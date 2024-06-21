"use client";

import React from "react";
import Link from "next/link";
import LatestL1L2Transaction from "./latest-l1-l2-transaction";
import { L1L2Transaction } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

const LatestL1L2Transactions = ({
  transactions,
}: {
  transactions: L1L2Transaction[];
}) => {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Latest L1→L2 Transactions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 divide-y">
        {transactions.map((transaction) => (
          <LatestL1L2Transaction
            key={transaction.l1Hash}
            transaction={transaction}
          />
        ))}
      </CardContent>
      <CardFooter className="flex justify-center border-t">
        <Link
          href="/l1-l2-txs"
          className="pt-6 text-primary hover:brightness-150"
        >
          View all L1→L2 transactions →
        </Link>
      </CardFooter>
    </Card>
  );
};

export default LatestL1L2Transactions;
