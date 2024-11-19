import { cn } from "@/lib/utils";
import { l2Chain } from "@/lib/chains";
import Search from "@/components/lib/search";
import EthPrice from "@/components/pages/home/eth-price";
import OpPrice from "@/components/pages/home/op-price";
import LatestBlockAndTxs from "@/components/pages/home/latest-block-and-txs";
import LatestL1TxBatch from "@/components/pages/home/latest-l1-tx-batch";
import TransactionHistory from "@/components/pages/home/transaction-history";
import LatestBlocks from "@/components/pages/home/latest-blocks";
import LatestTransactions from "@/components/pages/home/latest-transactions";
import LatestTransactionsEnqueued from "@/components/pages/home/latest-transactions-enqueued";
import fetchHomeData from "@/components/pages/home/fetch-home-data";

const Home = async () => {
  const {
    pricesToday,
    pricesYesterday,
    blocks,
    transactions,
    transactionsCount,
    tps,
    transactionsEnqueued,
    transactionsHistory,
  } = await fetchHomeData();
  const [firstBlock] = blocks;
  const hasTransactionsHistory = transactionsHistory.length >= 3;
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-4 md:p-4">
      <h1 className="text-xl font-bold">{l2Chain.name} Explorer</h1>
      <Search className="max-w-2xl" />
      <div
        className={cn("grid gap-4", {
          "lg:grid-cols-2": !hasTransactionsHistory,
          "lg:grid-cols-3": hasTransactionsHistory,
        })}
      >
        <div className="space-y-4">
          <EthPrice today={pricesToday.ETH} yesterday={pricesYesterday.ETH} />
          <OpPrice today={pricesToday.OP} yesterday={pricesYesterday.OP} />
        </div>
        <div className="space-y-4">
          <LatestBlockAndTxs
            blockNumber={firstBlock ? firstBlock.number : BigInt(0)}
            transactionsCount={transactionsCount}
            tps={tps}
          />
          <LatestL1TxBatch />
        </div>
        {hasTransactionsHistory && (
          <TransactionHistory data={transactionsHistory} />
        )}
      </div>
      <div className="grid gap-4 md:gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <LatestBlocks blocks={blocks} />
        <LatestTransactions transactions={transactions} />
        <LatestTransactionsEnqueued transactions={transactionsEnqueued} />
      </div>
    </main>
  );
};

export default Home;
