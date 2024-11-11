import { ReactNode } from "react";
import { getAddress } from "viem";
import { Card, CardContent } from "@/components/ui/card";
import fetchAccount from "@/lib/fetch-account";
import AddressContractTabs from "@/components/pages/address/address-contract/address-contract-tabs";

const AddressContractLayout = async ({
  params,
  children,
}: {
  params: Promise<{ address: string }>;
  children: ReactNode;
}) => {
  const { address: rawAddress } = await params;
  const address = getAddress(rawAddress);
  const account = await fetchAccount(address);
  return (
    <Card>
      <CardContent className="py-4">
        {account.contract ? (
          <>
            <AddressContractTabs address={address}>
              {children}
            </AddressContractTabs>
          </>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
};

export default AddressContractLayout;
