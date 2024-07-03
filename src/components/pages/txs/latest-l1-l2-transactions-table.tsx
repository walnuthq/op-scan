// src/components/tx/latest-l1-l2-transactions-table.tsx
import Link from "next/link";
import { formatTimestamp, formatGas } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { L1L2Transaction } from "@/lib/types";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { SquareArrowOutUpRight } from "lucide-react";
import { l1Chain } from "@/lib/chains";

const LatestL1L2TransactionsTable = ({
  transactions,
}: {
  transactions: L1L2Transaction[];
}) => (
  <Card>
    <CardContent className="p-4">
      <Table className="w-full table-auto">
        <TableCaption className="text-lg font-semibold">
          List of latest L1 - L2 transactions
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="px-4 py-2">Block No</TableHead>
            <TableHead className="px-4 py-2">L2 Tx Hash</TableHead>
            <TableHead className="px-4 py-2">Timestamp</TableHead>
            <TableHead className="px-4 py-2">L1 Tx Hash</TableHead>
            <TableHead className="px-4 py-2">L1 Tx Origin</TableHead>
            <TableHead className="px-4 py-2">Gas Limit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.l2TxHash}>
              <TableCell className="max-w-[10rem] truncate px-4 py-2">
                <div className="flex items-center gap-1 text-sm">
                  <a
                    className="flex items-center truncate text-primary hover:brightness-150"
                    href={`${l1Chain.blockExplorers.default.url}/block/${transaction.l1BlockNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="truncate">
                      {transaction.l1BlockNumber.toString()}
                    </span>
                    <SquareArrowOutUpRight className="ml-1 h-4 w-4 flex-shrink-0" />
                  </a>
                </div>
              </TableCell>
              <TableCell className="max-w-[14rem] truncate px-4 py-2">
                <div className="flex items-center gap-1 text-sm">
                  <Link
                    className="flex items-center truncate text-primary hover:brightness-150"
                    href={`/tx/${transaction.l2TxHash}`}
                  >
                    <span className="truncate">{transaction.l2TxHash}</span>
                  </Link>
                </div>
              </TableCell>
              <TableCell className="max-w-[10rem] truncate px-4 py-2">
                {formatTimestamp(transaction.timestamp).distance}
              </TableCell>
              <TableCell className="max-w-[14rem] truncate px-4 py-2">
                <div className="flex items-center gap-1 text-sm">
                  <a
                    className="flex items-center truncate text-primary hover:brightness-150"
                    href={`${l1Chain.blockExplorers.default.url}/tx/${transaction.l1TxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="truncate">{transaction.l1TxHash}</span>
                    <SquareArrowOutUpRight className="ml-1 h-4 w-4 flex-shrink-0" />
                  </a>
                </div>
              </TableCell>
              <TableCell className="max-w-[14rem] truncate px-4 py-2">
                <div className="flex items-center gap-1 text-sm">
                  <a
                    className="flex items-center truncate text-primary hover:brightness-150"
                    href={`${l1Chain.blockExplorers.default.url}/address/${transaction.l1TxOrigin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="truncate">{transaction.l1TxOrigin}</span>
                    <SquareArrowOutUpRight className="ml-1 h-4 w-4 flex-shrink-0" />
                  </a>
                </div>
              </TableCell>
              <TableCell className="max-w-[8rem] truncate px-4 py-2">
                {formatGas(transaction.gasLimit).value}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

export default LatestL1L2TransactionsTable;
