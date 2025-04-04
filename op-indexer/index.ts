import { parseArgs } from "node:util";
import { range } from "lodash";
import {
  fetchL2BlockNumberFromJsonRpc,
  fetchL2BlockNumberFromDatabase,
  fetchL1BlockNumberFromJsonRpc,
  fetchL1BlockNumberFromDatabase,
} from "@/lib/fetch-data";
import { prisma } from "@/lib/prisma";
import { l1Chain, l2Chain, l1PublicClient, l2PublicClient } from "@/lib/chains";
import { indexL1Block, indexL2Block } from "@/lib/indexer";
import { l2BlockTime } from "@/lib/constants";

const indexChain = (
  chainId: number,
  l2ChainId: number,
  blocksToIndex: Set<bigint>,
  indexDelay: number,
  fetchBlockNumberFromJsonRpc: () => Promise<bigint>,
  fetchBlockNumberFromDatabase: () => Promise<bigint>,
  indexBlock: (blockNumber: bigint, chainId: number) => Promise<void>,
) => {
  setInterval(async () => {
    const [blockNumberFromJsonRpc, blockNumberFromDatabase] = await Promise.all(
      [fetchBlockNumberFromJsonRpc(), fetchBlockNumberFromDatabase()],
    );
    blocksToIndex = blocksToIndex.union(
      new Set([
        ...range(
          Number(blockNumberFromDatabase) + 1,
          Number(blockNumberFromJsonRpc),
        ).map(BigInt),
      ]),
    );
    const [blockNumber] = blocksToIndex;
    if (blockNumber === undefined) {
      return;
    }
    blocksToIndex.delete(blockNumber);
    console.info(`Indexing Block #${blockNumber} from Chain ${chainId}`);
    try {
      console.time(`${chainId}-${blockNumber}`);
      await indexBlock(blockNumber, l2ChainId);
      console.timeEnd(`${chainId}-${blockNumber}`);
      console.info(`Indexed Block #${blockNumber} from Chain ${chainId}`);
    } catch (error) {
      console.error(error);
      blocksToIndex.add(blockNumber);
    }
  }, indexDelay);
};

const main = async () => {
  const rollupConfig = {
    l2ChainId: l2Chain.id,
    l2ChainName: l2Chain.name,
    l2ChainRpcUrl: l2Chain.rpcUrls.default.http[0],
    l2ChainBlockExplorerName: l2Chain.blockExplorers.default.name,
    l2ChainBlockExplorerUrl: l2Chain.blockExplorers.default.url,
    l2BlockTime,
    l1ChainId: l1Chain.id,
  };
  // create the OP Stack rollup config
  await prisma.rollupConfig.upsert({
    where: { l2ChainId: l2Chain.id },
    create: rollupConfig,
    update: rollupConfig,
  });

  const { values } = parseArgs({
    args: process.argv,
    options: {
      "l1-from-block": {
        type: "string",
      },
      "l1-index-block": {
        type: "string",
        multiple: true,
        default: [],
      },
      "l1-index-delay": { type: "string", default: "12000" },
      "l2-from-block": {
        type: "string",
        short: "f",
      },
      "l2-index-block": {
        type: "string",
        short: "b",
        multiple: true,
        default: [],
      },
      "l2-index-delay": { type: "string", short: "d", default: "2000" },
    },
    strict: true,
    allowPositionals: true,
  });

  const [latestL1BlockNumber, latestL2BlockNumber] = await Promise.all([
    l1PublicClient.getBlockNumber(),
    l2PublicClient.getBlockNumber(),
  ]);

  const defaultL1FromBlock =
    latestL1BlockNumber > BigInt(0)
      ? latestL1BlockNumber - BigInt(1)
      : BigInt(0);
  const l1FromBlock = values["l1-from-block"]
    ? BigInt(values["l1-from-block"])
    : defaultL1FromBlock;
  const indexL1Blocks = values["l1-index-block"];
  const l1IndexDelay = Number(values["l1-index-delay"]);

  const defaultL2FromBlock =
    latestL2BlockNumber > BigInt(0)
      ? latestL2BlockNumber - BigInt(1)
      : BigInt(0);
  const l2FromBlock = values["l2-from-block"]
    ? BigInt(values["l2-from-block"])
    : defaultL2FromBlock;
  const indexL2Blocks = values["l2-index-block"];
  const l2IndexDelay = Number(values["l2-index-delay"]);

  indexChain(
    l1Chain.id,
    l2Chain.id,
    new Set([
      ...indexL1Blocks.map(BigInt),
      ...range(Number(l1FromBlock), Number(latestL1BlockNumber) + 1).map(
        BigInt,
      ),
    ]),
    l1IndexDelay,
    fetchL1BlockNumberFromJsonRpc,
    fetchL1BlockNumberFromDatabase,
    indexL1Block,
  );

  indexChain(
    l2Chain.id,
    l2Chain.id,
    new Set([
      ...indexL2Blocks.map(BigInt),
      ...range(Number(l2FromBlock), Number(latestL2BlockNumber) + 1).map(
        BigInt,
      ),
    ]),
    l2IndexDelay,
    fetchL2BlockNumberFromJsonRpc,
    fetchL2BlockNumberFromDatabase,
    indexL2Block,
  );
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
