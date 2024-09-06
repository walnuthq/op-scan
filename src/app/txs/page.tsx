import Txs from "@/components/pages/txs";
import { fetchL2BlockNumber } from "@/lib/fetch-data";

const TxsPage = async ({
  searchParams: { start, page },
}: {
  searchParams: { start?: string; page?: string };
}) => {
  const latestBlockNumber = await fetchL2BlockNumber();
  return (
    <Txs
      start={start ? BigInt(start) : latestBlockNumber}
      page={page ? Number(page) : 1}
    />
  );
};

export default TxsPage;
