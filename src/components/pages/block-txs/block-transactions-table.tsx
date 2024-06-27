import { Card, CardContent } from "@/components/ui/card";
import { TransactionWithReceipt } from "@/lib/types";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import BlockTransactionsTableRow from "@/components/pages/block-txs/block-transactions-table-row";

const BlockTransactionsTable = ({
  transactions,
}: {
  transactions: TransactionWithReceipt[];
}) => (
  <Card>
    <CardContent className="p-4">
      <dl>
        <Table className="w-full table-auto">
          <TableCaption>TABLE CAPTION</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="max-w-[10rem]">Transaction Hash</TableHead>
              <TableHead className="max-w-[8rem]">Method</TableHead>
              <TableHead className="max-w-[10rem]">Timestamp</TableHead>
              <TableHead className="max-w-[12rem]">From</TableHead>
              <TableHead className="max-w-[12rem]">To</TableHead>
              <TableHead className="max-w-[8rem]">Value</TableHead>
              <TableHead className="max-w-[8rem]">Fee</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <BlockTransactionsTableRow
                key={transaction.hash}
                transaction={transaction}
              />
            ))}
          </TableBody>
        </Table>
      </dl>
    </CardContent>
  </Card>
);

export default BlockTransactionsTable;
