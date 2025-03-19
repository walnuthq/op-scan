import { type Address } from "viem";
import {
  prisma,
  fromPrismaTransactionWithReceiptAndAccounts,
} from "@/lib/prisma";
import { loadFunctions } from "@/lib/signatures";
import { txsPerPage } from "@/lib/constants";

const fetchTransactions = async (address: Address, page: number) => {
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
    transactions: prismaTransactions.map((prismaTransaction, index) =>
      fromPrismaTransactionWithReceiptAndAccounts(
        prismaTransaction,
        signatures[index],
      ),
    ),
    totalCount,
  };
};

export default fetchTransactions;
