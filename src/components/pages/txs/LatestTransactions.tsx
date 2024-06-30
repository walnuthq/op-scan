import { fetchL2LatestTransactions } from "@/components/lib/fetch-data";
import { TransactionsTable } from './TransactionTable';

export async function LatestTransactions() {
  const transactions = await fetchL2LatestTransactions();

  return <TransactionsTable transactions={transactions} />;
}