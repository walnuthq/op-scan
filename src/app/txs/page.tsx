import Txs from "@/components/pages/txs";
import { fetchL2BlockNumber } from "@/lib/fetch-data";

const TxsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ start?: string; page?: string }>;
}) => {
  const { start, page } = await searchParams;
  const latestBlockNumber = await fetchL2BlockNumber();
  return (
    <Txs
      start={start ? BigInt(start) : latestBlockNumber}
      page={page ? Number(page) : 1}
    />
  );
};

export default TxsPage;
