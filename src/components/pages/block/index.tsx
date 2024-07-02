import { notFound } from "next/navigation";
import { l2PublicClient } from "@/lib/chains";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import BlockDetails from "@/components/pages/block/block-details";

const Block = async ({ number }: { number: bigint }) => {
  const block = await l2PublicClient.getBlock({
    blockNumber: number,
    includeTransactions: true,
  });
  if (!block) {
    notFound();
  }
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-4 md:p-4">
      <div className="space-y-0.5">
        <h2 className="flex items-center text-2xl font-bold tracking-tight">
          Block
          <span className="ml-2 text-base text-muted-foreground">
            #{number.toString()}
          </span>
        </h2>
      </div>
      <Separator />
      <Card>
        <CardContent className="p-4">
          <BlockDetails
            block={{
              number: block.number,
              hash: block.hash,
              timestamp: block.timestamp,
              gasUsed: block.gasUsed,
              gasLimit: block.gasLimit,
              extraData: block.extraData,
              parentHash: block.parentHash,
              transactions: block.transactions.map((transaction) => ({
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
                nonce: transaction.nonce,
                input: transaction.input,
                signature: "",
                timestamp: block.timestamp,
              })),
            }}
          />
        </CardContent>
      </Card>
    </main>
  );
};

export default Block;
