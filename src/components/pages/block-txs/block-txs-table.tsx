"use client";
import { TransactionWithReceiptAndAccounts } from "@/lib/types";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import BlockTxsTableRow from "@/components/pages/block-txs/block-txs-table-row";
import useGlobalContext from "@/components/lib/context/hook";

const BlockTxsTable = ({
  transactions,
}: {
  transactions: TransactionWithReceiptAndAccounts[];
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
          <TableHead>To</TableHead>
          <TableHead>Value</TableHead>
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
        {transactions.map((transaction) => (
          <BlockTxsTableRow
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

export default BlockTxsTable;
