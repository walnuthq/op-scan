import LatestL1L2TransactionsTable from "@/components/pages/txs/latest-l1-l2-transactions-table";
import { fetchLatestL1L2Transactions } from "@/lib/fetch-data";

const TxsEnqueuedPage = async () => {
  const transactions = await fetchLatestL1L2Transactions();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-4 md:p-4">
      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight transition-colors first:mt-0">
        L1 - L2 Transactions
      </h2>
      <LatestL1L2TransactionsTable transactions={transactions} />
    </main>
  );
};

export default TxsEnqueuedPage;
