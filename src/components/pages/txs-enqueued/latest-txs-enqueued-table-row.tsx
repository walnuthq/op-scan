import Link from "next/link";
import { type TransactionEnqueued } from "@/lib/types";
import { formatTimestamp, formatGas } from "@/lib/utils";
import { TableRow, TableCell } from "@/components/ui/table";
import { l1Chain } from "@/lib/chains";
import { SquareArrowOutUpRight } from "lucide-react";
import CopyButton from "@/components/lib/copy-button";

const LatestTxsEnqueuedTableRow = ({
  transactionEnqueued: {
    timestamp,
    l1BlockNumber,
    l2TxHash,
    l1TxHash,
    l1TxOrigin,
    gasLimit,
  },
  timestampFormattedAsDate,
}: {
  transactionEnqueued: TransactionEnqueued;
  timestampFormattedAsDate: boolean;
}) => {
  const { distance, utc } = formatTimestamp(timestamp);
  return (
    <TableRow>
      <TableCell>
        <a
          className="text-primary inline-flex items-center gap-1 truncate hover:brightness-150"
          href={`${l1Chain.blockExplorers.default.url}/block/${l1BlockNumber}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {l1BlockNumber.toString()}
          <SquareArrowOutUpRight className="size-4 shrink-0" />
        </a>
      </TableCell>
      <TableCell className="max-w-40">
        <div className="flex items-center gap-2">
          <Link
            href={`/tx/${l2TxHash}`}
            className="text-primary truncate text-sm leading-none font-medium hover:brightness-150"
          >
            {l2TxHash}
          </Link>
          <CopyButton content="Copy L2 Tx Hash" copy={l2TxHash} />
        </div>
      </TableCell>
      <TableCell suppressHydrationWarning>
        {timestampFormattedAsDate ? utc : distance}
      </TableCell>
      <TableCell className="max-w-40">
        <div className="flex items-center gap-2">
          <a
            className="text-primary inline-flex items-center gap-1 truncate hover:brightness-150"
            href={`${l1Chain.blockExplorers.default.url}/tx/${l1TxHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="truncate">{l1TxHash}</span>
            <SquareArrowOutUpRight className="size-4 shrink-0" />
          </a>
          <CopyButton content="Copy L1 Tx Hash" copy={l1TxHash} />
        </div>
      </TableCell>
      <TableCell className="max-w-40">
        <div className="flex items-center gap-2">
          <a
            className="text-primary inline-flex items-center gap-1 truncate hover:brightness-150"
            href={`${l1Chain.blockExplorers.default.url}/address/${l1TxOrigin}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="truncate">{l1TxOrigin}</span>
            <SquareArrowOutUpRight className="size-4 shrink-0" />
          </a>
          <CopyButton content="Copy L1 Tx Origin" copy={l1TxOrigin} />
        </div>
      </TableCell>
      <TableCell>{formatGas(gasLimit).value}</TableCell>
    </TableRow>
  );
};

export default LatestTxsEnqueuedTableRow;
