"use client";
import { ReactNode } from "react";
import { CircleCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import { AccountWithTransactionAndToken } from "@/lib/types";
import RouterTabs from "@/components/lib/router-tabs";

const AddressTabs = ({
  account,
  children,
}: {
  account: AccountWithTransactionAndToken;
  children: ReactNode;
}) => {
  const pathname = usePathname();
  const tabs: Record<string, ReactNode> = {
    [`/address/${account.address}`]: "Transactions",
    [`/address/${account.address}/token-transfers`]: "Token Transfers (ERC-20)",
    [`/address/${account.address}/nft-transfers`]: "NFT Transfers",
  };
  if (account.bytecode) {
    tabs[`/address/${account.address}/events`] = "Events";
    tabs[`/address/${account.address}/contract`] = (
      <div className="flex items-center gap-1">
        Contract
        {account.contract && <CircleCheck className="size-4 text-green-400" />}
      </div>
    );
  }
  return (
    <RouterTabs
      tabs={tabs}
      currentTab={
        pathname.startsWith(`/address/${account.address}/contract`)
          ? `/address/${account.address}/contract`
          : pathname
      }
    >
      {children}
    </RouterTabs>
  );
};

export default AddressTabs;
