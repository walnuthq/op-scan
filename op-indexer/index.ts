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

const main = async () => {
  const deployConfig = { l1ChainId: l1Chain.id, l2ChainId: l2Chain.id };
  // create the OP Stack deploy config
  await prisma.deployConfig.upsert({
    where: { l1ChainId_l2ChainId: deployConfig },
    create: deployConfig,
    update: deployConfig,
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
      "index-delay": { type: "string", short: "d", default: "1000" },
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
  let l1BlocksToIndex = new Set([
    ...indexL1Blocks.map(BigInt),
    ...range(Number(l1FromBlock), Number(latestL1BlockNumber) + 1).map(BigInt),
  ]);

  const defaultL2FromBlock =
    latestL2BlockNumber > BigInt(0)
      ? latestL2BlockNumber - BigInt(1)
      : BigInt(0);
  const l2FromBlock = values["l2-from-block"]
    ? BigInt(values["l2-from-block"])
    : defaultL2FromBlock;
  const indexL2Blocks = values["l2-index-block"];
  let l2BlocksToIndex = new Set([
    ...indexL2Blocks.map(BigInt),
    ...range(Number(l2FromBlock), Number(latestL2BlockNumber) + 1).map(BigInt),
  ]);

  const indexDelay = Number(values["index-delay"]);

  setInterval(async () => {
    const [l1BlockNumberFromJsonRpc, l1BlockNumberFromDatabase] =
      await Promise.all([
        fetchL1BlockNumberFromJsonRpc(),
        fetchL1BlockNumberFromDatabase(),
      ]);
    l1BlocksToIndex = l1BlocksToIndex.union(
      new Set([
        ...range(
          Number(l1BlockNumberFromDatabase) + 1,
          Number(l1BlockNumberFromJsonRpc),
        ).map(BigInt),
      ]),
    );
    const [blockNumber] = l1BlocksToIndex;
    if (blockNumber === undefined) {
      return;
    }
    l1BlocksToIndex.delete(blockNumber);
    console.info(`Indexing L1 Block #${blockNumber}`);
    try {
      console.time(`l1-${blockNumber}`);
      await indexL1Block(blockNumber);
      console.timeEnd(`l1-${blockNumber}`);
      console.info(`Indexed L1 Block #${blockNumber}`);
    } catch (error) {
      console.error(error);
      l1BlocksToIndex.add(blockNumber);
    }
  }, indexDelay);

  setInterval(async () => {
    const [l2BlockNumberFromJsonRpc, l2BlockNumberFromDatabase] =
      await Promise.all([
        fetchL2BlockNumberFromJsonRpc(),
        fetchL2BlockNumberFromDatabase(),
      ]);
    l2BlocksToIndex = l2BlocksToIndex.union(
      new Set([
        ...range(
          Number(l2BlockNumberFromDatabase) + 1,
          Number(l2BlockNumberFromJsonRpc),
        ).map(BigInt),
      ]),
    );
    const [blockNumber] = l2BlocksToIndex;
    if (blockNumber === undefined) {
      return;
    }
    l2BlocksToIndex.delete(blockNumber);
    console.info(`Indexing L2 Block #${blockNumber}`);
    try {
      console.time(`l2-${blockNumber}`);
      await indexL2Block(blockNumber);
      console.timeEnd(`l2-${blockNumber}`);
      console.info(`Indexed L2 Block #${blockNumber}`);
    } catch (error) {
      console.error(error);
      l2BlocksToIndex.add(blockNumber);
    }
  }, indexDelay);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
