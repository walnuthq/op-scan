import Image from "next/image";
import { cn, formatPrice, formatPercent } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ethereumImg from "@/img/ethereum.png";

const EthPrice = ({
  today,
  yesterday,
}: {
  today: number;
  yesterday: number;
}) => (
  <Card className="relative pl-8">
    <Image
      src={ethereumImg}
      alt="ETH logo"
      className="absolute left-4 top-6 size-6"
    />
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium">ETH Price</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center gap-1 text-sm font-bold">
        {formatPrice(today)}
        <span
          className={cn("text-xs text-muted-foreground", {
            "text-red-500": today - yesterday < 0,
            "text-green-500": today - yesterday > 0,
          })}
        >
          ({formatPercent((today - yesterday) / yesterday, "always")})
        </span>
      </div>
    </CardContent>
  </Card>
);

export default EthPrice;
