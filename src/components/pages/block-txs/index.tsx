import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import BlockTxsTable from "@/components/pages/block-txs/block-txs-table";
import fetchBlockTransactions from "@/components/pages/block-txs/fetch-block-transactions";

const BlockTxs = async ({ number }: { number: bigint }) => {
  const { transactions } = await fetchBlockTransactions(number);

  if (!transactions) {
    return notFound();
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-4 md:p-4">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Transactions</h2>
        <p className="text-muted-foreground">
          For Block{" "}
          <Link
            className="text-primary hover:brightness-150"
            href={`/block/${number}`}
          >
            {number.toString()}
          </Link>
        </p>
      </div>
      <Separator />
      <Card>
        <CardHeader>
          A total of {transactions.length} transaction
          {transactions.length === 1 ? "" : "s"} found
        </CardHeader>
        <CardContent className="px-0">
          <BlockTxsTable
            transactions={transactions.sort(
              (a, b) => b.transactionIndex - a.transactionIndex,
            )}
          />
        </CardContent>
      </Card>
    </main>
  );
};

export default BlockTxs;
