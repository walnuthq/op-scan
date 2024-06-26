import { getLatestTransactions } from "@/components/lib/TransactionTable/TransactionTable";
import { TransactionsTable } from './TransactionTable';

export async function LatestTransactions() {
  const transactions = await getLatestTransactions();

  return <TransactionsTable transactions={transactions} />;
}