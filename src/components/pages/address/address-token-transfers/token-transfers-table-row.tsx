import { Address } from "viem";
import Link from "next/link";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatTimestamp } from "@/lib/utils";
import TxMethodBadge from "@/components/lib/tx-method-badge";
import { TokenTransfer } from "@/components/pages/address/address-token-transfers/fetch-token-transfers";
import AddressLink from "@/components/lib/address-link";
import CopyButton from "@/components/lib/copy-button";
import TxTypeBadge from "@/components/lib/tx-type-badge";

const TokenTransfersTableRow = ({
  tokenTransfer,
  timestampFormattedAsDate,
  usdValueShown,
  address,
}: {
  tokenTransfer: TokenTransfer;
  timestampFormattedAsDate: boolean;
  usdValueShown: boolean;
  address: Address;
}) => {
  const { distance, utc } = formatTimestamp(tokenTransfer.timestamp);
  return (
    <TableRow>
      <TableCell className="max-w-40">
        <div className="flex items-center gap-2">
          <Link
            href={`/tx/${tokenTransfer.transactionHash}`}
            className="text-primary truncate hover:brightness-150"
          >
            {tokenTransfer.transactionHash}
          </Link>
          <CopyButton
            content="Copy Transaction Hash"
            copy={tokenTransfer.transactionHash}
          />
        </div>
      </TableCell>
      <TableCell>
        <TxMethodBadge
          selector={tokenTransfer.selector}
          signature={tokenTransfer.signature}
        />
      </TableCell>
      <TableCell>
        <Link
          href={`/block/${tokenTransfer.blockNumber}`}
          className="text-primary hover:brightness-150"
        >
          {tokenTransfer.blockNumber.toString()}
        </Link>
      </TableCell>
      <TableCell suppressHydrationWarning>
        {timestampFormattedAsDate ? utc : distance}
      </TableCell>
      <TableCell className="max-w-40">
        <div className="flex items-center gap-2">
          <AddressLink address={tokenTransfer.from} formatted />
          <CopyButton content="Copy From" copy={tokenTransfer.from} />
        </div>
      </TableCell>
      <TableCell>
        <TxTypeBadge
          type={
            tokenTransfer.from === tokenTransfer.to
              ? "self"
              : tokenTransfer.from === address
                ? "out"
                : "in"
          }
        />
      </TableCell>
      <TableCell className="max-w-40">
        <div className="flex items-center gap-2">
          <AddressLink address={tokenTransfer.to} formatted />
          <CopyButton content="Copy To" copy={tokenTransfer.to} />
        </div>
      </TableCell>
      <TableCell>
        {usdValueShown ? tokenTransfer.usdValue : tokenTransfer.amount}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <AddressLink address={tokenTransfer.tokenAddress} formatted />
          <CopyButton content="Copy Token" copy={tokenTransfer.tokenAddress} />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default TokenTransfersTableRow;
