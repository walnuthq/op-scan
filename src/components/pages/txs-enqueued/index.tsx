import { Hash } from "viem";
import { formatNumber } from "@/lib/utils";
import { fetchLatestTransactionsEnqueued } from "@/lib/fetch-data";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
// import LatestTxsEnqueuedPagination from "@/components/pages/txs-enqueued/latest-txs-enqueued-pagination";
import LatestTxsEnqueuedTable from "@/components/pages/txs-enqueued/latest-txs-enqueued-table";

const TxsEnqueued = async ({
  start,
  hash,
  page,
  latest,
}: {
  start: bigint;
  hash: Hash;
  page: number;
  latest: bigint;
}) => {
  const {
    transactionsEnqueued,
    previousStart,
    previousHash,
    nextStart,
    nextHash,
  } = await fetchLatestTransactionsEnqueued(start, hash, latest);
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-4 md:p-4">
      <h2 className="text-2xl font-bold tracking-tight">L1→L2 Transactions</h2>
      <Separator />
      <Card>
        <CardHeader className="flex flex-col items-start justify-start md:flex-row md:items-center md:justify-between">
          <div className="space-y-0.5">
            <p>A total of {formatNumber(BigInt(500000))} transactions found</p>
            <p className="text-sm">(Showing the last 100k records)</p>
          </div>
          {/* <LatestTxsEnqueuedPagination
            page={page}
            previousStart={previousStart}
            previousHash={previousHash}
            nextStart={nextStart}
            nextHash={nextHash}
            latest={latest}
          /> */}
        </CardHeader>
        <CardContent className="px-0">
          <LatestTxsEnqueuedTable transactionsEnqueued={transactionsEnqueued} />
        </CardContent>
        <CardFooter className="flex flex-col items-start justify-start md:flex-row md:items-center md:justify-between">
          <div className="space-y-0.5">
            <p>A total of {formatNumber(BigInt(500000))} transactions found</p>
            <p className="text-sm">(Showing the last 100k records)</p>
          </div>
          {/* <LatestTxsEnqueuedPagination
            page={page}
            previousStart={previousStart}
            previousHash={previousHash}
            nextStart={nextStart}
            nextHash={nextHash}
            latest={latest}
          /> */}
        </CardFooter>
      </Card>
    </main>
  );
};

export default TxsEnqueued;
