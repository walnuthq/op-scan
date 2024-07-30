"use client";
import { TransactionWithReceipt } from "@/lib/types";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGlobalContext from "@/components/lib/context/hook";
import LatestTxsTableRow from "@/components/pages/txs/latest-txs-table-row";

const LatestTxsTable = ({
  transactions,
}: {
  transactions: TransactionWithReceipt[];
}) => {
  const {
    state: { timestampFormattedAsDate, txGasPriceShown },
    toggleTimestampFormattedAsDate,
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
              className="cursor-pointer text-primary hover:brightness-150"
              role="button"
              onClick={toggleTimestampFormattedAsDate}
            >
              {timestampFormattedAsDate ? "Date Time (UTC)" : "Age"}
            </a>
          </TableHead>
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>
            <a
              className="cursor-pointer text-primary hover:brightness-150"
              role="button"
              onClick={toggleTxGasPriceShown}
            >
              {txGasPriceShown ? "Gas Price" : "Txn Fee"}
            </a>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <LatestTxsTableRow
            key={transaction.hash}
            transaction={transaction}
            timestampFormattedAsDate={timestampFormattedAsDate}
            txGasPriceShown={txGasPriceShown}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default LatestTxsTable;
