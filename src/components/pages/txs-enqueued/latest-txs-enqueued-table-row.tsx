import Link from "next/link";
import { TransactionEnqueued } from "@/lib/types";
import { formatTimestamp, formatGas } from "@/lib/utils";
import { TableRow, TableCell } from "@/components/ui/table";
import { l1Chain } from "@/lib/chains";
import { SquareArrowOutUpRight } from "lucide-react";

const LatestTxsEnqueuedTableRow = ({
  transaction,
  timestampFormattedAsDate,
}: {
  transaction: TransactionEnqueued;
  timestampFormattedAsDate: boolean;
}) => {
  const { distance, utc } = formatTimestamp(transaction.timestamp);
  return (
    <TableRow>
      <TableCell>
        <a
          className="flex items-center truncate text-primary hover:brightness-150"
          href={`${l1Chain.blockExplorers.default.url}/block/${transaction.l1BlockNumber}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {transaction.l1BlockNumber.toString()}
          <SquareArrowOutUpRight className="ml-1 size-4" />
        </a>
      </TableCell>
      <TableCell>
        <div className="max-w-40 truncate text-primary hover:brightness-150">
          <Link
            className="text-sm font-medium leading-none"
            href={`/tx/${transaction.l2TxHash}`}
          >
            {transaction.l2TxHash}
          </Link>
        </div>
      </TableCell>
      <TableCell suppressHydrationWarning>
        {timestampFormattedAsDate ? utc : distance}
      </TableCell>
      <TableCell>
        <a
          className="flex items-center text-primary hover:brightness-150"
          href={`${l1Chain.blockExplorers.default.url}/tx/${transaction.l1TxHash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="max-w-40 truncate">{transaction.l1TxHash}</span>
          <SquareArrowOutUpRight className="ml-1 size-4" />
        </a>
      </TableCell>
      <TableCell>
        <a
          className="flex items-center text-primary hover:brightness-150"
          href={`${l1Chain.blockExplorers.default.url}/address/${transaction.l1TxOrigin}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="max-w-40 truncate">{transaction.l1TxOrigin}</span>
          <SquareArrowOutUpRight className="ml-1 size-4" />
        </a>
      </TableCell>
      <TableCell>{formatGas(transaction.gasLimit).value}</TableCell>
    </TableRow>
  );
};

export default LatestTxsEnqueuedTableRow;
