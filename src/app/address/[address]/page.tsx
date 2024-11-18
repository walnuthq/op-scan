import { notFound, permanentRedirect } from "next/navigation";
import { isAddress, getAddress } from "viem";
import AddressTransactions from "@/components/pages/address/address-transactions";

const AddressTransactionsPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ address: string }>;
  searchParams: Promise<{ page?: string }>;
}) => {
  const [{ address: rawAddress }, { page }] = await Promise.all([
    params,
    searchParams,
  ]);
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

export const dynamic = "force-dynamic";

export default AddressTransactionsPage;
