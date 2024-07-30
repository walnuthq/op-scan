import { Address } from "viem";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const AddressTransactions = ({ address }: { address: Address }) => {
  return (
    <Card>
      <CardHeader>Latest 25 from a total of N transactions</CardHeader>
      <CardContent>TRANSACTIONS</CardContent>
    </Card>
  );
};

export default AddressTransactions;
