import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { fromUnixTime, formatDistance } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import {
  formatEther as viemFormatEther,
  formatGwei as viemFormatGwei,
  Log,
  formatUnits,
  Address,
} from "viem";
import { TokenTransfer } from "@/lib/types";
import { getERC20Contract } from "./contracts/erc-20/contract";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatEther = (wei: bigint, precision = 5) =>
  new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: precision,
  }).format(Number(viemFormatEther(wei)));

export const formatGwei = (wei: bigint, precision = 8) =>
  new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: precision,
  }).format(Number(viemFormatGwei(wei)));

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    price,
  );

export const formatPercent = (
  percent: number,
  signDisplay: "auto" | "never" | "always" | "exceptZero" = "auto",
) =>
  new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 2,
    signDisplay,
  }).format(percent);

export const formatTimestamp = (timestamp: bigint) => {
  const timestampDate = fromUnixTime(Number(timestamp));
  return {
    distance: formatDistance(timestampDate, new Date(), {
      includeSeconds: true,
      addSuffix: true,
    }),
    utc: formatInTimeZone(timestampDate, "UTC", "yyyy-dd-MM hh:mm:ss"),
    utcWithTz: formatInTimeZone(
      timestampDate,
      "UTC",
      "MMM-dd-yyyy hh:mm:ss aa +z",
    ),
  };
};

export const formatAddress = (address: Address) =>
  `${address.slice(0, 10)}...${address.slice(-8)}`;

export const formatNumber = (value: bigint) =>
  new Intl.NumberFormat("en-US").format(value);

export const formatGas = (value: bigint, total: bigint = BigInt(1)) => ({
  value: formatNumber(value),
  percentage: (Number(value) / Number(total)) * 100,
  percentageFormatted: formatPercent(Number(value) / Number(total)),
});

const ERC20_TRANSFER_EVENT_TOPIC =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

export const parseTokenTransfers = async (
  logs: Log[],
): Promise<TokenTransfer[]> => {
  const transfers = logs
    .filter((log) => log.topics[0] === ERC20_TRANSFER_EVENT_TOPIC)
    .map((log) => {
      const [, fromTopic, toTopic] = log.topics;
      const from = `0x${fromTopic?.slice(26)}` as Address;
      const to = `0x${toTopic?.slice(26)}` as Address;
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
};
