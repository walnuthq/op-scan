import Link from 'next/link';
import { Card, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import LatestBlocksPagination from '@/components/pages/blocks/latest-blocks-pagination';
import LatestBlocksTable from '@/components/pages/blocks/latest-blocks-table';

interface BlocksPageProps {
  searchParams: { page?: string; latest?: string };
  currentPage: number;
  blocksPerPage: number;
  latestBlockNumber: bigint;
  totalBlocks: bigint;
  totalPages: number;
  startBlock: bigint;
  endBlock: bigint;
}

export default function BlocksPage({
  searchParams,
  currentPage,
  blocksPerPage,
  latestBlockNumber,
  totalBlocks,
  totalPages,
  startBlock,
  endBlock,
}: BlocksPageProps) {
  return (
    <main>
      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Blocks
      </h2>
      <Card className="mt-8">
        <CardHeader className="flex flex-col md:flex-row justify-start md:justify-between items-start md:items-center p-4">
          <div>
            <p className="text-sm pb-2">
              Total of {totalBlocks.toLocaleString() || 'fetching...'} blocks
            </p>
            <p className="text-xs block-diff">
              (Showing blocks between #{startBlock.toString()} to #{endBlock.toString()})
            </p>
          </div>
          <LatestBlocksPagination
            currentPage={currentPage}
            totalPages={totalPages}
            latestBlockNumber={latestBlockNumber.toString()}
          />
        </CardHeader>
        <LatestBlocksTable
          latestBlockNumber={latestBlockNumber}
          currentPage={currentPage}
          blocksPerPage={blocksPerPage}
        />
        <CardFooter className="flex flex-col md:flex-row justify-start md:justify-between items-start md:items-center p-4">
          <div className="text-sm whitespace-nowrap">
            Latest block number:{' '}
            <Link
              href={`/block/${latestBlockNumber}`}
              className="text-primary hover:brightness-150"
            >
              {latestBlockNumber.toString()}
            </Link>
          </div>
          <LatestBlocksPagination
            currentPage={currentPage}
            totalPages={totalPages}
            latestBlockNumber={latestBlockNumber.toString()}
          />
        </CardFooter>
      </Card>
    </main>
  );
}