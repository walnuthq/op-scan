import Link from "next/link";
import { TransactionWithReceipt } from "@/lib/types";
import { formatTimestamp, formatEther, formatGwei } from "@/lib/utils";
import { TableRow, TableCell } from "@/components/ui/table";
import TxMethodBadge from "@/components/lib/tx-method-badge";
import AddressLink from "@/components/lib/address-link";

const LatestTxsTableRow = ({
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
      <TableCell>
        <div className="max-w-40 truncate text-primary hover:brightness-150">
          <Link
            href={`/tx/${transaction.hash}`}
            className="text-sm font-medium leading-none"
          >
            {transaction.hash}
          </Link>
        </div>
      </TableCell>
      <TableCell>
        <TxMethodBadge
          selector={transaction.input.slice(0, 10)}
          signature={transaction.signature}
        />
      </TableCell>
      <TableCell>
        <Link
          href={`/block/${transaction.blockNumber}`}
          className="text-sm font-medium leading-none text-primary hover:brightness-150"
        >
          {transaction.blockNumber.toString()}
        </Link>
      </TableCell>
      <TableCell suppressHydrationWarning>
        {timestampFormattedAsDate ? utc : distance}
      </TableCell>
      <TableCell>
          <AddressLink
            href={`/address/${transaction.from}`}
            address={transaction.from}
          />
      </TableCell>
      <TableCell>
        <AddressLink
          href={`/address/${transaction.to}`}
          address={transaction.to}
        />
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

export default LatestTxsTableRow;
