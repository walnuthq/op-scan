import { type Address } from "viem";
import fetchAccount from "@/lib/fetch-account";
import AddressContractWriteContract from "@/components/pages/address/address-contract/address-contract-write/address-contract-write-contract";

const AddressContractWrite = async ({ address }: { address: Address }) => {
  const account = await fetchAccount(address);
  if (!account.contract) {
    return null;
  }
  return (
    <AddressContractWriteContract
      address={address}
      contract={account.contract}
    />
  );
};

export default AddressContractWrite;
