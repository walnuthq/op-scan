import Link from "next/link";
import { notFound } from "next/navigation";
import { l2PublicClient } from "@/lib/chains";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import BlockTransactionsTable from "@/components/pages/block-txs/block-transactions-table";
import { getSignatureBySelector } from "@/lib/4byte-directory";

const BlockTxs = async ({ number }: { number: bigint }) => {
  const block = await l2PublicClient.getBlock({
    blockNumber: number,
    includeTransactions: true,
  });
  if (!block) {
    notFound();
  }
  const [transactionReceipts, signatures] = await Promise.all([
    Promise.all(
      block.transactions.map(({ hash }) =>
        l2PublicClient.getTransactionReceipt({ hash }),
      ),
    ),
    Promise.all(
      block.transactions.map(({ input }) =>
        getSignatureBySelector(input.slice(0, 10)),
      ),
    ),
  ]);
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
          <BlockTransactionsTable
            transactions={block.transactions
              .map((transaction, i) => ({
                blockNumber: transaction.blockNumber,
                hash: transaction.hash,
                from: transaction.from,
                to: transaction.to,
                value: transaction.value,
                gas: transaction.gas,
                gasPrice: transaction.gasPrice ?? null,
                maxFeePerGas: transaction.maxFeePerGas ?? null,
                maxPriorityFeePerGas: transaction.maxPriorityFeePerGas ?? null,
                transactionIndex: transaction.transactionIndex,
                type: transaction.type,
                nonce: transaction.nonce,
                input: transaction.input,
                signature: signatures[i],
                timestamp: block.timestamp,
                transactionReceipt: {
                  transactionHash: transactionReceipts[i].transactionHash,
                  status: transactionReceipts[i].status,
                  from: transactionReceipts[i].from,
                  to: transactionReceipts[i].to,
                  effectiveGasPrice: transactionReceipts[i].effectiveGasPrice,
                  gasUsed: transactionReceipts[i].gasUsed,
                  l1Fee: transactionReceipts[i].l1Fee,
                  l1GasPrice: transactionReceipts[i].l1GasPrice,
                  l1GasUsed: transactionReceipts[i].l1GasUsed,
                  l1FeeScalar: transactionReceipts[i].l1FeeScalar,
                },
              }))
              .sort((a, b) => b.transactionIndex - a.transactionIndex)}
          />
        </CardContent>
      </Card>
    </main>
  );
};

export default BlockTxs;
