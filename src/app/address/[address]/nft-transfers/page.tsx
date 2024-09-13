import { notFound, permanentRedirect } from "next/navigation";
import { isAddress, getAddress } from "viem";
import AddressNftTransfers from "@/components/pages/address/address-nft-transfers";

const AddressNftTransfersPage = ({
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
    permanentRedirect(`/address/${address}/nft-transfers`);
  }
  return (
    <AddressNftTransfers address={address} page={page ? Number(page) : 1} />
  );
};

export default AddressNftTransfersPage;
