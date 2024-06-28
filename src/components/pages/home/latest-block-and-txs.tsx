import Link from "next/link";
import { Server } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LatestBlockAndTxs = ({
  blockNumber = BigInt(0),
  l2BlockTime,
}: {
  blockNumber?: bigint;
  l2BlockTime: bigint;
}) => (
  <Card className="relative pl-8">
    <Server className="absolute left-4 top-6 size-6" />
    <CardHeader className="space-y-0 pb-2">
      <CardTitle className="flex flex-row items-center justify-between">
        <div className="text-sm font-medium">Latest block</div>
        <div className="text-sm font-medium">Transactions</div>
      </CardTitle>
    </CardHeader>
    <CardContent className="flex flex-row items-center justify-between">
      <div className="text-sm">
        <Link
          href={`/block/${blockNumber}`}
          className="text-primary hover:brightness-150"
        >
          {blockNumber.toString()}
        </Link>{" "}
        <span className="text-xs text-muted-foreground">
          ({l2BlockTime.toString()}.0s)
        </span>
      </div>
      <div className="text-sm">
        <Link href="/txs" className="text-primary hover:brightness-150">
          300.00 M
        </Link>{" "}
        <span className="text-xs text-muted-foreground">(6.8 TPS)</span>
      </div>
    </CardContent>
  </Card>
);

export default LatestBlockAndTxs;
