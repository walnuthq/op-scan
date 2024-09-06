import { fromPrismaTransactionEnqueued, prisma } from "@/lib/prisma";

const fetchTransactionsEnqueued = async (page: number) => {
  const txsEnqueuedPerPage = Number(
    process.env.NEXT_PUBLIC_TXS_ENQUEUED_PER_PAGE,
  );
  const [prismaTransactionsEnqueued, totalCount] = await Promise.all([
    prisma.transactionEnqueued.findMany({
      orderBy: [{ l1BlockNumber: "desc" }, { l2TxHash: "asc" }],
      take: txsEnqueuedPerPage,
      skip: (page - 1) * txsEnqueuedPerPage,
    }),
    prisma.transactionEnqueued.count(),
  ]);
  return {
    transactionsEnqueued: prismaTransactionsEnqueued.map(
      fromPrismaTransactionEnqueued,
    ),
    totalCount,
  };
};

export default fetchTransactionsEnqueued;
