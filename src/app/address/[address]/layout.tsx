import { type ReactNode } from "react";
import { getAddress } from "viem";
import { l2PublicClient } from "@/lib/chains";
import { Separator } from "@/components/ui/separator";
import AddressDetails from "@/components/pages/address/address-details";
import { fetchSpotPrices } from "@/lib/fetch-data";
import CopyButton from "@/components/lib/copy-button";
import AddressTabs from "@/components/pages/address/address-tabs";
import fetchAccount from "@/lib/fetch-account";
import { fetchTokenHoldings } from "@/components/pages/address/address-details/fetch-token-holdings";
import AddressAvatar from "@/components/lib/address-avatar";

const AddressLayout = async ({
  params,
  children,
}: {
  params: Promise<{ address: string }>;
  children: ReactNode;
}) => {
  const { address: rawAddress } = await params;
  const address = getAddress(rawAddress);
  const [account, balance, tokenHoldings, prices] = await Promise.all([
    fetchAccount(address),
    l2PublicClient.getBalance({ address }),
    fetchTokenHoldings(address),
    fetchSpotPrices(),
  ]);
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-4 md:p-4">
      <div className="flex items-center gap-2">
        <AddressAvatar address={address} className="size-8" />
        <h2 className="inline-flex items-baseline gap-2 text-2xl font-bold tracking-tight">
          {account.bytecode ? "Contract" : "Address"}
          <span className="text-base font-normal">{address}</span>
        </h2>
        <CopyButton content="Copy Address" copy={address} />
      </div>
      <Separator />
      <AddressDetails
        balance={balance}
        ethPrice={prices.ETH}
        tokenHoldings={tokenHoldings}
        account={account}
      />
      <AddressTabs account={account}>{children}</AddressTabs>
    </main>
  );
};

export default AddressLayout;
