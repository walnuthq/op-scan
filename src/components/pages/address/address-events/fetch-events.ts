import {
  type Address,
  hexToString,
  getAddress,
  type Hash,
  type Hex,
  type Abi,
  type AbiEvent,
  parseAbiItem,
  toEventHash,
} from "viem";
import { prisma, fromPrismaLog } from "@/lib/prisma";
import { loadEvents, loadFunctions } from "@/lib/signatures";
import fetchAccount from "@/lib/fetch-account";
import { eventsPerPage } from "@/lib/constants";
import { l2Chain } from "@/lib/chains";

export type DecodedData = {
  hex: Hex;
  number: bigint;
  text: string;
  address: Address | null;
};

export type Event = {
  logIndex: number;
  transactionHash: Hash;
  blockNumber: bigint;
  timestamp: bigint;
  selector: string;
  signature: string;
  abiEvent: AbiEvent | null;
  topics: [Hex, ...Hex[]] | [];
  data: Hex;
  decodedData: DecodedData[];
};

const decodeData = (data: Hex): DecodedData[] =>
  data
    .slice(2)
    .match(/.{1,64}/g)
    ?.map((hex) => ({
      hex: hex as Hex,
      number: BigInt(`0x${hex}`),
      text: hexToString(`0x${hex}`),
      address: hex.startsWith("000000000000000000000000")
        ? getAddress(`0x${hex.slice(24)}`)
        : null,
    })) ?? [];

const abiEventFromSignature = (signature: string): AbiEvent => {
  const abiItem = parseAbiItem(`event ${signature}`);
  return abiItem as AbiEvent;
};

const findAbiEventFromHash = async (
  abi?: Abi,
  hash?: Hash,
): Promise<AbiEvent | null> => {
  if (abi) {
    // try to find a match from ABI
    const abiEvents = abi.filter(({ type }) => type === "event") as AbiEvent[];
    const abiEventFromAbi = abiEvents.find(
      (abiEvent) => hash === toEventHash(abiEvent),
    );
    if (abiEventFromAbi) {
      return abiEventFromAbi;
    }
  }
  // try to find a match from signature
  const signature = await loadEvents(hash);
  return signature ? abiEventFromSignature(signature) : null;
};

export const fetchEvents = async (address: Address): Promise<Event[]> => {
  const [logs, account] = await Promise.all([
    prisma.log.findMany({
      where: { address, chainId: l2Chain.id },
      include: { receipt: { include: { transaction: true } } },
      orderBy: [
        { blockNumber: "desc" },
        { transactionIndex: "desc" },
        { logIndex: "desc" },
      ],
      take: eventsPerPage,
    }),
    fetchAccount(address),
  ]);
  return Promise.all(
    logs.map(async (prismaLog) => {
      const log = fromPrismaLog(prismaLog);
      const selector = prismaLog.receipt.transaction.input.slice(0, 10);
      const [signature, abiEvent] = await Promise.all([
        loadFunctions(selector),
        findAbiEventFromHash(account.contract?.abi, log.topics[0]),
      ]);
      return {
        logIndex: log.logIndex,
        transactionHash: log.transactionHash,
        blockNumber: log.blockNumber,
        timestamp: prismaLog.receipt.transaction.timestamp,
        selector,
        signature,
        abiEvent,
        topics: log.topics,
        data: log.data,
        decodedData: decodeData(log.data),
      };
    }),
  );
};
