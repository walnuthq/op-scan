import { createPublicClient, http, formatEther } from 'viem';
import { optimism } from 'viem/chains';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const client = createPublicClient({
  chain: optimism,
  transport: http(process.env.RPC_URL),
});

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const formattedDate = date.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'UTC'
  });

  return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago (${formattedDate} +UTC)`;
}

async function BlockPage({ params: { block } }: { params: { block: string } }) {
  const blockNumber = BigInt(block.toString());
  
  const blockData = await client.getBlock({
    blockNumber: blockNumber,
    includeTransactions: true,
  });

  const fees : bigint = BigInt(1);

  if (blockData) {
    const formattedTimestamp = formatTimestamp(Number(blockData.timestamp));

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-lg font-semibold mb-4 mt-0">Block #{blockNumber.toString()}</h1>
        <div className="shadow overflow-hidden sm:rounded-lg">
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium ">Block Height:  </dt>
                <dd className="flex items-center mt-1 text-sm sm:mt-0 sm:col-span-2">{blockNumber.toString()}
                <Link href={`/block/${parseInt(block) - 1}`}> 
                  <ChevronLeft size={24} className='bg-gray-300 rounded-md ml-4 cursor-pointer' />
                </Link>
                <Link href={`/block/${parseInt(block) + 1}`}>
                  <ChevronRight size={24} className='bg-gray-300 rounded-md ml-2 cursor-pointer' />
                  </Link>
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium ">Timestamp:  </dt>
                <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">{formattedTimestamp}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium ">Block Hash</dt>
                <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">{blockData.hash}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium ">Parent Hash</dt>
                <dd className="mt-1 text-sm  sm:mt-0 sm:col-span-2">{blockData.parentHash}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium ">Transactions</dt>
                <dd className="mt-1 text-sm  sm:mt-0 sm:col-span-2">
                  <Link href={`/block/${blockNumber}/txs`} className="text-blue-600 hover:underline">
                    {blockData.transactions.length} transactions
                  </Link>
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium ">Gas Used</dt>
                <dd className="mt-1 text-sm  sm:mt-0 sm:col-span-2">{blockData.gasUsed.toString()}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium ">Gas Limit</dt>
                <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">{blockData.gasLimit.toString()}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium ">Base Fee Per Gas</dt>
                <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                  {formatEther(blockData.baseFeePerGas || fees)} ETH
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    );
  }

  return <div>Block not found</div>;
}

export default BlockPage;