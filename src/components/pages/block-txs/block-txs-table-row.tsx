import Link from "next/link";
import { zeroAddress } from "viem";
import { type TransactionWithReceiptAndAccounts } from "@/lib/types";
import { formatTimestamp, formatEther, formatGwei } from "@/lib/utils";
import { TableRow, TableCell } from "@/components/ui/table";
import TxMethodBadge from "@/components/lib/tx-method-badge";
import AddressLink from "@/components/lib/address-link";
import CopyButton from "@/components/lib/copy-button";

const BlockTxsTableRow = ({
  transaction,
  timestampFormattedAsDate,
  txGasPriceShown,
}: {
  transaction: TransactionWithReceiptAndAccounts;
  timestampFormattedAsDate: boolean;
  txGasPriceShown: boolean;
}) => {
  const account =
    transaction.accounts.length === 1 ? transaction.accounts[0] : undefined;
  const { distance, utc } = formatTimestamp(transaction.timestamp);
  const actualTo =
    transaction.to ?? (account ? account.address : null) ?? zeroAddress;
  return (
    <TableRow>
      <TableCell className="max-w-40">
        <div className="flex items-center gap-2">
          <Link
            href={`/tx/${transaction.hash}`}
            className="text-primary truncate hover:brightness-150"
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
          account={account}
        />
      </TableCell>
      <TableCell>{timestampFormattedAsDate ? utc : distance}</TableCell>
      <TableCell className="max-w-40">
        <div className="flex items-center gap-2">
          <AddressLink address={transaction.from} formatted />
          <CopyButton content="Copy From" copy={transaction.from} />
        </div>
      </TableCell>
      <TableCell className="max-w-40">
        <div className="flex items-center gap-2">
          <AddressLink address={actualTo} formatted />
          <CopyButton content="Copy To" copy={actualTo} />
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

export default BlockTxsTableRow;
