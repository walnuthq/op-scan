import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { formatEther, formatGwei } from "viem";

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
}

export function TransactionsTable({ transactions }: { 
transactions: any }) {
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
        {transactions.map((tx: any) =>{
           const formattedtimestamp = formatTimestamp(Number(tx.timestamp));
           return(
          <TableRow key={tx.hash}>
            <TableCell>
              <Link
                href={`/tx/${tx.hash}`}
                className="text-blue-500 hover:underline"
              >
                {tx.hash.slice(0, 10)}...
              </Link>
            </TableCell>
            <TableCell>{tx.input.slice(0, 10)}</TableCell>
            <TableCell>
              <Link
                href={`/block/${tx.blockNumber}`}
                className="text-blue-500 hover:underline"
              >
                {tx.blockNumber.toString()}
              </Link>
            </TableCell>
            <TableCell>{formattedtimestamp}</TableCell>
            <TableCell>
              <Link
                href={`/address/${tx.from}`}
                className="text-blue-500 hover:underline"
              >
                {formatAddress(tx.from)}
              </Link>
            </TableCell>
            <TableCell>
              {tx.to && (
                <Link
                  href={`/address/${tx.to}`}
                  className="text-blue-500 hover:underline"
                >
                  {formatAddress(tx.to)}
                </Link>
              )}
              {!tx.to && "Contract Creation"}
            </TableCell>
            <TableCell>{formatEther(tx.value)} ETH</TableCell>
            <TableCell>{formatGwei(tx.gasPrice ?? BigInt(0))} Gwei</TableCell>
          </TableRow>
        )})}
      </TableBody>
    </Table>
  );
}

function formatAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
