import Blocks from "@/components/pages/blocks";
import { fetchL2BlockNumber } from "@/lib/fetch-data";

const BlocksPage = async ({
  searchParams: { start, latest },
}: {
  searchParams: { start?: string; latest?: string };
}) => {
  const latestBlockNumber = await fetchL2BlockNumber();
  return (
    <Blocks
      start={start ? BigInt(start) : latestBlockNumber}
      latest={latest ? BigInt(latest) : latestBlockNumber}
    />
  );
};

export default BlocksPage;
