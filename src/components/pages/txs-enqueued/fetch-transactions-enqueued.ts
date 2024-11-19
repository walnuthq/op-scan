import { fromPrismaTransactionEnqueued, prisma } from "@/lib/prisma";
import { txsEnqueuedPerPage } from "@/lib/constants";

const fetchTransactionsEnqueued = async (page: number) => {
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
