import { Address } from "viem";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const AddressNftTransfers = ({ address }: { address: Address }) => {
  return (
    <Card>
      <CardHeader>Latest 25 NFT Transfers Token Transfers Events</CardHeader>
      <CardContent>NFT TRANSFERS</CardContent>
    </Card>
  );
};

export default AddressNftTransfers;
