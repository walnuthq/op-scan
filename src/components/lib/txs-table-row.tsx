import Link from "next/link";
import { zeroAddress } from "viem";
import { TransactionWithReceipt } from "@/lib/types";
import { formatTimestamp, formatEther, formatGwei } from "@/lib/utils";
import { TableRow, TableCell } from "@/components/ui/table";
import TxMethodBadge from "@/components/lib/tx-method-badge";
import AddressLink from "@/components/lib/address-link";
import CopyButton from "@/components/lib/copy-button";

const TxsTableRow = ({
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
      <TableCell className="max-w-40">
        <div className="flex items-center gap-2">
          <Link
            href={`/tx/${transaction.hash}`}
            className="truncate text-primary hover:brightness-150"
          >
            {transaction.hash}
          </Link>
          <CopyButton content="Copy Transaction Hash" copy={transaction.hash} />
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
          className="text-primary hover:brightness-150"
        >
          {transaction.blockNumber.toString()}
        </Link>
      </TableCell>
      <TableCell suppressHydrationWarning>
        {timestampFormattedAsDate ? utc : distance}
      </TableCell>
      <TableCell className="max-w-40">
        <div className="flex items-center gap-2">
          <AddressLink address={transaction.from} formatted />
          <CopyButton content="Copy From" copy={transaction.from} />
        </div>
      </TableCell>
      <TableCell className="max-w-40">
        <div className="flex items-center gap-2">
          <AddressLink address={transaction.to ?? zeroAddress} formatted />
          <CopyButton content="Copy To" copy={transaction.to ?? ""} />
        </div>
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

export default TxsTableRow;
