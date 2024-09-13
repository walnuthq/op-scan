"use client";
import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";
import { AccountWithTransactionAndToken } from "@/lib/types";

const AddressTabs = ({
  account,
  children,
}: {
  account: AccountWithTransactionAndToken;
  children: ReactNode;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <Tabs defaultValue={pathname} onValueChange={(value) => router.push(value)}>
      <TabsList>
        <TabsTrigger value={`/address/${account.address}`}>
          Transactions
        </TabsTrigger>
        <TabsTrigger value={`/address/${account.address}/token-transfers`}>
          Token Transfers (ERC-20)
        </TabsTrigger>
        <TabsTrigger value={`/address/${account.address}/nft-transfers`}>
          NFT Transfers
        </TabsTrigger>
        {account.bytecode && (
          <TabsTrigger value={`/address/${account.address}/events`}>
            Events
          </TabsTrigger>
        )}
        {account.bytecode && (
          <TabsTrigger value={`/address/${account.address}/contract`}>
            Contract
          </TabsTrigger>
        )}
      </TabsList>
      <TabsContent value={pathname} className="pt-2">
        {children}
      </TabsContent>
    </Tabs>
  );
};

export default AddressTabs;
