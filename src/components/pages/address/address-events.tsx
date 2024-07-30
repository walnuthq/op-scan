import { Address } from "viem";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const AddressEvents = ({ address }: { address: Address }) => {
  return (
    <Card>
      <CardHeader>Latest 25 Contract Events</CardHeader>
      <CardContent>CONTRACT EVENTS</CardContent>
    </Card>
  );
};

export default AddressEvents;
