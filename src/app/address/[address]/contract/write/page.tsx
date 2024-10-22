import { notFound, permanentRedirect } from "next/navigation";
import { isAddress, getAddress } from "viem";
import fetchAccount from "@/lib/fetch-account";
import AddressContractWrite from "@/components/pages/address/address-contract/address-contract-write";

const AddressContractWritePage = async ({
  params: { address: rawAddress },
}: {
  params: { address: string };
}) => {
  if (!isAddress(rawAddress)) {
    notFound();
  }
  const address = getAddress(rawAddress);
  if (rawAddress !== address) {
    permanentRedirect(`/address/${address}/contract/write`);
  }
  const account = await fetchAccount(address);
  if (!account.contract) {
    permanentRedirect(`/address/${address}/contract`);
  }
  return <AddressContractWrite address={address} />;
};

export default AddressContractWritePage;
