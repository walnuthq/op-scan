import { l2PublicClient } from "@/lib/chains";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { formatTimestamp } from "@/lib/utils";

const BlckTxs = async ({ number }: { number: bigint }) => {
    const block = l2PublicClient.getBlock({
        blockNumber: number,
        includeTransactions: true,
      });
    
    const ts = formatTimestamp((await block).timestamp, false);

    const transactions = (await block).transactions;

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-4 md:p-4">
            <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                Transactions
            </h2>
            <p>
                For block{' '}
                <Link
                    href={`/block/${number}`}
                    className="text-sm font-medium leading-none text-primary hover:brightness-150"
                >{number.toString()}</Link>
            </p>
            <div className="overflow-x-auto w-full">
                <Table className="table-auto w-full">
                <TableCaption>List of transactions for block {number.toString()}</TableCaption>
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
                            <Link href={`/tx/${transaction.hash}`} className="text-sm font-medium leading-none text-primary hover:brightness-150">
                                {transaction.hash}
                            </Link>
                        </TableCell>
                        <TableCell className="max-w-[8rem] truncate">{transaction.input.slice(0,10)}</TableCell>
                        <TableCell className="max-w-[10rem] truncate">{ts}</TableCell>
                        <TableCell className="max-w-[10rem] truncate">
                            <Link href={`/address/${transaction.from}`} className="text-sm font-medium leading-none text-primary hover:brightness-150">
                                {transaction.from}
                            </Link>
                        </TableCell>
                        <TableCell className="max-w-[10rem] truncate">
                            <Link href={`/address/${transaction.to}`} className="text-sm font-medium leading-none text-primary hover:brightness-150">
                                {transaction.to}
                            </Link>
                        </TableCell>
                        <TableCell className="max-w-[8rem] truncate">{transaction.value.toString()}</TableCell>
                        <TableCell className="max-w-[8rem] truncate">0.{(transaction.gasPrice * transaction.gas).toString()}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
        </main>
    );
}

export default BlckTxs;