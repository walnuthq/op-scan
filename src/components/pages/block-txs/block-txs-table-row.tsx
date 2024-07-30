import Link from "next/link";
import { TransactionWithReceipt } from "@/lib/types";
import { formatTimestamp, formatEther, formatGwei } from "@/lib/utils";
import { TableRow, TableCell } from "@/components/ui/table";
import TxMethodBadge from "@/components/lib/tx-method-badge";

const BlockTxsTableRow = ({
  transaction,
  timestampFormattedAsDate,
  txGasPriceShown,
}: {
  transaction: TransactionWithReceipt;
  timestampFormattedAsDate: boolean;
  txGasPriceShown: boolean;
}) => {
  const { distance, utc } = formatTimestamp(transaction.timestamp);
  return (
    <TableRow>
      <TableCell className="max-w-40 truncate text-primary hover:brightness-150">
        <Link
          href={`/tx/${transaction.hash}`}
          className="text-sm font-medium leading-none"
        >
          {transaction.hash}
        </Link>
      </TableCell>
      <TableCell>
        <TxMethodBadge
          selector={transaction.input.slice(0, 10)}
          signature={transaction.signature}
        />
      </TableCell>
      <TableCell>{timestampFormattedAsDate ? utc : distance}</TableCell>
      <TableCell className="max-w-40 truncate text-primary hover:brightness-150">
        <Link
          href={`/address/${transaction.from}`}
          className="text-sm font-medium leading-none"
        >
          {transaction.from}
        </Link>
      </TableCell>
      <TableCell className="max-w-40 truncate text-primary hover:brightness-150">
        <Link
          href={`/address/${transaction.to}`}
          className="text-sm font-medium leading-none"
        >
          {transaction.to}
        </Link>
      </TableCell>
      <TableCell>{formatEther(transaction.value, 15)} ETH</TableCell>
      <TableCell>
        {txGasPriceShown
          ? formatGwei(transaction.receipt.effectiveGasPrice)
          : formatEther(
              transaction.receipt.effectiveGasPrice *
                transaction.receipt.gasUsed,
              8,
            )}
      </TableCell>
    </TableRow>
  );
};

export default BlockTxsTableRow;
