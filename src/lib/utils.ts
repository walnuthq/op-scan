import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { fromUnixTime, formatDistance } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import {
  formatEther as viemFormatEther,
  formatGwei as viemFormatGwei,
  Address,
  Hex,
  TransactionType,
  Log,
  getAddress,
  parseEventLogs,
} from "viem";
import { capitalize } from "lodash";
import erc20Abi from "@/lib/contracts/erc-20/abi";
import { getERC20Contract } from "@/lib/contracts/erc-20/contract";
import { ERC20Transfer } from "@/lib/types";

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

export const formatTransactionType = (type: TransactionType, typeHex: Hex) => {
  const typeString = type.startsWith("eip")
    ? `EIP-${type.slice(3)}`
    : capitalize(type);
  return `${Number(typeHex)} (${typeString})`;
};

export const parseERC20Transfers = (logs: Log[]): Promise<ERC20Transfer[]> =>
  Promise.all(
    parseEventLogs({
      abi: erc20Abi,
      eventName: "Transfer",
      logs,
    }).map(async ({ transactionHash, logIndex, args, address, data }) => {
      const contract = getERC20Contract(address);
      const decimals = await contract.read.decimals();
      return {
        transactionHash,
        logIndex,
        from: args.from,
        to: args.to,
        address: getAddress(address),
        amount: BigInt(data),
        decimals,
      };
    }),
  );
