import { Address } from "viem";
import { Card, CardContent } from "@/components/ui/card";
import AddressContractTabs from "@/components/pages/address/address-contract/address-contract-tabs";
import fetchAccount from "@/components/pages/address/fetch-account";
import { fetchContract } from "@/components/pages/address/address-contract/fetch-contract";

const AddressContract = async ({ address }: { address: Address }) => {
  const account = await fetchAccount(address);
  const contract = account.contract
    ? account.contract
    : await fetchContract(address);
  return (
    <Card>
      <CardContent className="py-4">
        <AddressContractTabs account={account} contract={contract} />
      </CardContent>
    </Card>
  );
};

export default AddressContract;
