import { l2PublicClient } from "@/lib/chains";
import { fromViemBlockWithTransactionsAndReceipts } from "@/lib/viem";
import { loadFunctions } from "@/lib/signatures";
import {
  prisma,
  fromPrismaBlockWithTransactionsAndReceipts,
} from "@/lib/prisma";

const fetchBlockTransactionsFromDatabase = async (number: bigint) => {
  const block = await prisma.block.findUnique({
    where: { number },
    include: { transactions: { include: { receipt: true, accounts: true } } },
  });
  if (!block) {
    return fetchBlockTransactionsFromJsonRpc(number);
  }
  const signatures = await Promise.all(
    block.transactions.map(({ input }) => loadFunctions(input.slice(0, 10))),
  );
  return fromPrismaBlockWithTransactionsAndReceipts(block, signatures);
};

const fetchBlockTransactionsFromJsonRpc = async (number: bigint) => {
  try {
    const block = await l2PublicClient.getBlock({
      blockNumber: number,
      includeTransactions: true,
    });
    const [receipts, signatures] = await Promise.all([
      Promise.all(
        block.transactions.map(({ hash }) =>
          l2PublicClient.getTransactionReceipt({ hash }),
        ),
      ),
      Promise.all(
        block.transactions.map(({ input }) =>
          loadFunctions(input.slice(0, 10)),
        ),
      ),
    ]);
    return fromViemBlockWithTransactionsAndReceipts(
      block,
      receipts,
      signatures,
    );
  } catch (error) {
    console.error(error);
    return null;
  }
};

const fetchBlockTransactions = process.env.DATABASE_URL
  ? fetchBlockTransactionsFromDatabase
  : fetchBlockTransactionsFromJsonRpc;

export default fetchBlockTransactions;
