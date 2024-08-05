import { l2PublicClient } from "@/lib/chains";
import {
  fromViemTransactionWithReceipt,
  TransactionWithReceipt,
  fromPrismaTransactionWithReceipt,
} from "@/lib/types";
import { loadFunctions } from "@/lib/signatures";
import { prisma } from "@/lib/prisma";

type FetchBlockTransactionsReturnType = {
  transactions: TransactionWithReceipt[];
};

const fetchBlockTransactionsFromDatabase = async (
  blockNumber: bigint,
): Promise<FetchBlockTransactionsReturnType> => {
  const transactions = await prisma.transaction.findMany({
    where: { blockNumber },
    include: { receipt: true },
  });
  if (!transactions || transactions.length === 0) {
    return fetchBlockTransactionsFromJsonRpc(blockNumber);
  }
  const detailedTransactions = await Promise.all(
    transactions.map(async (transaction) => {
      if (!transaction.receipt) {
        return null;
      }
      const signature = await loadFunctions(transaction.input.slice(0, 10));
      return fromPrismaTransactionWithReceipt(
        transaction,
        transaction.receipt,
        signature,
      );
    }),
  ).then((results) => results.filter((tx) => tx !== null));
  return {
    transactions: detailedTransactions,
  };
};

const fetchBlockTransactionsFromJsonRpc = async (
  blockNumber: bigint,
): Promise<FetchBlockTransactionsReturnType> => {
  const block = await l2PublicClient.getBlock({
    blockNumber,
    includeTransactions: true,
  });
  if (!block) {
    return {
      transactions: [],
    };
  }
  const [receipts, signatures] = await Promise.all([
    Promise.all(
      block.transactions.map(({ hash }) =>
        l2PublicClient.getTransactionReceipt({ hash }),
      ),
    ),
    Promise.all(
      block.transactions.map(({ input }) => loadFunctions(input.slice(0, 10))),
    ),
  ]);
  const detailedTransactions = block.transactions.map((transaction, i) =>
    fromViemTransactionWithReceipt(
      transaction,
      receipts[i],
      block.timestamp,
      signatures[i],
    ),
  );
  return {
    transactions: detailedTransactions,
  };
};

const fetchBlockTransactions = process.env.DATABASE_URL
  ? fetchBlockTransactionsFromDatabase
  : fetchBlockTransactionsFromJsonRpc;

export default fetchBlockTransactions;
