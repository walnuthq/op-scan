import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { fromUnixTime, formatDistance, format } from "date-fns";
import { utc } from "@date-fns/utc";
import {
  formatEther as viemFormatEther,
  formatGwei as viemFormatGwei,
  type Address,
  type Hex,
  type TransactionType,
  type Log,
  getAddress,
  parseEventLogs,
  erc20Abi,
  erc721Abi,
  type Abi,
  type Hash,
} from "viem";
import { type AbiConstructor } from "abitype";
import { capitalize } from "lodash";
import { type Erc20Transfer, type NftTransfer } from "@/lib/types";
import erc1155Abi from "@/lib/contracts/erc-1155/abi";
import { l2PublicClient } from "@/lib/chains";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getBlockNumberSafe = async (blockHash: Hash) => {
  try {
    const block = await l2PublicClient.getBlock({
      blockHash,
    });
    return block.number;
  } catch (error) {
    console.error(error);
    return null;
  }
};

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
    utc: format(utc(timestampDate), "MMM-dd-yyyy hh:mm:ss aa"),
  };
};

export const formatAddress = (address: Address) =>
  `${address.slice(0, 10)}…${address.slice(-8)}`;

export const formatNumber = (
  value: number | bigint,
  options?: Intl.NumberFormatOptions,
) => new Intl.NumberFormat("en-US", options).format(value);

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

export const parseErc20Transfers = (logs: Log[]): Erc20Transfer[] =>
  parseEventLogs({
    abi: erc20Abi,
    eventName: "Transfer",
    logs,
  }).map(
    ({
      blockNumber,
      transactionIndex,
      logIndex,
      transactionHash,
      args,
      address,
    }) => ({
      blockNumber,
      transactionIndex,
      logIndex,
      transactionHash,
      address: getAddress(address),
      from: getAddress(args.from),
      to: getAddress(args.to),
      value: args.value,
    }),
  );

export const parseErc721Transfers = (logs: Log[]): NftTransfer[] =>
  parseEventLogs({
    abi: erc721Abi,
    eventName: "Transfer",
    logs,
  }).map(
    ({
      blockNumber,
      transactionIndex,
      logIndex,
      transactionHash,
      args,
      address,
    }) => ({
      blockNumber,
      transactionIndex,
      logIndex,
      transactionHash,
      address: getAddress(address),
      operator: null,
      from: getAddress(args.from),
      to: getAddress(args.to),
      tokenId: args.tokenId,
      value: BigInt(1),
      erc721TokenAddress: getAddress(address),
      erc1155TokenAddress: null,
    }),
  );

export const parseErc1155Transfers = (logs: Log[]): NftTransfer[] => {
  const transfersSingle = parseEventLogs({
    abi: erc1155Abi,
    eventName: "TransferSingle",
    logs,
  }).map(
    ({
      blockNumber,
      transactionIndex,
      logIndex,
      transactionHash,
      args,
      address,
    }) => ({
      blockNumber,
      transactionIndex,
      logIndex,
      transactionHash,
      address: getAddress(address),
      operator: getAddress(args.operator),
      from: getAddress(args.from),
      to: getAddress(args.to),
      tokenId: args.id,
      value: args.value,
      erc721TokenAddress: null,
      erc1155TokenAddress: getAddress(address),
    }),
  );
  const transfersBatch = parseEventLogs({
    abi: erc1155Abi,
    eventName: "TransferBatch",
    logs,
  }).reduce<NftTransfer[]>(
    (
      previousValue,
      {
        blockNumber,
        transactionIndex,
        logIndex,
        transactionHash,
        args,
        address,
      },
    ) => [
      ...previousValue,
      ...args.ids.map((tokenId, index) => ({
        blockNumber,
        transactionIndex,
        logIndex,
        transactionHash,
        address: getAddress(address),
        operator: getAddress(args.operator),
        from: getAddress(args.from),
        to: getAddress(args.to),
        tokenId,
        value: args.values[index] ?? BigInt(0),
        erc721TokenAddress: null,
        erc1155TokenAddress: getAddress(address),
      })),
    ],
    [],
  );
  return [...transfersSingle, ...transfersBatch];
};

export const getContractMetadata = (bytecode: Hex) => {
  const last2Bytes = bytecode.slice(-4);
  const cborLength = Number(`0x${last2Bytes}`);
  return bytecode.slice(-cborLength * 2 - 4, -4);
};

export const findAbiConstructor = (abi: Abi) => {
  const abiConstructor = abi.find(({ type }) => type === "constructor");
  return abiConstructor ? (abiConstructor as AbiConstructor) : null;
};
