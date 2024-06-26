import Link from "next/link";
import { formatTimestamp } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { L1L2Transaction } from "@/lib/types";
import { SquareArrowOutUpRight } from "lucide-react";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { l1Chain } from "@/lib/chains";

const LatestL1L2TransactionsTable = ({
  transactions,
}: {
  transactions: L1L2Transaction[];
}) => (
  <Card>
    <CardContent className="p-4">
      <Table className="w-full table-auto">
        <TableCaption>
          List of latest L1 - L2 transactions
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="max-w-[10rem]">Block No</TableHead>
            <TableHead className="max-w-[10rem]">L2 Tx Hash</TableHead>
            <TableHead className="max-w-[10rem]">Timestamp</TableHead>
            <TableHead className="max-w-[10rem]">L1 Tx Hash</TableHead>
            <TableHead className="max-w-[10rem]">L1 Tx Origin</TableHead>
            <TableHead className="max-w-[8rem]">Gas Limit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.l2Hash}>
              <TableCell className="max-w-[10rem] truncate">
                <Link href={`https://explorer.l1.com/block/${transaction.l1BlockNumber}`}>
                  {transaction.l1BlockNumber.toString()}
                </Link>
              </TableCell>
              <TableCell className="max-w-[10rem] truncate">
                <Link href={`/txs/${transaction.l2Hash}`}>
                  {transaction.l2Hash}
                </Link>
              </TableCell>
              <TableCell className="max-w-[10rem] truncate">
                {formatTimestamp(transaction.timestamp, false)}
              </TableCell>
              <TableCell className="max-w-[10rem] truncate">
                <Link href={`https://explorer.l1.com/tx/${transaction.l1TxHash}`}>
                  {transaction.l1TxHash}
                </Link>
              </TableCell>
              <TableCell className="max-w-[10rem] truncate">
                <Link href={`https://explorer.l1.com/address/${transaction.l1TxOrigin}`}>
                  {transaction.l1TxOrigin}
                </Link>
              </TableCell>
              <TableCell className="max-w-[8rem] truncate">
                {transaction.gasLimit}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

export default LatestL1L2TransactionsTable;