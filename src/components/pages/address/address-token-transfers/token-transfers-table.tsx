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
import { TokenTransfer } from "@/components/pages/address/address-token-transfers/fetch-token-transfers";
import useGlobalContext from "@/components/lib/context/hook";
import TokenTransfersTableRow from "@/components/pages/address/address-token-transfers/token-transfers-table-row";

const TokenTransfersTable = ({
  tokenTransfers,
  address,
}: {
  tokenTransfers: TokenTransfer[];
  address: Address;
}) => {
  const {
    state: { timestampFormattedAsDate, usdValueShown },
    toggleTimestampFormattedAsDate,
    toggleUSDValueShown,
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
              className="text-primary cursor-pointer hover:brightness-150"
              role="button"
              onClick={toggleTimestampFormattedAsDate}
            >
              {timestampFormattedAsDate ? "Date Time (UTC)" : "Age"}
            </a>
          </TableHead>
          <TableHead>From</TableHead>
          <TableHead />
          <TableHead>To</TableHead>
          <TableHead>
            <a
              className="text-primary cursor-pointer hover:brightness-150"
              role="button"
              onClick={toggleUSDValueShown}
            >
              {usdValueShown ? "Value (USD)" : "Amount"}
            </a>
          </TableHead>
          <TableHead>Token</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tokenTransfers.length === 0 ? (
          <TableRow>
            <TableCell colSpan={9} className="text-center">
              No data available in table
            </TableCell>
          </TableRow>
        ) : (
          tokenTransfers.map((tokenTransfer) => (
            <TokenTransfersTableRow
              key={`${tokenTransfer.blockNumber}-${tokenTransfer.transactionHash}-${tokenTransfer.logIndex}`}
              tokenTransfer={tokenTransfer}
              timestampFormattedAsDate={timestampFormattedAsDate}
              usdValueShown={usdValueShown}
              address={address}
            />
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default TokenTransfersTable;
