import Link from "next/link";
import { notFound } from "next/navigation";
import { l2PublicClient } from "@/lib/chains";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import BlockTxsTable from "@/components/pages/block-txs/block-txs-table";
import { loadFunctions } from "@/lib/signatures";
import { fromViemTransactionWithReceipt } from "@/lib/types";

const BlockTxs = async ({ number }: { number: bigint }) => {
  const block = await l2PublicClient.getBlock({
    blockNumber: number,
    includeTransactions: true,
  });
  if (!block) {
    notFound();
  }
  const [receipts, signatures] = await Promise.all([
    Promise.all(
      block.transactions.map(({ hash }) =>
        l2PublicClient.getTransactionReceipt({ hash }),
      ),
    ),
    Promise.all(
      block.transactions.map(({ input }) => loadFunctions(input.slice(0, 10))),
    ),
  ]);
  const transactions = block.transactions.map((transaction, i) =>
    fromViemTransactionWithReceipt(
      transaction,
      receipts[i],
      block.timestamp,
      signatures[i],
    ),
  );
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
          A total of {block.transactions.length} transaction
          {block.transactions.length === 1 ? "" : "s"} found
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
