import Link from "next/link";
import { formatTimestamp } from "@/lib/utils";
import EthereumIcon from "@/components/lib/ethereum-icon";
import { Card, CardContent } from "@/components/ui/card";
import { Transaction } from "@/lib/types";
import { formatEther, formatGwei } from "viem";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import DescriptionListItem from "@/components/lib/description-list-item";

const BlockTransactionsTable = ({
  transactions,
}: {
  transactions: Transaction[];
}) => (
  <Card>
    <CardContent className="p-4">
      <dl>
        <Table className="w-full table-auto">
          <TableCaption>
            List of transactions for block{" "}
            {transactions[0].blockNumber.toString()}
          </TableCaption>
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
              <TableRow key={transaction.hash}>
                <TableCell className="max-w-[10rem] truncate">
                  <Link
                    href={`/tx/${transaction.hash}`}
                    className="text-sm font-medium leading-none text-primary hover:brightness-150"
                  >
                    {transaction.hash}
                  </Link>
                </TableCell>
                <TableCell className="max-w-[8rem] truncate">
                  {transaction.method}
                </TableCell>
                <TableCell className="max-w-[10rem] truncate">
                  {formatTimestamp(transaction.timestamp, false)}
                </TableCell>
                <TableCell className="max-w-[10rem] truncate">
                  <Link
                    href={`/address/${transaction.from}`}
                    className="text-sm font-medium leading-none text-primary hover:brightness-150"
                  >
                    {transaction.from}
                  </Link>
                </TableCell>
                <TableCell className="max-w-[10rem] truncate">
                  <Link
                    href={`/address/${transaction.to}`}
                    className="text-sm font-medium leading-none text-primary hover:brightness-150"
                  >
                    {transaction.to}
                  </Link>
                </TableCell>
                <TableCell className="max-w-[8rem] truncate">
                  <p className="flex items-center">
                    <EthereumIcon className="mr-1 size-4" />
                    {formatEther(transaction.value)} ETH
                  </p>
                </TableCell>
                <TableCell className="max-w-[8rem] truncate">
                  {formatGwei(transaction.gasPrice ?? BigInt(0))} Gwei
                  <span className="ml-1 text-muted-foreground">
                    ({formatEther(transaction.effectiveGasUsed ?? BigInt(0))}{" "}
                    ETH)
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </dl>
    </CardContent>
  </Card>
);

export default BlockTransactionsTable;
