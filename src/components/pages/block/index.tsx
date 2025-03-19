import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import BlockDetails from "@/components/pages/block/block-details";
import fetchBlockDetails from "@/components/pages/block/fetch-block-details";
import { fetchL2BlockNumberFromJsonRpc } from "@/lib/fetch-data";

const Block = async ({ number }: { number: bigint }) => {
  const [block, latestBlockNumber] = await Promise.all([
    fetchBlockDetails(number),
    fetchL2BlockNumberFromJsonRpc(),
  ]);
  if (block === null) {
    notFound();
  }
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-4 md:p-4">
      <h2 className="inline-flex items-center text-2xl font-bold tracking-tight">
        Block
        <span className="text-muted-foreground ml-2 text-base font-normal">
          #{number.toString()}
        </span>
      </h2>
      <Separator />
      <Card>
        <CardContent className="p-4">
          <BlockDetails block={block} latestBlockNumber={latestBlockNumber} />
        </CardContent>
      </Card>
    </main>
  );
};

export default Block;
