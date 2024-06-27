import DescriptionListItem from "@/components/lib/description-list-item";
import EthereumIcon from "@/components/lib/ethereum-icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddressDetails } from "@/lib/types";
import { formatEther } from "viem";

const AddressDetailsSection = ({
  address,
  ethPriceToday,
}: {
  address: AddressDetails;
  ethPriceToday: number;
}) => (
  <Card>
    <CardHeader className="p-4">
      <CardTitle>Overview</CardTitle>
    </CardHeader>

    <CardContent>
      <dl>
        <DescriptionListItem secondary title="ETH BALANCE">
          <EthereumIcon className="mr-1 size-4" />
          {formatEther(address.balance)} ETH
        </DescriptionListItem>
        <DescriptionListItem secondary title="ETH VALUE">
          {(
            Number(formatEther(address.balance)) * ethPriceToday
          ).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}{" "}
          (@{" "}
          {ethPriceToday.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
          /ETH)
        </DescriptionListItem>
      </dl>
    </CardContent>
  </Card>
);

export default AddressDetailsSection;
