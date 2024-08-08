import React from "react";
import Link from "next/link";
import { TransactionEnqueued } from "@/lib/types";
import { ReceiptText } from "lucide-react";
import { l1Chain } from "@/lib/chains";
import { SquareArrowOutUpRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

const LatestTransactionEnqueued = ({
  transaction,
}: {
  transaction: TransactionEnqueued;
}) => (
  <div className="flex items-center gap-4 pt-6">
    <div className="hidden h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground 2xl:flex">
      <ReceiptText className="h-5 w-5" />
    </div>
    <div className="grid gap-1">
      <div className="flex items-center gap-1 text-sm">
        Block#
        <a
          className="flex max-w-60 items-center gap-1 truncate text-primary hover:brightness-150 md:max-w-96 xl:max-w-60"
          href={`${l1Chain.blockExplorers.default.url}/block/${transaction.l1BlockNumber}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {transaction.l1BlockNumber.toString()}
          <SquareArrowOutUpRight className="size-4" />
        </a>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <div className="flex items-center gap-1">
          L1 Tx#
          <a
            className="flex items-center gap-1 text-primary hover:brightness-150"
            href={`${l1Chain.blockExplorers.default.url}/tx/${transaction.l1TxHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="max-w-28 truncate md:max-w-36 xl:max-w-28">
              {transaction.l1TxHash}
            </span>
            <SquareArrowOutUpRight className="size-4" />
          </a>
        </div>
        <div className="flex items-center gap-1">
          L2 Tx#
          <Link
            className="max-w-28 truncate text-primary hover:brightness-150 md:max-w-36 xl:max-w-28"
            href={`/tx/${transaction.l2TxHash}`}
          >
            {transaction.l2TxHash}
          </Link>
        </div>
      </div>
    </div>
  </div>
);

const LatestTransactionsEnqueued = ({
  transactions,
}: {
  transactions: TransactionEnqueued[];
}) => (
  <Card>
    <CardHeader className="border-b">
      <CardTitle>Latest L1 → L2 Transactions</CardTitle>
    </CardHeader>
    <CardContent className="grid max-h-[557px] gap-6 divide-y overflow-x-hidden overflow-y-scroll">
      {transactions.map((transaction) => (
        <LatestTransactionEnqueued
          key={transaction.l1TxHash}
          transaction={transaction}
        />
      ))}
    </CardContent>
    <CardFooter className="flex justify-center border-t">
      <Link
        href="/txs-enqueued"
        className="pt-6 text-primary hover:brightness-150"
      >
        View all L1 → L2 transactions →
      </Link>
    </CardFooter>
  </Card>
);

export default LatestTransactionsEnqueued;
