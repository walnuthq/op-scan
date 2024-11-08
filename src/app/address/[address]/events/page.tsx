import { notFound, permanentRedirect } from "next/navigation";
import { isAddress, getAddress } from "viem";
import AddressEvents from "@/components/pages/address/address-events";

const AddressEventsPage = async ({
  params,
}: {
  params: Promise<{ address: string }>;
}) => {
  const { address: rawAddress } = await params;
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
