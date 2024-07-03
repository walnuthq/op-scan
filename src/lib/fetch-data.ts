import { subDays, formatISO } from "date-fns";
import { encodeFunctionData, keccak256, Address } from "viem";
import {
  Transaction,
  fromPrismaBlockWithTransactions,
  fromPrismaTransaction,
} from "@/lib/types";
import { BlockWithTransactions, L1L2Transaction } from "@/lib/types";
import { l1PublicClient, l2PublicClient } from "@/lib/chains";
import l2OutputOracle from "@/lib/contracts/l2-output-oracle/contract";
import l1CrossDomainMessenger from "@/lib/contracts/l1-cross-domain-messenger/contract";
import l2CrossDomainMessenger from "@/lib/contracts/l2-cross-domain-messenger/contract";
import { prisma } from "@/lib/prisma";

export const fetchLatestL1L2Transactions = async (): Promise<
  L1L2Transaction[]
> => {
  const [l1BlockNumber, l2BlockNumber, l2BlockTime] = await Promise.all([
    l1PublicClient.getBlockNumber(),
    l2PublicClient.getBlockNumber(),
    l2OutputOracle.read.l2BlockTime(),
  ]);
  const l1FromBlock = l1BlockNumber - BigInt(1000);
  const l2BlocksPerL1Block = 12 / Number(l2BlockTime);
  const l2FromBlock = l2BlockNumber - BigInt(1000 * l2BlocksPerL1Block);
  const [sentMessageLogs, sentMessageExtension1Logs, relayedMessageLogs] =
    await Promise.all([
      l1CrossDomainMessenger.getEvents.SentMessage(undefined, {
        fromBlock: l1FromBlock,
      }),
      l1CrossDomainMessenger.getEvents.SentMessageExtension1(undefined, {
        fromBlock: l1FromBlock,
      }),
      l2CrossDomainMessenger.getEvents.RelayedMessage(undefined, {
        fromBlock: l2FromBlock,
      }),
    ]);
  const lastSentMessageLogs = sentMessageLogs.reverse().slice(0, 10);
  const sentMessageLogsBlocks = await Promise.all(
    lastSentMessageLogs.map(({ blockNumber }) =>
      l1PublicClient.getBlock({ blockNumber }),
    ),
  );
  return lastSentMessageLogs.reduce<L1L2Transaction[]>(
    (txns, sentMessageLog, i) => {
      const { messageNonce, sender, target, gasLimit, message } =
        sentMessageLog.args;
      const sentMessageExtension1Log = sentMessageExtension1Logs.find(
        ({ transactionHash }) =>
          transactionHash === sentMessageLog.transactionHash,
      );
      if (!sentMessageExtension1Log) {
        return txns;
      }
      const { value } = sentMessageExtension1Log.args;
      const data = encodeFunctionData({
        abi: l1CrossDomainMessenger.abi,
        functionName: "relayMessage",
        args: [messageNonce!, sender!, target!, value!, gasLimit!, message!],
      });
      const hash = keccak256(data);
      const relayedMessageLog = relayedMessageLogs.find(
        ({ args }) => args.msgHash === hash,
      );
      if (!relayedMessageLog) {
        return txns;
      }
      const txn = {
        l1BlockNumber: sentMessageLog.blockNumber,
        l1TxHash: sentMessageLog.transactionHash,
        l2TxHash: relayedMessageLog.transactionHash,
        timestamp: sentMessageLogsBlocks[i].timestamp,
        // Optimism: Aliased L1 Cross-Domain Messenger
        l1TxOrigin: "0x36bde71c97b33cc4729cf772ae268934f7ab70b2" as Address,
        gasLimit: gasLimit!,
      };
      return [...txns, txn];
    },
    [],
  );
};

