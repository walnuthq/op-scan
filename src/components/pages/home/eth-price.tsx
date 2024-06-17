import Image from "next/image";
import { cn, formatPrice, formatPercent } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ethereumImg from "@/img/ethereum.png";

const EthPrice = ({ eth }: { eth: { today: number; yesterday: number } }) => (
  <Card className="relative pl-8">
    <Image
      src={ethereumImg}
      alt="ETH logo"
      className="absolute left-4 top-6 size-6"
    />
    <CardHeader className="space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">ETH Price</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-sm font-bold">
        {formatPrice(eth.today)}{" "}
        <span
          className={cn("text-xs text-muted-foreground", {
            "text-red-500": eth.today - eth.yesterday < 0,
            "text-green-500": eth.today - eth.yesterday > 0,
          })}
        >
          ({formatPercent((eth.today - eth.yesterday) / eth.yesterday)})
        </span>
      </div>
    </CardContent>
  </Card>
);

export default EthPrice;
