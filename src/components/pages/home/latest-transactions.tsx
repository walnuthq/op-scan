"use client";
import Link from "next/link";
import { zeroAddress } from "viem";
import { Transaction } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import AddressLink from "@/components/lib/address-link";
import { formatEther } from "@/lib/utils";
import { ReceiptText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatTimestamp } from "@/lib/utils";

const LatestTransaction = ({ transaction }: { transaction: Transaction }) => (
  <div className="flex items-center gap-4 pt-6">
    <div className="hidden h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground 2xl:flex">
      <ReceiptText className="h-5 w-5" />
    </div>
    <div className="flex grow flex-col gap-1">
      <div className="flex items-center gap-1 text-sm">
        Tx#
        <Link
          className="max-w-60 truncate text-primary hover:brightness-150 md:max-w-96 xl:max-w-60"
          href={`/tx/${transaction.hash}`}
        >
          {transaction.hash}
        </Link>
      </div>
      <div className="flex items-center gap-1 text-sm">
        <div className="flex max-w-44 items-center gap-1 md:max-w-60 xl:max-w-44">
          From
          <AddressLink address={transaction.from} formatted />
        </div>
        <div className="flex max-w-44 items-center gap-1 md:max-w-60 xl:max-w-44">
          To
          <AddressLink address={transaction.to ?? zeroAddress} formatted />
        </div>
      </div>
      <div className="flex items-center gap-1 text-sm">
        <span className="pr-2 text-muted-foreground" suppressHydrationWarning>
          {formatTimestamp(transaction.timestamp).distance}
        </span>
        <Badge variant="outline">{formatEther(transaction.value)} ETH</Badge>
      </div>
    </div>
  </div>
);

const LatestTransactions = ({
  transactions,
}: {
  transactions: Transaction[];
}) => (
  <Card>
    <CardHeader className="border-b">
      <CardTitle>Latest Transactions</CardTitle>
    </CardHeader>
    <CardContent className="grid max-h-[557px] gap-6 divide-y overflow-x-hidden overflow-y-scroll">
      {transactions.map((transaction) => (
        <LatestTransaction key={transaction.hash} transaction={transaction} />
      ))}
    </CardContent>
    <CardFooter className="flex justify-center border-t">
      <Link href="/txs" className="pt-6 text-primary hover:brightness-150">
        View all transactions →
      </Link>
    </CardFooter>
  </Card>
);

export default LatestTransactions;
