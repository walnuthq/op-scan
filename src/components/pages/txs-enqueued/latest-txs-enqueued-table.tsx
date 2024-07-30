"use client";
import { TransactionEnqueued } from "@/lib/types";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGlobalContext from "@/components/lib/context/hook";
import LatestTxsEnqueuedTableRow from "@/components/pages/txs-enqueued/latest-txs-enqueued-table-row";

const LatestTxsEnqueuedTable = ({
  transactions,
}: {
  transactions: TransactionEnqueued[];
}) => {
  const {
    state: { timestampFormattedAsDate },
    toggleTimestampFormattedAsDate,
  } = useGlobalContext();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Block No</TableHead>
          <TableHead>L2 Tx Hash</TableHead>
          <TableHead>
            <a
              className="cursor-pointer text-primary hover:brightness-150"
              role="button"
              onClick={toggleTimestampFormattedAsDate}
            >
              {timestampFormattedAsDate ? "Date Time (UTC)" : "Age"}
            </a>
          </TableHead>
          <TableHead>L1 Tx Hash</TableHead>
          <TableHead>L1 Tx Origin</TableHead>
          <TableHead>Gas Limit</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <LatestTxsEnqueuedTableRow
            key={transaction.l1TxHash}
            transaction={transaction}
            timestampFormattedAsDate={timestampFormattedAsDate}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default LatestTxsEnqueuedTable;
