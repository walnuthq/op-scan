import Link from "next/link";
import { TransactionEnqueued } from "@/lib/types";
import { formatTimestamp, formatGas } from "@/lib/utils";
import { TableRow, TableCell } from "@/components/ui/table";
import { l1Chain } from "@/lib/chains";
import { SquareArrowOutUpRight } from "lucide-react";

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
      <TableCell>
        <div className="max-w-40 truncate text-primary hover:brightness-150">
          <Link
            className="text-sm font-medium leading-none"
            href={`/tx/${transactionEnqueued.l2TxHash}`}
          >
            {transactionEnqueued.l2TxHash}
          </Link>
        </div>
      </TableCell>
      <TableCell suppressHydrationWarning>
        {timestampFormattedAsDate ? utc : distance}
      </TableCell>
      <TableCell>
        <a
          className="flex items-center text-primary hover:brightness-150"
          href={`${l1Chain.blockExplorers.default.url}/tx/${transactionEnqueued.l1TxHash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="max-w-40 truncate">
            {transactionEnqueued.l1TxHash}
          </span>
          <SquareArrowOutUpRight className="ml-1 size-4" />
        </a>
      </TableCell>
      <TableCell>
        <a
          className="flex items-center text-primary hover:brightness-150"
          href={`${l1Chain.blockExplorers.default.url}/address/${transactionEnqueued.l1TxOrigin}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="max-w-40 truncate">
            {transactionEnqueued.l1TxOrigin}
          </span>
          <SquareArrowOutUpRight className="ml-1 size-4" />
        </a>
      </TableCell>
      <TableCell>{formatGas(transactionEnqueued.gasLimit).value}</TableCell>
    </TableRow>
  );
};

export default LatestTxsEnqueuedTableRow;
