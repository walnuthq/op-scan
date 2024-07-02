import { Address } from "viem";
import AddressComponent from "@/components/pages/address";

const AddressPage = ({
  params: { address },
}: {
  params: { address: string };
}) => <AddressComponent address={address as Address} />;

export default AddressPage;
