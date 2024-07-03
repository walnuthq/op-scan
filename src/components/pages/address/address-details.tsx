import EthereumIcon from "@/components/lib/ethereum-icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatEther, formatPrice } from "@/lib/utils";

const AddressDetailsSection = ({
  balance,
  ethPriceToday,
}: {
  balance: bigint;
  ethPriceToday: number;
}) => (
  <div className="grid gap-4 lg:grid-cols-3">
    <Card>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-0.5">
          <span className="text-xs font-semibold text-muted-foreground">
            ETH BALANCE
          </span>
          <div className="flex items-center text-sm font-semibold">
            <EthereumIcon className="mr-1 size-4" />
            {formatEther(balance, 18)} ETH
          </div>
        </div>
        <div className="space-y-0.5">
          <span className="text-xs font-semibold text-muted-foreground">
            ETH VALUE
          </span>
          <div className="flex items-center text-sm font-semibold">
            {formatPrice(Number(formatEther(balance)) * ethPriceToday)} (@{" "}
            {formatPrice(ethPriceToday)}/ETH)
          </div>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>More Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4"></CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Multichain Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4"></CardContent>
    </Card>
  </div>
);

export default AddressDetailsSection;
