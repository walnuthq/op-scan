import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { fromUnixTime, formatDistance } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { formatEther as viemFormatEther, Log, formatUnits, encodeFunctionData, keccak256, Hash} from "viem";
import { BlockWithTransactions, L1L2Transaction, MessageArgs} from "@/lib/types";
import { l1PublicClient, l2PublicClient } from "@/lib/chains";
import { getERC20Contract } from "./contracts/erc-20/contract";
import l1CrossDomainMessenger from "./contracts/l1-cross-domain-messenger/contract";
import l2CrossDomainMessenger from "./contracts/l2-cross-domain-messenger/contract";
import l2CrossDomainMessengerAbi from "./contracts/l2-cross-domain-messenger/abi";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

function encodeL1Args(args: MessageArgs): Hash {
  const { target, sender, message, value, messageNonce, gasLimit } = args;

  const encodedMessage = encodeFunctionData({
    abi: l2CrossDomainMessengerAbi,
    functionName: "relayMessage",
    args: [messageNonce, sender, target, value, gasLimit, message],
  });

  return encodedMessage;
}

async function searchHashInLogs(hash: Hash): Promise<any | null> {
  try {
    const logs = await fetchL2RelayedMessageLatestLogs();

    const log = logs.find(log => log.args.msgHash === hash);

    return log;
  } catch (error) {
    console.error("Error searching for hash in logs:", error);
    throw error;
  }
};

async function calculateHash(args: MessageArgs): Promise<Hash> {
  const encodedMessage = encodeL1Args(args);
  const calculatedHash = keccak256(encodedMessage);

  return calculatedHash;
};

export const searchHashMsg = async (): Promise<L1L2Transaction[]> => {
  try {
    const sentMessageLogs = await fetchL1SentMessageLatestLogs();
    const l1l2LatestTransacions: any[] = [];

    for (const log of sentMessageLogs) {
      let messageValue = await messageExtension1ArgsByHash(log.transactionHash);
      let args: MessageArgs = {
        target: log.args.target,
        sender: log.args.sender,
        message: log.args.message,
        messageNonce: log.args.messageNonce,
        value: messageValue,
        gasLimit: log.args.gasLimit,
      };
      let calculatedHash = await calculateHash(args);
      let l2Message = await searchHashInLogs(calculatedHash);

      if (l2Message) {
        let transaction: L1L2Transaction = {
          l1BlockNumber: log.blockNumber,
          l1Hash: log.transactionHash, 
          l2Hash: l2Message.transactionHash  
        };
        l1l2LatestTransacions.push(transaction);
      }

    }
    return l1l2LatestTransacions;
  } catch (error) {
    console.error("Error fetching or matching logs:", error);
    throw error;
  }
};

async function messageExtension1ArgsByHash(transactionHash: Hash): Promise<any> {
  try {
    const sentMessageExtension1Logs =
      await fetchL1SentMessageExtension1LatestLogs();

    const matchedLog = sentMessageExtension1Logs.find(
      (log) => log.transactionHash === transactionHash,
    );

    if (!matchedLog) {
      console.error(`No log found with transactionHash: ${transactionHash}`);
      return null;
    }

    return matchedLog.args.value;
  } catch (error) {
    console.error("Error fetching or matching logs:", error);
    throw error;
  }
};

async function fetchL2RelayedMessageLatestLogs(): Promise<any[]> {
  try {
    const latestBlock = await l2PublicClient.getBlockNumber();

    const startBlock = latestBlock - BigInt(1000);

    const logs = l2CrossDomainMessenger.getEvents.RelayedMessage(undefined, {
      fromBlock: startBlock,
      toBlock: latestBlock,
    });

    return logs;
  } catch (error) {
    console.error("Error fetching logs:", error);
    throw error;
  }
};

