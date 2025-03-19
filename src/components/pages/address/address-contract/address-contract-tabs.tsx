"use client";
import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { type Address } from "viem";
import RouterTabs from "@/components/lib/router-tabs";

const AddressContractTabs = ({
  address,
  children,
}: {
  address: Address;
  children: ReactNode;
}) => (
  <RouterTabs
    tabs={{
      [`/address/${address}/contract`]: "Code",
      [`/address/${address}/contract/read`]: "Read Contract",
      [`/address/${address}/contract/write`]: "Write Contract",
    }}
    currentTab={usePathname()}
  >
    {children}
  </RouterTabs>
);

export default AddressContractTabs;
