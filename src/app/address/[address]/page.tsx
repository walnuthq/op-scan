import AddressComponent from "@/components/pages/address";
import { Address } from "viem";

const AddressPage = ({
  params: { address },
}: {
  params: { address: Address };
}) => <AddressComponent address={address} />;

export default AddressPage;
