import { LatestTransactions } from "@/components/pages/txs/LatestTransactions";

export default function TxsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Latest Transactions</h1>
      <LatestTransactions />
    </div>
  );
}