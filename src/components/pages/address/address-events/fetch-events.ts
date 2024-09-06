import {
  Address,
  hexToString,
  getAddress,
  Hash,
  Hex,
  AbiEvent,
  parseAbiItem,
  toEventHash,
} from "viem";
import { AutoloadResult } from "@shazow/whatsabi";
import { autoload } from "@/lib/whatsabi";
import { prisma, fromPrismaLog } from "@/lib/prisma";
import { loadEvents, loadFunctions } from "@/lib/signatures";

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
  autoloadResult: AutoloadResult,
  hash?: Hash,
): Promise<AbiEvent | null> => {
  // if the hash is present in the ABIEvent then it was loaded from bytecode
  const abiEventFromBytecode = autoloadResult.abi
    .filter(({ type }) => type === "event")
    .find((abiItem) => (abiItem as { hash: string }).hash === hash);
  if (abiEventFromBytecode && abiEventFromBytecode.sig) {
    return abiEventFromSignature(abiEventFromBytecode.sig);
  }
  // try to find a match from ABI
  const abiEvents = autoloadResult.abi.filter(
    ({ type }) => type === "event",
  ) as unknown as AbiEvent[];
  const abiEventFromAbi = abiEvents.find(
    (abiEvent) => hash === toEventHash(abiEvent),
  );
  if (abiEventFromAbi) {
    return abiEventFromAbi;
  }
  // try to find a match from signature
  const signature = await loadEvents(hash);
  return signature ? abiEventFromSignature(signature) : null;
};

export const fetchEvents = async (address: Address): Promise<Event[]> => {
  const [logs, autoloadResult] = await Promise.all([
    prisma.log.findMany({
      where: { address },
      include: { transaction: true },
      orderBy: [
        { blockNumber: "desc" },
        { transactionIndex: "desc" },
        { logIndex: "desc" },
      ],
      take: Number(process.env.NEXT_PUBLIC_EVENTS_PER_PAGE),
    }),
    autoload(address),
  ]);
  return Promise.all(
    logs.map(async (prismaLog) => {
      const log = fromPrismaLog(prismaLog);
      const selector = prismaLog.transaction.input.slice(0, 10);
      const [signature, abiEvent] = await Promise.all([
        loadFunctions(selector),
        findAbiEventFromHash(autoloadResult, log.topics[0]),
      ]);
      return {
        logIndex: log.logIndex,
        transactionHash: log.transactionHash,
        blockNumber: log.blockNumber,
        timestamp: prismaLog.transaction.timestamp,
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
