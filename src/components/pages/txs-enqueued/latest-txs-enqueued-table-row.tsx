import Link from "next/link";
import { TransactionEnqueued } from "@/lib/types";
import { formatTimestamp, formatGas } from "@/lib/utils";
import { TableRow, TableCell } from "@/components/ui/table";
import { l1Chain } from "@/lib/chains";
import { SquareArrowOutUpRight } from "lucide-react";
import CopyButton from "@/components/lib/copy-button";

const LatestTxsEnqueuedTableRow = ({
  transactionEnqueued,
  timestampFormattedAsDate,
}: {
  transactionEnqueued: TransactionEnqueued;
  timestampFormattedAsDate: boolean;
}) => {
  const { distance, utc } = formatTimestamp(transactionEnqueued.timestamp);
  return (
    <TableRow>
      <TableCell>
        <a
          className="flex items-center truncate text-primary hover:brightness-150"
          href={`${l1Chain.blockExplorers.default.url}/block/${transactionEnqueued.l1BlockNumber}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {transactionEnqueued.l1BlockNumber.toString()}
          <SquareArrowOutUpRight className="ml-1 size-4" />
        </a>
      </TableCell>
      <TableCell className="max-w-40">
        <div className="flex">
          <Link
            href={`/tx/${transactionEnqueued.l2TxHash}`}
            className="truncate text-sm font-medium leading-none text-primary hover:brightness-150"
          >
            {transactionEnqueued.l2TxHash}
          </Link>
          <CopyButton
            content="Copy Hash to clipboard"
            copy={transactionEnqueued.l2TxHash}
          />
        </div>
      </TableCell>
      <TableCell suppressHydrationWarning>
        {timestampFormattedAsDate ? utc : distance}
      </TableCell>
      <TableCell className="max-w-40">
        <div className="flex text-sm">
          <a
            className="flex items-center truncate text-primary hover:brightness-150"
            href={`${l1Chain.blockExplorers.default.url}/tx/${transactionEnqueued.l2TxHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="truncate">{transactionEnqueued.l2TxHash}</span>
            <SquareArrowOutUpRight className="ml-1 h-4 w-4 flex-shrink-0" />
          </a>
          <CopyButton
            content="Copy Hash to clipboard"
            copy={transactionEnqueued.l2TxHash}
          />
        </div>
      </TableCell>
      <TableCell className="max-w-40">
        <div className="flex text-sm">
          <a
            className="flex items-center truncate text-primary hover:brightness-150"
            href={`${l1Chain.blockExplorers.default.url}/address/${transactionEnqueued.l1TxOrigin}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="truncate">{transactionEnqueued.l1TxOrigin}</span>
            <SquareArrowOutUpRight className="ml-1 h-4 w-4 flex-shrink-0" />
          </a>
          <CopyButton
            content="Copy Hash to clipboard"
            copy={transactionEnqueued.l1TxOrigin}
          />
        </div>
      </TableCell>

      <TableCell>{formatGas(transactionEnqueued.gasLimit).value}</TableCell>
    </TableRow>
  );
};

export default LatestTxsEnqueuedTableRow;
