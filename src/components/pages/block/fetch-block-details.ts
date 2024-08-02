import { l2PublicClient } from "@/lib/chains";
import { Block, fromViemBlock, fromPrismaBlock } from "@/lib/types";
import { prisma } from "@/lib/prisma";

type FetchBlockDetailsReturnType = {
  block: Block | null;
};

const fetchBlockDetailsFromDatabase = async (
  number: bigint,
): Promise<FetchBlockDetailsReturnType> => {
  const block = await prisma.block.findUnique({
    where: { number: BigInt(number) },
    include: { transactions: true },
  });

  if (!block) {
    return fetchBlockDetailsFromJsonRpc(number);
  }

  return {
    block: fromPrismaBlock(block, block.transactions),
  };
};

const fetchBlockDetailsFromJsonRpc = async (
  number: bigint,
): Promise<FetchBlockDetailsReturnType> => {
  const block = await l2PublicClient.getBlock({ blockNumber: number });

  if (!block) {
    return { block: null };
  }

  return {
    block: fromViemBlock(block),
  };
};

const fetchBlockDetails = process.env.DATABASE_URL
  ? fetchBlockDetailsFromDatabase
  : fetchBlockDetailsFromJsonRpc;

export default fetchBlockDetails;