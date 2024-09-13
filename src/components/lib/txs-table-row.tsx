import Link from "next/link";
import { Address, zeroAddress, formatEther as viemFormatEther } from "viem";
import { TransactionWithReceiptAndAccounts } from "@/lib/types";
import {
  formatTimestamp,
  formatEther,
  formatGwei,
  formatPrice,
} from "@/lib/utils";
import { TableRow, TableCell } from "@/components/ui/table";
import TxMethodBadge from "@/components/lib/tx-method-badge";
import AddressLink from "@/components/lib/address-link";
import CopyButton from "@/components/lib/copy-button";
import TxTypeBadge from "@/components/lib/tx-type-badge";

const TxsTableRow = ({
  transaction,
  timestampFormattedAsDate,
  usdValueShown,
  txGasPriceShown,
  ethPrice,
  address,
}: {
  transaction: TransactionWithReceiptAndAccounts;
  timestampFormattedAsDate: boolean;
  usdValueShown: boolean;
  txGasPriceShown: boolean;
  ethPrice: number;
  address?: Address;
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
          account={account}
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
      {address && (
        <TableCell>
          <TxTypeBadge
            type={
              transaction.from === transaction.to
                ? "self"
                : transaction.from === address
                  ? "out"
                  : "in"
            }
          />
        </TableCell>
      )}
      <TableCell className="max-w-40">
        <div className="flex items-center gap-2">
          <AddressLink address={actualTo} formatted />
          <CopyButton content="Copy To" copy={actualTo} />
        </div>
      </TableCell>
      <TableCell>
        {usdValueShown
          ? formatPrice(Number(viemFormatEther(transaction.value)) * ethPrice)
          : `${formatEther(transaction.value, 15)} ETH`}
      </TableCell>
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
