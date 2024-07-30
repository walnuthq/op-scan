import { Address } from "viem";
import AddressTransactions from "@/components/pages/address/address-transactions";

const AddressTransactionsPage = ({
  params: { address },
}: {
  params: { address: string };
}) => <AddressTransactions address={address as Address} />;

export default AddressTransactionsPage;
