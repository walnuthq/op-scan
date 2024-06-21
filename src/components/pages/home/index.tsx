import { Transaction } from "@/lib/types";
import {
  fetchTokensPrices,
  fetchL2LatestBlocks,
  fetchLatestL1L2Transactions,
} from "@/lib/utils";
import l2OutputOracle from "@/lib/contracts/l2-output-oracle/contract";
import EthPrice from "@/components/pages/home/eth-price";
import OpPrice from "@/components/pages/home/op-price";
import LatestBlockAndTxs from "@/components/pages/home/latest-block-and-txs";
import LatestL1TxBatch from "@/components/pages/home/latest-l1-l2-transactions/latest-l1-tx-batch";
import TransactionHistory from "@/components/pages/home/transaction-history";
import LatestBlocks from "@/components/pages/home/latest-blocks";
import LatestTransactions from "@/components/pages/home/latest-transactions/latest-transactions";
import LatestL1L2Transactions from "@/components/pages/home/latest-l1-l2-transactions/latest-l1-l2-transactions";

const Home = async () => {
  const [tokensPrices, latestBlocks, l2BlockTime, latestL1L2Transactions] =
    await Promise.all([
      fetchTokensPrices(),
      fetchL2LatestBlocks(),
      l2OutputOracle.read.l2BlockTime(),
      fetchLatestL1L2Transactions(),
    ]);
  const latestTransactions = latestBlocks
    .reduce<
      Transaction[]
    >((txns, block) => [...txns, ...block.transactions.reverse()], [])
    .slice(0, 6);
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-4 md:p-4">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4">
          <EthPrice eth={tokensPrices.eth} />
          <OpPrice op={tokensPrices.op} />
        </div>
        <div className="space-y-4">
          <LatestBlockAndTxs block={latestBlocks[0]} />
          <LatestL1TxBatch />
        </div>
        <TransactionHistory />
      </div>
      <div className="grid gap-4 md:gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <LatestBlocks blocks={latestBlocks} l2BlockTime={l2BlockTime} />
        <LatestTransactions transactions={latestTransactions} />
        <LatestL1L2Transactions transactions={latestL1L2Transactions} />
      </div>
    </main>
  );
};

export default Home;
