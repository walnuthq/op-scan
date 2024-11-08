import { notFound, permanentRedirect } from "next/navigation";
import { isAddress, getAddress } from "viem";
import AddressNftTransfers from "@/components/pages/address/address-nft-transfers";

const AddressNftTransfersPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ address: string }>;
  searchParams: Promise<{ page?: string }>;
}) => {
  const [{ address: rawAddress }, { page }] = await Promise.all([
    params,
    searchParams,
  ]);
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
