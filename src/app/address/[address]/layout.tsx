import { ReactNode } from "react";
import { Address } from "viem";
import { l2PublicClient } from "@/lib/chains";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import AddressDetails from "@/components/pages/address/address-details";
import { fetchSpotPrices } from "@/lib/fetch-data";
import CopyButton from "@/components/lib/copy-button";
import AddressTabs from "@/components/pages/address/address-tabs";
import { fetchTokenHoldings } from "@/components/pages/address/fetch-token-holdings";

const AddressLayout = async ({
  params,
  children,
}: {
  params: { address: string };
  children: ReactNode;
}) => {
  const address = params.address as Address;
  const [balance, bytecode, tokenHoldings, prices] = await Promise.all([
    l2PublicClient.getBalance({ address }),
    l2PublicClient.getCode({ address }),
    fetchTokenHoldings(address),
    fetchSpotPrices(),
  ]);
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-4 md:p-4">
      <div className="flex items-center gap-2">
        <Avatar className="size-8">
          <AvatarImage
            src={`https://effigy.im/a/${address}.png`}
            alt="Ethereum avatar"
          />
          <AvatarFallback>0x</AvatarFallback>
        </Avatar>
        <h2 className="inline-flex items-baseline gap-2 text-2xl font-bold tracking-tight">
          {bytecode ? "Contract" : "Address"}
          <span className="text-base font-normal">{address}</span>
        </h2>
        <CopyButton content="Copy Address" copy={address} />
      </div>
      <Separator />
      <AddressDetails
        tokenHoldings={tokenHoldings}
        balance={balance}
        ethPriceToday={prices.ETH}
      />
      <AddressTabs address={address}>{children}</AddressTabs>
    </main>
  );
};

export default AddressLayout;
