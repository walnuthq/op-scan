import { parseArgs } from "node:util";
import { range } from "lodash";
import { createPublicClient, webSocket } from "viem";
import { prisma } from "@/lib/prisma";
import { l1Chain, l2Chain, l1PublicClient, l2PublicClient } from "@/lib/chains";
import { indexL1Block, indexL2Block } from "./utils";

const l1PublicClientWs = createPublicClient({
  chain: l1Chain,
  transport: webSocket(process.env.L1_RPC_WSS),
});

const l2PublicClientWs = createPublicClient({
  chain: l2Chain,
  transport: webSocket(process.env.L2_RPC_WSS),
});

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

const defaultL1FromBlock = latestL1BlockNumber - BigInt(1);
const l1FromBlock = values["l1-from-block"]
  ? BigInt(values["l1-from-block"])
  : defaultL1FromBlock;
const indexL1Blocks = values["l1-index-block"] ?? [];
const l1BlocksToIndex = new Set<bigint>([
  ...indexL1Blocks.map(BigInt),
  ...range(Number(l1FromBlock), Number(latestL1BlockNumber) + 1).map(BigInt),
]);

const defaultL2FromBlock = latestL2BlockNumber - BigInt(1);
const l2FromBlock = values["l2-from-block"]
  ? BigInt(values["l2-from-block"])
  : defaultL2FromBlock;
const indexL2Blocks = values["l2-index-block"] ?? [];
const l2BlocksToIndex = new Set<bigint>([
  ...indexL2Blocks.map(BigInt),
  ...range(Number(l2FromBlock), Number(latestL2BlockNumber) + 1).map(BigInt),
]);

// listen to new head and index blocks
l1PublicClientWs.watchBlockNumber({
  onBlockNumber: (blockNumber) => l1BlocksToIndex.add(blockNumber),
});
l2PublicClientWs.watchBlockNumber({
  onBlockNumber: (blockNumber) => l2BlocksToIndex.add(blockNumber),
});

const indexDelay = Number(values["index-delay"] ?? "1000");

setInterval(async () => {
  const [blockNumber] = l1BlocksToIndex;
  if (blockNumber === undefined) {
    return;
  }
  l1BlocksToIndex.delete(blockNumber);
  console.info(`Indexing L1 Block #${blockNumber}`);
  console.time(`l1-${blockNumber}`);
  await indexL1Block(blockNumber);
  console.timeEnd(`l1-${blockNumber}`);
  console.info(`L1 Block #${blockNumber} indexed`);
}, indexDelay);

setInterval(async () => {
  const [blockNumber] = l2BlocksToIndex;
  if (blockNumber === undefined) {
    return;
  }
  l2BlocksToIndex.delete(blockNumber);
  console.info(`Indexing L2 Block #${blockNumber}`);
  console.time(`l2-${blockNumber}`);
  await indexL2Block(blockNumber);
  console.timeEnd(`l2-${blockNumber}`);
  console.info(`L2 Block #${blockNumber} indexed`);
}, indexDelay);
