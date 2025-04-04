import { type Address } from "viem";
import Link from "next/link";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatTimestamp } from "@/lib/utils";
import TxMethodBadge from "@/components/lib/tx-method-badge";
import { type NftTransfer } from "@/components/pages/address/address-nft-transfers/fetch-nft-transfers";
import AddressLink from "@/components/lib/address-link";
import CopyButton from "@/components/lib/copy-button";
import TxTypeBadge from "@/components/lib/tx-type-badge";
import NftLink from "@/components/lib/nft-link";

const NftTransfersTableRow = ({
  address,
  nftTransfer,
  timestampFormattedAsDate,
}: {
  address: Address;
  nftTransfer: NftTransfer;
  timestampFormattedAsDate: boolean;
}) => {
  const { distance, utc } = formatTimestamp(nftTransfer.timestamp);
  return (
    <TableRow>
      <TableCell className="max-w-40">
        <div className="flex items-center gap-2">
          <Link
            href={`/tx/${nftTransfer.transactionHash}`}
            className="text-primary truncate hover:brightness-150"
          >
            {nftTransfer.transactionHash}
          </Link>
          <CopyButton
            content="Copy Transaction Hash"
            copy={nftTransfer.transactionHash}
          />
        </div>
      </TableCell>
      <TableCell>
        <TxMethodBadge
          selector={nftTransfer.selector}
          signature={nftTransfer.signature}
        />
      </TableCell>
      <TableCell>
        <Link
          href={`/block/${nftTransfer.blockNumber}`}
          className="text-primary hover:brightness-150"
        >
          {nftTransfer.blockNumber.toString()}
        </Link>
      </TableCell>
      <TableCell suppressHydrationWarning>
        {timestampFormattedAsDate ? utc : distance}
      </TableCell>
      <TableCell className="max-w-40">
        <div className="flex items-center gap-2">
          <AddressLink address={nftTransfer.from} formatted />
          <CopyButton content="Copy From" copy={nftTransfer.from} />
        </div>
      </TableCell>
      <TableCell>
        <TxTypeBadge
          type={
            nftTransfer.from === nftTransfer.to
              ? "self"
              : nftTransfer.from === address
                ? "out"
                : "in"
          }
        />
      </TableCell>
      <TableCell className="max-w-40">
        <div className="flex items-center gap-2">
          <AddressLink address={nftTransfer.to} formatted />
          <CopyButton content="Copy To" copy={nftTransfer.to} />
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline">{nftTransfer.type}</Badge>
      </TableCell>
      <TableCell>
        <NftLink metadata={nftTransfer.metadata} />
      </TableCell>
    </TableRow>
  );
};

export default NftTransfersTableRow;
