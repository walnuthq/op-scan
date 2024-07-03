import Link from "next/link";
import { l2PublicClient } from "@/lib/chains";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatTimestamp } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface LatestBlocksTableProps {
  latestBlockNumber: bigint;
  currentPage: number;
  blocksPerPage: number;
}

async function fetchBlocks(
  latestBlockNumber: bigint,
  currentPage: number,
  blocksPerPage: number,
) {
  const startBlock =
    latestBlockNumber - BigInt((currentPage - 1) * blocksPerPage);
  const remainingBlocks = Number(startBlock + BigInt(1));
  const blocksToFetch = Math.min(blocksPerPage, remainingBlocks);

  const blocks = await Promise.all(
    Array.from({ length: blocksToFetch }, (_, i) =>
      l2PublicClient.getBlock({ blockNumber: startBlock - BigInt(i) }),
    ),
  );
  return blocks;
}

function formatGas(value: bigint, total?: bigint) {
  const formattedValue = value.toLocaleString();
  if (total) {
    const percentage = ((Number(value) / Number(total)) * 100).toFixed(2);
    return { formattedValue, percentage };
  }
  return { formattedValue };
}

export default async function LatestBlocksTable({
  latestBlockNumber,
  currentPage,
  blocksPerPage,
}: LatestBlocksTableProps) {
  const blocks = await fetchBlocks(
    latestBlockNumber,
    currentPage,
    blocksPerPage,
  );

  return (
    <TooltipProvider>
      <Table className="table-auto md:table-fixed">
        <TableHeader>
          <TableRow className="text-primary-foreground">
            <TableHead className="md:w-1/6">Block</TableHead>
            <TableHead className="text-primary md:w-1/6">Timestamp</TableHead>
            <TableHead className="md:w-1/6">Txn</TableHead>
            <TableHead className="md:w-1/6">Gas Used</TableHead>
            <TableHead className="md:w-1/6">Gas Limit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blocks.map((block) => (
            <TableRow key={block.number.toString()}>
              <TableCell>
                <Link
                  href={`/block/${block.number.toString()}`}
                  className="text-primary hover:brightness-150"
                >
                  {block.number.toString()}
                </Link>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <Tooltip>
                  <TooltipTrigger>
                    {formatTimestamp(block.timestamp).distance}
                  </TooltipTrigger>
                  <TooltipContent className="text-xs">
                    {new Date(Number(block.timestamp) * 1000).toUTCString()}
                  </TooltipContent>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Link
                  href={`/block/${block.number.toString()}/txs`}
                  className="text-primary hover:brightness-150"
                >
                  {block.transactions.length}
                </Link>
              </TableCell>
              <TableCell className="md:max-w-[4rem]">
                <div className="flex items-center space-x-2">
                  <span>
                    {formatGas(block.gasUsed, block.gasLimit).formattedValue}
                  </span>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="text-xs text-gray-500">
                        ({formatGas(block.gasUsed, block.gasLimit).percentage}%)
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="text-xs">
                      Gas used in %
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="progress-bar mt-1 h-[3px] max-w-[4rem] bg-gray-200">
                  <Progress
                    className="h-full rounded-none"
                    value={
                      (Number(block.gasUsed) / Number(block.gasLimit)) * 100
                    }
                  />
                </div>
              </TableCell>
              <TableCell className="md:max-w-[4rem]">
                {formatGas(block.gasLimit).formattedValue}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TooltipProvider>
  );
}
