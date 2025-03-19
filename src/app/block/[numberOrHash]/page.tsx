import { notFound, permanentRedirect } from "next/navigation";
import { type Hash } from "viem";
import { getBlockNumberSafe } from "@/lib/utils";
import Block from "@/components/pages/block";

const BlockPage = async ({
  params,
}: {
  params: Promise<{ numberOrHash: string }>;
}) => {
  const { numberOrHash } = await params;
  if (numberOrHash.startsWith("0x")) {
    const number = await getBlockNumberSafe(numberOrHash as Hash);
    if (number === null) {
      notFound();
    }
    permanentRedirect(`/block/${number}`);
  }
  return <Block number={BigInt(numberOrHash)} />;
};

export const dynamic = "force-dynamic";

export default BlockPage;
