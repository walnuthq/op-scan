import { Address } from "viem";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { getLatestTransferEvents } from "@/lib/fetch-data";

const AddressTokenTransfers = async ({ address }: { address: Address }) => {
  // try {
  //   const transferEvents = await getLatestTransferEvents(address);
  //   console.log("Transfer:", transferEvents);
  // } catch (error) {
  //   console.error("Error Transfer:", error);
  // }
  return (
    <Card>
      <CardHeader>Latest 25 ERC-20 Token Transfers Events</CardHeader>
      <CardContent>TOKEN TRANSFERS</CardContent>
      <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Transaction Hash</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Block</TableHead>
          <TableHead>Age</TableHead>
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Token</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        
      </TableBody>
    </Table>
    </Card>
  );
};

export default AddressTokenTransfers;
