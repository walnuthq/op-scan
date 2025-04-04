import { type Address } from "viem";
import AddressContractCode from "@/components/pages/address/address-contract/address-contract-code";
import fetchAccount from "@/lib/fetch-account";

const AddressContract = async ({ address }: { address: Address }) => {
  const account = await fetchAccount(address);
  return <AddressContractCode account={account} />;
};

export default AddressContract;
