import Link from "next/link";
import { Server } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import { l2BlockTime } from "@/lib/constants";

const LatestBlockAndTxs = ({
  blockNumber,
  transactionsCount,
  tps,
}: {
  blockNumber: bigint;
  transactionsCount: number;
  tps: number;
}) => (
  <Card className="relative pl-8">
    <Server className="absolute left-4 top-6 size-6" />
    <CardHeader className="pb-2">
      <CardTitle className="flex flex-row items-center justify-between">
        <div className="text-sm font-medium">Latest block</div>
        <div className="text-sm font-medium">Transactions</div>
      </CardTitle>
    </CardHeader>
    <CardContent className="flex flex-row items-center justify-between">
      <div className="flex items-center gap-1 text-sm">
        <Link
          href={`/block/${blockNumber}`}
          className="text-primary hover:brightness-150"
        >
          {blockNumber.toString()}
        </Link>
        <span className="text-xs text-muted-foreground">
          ({l2BlockTime}.0s)
        </span>
      </div>
      <div className="flex items-center gap-1 text-sm">
        <Link href="/txs" className="text-primary hover:brightness-150">
          {formatNumber(transactionsCount, { notation: "compact" })}
        </Link>
        <span className="text-xs text-muted-foreground">
          ({tps.toFixed(1)} TPS)
        </span>
      </div>
    </CardContent>
  </Card>
);

export default LatestBlockAndTxs;
