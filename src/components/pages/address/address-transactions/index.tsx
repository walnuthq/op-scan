import { Address } from "viem";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import TxsTable from "@/components/lib/txs-table";
import fetchTransactions from "@/components/pages/address/address-transactions/fetch-transactions";
import { fetchSpotPrices } from "@/lib/fetch-data";
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
    <p className="text-sm">No transactions found</p>
  ) : (
    <>
      <p className="text-sm">
        A total of {totalCount} transaction{totalCount === 1 ? "" : "s"} found
      </p>
      <Pagination
        pathname={`/address/${address}`}
        page={page}
        totalPages={Math.ceil(
          totalCount / Number(process.env.NEXT_PUBLIC_TXS_PER_PAGE),
        )}
      />
    </>
  );

const AddressTransactions = async ({
  address,
  page,
}: {
  address: Address;
  page: number;
}) => {
  const [{ transactions, totalCount }, prices] = await Promise.all([
    fetchTransactions(address, page),
    fetchSpotPrices(),
  ]);
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
        <TxsTable
          transactions={transactions}
          ethPrice={prices.ETH}
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

export default AddressTransactions;
