import Link from "next/link";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { l2PublicClient } from "../../../lib/chains";
import { formatTimestamp } from "../../../lib/utils";
import DescriptionListItem from "@/components/lib/description-list-item";

const client = l2PublicClient;

async function BlockPage({
  params: { number },
}: {
  params: { number: string };
}) {
  const blockNumber = BigInt(number.toString());

  const blockData = await client.getBlock({
    blockNumber: blockNumber,
    includeTransactions: true,
  });

  function formatGas(gas: bigint, limit: bigint): string {
    const total = Number(gas) / Number(limit);
    const percentage = total * 100;
    return percentage.toFixed(2) + "%";
  }

  const fees: bigint = BigInt(1);

  if (blockData) {
    const formattedTimestamp = formatTimestamp(BigInt(blockData.timestamp));

    return (
      <div className="container mx-auto px-8 py-4">
        <div className="my-4 flex items-center gap-2 border-b border-gray-300 py-4 dark:border-white/10">
          <h1 className="text-xl font-semibold">Block</h1>
          <p className="text-md text-gray-500">#{blockNumber.toString()}</p>
        </div>
        <div className="mt-8 rounded-md border border-gray-300 p-4 dark:border-white/10">
          <dl>
            <DescriptionListItem title="Block Height">
              {blockNumber.toString()}
              <Link href={`/block/${parseInt(number) - 1}`}>
                <ChevronLeft
                  size={24}
                  color="gray"
                  className="ml-4 cursor-pointer rounded-md bg-gray-200 dark:bg-white/10"
                />
              </Link>
              <Link href={`/block/${parseInt(number) + 1}`}>
                <ChevronRight
                  size={24}
                  color="gray"
                  className="ml-2 cursor-pointer rounded-md bg-gray-200 dark:bg-white/10"
                />
              </Link>
            </DescriptionListItem>
            <DescriptionListItem title="Timestamp">
              <Clock color="gray" size={20} className="mr-2" />
              {formattedTimestamp.distance}
            </DescriptionListItem>
            <DescriptionListItem title="Block Hash">
              {" "}
              {blockData.hash}
            </DescriptionListItem>
            <DescriptionListItem border title="Transactions">
              <Link
                href={`/block/${blockNumber}/txs`}
                className="mr-2 text-primary hover:underline"
              >
                {blockData.transactions.length} transactions
              </Link>
              in this block
            </DescriptionListItem>
            <DescriptionListItem title="Gas Used">
              {blockData.gasUsed.toString()} (
              {formatGas(blockData.gasUsed, blockData.gasLimit)})
            </DescriptionListItem>
            <DescriptionListItem title="Gas Limit">
              {blockData.gasLimit.toString()}
            </DescriptionListItem>
          </dl>
        </div>
      </div>
    );
  }

  return <div>Block not found</div>;
}

export default BlockPage;
