import { prisma, fromPrismaTransactionWithReceipt } from "@/lib/prisma";
import { loadFunctions } from "@/lib/signatures";

const fetchTransactions = async (start: bigint, page: number) => {
  const txsPerPage = Number(process.env.NEXT_PUBLIC_TXS_PER_PAGE);
  const where = { blockNumber: { lte: start } };
  const [transactions, totalCount] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: [{ blockNumber: "desc" }, { transactionIndex: "desc" }],
      take: txsPerPage,
      skip: (page - 1) * txsPerPage,
      include: { receipt: true },
    }),
    prisma.transaction.count({ where }),
  ]);
  const signatures = await Promise.all(
    transactions.map(({ input }) => loadFunctions(input.slice(0, 10))),
  );
  return {
    transactions: transactions.map((transaction, i) =>
      fromPrismaTransactionWithReceipt(transaction, signatures[i]),
    ),
    totalCount,
  };
};

/*const fetchTransactionsFromJsonRpc = async (
  start: bigint,
  index: number,
  latest: bigint,
): Promise<FetchTransactionsResult> => {
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
  const transactions = transactionsWithTimestamp.map((transaction, i) =>
    fromViemTransactionWithReceipt(
      transaction,
      receipts[i],
      transaction.timestamp,
      signatures[i],
    ),
  );
  return {
    transactions,
    totalCount: 500000,
    previousStart: previousItem?.blockNumber,
    previousIndex: previousItem?.transactionIndex,
    nextStart: nextItem?.blockNumber,
    nextIndex: nextItem?.transactionIndex,
  };
};*/

export default fetchTransactions;
