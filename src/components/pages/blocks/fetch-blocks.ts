import { l2PublicClient } from "@/lib/chains";
import { prisma, fromPrismaBlock } from "@/lib/prisma";
import { fromViemBlock } from "@/lib/viem";
import { range } from "lodash";

const fetchBlocksFromJsonRpc = async (start: bigint) => {
  const blocksPerPage = BigInt(process.env.NEXT_PUBLIC_BLOCKS_PER_PAGE);
  const blocks = await Promise.all(
    range(Number(start), Math.max(Number(start - blocksPerPage), -1)).map((i) =>
      l2PublicClient.getBlock({ blockNumber: BigInt(i) }),
    ),
  );
  return blocks.map(fromViemBlock);
};

const fetchBlocksFromDatabase = async (start: bigint) => {
  const blocksPerPage = BigInt(process.env.NEXT_PUBLIC_BLOCKS_PER_PAGE);
  const blocks = await prisma.block.findMany({
    where: {
      number: { lte: start, gt: Math.max(Number(start - blocksPerPage), -1) },
    },
    orderBy: { number: "desc" },
    take: Number(blocksPerPage),
    include: { transactions: { select: { hash: true } } },
  });
  if (blocks.length === 0) {
    return fetchBlocksFromJsonRpc(start);
  }
  return blocks.map(fromPrismaBlock);
};

const fetchBlocks = process.env.DATABASE_URL
  ? fetchBlocksFromDatabase
  : fetchBlocksFromJsonRpc;

export default fetchBlocks;
