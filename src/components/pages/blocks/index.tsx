import Link from "next/link";
import { formatNumber } from "@/lib/utils";
import { fetchBlocks } from "@/lib/fetch-data";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import LatestBlocksPagination from "@/components/pages/blocks/latest-blocks-pagination";
import LatestBlocksTable from "@/components/pages/blocks/latest-blocks-table";

const Blocks = async ({ page, latest }: { page: bigint; latest: bigint }) => {
  const blocksPerPage = BigInt(process.env.NEXT_PUBLIC_BLOCKS_PER_PAGE);
  const totalPages = Math.ceil(Number(latest) / Number(blocksPerPage));
  const startBlock = latest - (page - BigInt(1)) * blocksPerPage;
  const endBlock = latest - page * blocksPerPage + BigInt(1);
  const blocks = await fetchBlocks(latest, page, blocksPerPage);
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-4 md:p-4">
      <h2 className="text-2xl font-bold tracking-tight">Blocks</h2>
      <Separator />
      <Card>
        <CardHeader className="flex flex-col items-start justify-start md:flex-row md:items-center md:justify-between">
          <div className="space-y-0.5">
            <p>
              Total of {formatNumber(latest)} block
              {latest === BigInt(1) ? "" : "s"}
            </p>
            <p className="text-sm">
              (Showing blocks between #{startBlock.toString()} to #
              {endBlock.toString()})
            </p>
          </div>
          <LatestBlocksPagination
            currentPage={Number(page.toString())}
            totalPages={totalPages}
            latestBlockNumber={latest.toString()}
            totalBlocks={latest}
            blocksPerPage={Number(blocksPerPage.toString())}
          />
        </CardHeader>
        <CardContent className="px-0">
          <LatestBlocksTable blocks={blocks} />
        </CardContent>
        <CardFooter className="flex flex-col items-start justify-start md:flex-row md:items-center md:justify-between">
          <div className="whitespace-nowrap text-sm">
            <span className="mr-1">Latest block number:</span>
            <Link
              href={`/block/${latest}`}
              className="text-primary hover:brightness-150"
            >
              {latest.toString()}
            </Link>
          </div>
          <LatestBlocksPagination
            currentPage={Number(page.toString())}
            totalPages={totalPages}
            latestBlockNumber={latest.toString()}
            totalBlocks={latest}
            blocksPerPage={Number(blocksPerPage.toString())}
          />
        </CardFooter>
      </Card>
    </main>
  );
};

export default Blocks;
