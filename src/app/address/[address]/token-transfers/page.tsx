import { Address } from "viem";
import AddressTokenTransfers from "@/components/pages/address/address-token-transfers";

const AddressTokenTransfersPage = ({
  params: { address },
}: {
  params: { address: string };
}) => <AddressTokenTransfers address={address as Address} />;

export default AddressTokenTransfersPage;
