import {
  prisma,
  fromPrismaTransactionWithReceiptAndAccounts,
} from "@/lib/prisma";
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
      include: { receipt: true, accounts: true },
    }),
    prisma.transaction.count({ where }),
  ]);
  const signatures = await Promise.all(
    transactions.map(({ input }) => loadFunctions(input.slice(0, 10))),
  );
  return {
    transactions: transactions.map((transaction, i) =>
      fromPrismaTransactionWithReceiptAndAccounts(transaction, signatures[i]),
    ),
    totalCount,
  };
};

export default fetchTransactions;
