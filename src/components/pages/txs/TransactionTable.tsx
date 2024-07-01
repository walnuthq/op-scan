import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatAddress, formatTimestamp } from "@/lib/utils";
import Link from "next/link";
import { formatEther, formatGwei } from "viem";

export function TransactionsTable({ transactions }: { transactions: any }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tx Hash</TableHead>
          <TableHead>Method ID</TableHead>
          <TableHead>Block</TableHead>
          <TableHead>Age</TableHead>
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Txn Fee</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((tx: any) => {
          const formattedtimestamp = formatTimestamp(tx.timestamp);
          return (
            <TableRow key={tx.hash}>
              <TableCell>
                <Link
                  href={`/tx/${tx.hash}`}
                  className="text-primary hover:brightness-150"
                >
                  {tx.hash.slice(0, 10)}...
                </Link>
              </TableCell>
              <TableCell>{tx.input.slice(0, 10)}</TableCell>
              <TableCell>
                <Link
                  href={`/block/${tx.blockNumber}`}
                  className="text-primary hover:brightness-150"
                >
                  {tx.blockNumber.toString()}
                </Link>
              </TableCell>
              <TableCell>{formattedtimestamp.distance}</TableCell>
              <TableCell>
                <Link
                  href={`/address/${tx.from}`}
                  className="text-primary hover:brightness-150"
                >
                  {formatAddress(tx.from)}
                </Link>
              </TableCell>
              <TableCell>
                {tx.to && (
                  <Link
                    href={`/address/${tx.to}`}
                    className="text-primary hover:brightness-150"
                  >
                    {formatAddress(tx.to)}
                  </Link>
                )}
                {!tx.to && "Contract Creation"}
              </TableCell>
              <TableCell>{formatEther(tx.value)} ETH</TableCell>
              <TableCell>{formatGwei(tx.gasPrice ?? BigInt(0))} Gwei</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
