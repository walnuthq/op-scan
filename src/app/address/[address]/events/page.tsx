import { Address } from "viem";
import AddressEvents from "@/components/pages/address/address-events";

const AddressEventsPage = ({
  params: { address },
}: {
  params: { address: string };
}) => <AddressEvents address={address as Address} />;

export default AddressEventsPage;
