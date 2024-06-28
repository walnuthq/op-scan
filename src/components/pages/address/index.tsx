import { Address } from "viem";
import { l2PublicClient } from "@/lib/chains";
import AddressDetails from "./address-details";
import { fetchTokensPrices } from "@/lib/utils";
import { CopyButton } from "@/components/common/copy-button";

const AddressComponent = async ({ address }: { address: Address }) => {
  const ethPrice = await fetchTokensPrices();
  const byteCode = await l2PublicClient.getCode({ address });
  const balance = await l2PublicClient.getBalance({ address });

  const addressType = byteCode ? "Contract" : "Address";

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-4 md:p-4">
      <h2 className="mt-10 flex scroll-m-20 items-end border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        {addressType}
        <span className="ml-2 flex items-center text-base">
          {address}
          <CopyButton toCopy={address} />
        </span>
      </h2>
      <AddressDetails
        address={{ addressType, balance }}
        ethPriceToday={ethPrice.eth.today}
      />
    </main>
  );
};

export default AddressComponent;
