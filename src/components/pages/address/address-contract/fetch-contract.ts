import { Abi, Address, Hex } from "viem";
import { AbiConstructor } from "abitype";
import { getContract } from "@/lib/whatsabi";
import { whatsabi } from "@shazow/whatsabi";

export type ContractInfo = {
  name: string | null;
  evmVersion: string;
  compilerVersion: string;
  optimizer: { enabled: boolean; runs: number };
  license: string;
  language: string;
};

export type ContractSource = { path: string; content: string };

export type ContractSources = ContractSource[];

export type Contract = {
  info: ContractInfo;
  sources: ContractSources;
  abi: Abi;
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

const getMetadata = (sources: ContractSources) => {
  const metadata = sources.find(({ path }) => path.endsWith("metadata.json"));
  if (!metadata) {
    return {
      name: "",
      optimizer: { enabled: false, runs: -1 },
      license: "",
      language: "Solidity",
    };
  }
  const { language, settings } = JSON.parse(metadata.content) as {
    language: string;
    settings: {
      compilationTarget: Record<string, string>;
      optimizer: { enabled: boolean; runs: number };
    };
  };
  const [name] = Object.values(settings.compilationTarget);
  return { name, optimizer: settings.optimizer, license: "", language };
};

export const fetchContract = async (address: Address): Promise<Contract> => {
  const contract = await getContract(address);
  const rawSources = contract.getSources ? await contract.getSources() : [];
  const sources = cleanSources(rawSources, contract.name ?? "");
  const { name, optimizer, license, language } = getMetadata(sources);
  return {
    info: {
      name: contract.name || name,
      evmVersion: contract.evmVersion,
      compilerVersion: contract.compilerVersion,
      optimizer:
        optimizer.runs === -1
          ? { enabled: true, runs: contract.runs }
          : optimizer,
      license,
      language,
    },
    sources,
    abi: contract.abi,
  };
};
