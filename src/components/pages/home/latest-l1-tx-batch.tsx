// import Link from "next/link";
import { Gauge } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";

const LatestL1TxBatch = () => (
  <Card className="relative pl-8">
    <Gauge className="absolute top-6 left-4 size-6" />
    <CardHeader className="pb-2">
      <CardTitle className="flex flex-row items-center justify-between">
        <div className="text-sm font-medium">Latest L1 TXN batch</div>
        <div className="text-sm font-medium">Latest L1 state batch</div>
      </CardTitle>
    </CardHeader>
    <CardContent className="flex flex-row items-center justify-between">
      <div className="text-sm">
        <a
          //href="/batches"
          href="#"
          className="text-primary hover:brightness-150"
        >
          {formatNumber(1078412, { notation: "compact" })}
        </a>
      </div>
      <div className="text-sm">
        <a
          //href="/state-batches"
          href="#"
          className="text-primary hover:brightness-150"
        >
          8878
        </a>
      </div>
    </CardContent>
  </Card>
);

export default LatestL1TxBatch;
