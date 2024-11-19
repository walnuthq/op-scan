import { txsPerPage } from "@/lib/constants";
import {
  prisma,
  fromPrismaTransactionWithReceiptAndAccounts,
} from "@/lib/prisma";
import { loadFunctions } from "@/lib/signatures";

const fetchTransactions = async (start: bigint, page: number) => {
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
    transactions: transactions.map((transaction, index) =>
      fromPrismaTransactionWithReceiptAndAccounts(
        transaction,
        signatures[index],
      ),
    ),
    totalCount,
  };
};

export default fetchTransactions;
