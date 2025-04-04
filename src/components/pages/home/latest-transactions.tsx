"use client";
import Link from "next/link";
import { zeroAddress } from "viem";
import { type TransactionWithAccounts } from "@/lib/types";
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

const LatestTransaction = ({
  transaction: { hash, from, to, value, timestamp, accounts },
}: {
  transaction: TransactionWithAccounts;
}) => {
  const account = accounts.length === 1 ? accounts[0] : undefined;
  const actualTo = to ?? (account ? account.address : null);
  return (
    <div className="flex items-center gap-4 pb-6 last:pb-0">
      <div className="bg-accent text-accent-foreground hidden h-9 w-9 items-center justify-center rounded-lg 2xl:flex">
        <ReceiptText className="h-5 w-5" />
      </div>
      <div className="flex grow flex-col gap-1">
        <div className="flex items-center gap-1 text-sm">
          Tx#
          <Link
            className="text-primary max-w-60 truncate hover:brightness-150 md:max-w-96 xl:max-w-60"
            href={`/tx/${hash}`}
          >
            {hash}
          </Link>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <div className="flex max-w-44 items-center gap-1 md:max-w-60 xl:max-w-44">
            From
            <AddressLink address={from} formatted />
          </div>
          <div className="flex max-w-44 items-center gap-1 md:max-w-60 xl:max-w-44">
            To
            <AddressLink address={actualTo ?? zeroAddress} formatted />
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <span className="text-muted-foreground pr-2" suppressHydrationWarning>
            {formatTimestamp(timestamp).distance}
          </span>
          <Badge variant="outline">{formatEther(value)} ETH</Badge>
        </div>
      </div>
    </div>
  );
};

const LatestTransactions = ({
  transactions,
}: {
  transactions: TransactionWithAccounts[];
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
      <Link href="/txs" className="text-primary pt-6 hover:brightness-150">
        View all transactions →
      </Link>
    </CardFooter>
  </Card>
);

export default LatestTransactions;
