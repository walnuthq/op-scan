import { Address } from "viem";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const AddressTokenTransfers = ({ address }: { address: Address }) => {
  return (
    <Card>
      <CardHeader>Latest 25 ERC-20 Token Transfers Events</CardHeader>
      <CardContent>TOKEN TRANSFERS</CardContent>
    </Card>
  );
};

export default AddressTokenTransfers;
