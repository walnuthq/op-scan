"use client";
import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Address } from "viem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AddressContractTabs = ({
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
        <TabsTrigger value={`/address/${address}/contract`}>Code</TabsTrigger>
        <TabsTrigger value={`/address/${address}/contract/read`}>
          Read Contract
        </TabsTrigger>
        <TabsTrigger value={`/address/${address}/contract/write`}>
          Write Contract
        </TabsTrigger>
      </TabsList>
      <TabsContent value={pathname} className="pt-4">
        {children}
      </TabsContent>
    </Tabs>
  );
};

export default AddressContractTabs;
