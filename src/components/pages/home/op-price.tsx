import Image from "next/image";
import { cn, formatPrice, formatPercent } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import optimismImg from "@/img/optimism.png";

const EthPrice = ({ op }: { op: { today: number; yesterday: number } }) => (
  <Card className="relative pl-8">
    <Image
      src={optimismImg}
      alt="ETH logo"
      className="absolute left-4 top-6 size-6"
    />
    <CardHeader className="space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">OP Price</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-sm font-bold">
        {formatPrice(op.today)}{" "}
        <span
          className={cn("text-xs text-muted-foreground", {
            "text-red-500": op.today - op.yesterday < 0,
            "text-green-500": op.today - op.yesterday > 0,
          })}
        >
          ({formatPercent((op.today - op.yesterday) / op.yesterday, "always")})
        </span>
      </div>
    </CardContent>
  </Card>
);

export default EthPrice;
