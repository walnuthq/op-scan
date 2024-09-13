import { notFound, permanentRedirect } from "next/navigation";
import { isAddress, getAddress } from "viem";
import AddressEvents from "@/components/pages/address/address-events";

const AddressEventsPage = ({
  params: { address: rawAddress },
}: {
  params: { address: string };
}) => {
  if (!isAddress(rawAddress)) {
    notFound();
  }
  const address = getAddress(rawAddress);
  if (rawAddress !== address) {
    permanentRedirect(`/address/${address}/events`);
  }
  return <AddressEvents address={address} />;
};

export default AddressEventsPage;
