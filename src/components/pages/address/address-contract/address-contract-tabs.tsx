"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddressContractCode from "@/components/pages/address/address-contract/address-contract-code";
import { Contract } from "@/components/pages/address/address-contract/fetch-contract";
import { AccountWithTransactionAndToken } from "@/lib/types";

const AddressContractTabs = ({
  account,
  contract,
}: {
  account: AccountWithTransactionAndToken;
  contract: Contract;
}) => {
  const tabs = {
    code: "Code",
    "read-contract": "Read Contract",
    "write-contract": "Write Contract",
  };
  const [tab, setTab] = useState<keyof typeof tabs>("code");
  return (
    <Tabs
      defaultValue={tab}
      onValueChange={(value) => setTab(value as keyof typeof tabs)}
    >
      <TabsList>
        {Object.keys(tabs).map((key) => (
          <TabsTrigger key={key} value={key}>
            {tabs[key as keyof typeof tabs]}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="code" className="pt-4">
        <AddressContractCode account={account} contract={contract} />
      </TabsContent>
      <TabsContent value="read-contract" className="pt-4">
        READ CONTRACT (TODO)
      </TabsContent>
      <TabsContent value="write-contract" className="pt-4">
        WRITE CONTRACT (TODO)
      </TabsContent>
    </Tabs>
  );
};

export default AddressContractTabs;
