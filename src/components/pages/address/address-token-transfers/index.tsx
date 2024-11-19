import { Address } from "viem";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { fetchTokenTransfers } from "@/components/pages/address/address-token-transfers/fetch-token-transfers";
import TokenTransfersTable from "@/components/pages/address/address-token-transfers/token-transfers-table";
import Pagination from "@/components/lib/pagination";
import { txsPerPage } from "@/lib/constants";

const CardHeaderFooterContent = ({
  totalCount,
  address,
  page,
}: {
  totalCount: number;
  address: Address;
  page: number;
}) =>
  totalCount === 0 ? (
    <p className="text-sm">No ERC-20 token transfers found</p>
  ) : (
    <>
      <p className="text-sm">
        A total of {totalCount} ERC-20 token transfer
        {totalCount === 1 ? "" : "s"} found
      </p>
      <Pagination
        pathname={`/address/${address}/token-transfers`}
        page={page}
        totalPages={Math.ceil(totalCount / txsPerPage)}
      />
    </>
  );

const AddressTokenTransfers = async ({
  address,
  page,
}: {
  address: Address;
  page: number;
}) => {
  const { tokenTransfers, totalCount } = await fetchTokenTransfers(
    address,
    page,
  );
  return (
    <Card>
      <CardHeader className="flex flex-col items-start justify-start md:flex-row md:items-center md:justify-between">
        <CardHeaderFooterContent
          totalCount={totalCount}
          address={address}
          page={page}
        />
      </CardHeader>
      <CardContent className="px-0">
        <TokenTransfersTable
          tokenTransfers={tokenTransfers}
          address={address}
        />
      </CardContent>
      <CardFooter className="flex flex-col items-start justify-start md:flex-row md:items-center md:justify-between">
        <CardHeaderFooterContent
          totalCount={totalCount}
          address={address}
          page={page}
        />
      </CardFooter>
    </Card>
  );
};

export default AddressTokenTransfers;
