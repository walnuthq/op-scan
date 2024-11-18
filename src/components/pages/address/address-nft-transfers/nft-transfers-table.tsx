"use client";
import { Address } from "viem";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import useGlobalContext from "@/components/lib/context/hook";
import { NftTransfer } from "@/components/pages/address/address-nft-transfers/fetch-nft-transfers";
import NftTransfersTableRow from "@/components/pages/address/address-nft-transfers/nft-transfers-table-row";

const NftTransfersTable = ({
  address,
  nftTransfers,
}: {
  address: Address;
  nftTransfers: NftTransfer[];
}) => {
  const {
    state: { timestampFormattedAsDate },
    toggleTimestampFormattedAsDate,
  } = useGlobalContext();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Transaction Hash</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Block</TableHead>
          <TableHead>
            <a
              className="cursor-pointer text-primary hover:brightness-150"
              role="button"
              onClick={toggleTimestampFormattedAsDate}
            >
              {timestampFormattedAsDate ? "Date Time (UTC)" : "Age"}
            </a>
          </TableHead>
          <TableHead>From</TableHead>
          <TableHead />
          <TableHead>To</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Item</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {nftTransfers.length === 0 ? (
          <TableRow>
            <TableCell colSpan={9} className="text-center">
              No data available in table
            </TableCell>
          </TableRow>
        ) : (
          nftTransfers.map((nftTransfer) => (
            <NftTransfersTableRow
              key={`${nftTransfer.blockNumber}-${nftTransfer.transactionHash}-${nftTransfer.logIndex}`}
              address={address}
              nftTransfer={nftTransfer}
              timestampFormattedAsDate={timestampFormattedAsDate}
            />
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default NftTransfersTable;
