import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { fromUnixTime, formatDistance } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import {
  formatEther as viemFormatEther,
  Log,
  formatUnits,
  encodeFunctionData,
  keccak256,
  Hash,
  getBlock
} from "viem";
import { L1L2Transaction, MessageArgs } from "@/lib/types";
import { l1PublicClient, l2PublicClient } from "@/lib/chains";
import { getERC20Contract } from "./contracts/erc-20/contract";
import l1CrossDomainMessenger from "./contracts/l1-cross-domain-messenger/contract";
import l2CrossDomainMessenger from "./contracts/l2-cross-domain-messenger/contract";
import l2CrossDomainMessengerAbi from "./contracts/l2-cross-domain-messenger/abi";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

function encodeL1Args(args: MessageArgs): Hash {
  try {
    const { target, sender, message, value, messageNonce, gasLimit } = args;

    const encodedMessage = encodeFunctionData({
      abi: l2CrossDomainMessengerAbi,
      functionName: "relayMessage",
      args: [messageNonce, sender, target, value, gasLimit, message],
    });
    return encodedMessage;
  } catch (error) {
    console.error("Error encoding L1 arguments", error);
    throw error;
  }
}

export const fetchLatestL1L2Transactions = async (): Promise<
  L1L2Transaction[]
> =>
  Array.from({ length: 50 }, (_, i) => i).map((i) => ({
    l1BlockNumber: BigInt(20105119 - i),
    l1Hash:
      "0xc9f6566bfc6ff30a4d97dde51d011c47259268c8b7051f5ef0d23f407aece9a4",
    l2Hash:
      "0x8d721b30143b799d4b207bbea88cbf187862654357e7ddc318d6616f409045ae",
    timestamp: BigInt(Date.now()), // Timestamp example
    l1TxHash: "0xc9f6566bfc6ff30a4d97dde51d011c47259268c8b7051f5ef0d23f407aece9a4",
    l1TxOrigin: "0x8d721b30143b799d4b207bbea88cbf187862654357e7ddc318d6616f409045ae",
    gasLimit: 200000,
  }));

async function fetchL2RelayedMessageLatestLogs(): Promise<any[]> {
  try {
    const latestBlock = await l2PublicClient.getBlock({ blockTag: 'latest' });
    console.log(latestBlock.number);
    const startBlock = latestBlock.number - BigInt(10000);

    const logs = l2CrossDomainMessenger.getEvents.RelayedMessage(undefined, {
      fromBlock: startBlock,
      toBlock: latestBlock.number,
    });

    return logs;
  } catch (error) {
    console.error("Error fetching logs:", error);
    throw error;
  }
}

async function fetchL1SentMessageExtension1LatestLogs(): Promise<any[]> {
  try {
    const latestBlock = await l1PublicClient.getBlock({ blockTag: 'latest' });

    const startBlock = latestBlock.number - BigInt(1000);

    const logs = await l1CrossDomainMessenger.getEvents.SentMessageExtension1(
      undefined,
      {
        fromBlock: startBlock,
        toBlock: latestBlock.number,
      },
    );
    return logs;
  } catch (error) {
    console.error("Error fetching logs:", error);
    throw error;
  }
}

export const searchHashInLogs = async(hash: Hash): Promise<any> => {
  try {
    const logs = await fetchL2RelayedMessageLatestLogs();

    const log = logs.find((log) => log.args.msgHash === hash);

    return log;
  } catch (error) {
    console.error("Error searching for hash in logs:", error);
    throw error;
  }
}

export const calculateHash = async(args: MessageArgs): Promise<Hash> => {
  const encodedMessage = encodeL1Args(args);
  const calculatedHash = keccak256(encodedMessage);

  return calculatedHash;
}

export const messageExtension1ArgsByHash = async(
  transactionHash: Hash,
): Promise<any> => {
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
}

export const fetchL1SentMessageLatestLogs = async (): Promise<any[]> => {
  try {
    const latestBlock = await l1PublicClient.getBlock({ blockTag: 'latest' });

    const startBlock = latestBlock.number - BigInt(1000);

    const logs = await l1CrossDomainMessenger.getEvents.SentMessage(
      undefined,
      {
        fromBlock: startBlock,
        toBlock: latestBlock.number,
      },
    );
    return logs;
  } catch (error) {
    console.error("Error fetching logs:", error);
    throw error;
  }
}

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

export function formatAddress(address: string) {
  return `${address.slice(0, 10)}...${address.slice(-8)}`;
}

const ERC20_TRANSFER_EVENT_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';

export interface TokenTransfer {
  from: string;
  to: string;
  tokenAddress: string;
  amount: string;
  decimals: number;
}

export async function parseTokenTransfers(
  logs: Log[],
): Promise<TokenTransfer[]> {
  const transfers = logs
    .filter((log) => log.topics[0] === ERC20_TRANSFER_EVENT_TOPIC)
    .map((log) => {
      const [, fromTopic, toTopic] = log.topics;
      const from = `0x${fromTopic?.slice(26)}`;
      const to = `0x${toTopic?.slice(26)}`;
      const amount = BigInt(log.data);

      return {
        from,
        to,
        tokenAddress: log.address,
        amount,
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
          decimals,
        };
      } catch (error) {
        console.error(
          `Error processing transfer for ${transfer.tokenAddress}:`,
          error,
        );
        const defaultDecimals = 18;
        return {
          ...transfer,
          amount: formatUnits(transfer.amount, defaultDecimals),
          decimals: defaultDecimals,
        };
      }
    }),
  );
  return transfersWithDecimals;
}
