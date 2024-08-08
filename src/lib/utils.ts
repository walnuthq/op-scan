import { type ClassValue, clsx } from "clsx";
import { ABIEventExtended, DecodedArgs } from "@/interfaces";
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
  toHex,
  isHex,
  toBytes,
} from "viem";
import { capitalize } from "lodash";
import { ERC20Transfer, ERC721Transfer, ERC1155Transfer } from "@/lib/types";
import erc20Abi from "@/lib/contracts/erc-20/abi";
import getERC20Contract from "@/lib/contracts/erc-20/contract";
import erc721Abi from "@/lib/contracts/erc-721/abi";
import erc1155Abi from "@/lib/contracts/erc-1155/abi";
import { l2PublicClient } from "@/lib/chains";
import { loadEvents } from "@/lib/signatures";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

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
    originalTimestamp: timestamp,
  };
};

export const formatAddress = (address: Address) =>
  `${address.slice(0, 10)}…${address.slice(-8)}`;

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
    }).map(async ({ transactionHash, logIndex, args, address }) => {
      const contract = getERC20Contract(address);
      const decimals = await contract.read.decimals();
      return {
        transactionHash,
        logIndex,
        address: getAddress(address),
        from: args.from,
        to: args.to,
        value: args.value,
        decimals,
      };
    }),
  );

export const parseERC721Transfers = (logs: Log[]): ERC721Transfer[] =>
  parseEventLogs({
    abi: erc721Abi,
    eventName: "Transfer",
    logs,
  }).map(({ transactionHash, logIndex, args, address }) => ({
    transactionHash,
    logIndex,
    address: getAddress(address),
    from: args.from,
    to: args.to,
    tokenId: args.tokenId,
  }));

export const parseERC1155Transfers = (logs: Log[]): ERC1155Transfer[] => {
  const transfersSingle = parseEventLogs({
    abi: erc1155Abi,
    eventName: "TransferSingle",
    logs,
  }).map(({ transactionHash, logIndex, args, address }) => ({
    transactionHash,
    logIndex,
    address: getAddress(address),
    operator: args.operator,
    from: args.from,
    to: args.to,
    id: args.id,
    value: args.value,
  }));
  const transfersBatch = parseEventLogs({
    abi: erc1155Abi,
    eventName: "TransferBatch",
    logs,
  }).reduce<ERC1155Transfer[]>(
    (previousValue, { transactionHash, logIndex, args, address }) => [
      ...previousValue,
      ...args.ids.map((id, i) => ({
        transactionHash,
        logIndex,
        address: getAddress(address),
        operator: args.operator,
        from: args.from,
        to: args.to,
        id,
        value: args.values[i],
      })),
    ],
    [],
  );
  return [...transfersSingle, ...transfersBatch];
};

const decodeData = (
  data: string,
): { hex: string; number: string; address: string }[] => {
  const decoded: { hex: string; number: string; address: string }[] = [];

  if (!isHex(data)) {
    return [];
  }

  const dataBytes = toBytes(data);

  for (let i = 0; i < dataBytes.length; i += 32) {
    const value = dataBytes.slice(i, i + 32);
    const hexValue = toHex(value);

    let formattedValue: { hex: string; number: string; address: string } = {
      hex: hexValue,
      number: "N/A",
      address: "N/A",
    };

    try {
      const numberValue = BigInt(hexValue);
      formattedValue.number = numberValue.toString();
    } catch (error) {
      console.error(`Error converting hex to number at index ${i}:`, error);
    }

    try {
      if (value.length === 20) {
        const addressValue = getAddress(hexValue);
        formattedValue.address = addressValue;
      } else if (value.length === 32) {
        const addressValue = getAddress(toHex(value.slice(12)));
        formattedValue.address = addressValue;
      }
    } catch (error) {
      console.error(`Error converting hex to address at index ${i}:`, error);
    }

    decoded.push(formattedValue);
  }

  return decoded;
};

export const formatEventLog = async (
  log: Log,
  abi: ABIEventExtended[],
): Promise<{ eventName: string; method: string; args: DecodedArgs }> => {
  const eventFragment = abi.find(
    (item) => item.type === "event" && item.hash === log.topics[0],
  );
  if (!eventFragment) {
    return {
      eventName: "Unknown",
      method: log.topics?.[0]?.slice(0, 10) || "Unknown",
      args: {
        function: "Unknown function",
        topics: log.topics,
        data: log.data,
        decoded: decodeData(log.data),
      },
    };
  }

  const eventSignatures = await loadEvents(log.topics[0] as Address);
  const eventName = eventSignatures.length > 0 ? eventSignatures : "Unknown";

  let methodID = "Unknown";
  if (log.transactionHash) {
    try {
      const transaction = await l2PublicClient.getTransaction({
        hash: log.transactionHash as Address,
      });
      methodID = transaction.input.slice(0, 10);
    } catch (error) {
      console.error(
        `Error fetching transaction for log: ${log.transactionHash}`,
        error,
      );
    }
  }

  const decodedLog: DecodedArgs = {
    function: `${eventName}`,
    topics: log.topics,
    data: log.data,
    decoded: decodeData(log.data),
  };

  return {
    eventName,
    method: methodID,
    args: decodedLog,
  };
};
