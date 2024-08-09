import { range } from "lodash";
import { Hash } from "viem";
import { prisma } from "@/lib/prisma";
import {
  TransactionWithReceipt,
  fromPrismaTransactionWithReceipt,
  fromViemTransactionWithReceipt,
} from "@/lib/types";
import { loadFunctions } from "@/lib/signatures";
import { l2PublicClient } from "@/lib/chains";

const fetchLatestTransactionsFromDatabase = async (
  start: bigint,
  index: number,
  latest: bigint,
): Promise<{
  transactions: TransactionWithReceipt[];
  previousStart?: bigint;
  previousIndex?: number;
  nextStart?: bigint;
  nextIndex?: number;
}> => {
  const txsPerPage = BigInt(process.env.NEXT_PUBLIC_TXS_PER_PAGE);

  const transactionsFromPrisma = await Promise.all(
    range(
      Math.min(Number(start + txsPerPage), Number(latest)),
      Math.max(Number(start - BigInt(2) * txsPerPage), -1),
    ).map(async (i) => {
      return await prisma.transaction.findMany({
        where: {
          blockNumber: BigInt(i),
        },
        orderBy: [{ blockNumber: "desc" }, { transactionIndex: "desc" }],
        select: {
          hash: true,
          blockNumber: true,
          transactionIndex: true,
          receipt: true,
          timestamp: true,
        },
      });
    }),
  );

  const transactionPaginationItems = transactionsFromPrisma
    .flat()
    .map((transaction) => ({
      hash: transaction.hash,
      transactionIndex: transaction.transactionIndex,
      blockNumber: transaction.blockNumber,
      timestamp: transaction.timestamp,
      receipt: transaction.receipt,
    }));

  const startItemIndex = transactionPaginationItems.findIndex(
    ({ blockNumber, transactionIndex }) =>
      blockNumber === start && transactionIndex === index,
  );
  const previousItem =
    transactionPaginationItems[startItemIndex - Number(txsPerPage)];
  const nextItem =
    transactionPaginationItems[startItemIndex + Number(txsPerPage)];
  const currentItems = transactionPaginationItems.slice(
    startItemIndex,
    startItemIndex + Number(txsPerPage),
  );
  const [transactionsWithTimestamp, receipts] = await Promise.all([
    Promise.all(
      currentItems.map(async ({ hash, timestamp }) => {
        const transaction = await prisma.transaction.findUniqueOrThrow({
          where: { hash: hash },
        });
        return { ...transaction, timestamp };
      }),
    ),
    Promise.all(
      currentItems.map(({ hash }) =>
        prisma.transactionReceipt.findUniqueOrThrow({
          where: { transactionHash: hash },
        }),
      ),
    ),
  ]);
  const signatures = await Promise.all(
    transactionsWithTimestamp.map(({ input }) =>
      loadFunctions(input.slice(0, 10)),
    ),
  );
  const transactions = transactionsWithTimestamp.map((transaction, i) => {
    return fromPrismaTransactionWithReceipt(
      transaction,
      receipts[i],
      signatures[i],
    );
  });
  return {
    transactions,
    previousStart: previousItem?.blockNumber,
    previousIndex: previousItem?.transactionIndex,
    nextStart: nextItem?.blockNumber,
    nextIndex: nextItem?.transactionIndex,
  };
};

const fetchLatestTransactionsFromJsonRpc = async (
  start: bigint,
  index: number,
  latest: bigint,
): Promise<{
  transactions: TransactionWithReceipt[];
  previousStart?: bigint;
  previousIndex?: number;
  nextStart?: bigint;
  nextIndex?: number;
}> => {
  const txsPerPage = BigInt(process.env.NEXT_PUBLIC_TXS_PER_PAGE);
  const blocks = await Promise.all(
    range(
      Math.min(Number(start + txsPerPage), Number(latest)),
      Math.max(Number(start - BigInt(2) * txsPerPage), -1),
    ).map((i) => l2PublicClient.getBlock({ blockNumber: BigInt(i) })),
  );

  type TransactionPaginationItem = {
    hash: Hash;
    transactionIndex: number;
    blockNumber: bigint;
    timestamp: bigint;
  };
  const transactionPaginationItems = blocks.reduce<TransactionPaginationItem[]>(
    (previousValue, block) => {
      const items = block.transactions.map((hash, i) => ({
        hash,
        transactionIndex: i,
        blockNumber: block.number,
        timestamp: block.timestamp,
      }));
      return [...previousValue, ...items];
    },
    [],
  );
  const startItemIndex = transactionPaginationItems.findIndex(
    ({ blockNumber, transactionIndex }) =>
      blockNumber === start && transactionIndex === index,
  );
  const previousItem =
    transactionPaginationItems[startItemIndex - Number(txsPerPage)];
  const nextItem =
    transactionPaginationItems[startItemIndex + Number(txsPerPage)];
  const currentItems = transactionPaginationItems.slice(
    startItemIndex,
    startItemIndex + Number(txsPerPage),
  );
  const [transactionsWithTimestamp, receipts] = await Promise.all([
    Promise.all(
      currentItems.map(async ({ hash, timestamp }) => {
        const transaction = await l2PublicClient.getTransaction({ hash });
        return { ...transaction, timestamp };
      }),
    ),
    Promise.all(
      currentItems.map(({ hash }) =>
        l2PublicClient.getTransactionReceipt({ hash }),
      ),
    ),
  ]);
  const signatures = await Promise.all(
    transactionsWithTimestamp.map(({ input }) =>
      loadFunctions(input.slice(0, 10)),
    ),
  );
  const transactions = transactionsWithTimestamp.map((transaction, i) => {
    return fromViemTransactionWithReceipt(
      transaction,
      receipts[i],
      transaction.timestamp,
      signatures[i],
    );
  });
  return {
    transactions,
    previousStart: previousItem?.blockNumber,
    previousIndex: previousItem?.transactionIndex,
    nextStart: nextItem?.blockNumber,
    nextIndex: nextItem?.transactionIndex,
  };
};

const fetchLatestTransactions = process.env.DATABASE_URL
  ? fetchLatestTransactionsFromDatabase
  : fetchLatestTransactionsFromJsonRpc;

export default fetchLatestTransactions;
