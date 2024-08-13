import { formatNumber } from "@/lib/utils";
import fetchBlocks from "@/components/pages/blocks/fetch-blocks";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import LatestBlocksPagination from "@/components/pages/blocks/latest-blocks-pagination";
import LatestBlocksTable from "@/components/pages/blocks/latest-blocks-table";

const Blocks = async ({ start, latest }: { start: bigint; latest: bigint }) => {
  const blocks = await fetchBlocks(start);
  const totalBlocks = latest + BigInt(1);
  const end = blocks[blocks.length - 1].number;
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-4 md:p-4">
      <h2 className="text-2xl font-bold tracking-tight">Blocks</h2>
      <Separator />
      <Card>
        <CardHeader className="flex flex-col items-start justify-start md:flex-row md:items-center md:justify-between">
          <div className="space-y-0.5">
            <p>
              Total of {formatNumber(totalBlocks)} block
              {totalBlocks === BigInt(1) ? "" : "s"}
            </p>
            <p className="text-sm">
              (Showing blocks between #{start.toString()} to #{end.toString()})
            </p>
          </div>
          <LatestBlocksPagination start={start} latest={latest} />
        </CardHeader>
        <CardContent className="px-0">
          <LatestBlocksTable blocks={blocks} />
        </CardContent>
        <CardFooter className="flex flex-col items-start justify-start md:flex-row md:items-center md:justify-between">
          <div className="space-y-0.5">
            <p>
              Total of {formatNumber(totalBlocks)} block
              {totalBlocks === BigInt(1) ? "" : "s"}
            </p>
            <p className="text-sm">
              (Showing blocks between #{start.toString()} to #{end.toString()})
            </p>
          </div>
          <LatestBlocksPagination start={start} latest={latest} />
        </CardFooter>
      </Card>
    </main>
  );
};

export default Blocks;
