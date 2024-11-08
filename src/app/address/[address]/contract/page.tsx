import { notFound, permanentRedirect } from "next/navigation";
import { isAddress, getAddress } from "viem";
import AddressContract from "@/components/pages/address/address-contract";

const AddressContractPage = async ({
  params,
}: {
  params: Promise<{ address: string }>;
}) => {
  const { address: rawAddress } = await params;
  if (!isAddress(rawAddress)) {
    notFound();
  }
  const address = getAddress(rawAddress);
  if (rawAddress !== address) {
    permanentRedirect(`/address/${address}/contract`);
  }
  return <AddressContract address={address} />;
};

export default AddressContractPage;
