"use client";
import { ReactNode } from "react";
import { CircleCheck } from "lucide-react";
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
  const value = pathname.startsWith(`/address/${account.address}/contract`)
    ? `/address/${account.address}/contract`
    : pathname;
  return (
    <Tabs defaultValue={value} onValueChange={(value) => router.push(value)}>
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
          <TabsTrigger
            value={`/address/${account.address}/contract`}
            className="flex gap-1"
          >
            Contract
            {account.contract && (
              <CircleCheck className="size-4 text-green-400" />
            )}
          </TabsTrigger>
        )}
      </TabsList>
      <TabsContent value={value} className="pt-2">
        {children}
      </TabsContent>
    </Tabs>
  );
};

export default AddressTabs;
