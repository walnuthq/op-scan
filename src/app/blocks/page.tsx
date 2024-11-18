import Blocks from "@/components/pages/blocks";
import { fetchL2BlockNumber } from "@/lib/fetch-data";

const BlocksPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ start?: string; latest?: string }>;
}) => {
  const { start, latest } = await searchParams;
  const latestBlockNumber = await fetchL2BlockNumber();
  return (
    <Blocks
      start={start ? BigInt(start) : latestBlockNumber}
      latest={latest ? BigInt(latest) : latestBlockNumber}
    />
  );
};

export const dynamic = "force-dynamic";

export default BlocksPage;
