import { notFound, permanentRedirect } from "next/navigation";
import { isAddress, getAddress } from "viem";
import AddressTokenTransfers from "@/components/pages/address/address-token-transfers";

const AddressTokenTransfersPage = ({
  params: { address: rawAddress },
  searchParams: { page },
}: {
  params: { address: string };
  searchParams: { page?: string };
}) => {
  if (!isAddress(rawAddress)) {
    notFound();
  }
  const address = getAddress(rawAddress);
  if (rawAddress !== address) {
    permanentRedirect(`/address/${address}/token-transfers`);
  }
  return (
    <AddressTokenTransfers address={address} page={page ? Number(page) : 1} />
  );
};

export default AddressTokenTransfersPage;
