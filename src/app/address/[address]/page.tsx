import { notFound, permanentRedirect } from "next/navigation";
import { isAddress, getAddress } from "viem";
import AddressTransactions from "@/components/pages/address/address-transactions";

const AddressTransactionsPage = ({
  params: { address: rawAddress },
  searchParams: { page },
}: {
  params: { address: string };
  searchParams: { page?: string };
}) => {
  if (!isAddress(rawAddress)) {
    notFound();
  }
  const address = getAddress(rawAddress);
  if (rawAddress !== address) {
    permanentRedirect(`/address/${address}`);
  }
  return (
    <AddressTransactions address={address} page={page ? Number(page) : 1} />
  );
};

export default AddressTransactionsPage;
