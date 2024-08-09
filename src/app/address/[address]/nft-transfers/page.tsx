import { Address } from "viem";
import AddressNftTransfers from "@/components/pages/address/address-nft-transfers";
import { getLatestNftTransferEvents } from "@/lib/fetch-data";

const AddressNftTransfersPage = async ({
  params: { address },
}: {
  params: { address: Address };
}) => {
  let nftTransferEvents;
  try {
    nftTransferEvents = await getLatestNftTransferEvents(address);
  } catch (error) {
    console.error("Error Transfer:", error);
  }
  return (
    <AddressNftTransfers
      address={address as Address}
      nftTokenTransfers={nftTransferEvents}
    />
  );
};
export default AddressNftTransfersPage;
