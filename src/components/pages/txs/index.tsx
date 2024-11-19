import { formatNumber } from "@/lib/utils";
import fetchTransactions from "@/components/pages/txs/fetch-transactions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import LatestTxsPagination from "@/components/pages/txs/latest-txs-pagination";
import TxsTable from "@/components/lib/txs-table";
import { fetchSpotPrices } from "@/lib/fetch-data";
import { txsPerPage } from "@/lib/constants";

const CardHeaderFooterContent = ({
  totalCount,
  start,
  page,
}: {
  totalCount: number;
  start: bigint;
  page: number;
}) => (
  <>
    <div className="space-y-0.5">
      <p className="text-sm">
        More than {formatNumber(totalCount)} transactions found
      </p>
      <p className="text-xs">(Showing the last 500k records)</p>
    </div>
    <LatestTxsPagination
      start={start}
      page={page}
      totalPages={Math.ceil(totalCount / txsPerPage)}
    />
  </>
);

const Txs = async ({ start, page }: { start: bigint; page: number }) => {
  const [{ transactions, totalCount }, prices] = await Promise.all([
    fetchTransactions(start, page),
    fetchSpotPrices(),
  ]);
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-4 md:p-4">
      <h2 className="text-2xl font-bold tracking-tight">Transactions</h2>
      <Separator />
      <Card>
        <CardHeader className="flex flex-col items-start justify-start md:flex-row md:items-center md:justify-between">
          <CardHeaderFooterContent
            totalCount={totalCount}
            start={start}
            page={page}
          />
        </CardHeader>
        <CardContent className="px-0">
          <TxsTable transactions={transactions} ethPrice={prices.ETH} />
        </CardContent>
        <CardFooter className="flex flex-col items-start justify-start md:flex-row md:items-center md:justify-between">
          <CardHeaderFooterContent
            totalCount={totalCount}
            start={start}
            page={page}
          />
        </CardFooter>
      </Card>
    </main>
  );
};

export default Txs;
