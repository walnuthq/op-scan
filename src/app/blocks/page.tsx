import { Suspense } from 'react';
import BlocksPage from '@/components/pages/blocks';
import { l2PublicClient } from '@/lib/chains';

interface BlocksPageParams {
  searchParams: { page?: string; latest?: string };
}

async function fetchBlockData(page: number, latestBlockNumber?: bigint) {
  const blocksPerPage = 25;
  if (!latestBlockNumber) {
    latestBlockNumber = await l2PublicClient.getBlockNumber();
  }

  const totalBlocks = latestBlockNumber;
  const totalPages = Math.ceil(Number(totalBlocks) / blocksPerPage);
  const startBlock = totalBlocks - BigInt((page - 1) * blocksPerPage);
  const endBlock = totalBlocks - BigInt(page * blocksPerPage) + BigInt(1);

  return {
    latestBlockNumber,
    totalBlocks,
    totalPages,
    startBlock,
    endBlock,
    blocksPerPage,
  };
}

export default async function Blocks({ searchParams }: BlocksPageParams) {
  const page = parseInt(searchParams.page || '1', 10);
  const latestBlockNumber = searchParams.latest ? BigInt(searchParams.latest) : undefined;
  const data = await fetchBlockData(page, latestBlockNumber);

  return (
    <main className="p-4">
      <Suspense fallback={<div className='w-full h-screen grid place-content-center text-primary'>Loading...</div>}>
        <BlocksPage
          searchParams={searchParams}
          currentPage={page}
          blocksPerPage={data.blocksPerPage}
          latestBlockNumber={data.latestBlockNumber}
          totalBlocks={data.totalBlocks}
          totalPages={data.totalPages}
          startBlock={data.startBlock}
          endBlock={data.endBlock}
        />
      </Suspense>
    </main>
  );
}