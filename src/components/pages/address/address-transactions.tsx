import { Address } from "viem";
import { prisma } from "@/lib/prisma";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { fromPrismaTransactionWithReceipt, TransactionWithReceipt } from "@/lib/types";
import { loadFunctions } from "@/lib/signatures";
import TxsTable from "@/components/lib/txs-table";

const TRANSACTION_LIMIT = 25;
interface TransactionQueryResult {
  transactions: TransactionWithReceipt[];
  totalCount: number;
}

const fetchTransactionsData = async (address: Address): Promise<TransactionQueryResult> => {
  const associatedTransactions = await prisma.transaction.findMany({
    where: {
      OR: [
        { from: { contains: address } },
        { to: { contains: address } },
      ],
    },
    orderBy: { timestamp: 'desc' },
    include: { receipt: true },
  });

  const transactionsWithReceipts = associatedTransactions.filter(tx => tx.receipt !== null);
  const validTransactions = await Promise.all(
    transactionsWithReceipts.map(async (tx) => {
      try {
        const signature = await loadFunctions(tx.input.slice(0, 10));
        return fromPrismaTransactionWithReceipt(tx, tx.receipt!, signature);
      } catch (error) {
        console.error(`Error processing transaction ${tx.hash}:`, error);
        return null;
      }
    })
  );

  const filteredValidTransactions = validTransactions.filter(tx => tx !== null) as TransactionWithReceipt[];
  return {
    transactions: filteredValidTransactions.slice(0, TRANSACTION_LIMIT),
    totalCount: filteredValidTransactions.length,
  };
};

const AddressTransactions: React.FC<{ address: Address }> = async ({ address }) => {
  const { transactions, totalCount } = await fetchTransactionsData(address);
  return (
    <Card>
      <CardHeader>
        Latest {transactions.length >= TRANSACTION_LIMIT ? TRANSACTION_LIMIT : transactions.length} from a total of {totalCount} valid transactions
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