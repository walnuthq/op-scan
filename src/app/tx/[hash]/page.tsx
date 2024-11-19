import { Hash } from "viem";
import Tx from "@/components/pages/tx";

const TxPage = async ({ params }: { params: Promise<{ hash: string }> }) => {
  const { hash } = await params;
  return <Tx hash={hash as Hash} />;
};

export const dynamic = "force-dynamic";

export default TxPage;
