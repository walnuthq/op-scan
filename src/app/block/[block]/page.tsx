import { formatEther } from "viem";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { l2PublicClient } from "../../../lib/chains";
import { formatTimestamp, formatPercent } from "../../../lib/utils";
import DescriptionListItem from "@/components/lib/description-list-item";

const client = l2PublicClient;

async function BlockPage({ params: { block } }: { params: { block: string } }) {
  const blockNumber = BigInt(block.toString());

  const blockData = await client.getBlock({
    blockNumber: blockNumber,
    includeTransactions: true,
  });

  const fees: bigint = BigInt(1);

  if (blockData) {
    const formattedTimestamp = formatTimestamp(BigInt(blockData.timestamp));

    return (
      <div className="container mx-auto px-8 py-8">
        <h1 className="mb-4 mt-4 text-lg font-semibold">
          Block   #{blockNumber.toString()}
        </h1>
        <div className="p-4">
          <dl>
            <DescriptionListItem title="Block Height">
              {blockNumber.toString()}
              <Link href={`/block/${parseInt(block) - 1}`}>
                <ChevronLeft
                  size={24}
                  color="black"
                  className='ml-4 cursor-pointer rounded-md bg-gray-200 hover:bg-gray-300'
                />
              </Link>
              <Link href={`/block/${parseInt(block) + 1}`}>
                <ChevronRight
                  size={24}
                  color="black"
                  className="ml-2 cursor-pointer rounded-md bg-gray-200 hover:bg-gray-300"
                />
              </Link>
            </DescriptionListItem>
            <DescriptionListItem title="Timestamp">
              {formattedTimestamp}
            </DescriptionListItem>
            <DescriptionListItem title="Block Hash">
              {" "}
              {blockData.hash}
            </DescriptionListItem>
            <DescriptionListItem title="Parent Hash">
              {blockData.parentHash}
            </DescriptionListItem>
            <DescriptionListItem title="Transactions">
              <Link
                href={`/block/${blockNumber}/txs`}
                className="text-blue-600 hover:underline"
              >
                {blockData.transactions.length} transactions
              </Link>
            </DescriptionListItem>
            <DescriptionListItem title="Gas Used">
              {formatEther(blockData.gasUsed).toString()} (
              {formatPercent(parseInt(blockData.gasUsed.toString()))})
            </DescriptionListItem>
            <DescriptionListItem title="Gas Limit">
              {formatEther(blockData.gasLimit).toString()}
            </DescriptionListItem>
          </dl>
        </div>
      </div>
    );
  }

  return <div>Block not found</div>;
}

export default BlockPage;
