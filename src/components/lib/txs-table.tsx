"use client";
import { type Address } from "viem";
import { type TransactionWithReceiptAndAccounts } from "@/lib/types";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import useGlobalContext from "@/components/lib/context/hook";
import TxsTableRow from "@/components/lib/txs-table-row";

const TxsTable = ({
  transactions,
  ethPrice,
  address,
}: {
  transactions: TransactionWithReceiptAndAccounts[];
  ethPrice: number;
  address?: Address;
}) => {
  const {
    state: { timestampFormattedAsDate, usdValueShown, txGasPriceShown },
    toggleTimestampFormattedAsDate,
    toggleUSDValueShown,
    toggleTxGasPriceShown,
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
          {address && <TableHead />}
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
          <TableHead>
            <a
              className="text-primary cursor-pointer hover:brightness-150"
              role="button"
              onClick={toggleTxGasPriceShown}
            >
              {txGasPriceShown ? "Gas Price" : "Txn Fee"}
            </a>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.length === 0 ? (
          <TableRow>
            <TableCell colSpan={address ? 9 : 8} className="text-center">
              No data available in table
            </TableCell>
          </TableRow>
        ) : (
          transactions.map((transaction) => (
            <TxsTableRow
              key={transaction.hash}
              transaction={transaction}
              timestampFormattedAsDate={timestampFormattedAsDate}
              usdValueShown={usdValueShown}
              txGasPriceShown={txGasPriceShown}
              ethPrice={ethPrice}
              address={address}
            />
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default TxsTable;
