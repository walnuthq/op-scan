import Link from "next/link";
import { Box } from "lucide-react";
import { Block } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { formatTimestamp } from "@/lib/utils";
import { l2BlockTime } from "@/lib/constants";

const LatestBlock = ({ block }: { block: Block }) => (
  <div className="flex items-center gap-4 pb-6 last:pb-0">
    <div className="bg-accent text-accent-foreground flex h-9 w-9 items-center justify-center rounded-lg">
      <Box className="h-5 w-5" />
    </div>
    <div className="grid grow gap-1">
      <div className="flex items-center justify-between gap-1 py-0.5 text-sm">
        <div>
          <Link
            href={`/block/${block.number}`}
            className="text-primary text-sm leading-none font-medium hover:brightness-150"
          >
            {block.number.toString()}
          </Link>
          <p className="text-muted-foreground text-sm">
            {formatTimestamp(block.timestamp).distance}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1 text-sm font-medium">
          <Link
            href={`/block/${block.number}/txs`}
            className="text-primary hover:brightness-150"
          >
            {block.transactionsCount} txn
            {block.transactionsCount === 1 ? "" : "s"}
          </Link>
          <span className="text-muted-foreground">in {l2BlockTime} secs</span>
        </div>
      </div>
    </div>
  </div>
);

const LatestBlocks = ({ blocks }: { blocks: Block[] }) => (
  <Card>
    <CardHeader className="border-b">
      <CardTitle>Latest Blocks</CardTitle>
    </CardHeader>
    <CardContent className="grid gap-6 divide-y">
      {blocks.map((block) => (
        <LatestBlock key={block.hash} block={block} />
      ))}
    </CardContent>
    <CardFooter className="flex justify-center border-t">
      <Link href="/blocks" className="text-primary pt-6 hover:brightness-150">
        View all blocks →
      </Link>
    </CardFooter>
  </Card>
);

export default LatestBlocks;
