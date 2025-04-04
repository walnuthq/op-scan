import Link from "next/link";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatTimestamp } from "@/lib/utils";
import TxMethodBadge from "@/components/lib/tx-method-badge";
import { type TokenTransfer } from "@/components/pages/address/address-token-transfers/fetch-token-transfers";
import AddressLink from "@/components/lib/address-link";
import CopyButton from "@/components/lib/copy-button";
import TxTypeBadge from "@/components/lib/tx-type-badge";
import TokenTransferDestSrcBadge from "@/components/pages/address/address-token-transfers/token-transfer-dest-src-badge";
import ChainBadge from "@/components/lib/chain-badge";
import type { AccountWithTransactionAndToken } from "@/lib/types";

const TokenTransfersTableRow = ({
  tokenTransfer,
  timestampFormattedAsDate,
  usdValueShown,
  account,
  withDestSrcChain,
}: {
  tokenTransfer: TokenTransfer;
  timestampFormattedAsDate: boolean;
  usdValueShown: boolean;
  account: AccountWithTransactionAndToken;
  withDestSrcChain: boolean;
}) => {
  const { distance, utc } = formatTimestamp(tokenTransfer.timestamp);
  const destinationAccount = account.accounts?.find(
    ({ rollupConfig }) => rollupConfig.l2ChainId === tokenTransfer.destination,
  );
  const sourceAccount = account.accounts?.find(
    ({ rollupConfig }) => rollupConfig.l2ChainId === tokenTransfer.source,
  );
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
              : tokenTransfer.from === account.address
                ? "out"
                : "in"
          }
        />
      </TableCell>
      <TableCell className="max-w-40">
        <div className="flex items-center gap-2">
          <AddressLink
            address={tokenTransfer.to}
            formatted
            href={
              (destinationAccount &&
                `${destinationAccount.rollupConfig.l2ChainBlockExplorerUrl}/address/${tokenTransfer.to}`) ??
              (sourceAccount &&
                `${sourceAccount.rollupConfig.l2ChainBlockExplorerUrl}/address/${tokenTransfer.to}`)
            }
          />
          <CopyButton content="Copy To" copy={tokenTransfer.to} />
        </div>
      </TableCell>
      {withDestSrcChain && (
        <>
          <TableCell>
            {destinationAccount && <TokenTransferDestSrcBadge type="dest" />}
            {sourceAccount && <TokenTransferDestSrcBadge type="src" />}
          </TableCell>
          <TableCell>
            {destinationAccount && (
              <ChainBadge name={destinationAccount.rollupConfig.l2ChainName} />
            )}
            {sourceAccount && (
              <ChainBadge name={sourceAccount.rollupConfig.l2ChainName} />
            )}
          </TableCell>
        </>
      )}
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
