import { fromPrismaTransactionEnqueued, prisma } from "@/lib/prisma";
import { txsEnqueuedPerPage } from "@/lib/constants";
import { l2Chain } from "@/lib/chains";

const fetchTransactionsEnqueued = async (page: number) => {
  const where = { chainId: l2Chain.id };
  const [prismaTransactionsEnqueued, totalCount] = await Promise.all([
    prisma.transactionEnqueued.findMany({
      where,
      orderBy: [{ l1BlockNumber: "desc" }, { l2TxHash: "asc" }],
      take: txsEnqueuedPerPage,
      skip: (page - 1) * txsEnqueuedPerPage,
    }),
    prisma.transactionEnqueued.count({ where }),
  ]);
  return {
    transactionsEnqueued: prismaTransactionsEnqueued.map(
      fromPrismaTransactionEnqueued,
    ),
    totalCount,
  };
};

export default fetchTransactionsEnqueued;
