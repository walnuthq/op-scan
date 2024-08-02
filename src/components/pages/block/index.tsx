import { notFound } from "next/navigation";
import { l2PublicClient } from "@/lib/chains";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import BlockDetails from "@/components/pages/block/block-details";
import { fromViemBlock } from "@/lib/types";

const Block = async ({ number }: { number: bigint }) => {
  const block = await l2PublicClient.getBlock({ blockNumber: number });
  if (!block) {
    notFound();
  }
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-4 md:p-4">
      <h2 className="flex items-center text-2xl font-bold tracking-tight">
        Block
        <span className="ml-2 text-base font-normal text-muted-foreground">
          #{number.toString()}
        </span>
      </h2>
      <Separator />
      <Card>
        <CardContent className="p-4">
          <BlockDetails block={fromViemBlock(block)} />
        </CardContent>
      </Card>
    </main>
  );
};

export default Block;
