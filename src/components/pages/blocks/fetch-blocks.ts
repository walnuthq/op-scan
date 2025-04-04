import { range } from "lodash";
import { blocksPerPage } from "@/lib/constants";
import { l2PublicClient, l2Chain } from "@/lib/chains";
import { prisma, fromPrismaBlock } from "@/lib/prisma";
import { fromViemBlock } from "@/lib/viem";

const fetchBlocksFromDatabase = async (start: bigint) => {
  const blocks = await prisma.block.findMany({
    where: {
      number: { lte: start, gt: Math.max(Number(start) - blocksPerPage, -1) },
      chainId: l2Chain.id,
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

const fetchBlocksFromJsonRpc = async (start: bigint) => {
  const blocks = await Promise.all(
    range(Number(start), Math.max(Number(start) - blocksPerPage, -1)).map((i) =>
      l2PublicClient.getBlock({ blockNumber: BigInt(i) }),
    ),
  );
  return blocks.map(fromViemBlock);
};

const fetchBlocks = process.env.DATABASE_URL
  ? fetchBlocksFromDatabase
  : fetchBlocksFromJsonRpc;

export default fetchBlocks;
