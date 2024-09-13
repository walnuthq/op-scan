import { Address } from "viem";
import {
  prisma,
  fromPrismaTransactionWithReceiptAndAccounts,
} from "@/lib/prisma";
import { loadFunctions } from "@/lib/signatures";

const fetchTransactions = async (address: Address, page: number) => {
  const txsPerPage = Number(process.env.NEXT_PUBLIC_TXS_PER_PAGE);
  const where = {
    OR: [{ from: address }, { to: address }],
  };
  const [prismaTransactions, totalCount] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: [{ blockNumber: "desc" }, { transactionIndex: "desc" }],
      include: { receipt: true, accounts: true },
      take: txsPerPage,
      skip: (page - 1) * txsPerPage,
    }),
    prisma.transaction.count({ where }),
  ]);
  const signatures = await Promise.all(
    prismaTransactions.map(({ input }) => loadFunctions(input.slice(0, 10))),
  );
  return {
    transactions: prismaTransactions.map((prismaTransaction, i) =>
      fromPrismaTransactionWithReceiptAndAccounts(
        prismaTransaction,
        signatures[i],
      ),
    ),
    totalCount,
  };
};

export default fetchTransactions;
