import { Address } from "viem";
import AddressNftTransfers from "@/components/pages/address/address-nft-transfers";

const AddressNftTransfersPage = ({
  params: { address },
}: {
  params: { address: string };
}) => <AddressNftTransfers address={address as Address} />;

export default AddressNftTransfersPage;
