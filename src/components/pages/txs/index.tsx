import { formatNumber } from "@/lib/utils";
import { fetchLatestTransactions } from "@/lib/fetch-data";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import LatestTxsPagination from "@/components/pages/txs/latest-txs-pagination";
import TxsTable from "@/components/lib/txs-table";

const Txs = async ({
  start,
  index,
  page,
  latest,
}: {
  start: bigint;
  index: number;
  page: number;
  latest: bigint;
}) => {
  const { transactions, previousStart, previousIndex, nextStart, nextIndex } =
    await fetchLatestTransactions(start, index, latest);
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-4 md:p-4">
      <h2 className="text-2xl font-bold tracking-tight">Transactions</h2>
      <Separator />
      <Card>
        <CardHeader className="flex flex-col items-start justify-start md:flex-row md:items-center md:justify-between">
          <div className="space-y-0.5">
            <p>More than {formatNumber(BigInt(500000))} transactions found</p>
            <p className="text-sm">(Showing the last 500k records)</p>
          </div>
          <LatestTxsPagination
            page={page}
            previousStart={previousStart}
            previousIndex={previousIndex}
            nextStart={nextStart}
            nextIndex={nextIndex}
            latest={latest}
          />
        </CardHeader>
        <CardContent className="px-0">
          <TxsTable transactions={transactions} />
        </CardContent>
        <CardFooter className="flex flex-col items-start justify-start md:flex-row md:items-center md:justify-between">
          <div className="space-y-0.5">
            <p>More than {formatNumber(BigInt(500000))} transactions found</p>
            <p className="text-sm">(Showing the last 500k records)</p>
          </div>
          <LatestTxsPagination
            page={page}
            previousStart={previousStart}
            previousIndex={previousIndex}
            nextStart={nextStart}
            nextIndex={nextIndex}
            latest={latest}
          />
        </CardFooter>
      </Card>
    </main>
  );
};

export default Txs;
