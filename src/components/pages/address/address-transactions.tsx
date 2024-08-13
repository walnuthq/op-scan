import { Address, getAddress } from "viem";
import { prisma } from "@/lib/prisma";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  fromPrismaTransactionWithReceipt,
  TransactionWithReceipt,
} from "@/lib/types";
import { loadFunctions } from "@/lib/signatures";
import TxsTable from "@/components/lib/txs-table";

const TXS_PER_PAGE = Number(process.env.NEXT_PUBLIC_TXS_PER_PAGE) || 10;
interface TransactionQueryResult {
  transactions: TransactionWithReceipt[];
  totalCount: number;
}

const fetchTransactionsData = async (
  address: Address,
): Promise<TransactionQueryResult> => {
  const checksumAddress = getAddress(address);
  const [associatedTransactions, totalCount] = await Promise.all([
    prisma.transaction.findMany({
      where: {
        OR: [{ from: checksumAddress }, { to: checksumAddress }],
        receipt: { isNot: null },
      },
      orderBy: { timestamp: "desc" },
      include: { receipt: true },
      take: TXS_PER_PAGE,
    }),
    prisma.transaction.count({
      where: {
        OR: [{ from: checksumAddress }, { to: checksumAddress }],
        receipt: { isNot: null },
      },
    }),
  ]);

  const validTransactions = await Promise.all(
    associatedTransactions.map(async (tx) => {
      try {
        const signature = await loadFunctions(tx.input.slice(0, 10));
        return fromPrismaTransactionWithReceipt(tx, tx.receipt!, signature);
      } catch (error) {
        console.error(`Error processing transaction ${tx.hash}:`, error);
        return null;
      }
    }),
  );

  const filteredValidTransactions = validTransactions.filter(
    (tx): tx is TransactionWithReceipt => tx !== null,
  );
  return {
    transactions: filteredValidTransactions,
    totalCount,
  };
};

const AddressTransactions: React.FC<{ address: Address }> = async ({
  address,
}) => {
  const { transactions, totalCount } = await fetchTransactionsData(address);
  return (
    <Card>
      <CardHeader>
        Latest {transactions.length} from a total of {totalCount} valid
        transactions
      </CardHeader>
      <CardContent>
        <h1>TRANSACTIONS</h1>
        {transactions.length === 0 ? (
          <p>No transactions</p>
        ) : (
          <TxsTable transactions={transactions} />
        )}
      </CardContent>
    </Card>
  );
};
export default AddressTransactions;
