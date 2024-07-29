"use client";
import { ReactNode } from "react";
import { Address } from "viem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";

const AddressTabs = ({
  address,
  children,
}: {
  address: Address;
  children: ReactNode;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <Tabs defaultValue={pathname} onValueChange={(value) => router.push(value)}>
      <TabsList>
        <TabsTrigger value={`/address/${address}`}>Transactions</TabsTrigger>
        <TabsTrigger value={`/address/${address}/token-transfers`}>
          Token Transfers (ERC-20)
        </TabsTrigger>
        <TabsTrigger value={`/address/${address}/nft-transfers`}>
          NFT Transfers
        </TabsTrigger>
        <TabsTrigger value={`/address/${address}/events`}>Events</TabsTrigger>
      </TabsList>
      <TabsContent value={pathname}>{children}</TabsContent>
    </Tabs>
  );
};

export default AddressTabs;
