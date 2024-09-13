import { Address } from "viem";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { fetchNftTransfers } from "@/components/pages/address/address-nft-transfers/fetch-nft-transfers";
import NftTransfersTable from "@/components/pages/address/address-nft-transfers/nft-transfers-table";
import Pagination from "@/components/lib/pagination";

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
    <p className="text-sm">No NFT token transfers found</p>
  ) : (
    <>
      <p className="text-sm">
        A total of {totalCount} NFT token transfer
        {totalCount === 1 ? "" : "s"} found
      </p>
      <Pagination
        pathname={`/address/${address}/nft-transfers`}
        page={page}
        totalPages={Math.ceil(
          totalCount / Number(process.env.NEXT_PUBLIC_TXS_PER_PAGE),
        )}
      />
    </>
  );

const AddressNftTransfers = async ({
  address,
  page,
}: {
  address: Address;
  page: number;
}) => {
  const { nftTransfers, totalCount } = await fetchNftTransfers(address, page);
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
        <NftTransfersTable address={address} nftTransfers={nftTransfers} />
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

export default AddressNftTransfers;
