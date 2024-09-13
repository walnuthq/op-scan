import { Abi, Hex, Address } from "viem";
import { AbiConstructor } from "abitype";
import { ContractSources, Contract } from "@/lib/types";
import { getContract } from "@/lib/whatsabi";
import { whatsabi } from "@shazow/whatsabi";
import { Metadata } from "@ethereum-sourcify/lib-sourcify";

export const getContractMetadata = (bytecode: Hex) => {
  const last2Bytes = bytecode.slice(-4);
  const cborLength = Number(`0x${last2Bytes}`);
  return bytecode.slice(-cborLength * 2 - 4, -4);
};

export const findAbiConstructor = (abi: Abi) => {
  const abiConstructor = abi.find(({ type }) => type === "constructor");
  return abiConstructor ? (abiConstructor as AbiConstructor) : null;
};

const extractMatch = (sources: whatsabi.loaders.ContractSources) => {
  if (sources.length === 0) {
    return null;
  }
  const [source] = sources;
  if (!source.path) {
    return null;
  }
  return source.path.includes("full_match") ? "perfect" : "partial";
};

const cleanSources = (
  sources: whatsabi.loaders.ContractSources,
  name: string,
) =>
  sources.map((source) => ({
    path: source.path
      ? whatsabi.loaders.SourcifyABILoader.stripPathPrefix(`/${source.path}`)
      : `${name}.sol`,
    content: source.content,
  }));

const getMetadata = (sources: ContractSources): Metadata | null => {
  const metadata = sources.find(({ path }) => path.endsWith("metadata.json"));
  return metadata ? JSON.parse(metadata.content) : null;
};

export const fetchContract = async (address: Address): Promise<Contract> => {
  const contract = await getContract(address);
  const rawSources = contract.getSources ? await contract.getSources() : [];
  const match = extractMatch(rawSources);
  const sources = cleanSources(rawSources, contract.name ?? "");
  const metadata = getMetadata(sources);
  return {
    info: {
      name: contract.name ?? "",
      match,
      evmVersion: contract.evmVersion,
      compilerVersion: contract.compilerVersion,
      optimizer:
        metadata && metadata.settings.optimizer
          ? metadata.settings.optimizer
          : { enabled: true, runs: contract.runs },
      license: "",
      language: metadata ? metadata.language : "Solidity",
    },
    sources,
    abi: contract.abi,
  };
};
