import { Address } from "viem";
import AddressTokenTransfers from "@/components/pages/address/address-token-transfers";
import { getLatestTransferEvents } from "@/lib/fetch-data";


const AddressTokenTransfersPage = async ({
  params: { address },
}: {
  params: { address: Address };
}) => {
  let transferEvents;
  try {
    transferEvents = await getLatestTransferEvents(address);
    console.log("Transfer:", transferEvents);
  } catch (error) {
    console.error("Error Transfer:", error);
  }
  return(
  <AddressTokenTransfers address={address as Address} erc20Transfers={transferEvents}
  />
  )
};

export default AddressTokenTransfersPage;
