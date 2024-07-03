import Link from "next/link";
import { Gauge } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LatestL1TxBatch = () => (
  <Card className="relative pl-8">
    <Gauge className="absolute left-4 top-6 size-6" />
    <CardHeader className="pb-2">
      <CardTitle className="flex flex-row items-center justify-between">
        <div className="text-sm font-medium">Latest L1 TXN batch</div>
        <div className="text-sm font-medium">Latest L1 state batch</div>
      </CardTitle>
    </CardHeader>
    <CardContent className="flex flex-row items-center justify-between">
      <div className="text-sm">
        <Link href="/batches" className="text-primary hover:brightness-150">
          1.08 M
        </Link>
      </div>
      <div className="text-sm">
        <Link
          href="/state-batches"
          className="text-primary hover:brightness-150"
        >
          8878
        </Link>
      </div>
    </CardContent>
  </Card>
);

export default LatestL1TxBatch;
