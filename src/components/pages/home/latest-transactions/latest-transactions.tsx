"use client";

import { useState } from "react";
import Link from "next/link";
import { Transaction } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import LatestTransaction from "./latest-transaction";

interface LatestTransactionsProps {
  transactions: Transaction[];
}

const LatestTransactions = ({ transactions }: LatestTransactionsProps) => {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Latest Transactions</CardTitle>
      </CardHeader>
      <CardContent className="grid max-h-[557px] gap-6 divide-y overflow-y-scroll">
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
};

export default LatestTransactions;