const fetchL2LatestBlocks = async (): Promise<BlockWithTransactions[]> => {
  const latestBlock = await l2PublicClient.getBlock({
    includeTransactions: true,
  });
  const latestBlocks = await Promise.all(
    [1, 2, 3, 4, 5].map((index) =>
      l2PublicClient.getBlock({
        blockNumber: latestBlock.number - BigInt(index),
        includeTransactions: true,
      }),
    ),
  );
  const blocks = [latestBlock, ...latestBlocks];
  return blocks.map((block) => ({
    number: block.number,
    hash: block.hash,
    timestamp: block.timestamp,
    gasUsed: block.gasUsed,
    gasLimit: block.gasLimit,
    extraData: block.extraData,
    parentHash: block.parentHash,
    transactions: block.transactions.map((transaction) => ({
      blockNumber: transaction.blockNumber,
      hash: transaction.hash,
      from: transaction.from,
      to: transaction.to,
      value: transaction.value,
      gas: transaction.gas,
      gasPrice: transaction.gasPrice ?? null,
      maxFeePerGas: transaction.maxFeePerGas ?? null,
      maxPriorityFeePerGas: transaction.maxPriorityFeePerGas ?? null,
      transactionIndex: transaction.transactionIndex,
      nonce: transaction.nonce,
      input: transaction.input,
      signature: "",
      timestamp: block.timestamp,
    })),
  }));
};

export const fetchTokensPrices = async () => {
  const date = formatISO(subDays(new Date(), 1), {
    representation: "date",
  });
  const [
    ethResponseToday,
    ethResponseYesterday,
    opResponseToday,
    opResponseYesterday,
  ] = await Promise.all([
    fetch("https://api.coinbase.com/v2/prices/ETH-USD/spot"),
    fetch(`https://api.coinbase.com/v2/prices/ETH-USD/spot?date=${date}`),
    fetch("https://api.coinbase.com/v2/prices/OP-USD/spot"),
    fetch(`https://api.coinbase.com/v2/prices/OP-USD/spot?date=${date}`),
  ]);
  const [ethJsonToday, ethJsonYesterday, opJsonToday, opJsonYesterday] =
    await Promise.all([
      ethResponseToday.json(),
      ethResponseYesterday.json(),
      opResponseToday.json(),
      opResponseYesterday.json(),
    ]);
  type GetSpotPriceResponse = {
    data: { amount: string; base: string; currency: string };
  };
  const {
    data: { amount: ethPriceToday },
  } = ethJsonToday as GetSpotPriceResponse;
  const {
    data: { amount: ethPriceYesterday },
  } = ethJsonYesterday as GetSpotPriceResponse;
  const {
    data: { amount: opPriceToday },
  } = opJsonToday as GetSpotPriceResponse;
  const {
    data: { amount: opPriceYesterday },
  } = opJsonYesterday as GetSpotPriceResponse;
  return {
    eth: { today: Number(ethPriceToday), yesterday: Number(ethPriceYesterday) },
    op: { today: Number(opPriceToday), yesterday: Number(opPriceYesterday) },
  };
};

export const fetchHomePageData = async () => {
  if (process.env.DATABASE_URL) {
    const [
      tokensPrices,
      latestBlocks,
      deployConfig,
      latestTransactions,
      latestL1L2Transactions,
    ] = await Promise.all([
      fetchTokensPrices(),
      prisma.block.findMany({
        include: { transactions: true },
        orderBy: { number: "desc" },
        take: 6,
      }),
      prisma.deployConfig.findFirst(),
      prisma.transaction.findMany({
        orderBy: { timestamp: "desc" },
        take: 6,
      }),
      fetchLatestL1L2Transactions(),
    ]);
    return {
      tokensPrices,
      latestBlocks: latestBlocks.map(fromPrismaBlockWithTransactions),
      l2BlockTime: deployConfig ? deployConfig.l2BlockTime : BigInt(2),
      latestTransactions: latestTransactions.map(fromPrismaTransaction),
      latestL1L2Transactions,
    };
  }
  const [
    tokensPrices,
    latestBlocksFromJsonRpc,
    l2BlockTime,
    latestL1L2Transactions,
  ] = await Promise.all([
    fetchTokensPrices(),
    fetchL2LatestBlocks(),
    l2OutputOracle.read.l2BlockTime(),
    fetchLatestL1L2Transactions(),
  ]);
  const latestTransactionsFromJsonRpc = latestBlocksFromJsonRpc
    .reduce<
      Transaction[]
    >((txns, block) => [...txns, ...block.transactions.reverse()], [])
    .slice(0, 6);
  return {
    tokensPrices,
    latestBlocks: latestBlocksFromJsonRpc,
    l2BlockTime,
    latestTransactions: latestTransactionsFromJsonRpc,
    latestL1L2Transactions,
  };
};
