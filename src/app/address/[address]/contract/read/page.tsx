import { notFound, permanentRedirect } from "next/navigation";
import { isAddress, getAddress } from "viem";
import fetchAccount from "@/lib/fetch-account";
import AddressContractRead from "@/components/pages/address/address-contract/address-contract-read";

const AddressContractReadPage = async ({
  params: { address: rawAddress },
}: {
  params: { address: string };
}) => {
  if (!isAddress(rawAddress)) {
    notFound();
  }
  const address = getAddress(rawAddress);
  if (rawAddress !== address) {
    permanentRedirect(`/address/${address}/contract/read`);
  }
  const account = await fetchAccount(address);
  if (!account.contract) {
    permanentRedirect(`/address/${address}/contract`);
  }
  return <AddressContractRead address={address} />;
};

export default AddressContractReadPage;
