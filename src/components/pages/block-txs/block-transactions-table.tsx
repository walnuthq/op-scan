"use client";
import { TransactionWithReceipt } from "@/lib/types";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import BlockTransactionsTableRow from "@/components/pages/block-txs/block-transactions-table-row";
import useGlobalContext from "@/components/lib/context/hook";

const BlockTransactionsTable = ({
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
    <Table className="table-auto">
      <TableHeader>
        <TableRow>
          <TableHead>Transaction Hash</TableHead>
          <TableHead>Method</TableHead>
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
          <TableHead>Value</TableHead>
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
          <BlockTransactionsTableRow
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

export default BlockTransactionsTable;
