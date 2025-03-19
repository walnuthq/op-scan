import Link from "next/link";
import { TableRow, TableCell } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { type Block } from "@/lib/types";
import { formatTimestamp, formatGas } from "@/lib/utils";

const LatestBlocksTableRow = ({
  block,
  timestampFormattedAsDate,
}: {
  block: Block;
  timestampFormattedAsDate: boolean;
}) => {
  const { distance, utc } = formatTimestamp(block.timestamp);
  const { value, percentage, percentageFormatted } = formatGas(
    block.gasUsed,
    block.gasLimit,
  );
  return (
    <TableRow>
      <TableCell>
        <Link
          href={`/block/${block.number}`}
          className="text-primary text-sm leading-none font-medium hover:brightness-150"
        >
          {block.number.toString()}
        </Link>
      </TableCell>
      <TableCell>
        <Tooltip>
          <TooltipTrigger>
            <span suppressHydrationWarning>
              {timestampFormattedAsDate ? utc : distance}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <span className="text-xs" suppressHydrationWarning>
              {timestampFormattedAsDate ? distance : utc}
            </span>
          </TooltipContent>
        </Tooltip>
      </TableCell>
      <TableCell>
        <Link
          href={`/block/${block.number}/txs`}
          className="text-primary text-sm leading-none font-medium hover:brightness-150"
        >
          {block.transactionsCount}
        </Link>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <span>{value}</span>
          <Tooltip>
            <TooltipTrigger>
              <span className="text-xs text-gray-500">
                ({percentageFormatted})
              </span>
            </TooltipTrigger>
            <TooltipContent className="text-xs">Gas used in %</TooltipContent>
          </Tooltip>
        </div>
        <Progress value={percentage} className="h-1" />
      </TableCell>
      <TableCell>{formatGas(block.gasLimit).value}</TableCell>
    </TableRow>
  );
};

export default LatestBlocksTableRow;
