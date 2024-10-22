import { Address } from "viem";
import fetchAccount from "@/lib/fetch-account";
import AddressContractReadContract from "@/components/pages/address/address-contract/address-contract-read/address-contract-read-contract";

const AddressContractRead = async ({ address }: { address: Address }) => {
  const account = await fetchAccount(address);
  if (!account.contract) {
    return null;
  }
  return (
    <AddressContractReadContract
      address={address}
      contract={account.contract}
    />
  );
};

export default AddressContractRead;
