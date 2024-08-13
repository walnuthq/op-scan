"use client";
import { Address } from "viem";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TxMethodBadge from "@/components/lib/tx-method-badge";

interface TokenInfo {
  address: string;
  decimals: number;
}

interface ERC20Transfer {
  transactionHash: string;
  method: string;
  block: number;
  age: string;
  from: string;
  to: string;
  amount: string;
  token: TokenInfo;
  type: "ERC20";
}

interface TransferEventsResponse {
  transfers: ERC20Transfer[];
  page: number;
  limit: number;
}

const AddressTokenTransfers = ({
  address,
  erc20Transfers,
}: {
  address: Address;
  erc20Transfers: TransferEventsResponse | undefined;
}) => {
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
            <TableHead>Token</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TooltipProvider>
            {erc20Transfers &&
              erc20Transfers?.transfers?.map((item, i) => {
                return (
                  <TableRow key={i}>
                    <TableCell>
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger>
                          {item.transactionHash.slice(0, 12)}...
                        </TooltipTrigger>
                        <TooltipContent>{item.transactionHash}</TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <TxMethodBadge selector={item.method} signature={""} />
                    </TableCell>
                    <TableCell>{item.block}</TableCell>
                    <TableCell>{item.age}</TableCell>
                    <TableCell>
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger>
                          {item.from.slice(0, 11)}...{item.from.slice(-9)}
                        </TooltipTrigger>
                        <TooltipContent>{item.from}</TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger>
                          {item.to.slice(0, 11)}...{item.to.slice(-9)}
                        </TooltipTrigger>
                        <TooltipContent>{item.to}</TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{item.amount}</TableCell>
                    <TableCell>
                      {item.token.address.slice(0, 11)}...
                      {item.token.address.slice(-9)}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TooltipProvider>
        </TableBody>
      </Table>
    </Card>
  );
};

export default AddressTokenTransfers;