async function fetchL1SentMessageExtension1LatestLogs(): Promise<any[]> {
  try {
    const latestBlock = await l1PublicClient.getBlockNumber();

    const startBlock = latestBlock - BigInt(1000);

    const logs = await l1CrossDomainMessenger.getEvents.SentMessageExtension1(
      undefined,
      {
        fromBlock: startBlock,
        toBlock: latestBlock,
      },
    );
    return logs;
  } catch (error) {
    console.error("Error fetching logs:", error);
    throw error;
  }
};

async function fetchL1SentMessageLatestLogs(): Promise<any[]> {
  try {
    const latestBlock = await l1PublicClient.getBlockNumber();

    const startBlock = latestBlock - BigInt(1000);

    const logs = await l1CrossDomainMessenger.getEvents.SentMessage(undefined, {
      fromBlock: startBlock,
      toBlock: latestBlock,
    });
    return logs;
  } catch (error) {
    console.error("Error fetching logs:", error);
    throw error;
  }
};

export const fetchL2LatestBlocks = async (): Promise<
  BlockWithTransactions[]
> => {
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
  return blocks.map(({ number, hash, timestamp, transactions }) => ({
    number,
    hash,
    timestamp,
    transactions: transactions.map(
      ({ hash, blockNumber, from, to, value }) => ({
        hash,
        blockNumber,
        from,
        to,
        value,
        timestamp,
      }),
    ),
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

export const fetchLatestL1L2Transactions = async (): Promise<
  L1L2Transaction[]
> =>
  Array.from({ length: 6 }, (_, i) => i).map((i) => ({
    l1BlockNumber: BigInt(20105119 - i),
    l1Hash: "0xte",
    l2Hash: "0xteteo",
  }));

export const formatEther = (ether: bigint, precision = 5) =>
  new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: precision,
  }).format(Number(viemFormatEther(ether)));

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    price,
  );

export const formatPercent = (percent: number) =>
  new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumSignificantDigits: 3,
    signDisplay: "always",
  }).format(percent);

export const formatTimestamp = (timestamp: bigint, withDate = true) => {
  const timestampDate = fromUnixTime(Number(timestamp));
  const timestampDistance = formatDistance(timestampDate, new Date(), {
    includeSeconds: true,
    addSuffix: true,
  });
  const timestampDateFormatted = formatInTimeZone(
    timestampDate,
    "UTC",
    "MMM-dd-yyyy hh:mm:ss aa +z",
  );
  return withDate
    ? `${timestampDistance} (${timestampDateFormatted})`
    : timestampDistance;
};


const ERC20_TRANSFER_EVENT_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';

export interface TokenTransfer {
  from: string;
  to: string;
  tokenAddress: string;
  amount: string;  
  decimals: number;
}

export async function parseTokenTransfers(logs: Log[]): Promise<TokenTransfer[]> {
  const transfers = logs
    .filter(log => log.topics[0] === ERC20_TRANSFER_EVENT_TOPIC)
    .map(log => {
      const [, fromTopic, toTopic] = log.topics;
      const from = `0x${fromTopic?.slice(26)}`;
      const to = `0x${toTopic?.slice(26)}`;
      const amount = BigInt(log.data);
      
      return {
        from,
        to,
        tokenAddress: log.address,
        amount
      };
    });

  const transfersWithDecimals = await Promise.all(
    transfers.map(async (transfer) => {
      try {
        const contract = getERC20Contract(transfer.tokenAddress);
        const decimals = await contract.read.decimals();
        const formattedAmount = formatUnits(transfer.amount, decimals);
        return { 
          ...transfer, 
          amount: formattedAmount,  
          decimals 
        };
      } catch (error) {
        console.error(`Error processing transfer for ${transfer.tokenAddress}:`, error);
        const defaultDecimals = 18;
        return { 
          ...transfer, 
          amount: formatUnits(transfer.amount, defaultDecimals),
          decimals: defaultDecimals 
        };
      }
    })
  );
  return transfersWithDecimals;
}