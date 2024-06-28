import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { fromUnixTime, formatDistance } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { formatEther as viemFormatEther, Log, formatUnits } from "viem";
import { BlockWithTransactions, L1L2Transaction } from "@/lib/types";
import { l2PublicClient } from "@/lib/chains";
import { getERC20Contract } from "./contracts/erc-20/contract";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

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