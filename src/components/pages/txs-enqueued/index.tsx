import { formatNumber } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Pagination from "@/components/lib/pagination";
import LatestTxsEnqueuedTable from "@/components/pages/txs-enqueued/latest-txs-enqueued-table";
import fetchTransactionsEnqueued from "@/components/pages/txs-enqueued/fetch-transactions-enqueued";
import { txsEnqueuedPerPage } from "@/lib/constants";

const CardHeaderFooterContent = ({
  page,
  totalCount,
}: {
  page: number;
  totalCount: number;
}) => (
  <>
    <div className="space-y-0.5">
      <p className="text-sm">
        A total of {formatNumber(totalCount)} transaction
        {totalCount === 1 ? "" : "s"} found
      </p>
      <p className="text-xs">(Showing the last 100k records)</p>
    </div>
    <Pagination
      pathname="/txs-enqueued"
      page={page}
      totalPages={Math.ceil(totalCount / txsEnqueuedPerPage)}
    />
  </>
);

const TxsEnqueued = async ({ page }: { page: number }) => {
  const { transactionsEnqueued, totalCount } =
    await fetchTransactionsEnqueued(page);
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-4 md:p-4">
      <h2 className="text-2xl font-bold tracking-tight">
        L1 → L2 Transactions
      </h2>
      <Separator />
      <Card>
        <CardHeader className="flex flex-col items-start justify-start md:flex-row md:items-center md:justify-between">
          <CardHeaderFooterContent page={page} totalCount={totalCount} />
        </CardHeader>
        <CardContent className="px-0">
          <LatestTxsEnqueuedTable transactionsEnqueued={transactionsEnqueued} />
        </CardContent>
        <CardFooter className="flex flex-col items-start justify-start md:flex-row md:items-center md:justify-between">
          <CardHeaderFooterContent page={page} totalCount={totalCount} />
        </CardFooter>
      </Card>
    </main>
  );
};

export default TxsEnqueued;
