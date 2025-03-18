"use server";
import {
  Address,
  Abi,
  AbiFunction,
  AbiEvent,
  toFunctionSignature,
  toFunctionSelector,
  toEventSignature,
  toEventHash,
} from "viem";
import { redirect } from "next/navigation";
import {
  JsonInput,
  checkFilesWithMetadata,
  verifyDeployed,
  Status,
} from "@ethereum-sourcify/lib-sourcify";
import { prisma } from "@/lib/prisma";
import { EvmVersion, CompilerType, SolidityCompilerVersion } from "@/lib/types";
import { solc, vyper, sourcifyChain } from "@/lib/sourcify";

export const submitContractDetails = async ({
  address,
  type,
  version,
}: {
  address: Address;
  type: CompilerType;
  version: SolidityCompilerVersion;
}) =>
  redirect(
    `/verify-contract?address=${address}&type=${type}&version=${encodeURIComponent(version)}`,
  );

const solcJsonInputFromSingleFile = ({
  singleFile,
  optimizerEnabled,
  optimizerRuns,
  evmVersion,
}: {
  singleFile: string;
  optimizerEnabled: "yes" | "no";
  optimizerRuns: number;
  evmVersion: EvmVersion;
}): JsonInput => ({
  language: "Solidity",
  sources: { "Contract.sol": { content: singleFile } },
  settings: {
    optimizer: { enabled: optimizerEnabled === "yes", runs: optimizerRuns },
    metadata: {
      useLiteralContent: false,
      bytecodeHash: "ipfs",
    },
    outputSelection: {
      "*": {
        "*": [
          "abi",
          "evm.bytecode",
          "evm.deployedBytecode",
          "evm.methodIdentifiers",
          "metadata",
        ],
      },
    },
    evmVersion: evmVersion === "default" ? undefined : evmVersion,
    viaIR: false,
  },
});

const solcJsonInputFromStandardJsonInput = (
  standardJsonInput: string,
): JsonInput => JSON.parse(standardJsonInput);

const getSolcJsonInput = ({
  type,
  singleFile,
  optimizerEnabled,
  optimizerRuns,
  evmVersion,
  standardJsonInput,
}: {
  type: CompilerType;
  singleFile: string;
  optimizerEnabled: "yes" | "no";
  optimizerRuns: number;
  evmVersion: EvmVersion;
  standardJsonInput: string;
}): JsonInput => {
  switch (type) {
    case "solidity-single-file": {
      return solcJsonInputFromSingleFile({
        singleFile,
        optimizerEnabled,
        optimizerRuns,
        evmVersion,
      });
    }
    /* case "solidity-multiple-files": {
      return solcJsonInputFromSingleFile({
        singleFile: "",
        optimizerEnabled,
        optimizerRuns,
        evmVersion,
      });
    } */
    default: {
      return solcJsonInputFromStandardJsonInput(standardJsonInput);
    }
  }
};

const isMatch = (status: Status) =>
  status === "partial" || status === "perfect";

const signaturesFromAbi = (abi: Abi) => {
  const abiFunctions = abi.filter(
    ({ type }) => type === "function",
  ) as AbiFunction[];
  const functions = abiFunctions
    .filter((abiFunction) => abiFunction.stateMutability !== "view")
    .map((abiFunction) => ({
      signature: toFunctionSignature(abiFunction),
      hash: toFunctionSelector(abiFunction),
    }));
  const abiEvents = abi.filter(({ type }) => type === "event") as AbiEvent[];
  const events = abiEvents.map((abiEvent) => ({
    signature: toEventSignature(abiEvent),
    hash: toEventHash(abiEvent),
  }));
  return [...functions, ...events];
};

export const verifyContract = async ({
  address,
  type,
  version,
  singleFile,
  standardJsonInput,
  optimizerEnabled,
  optimizerRuns,
  evmVersion,
}: {
  address: Address;
  type: CompilerType;
  version: SolidityCompilerVersion;
  singleFile: string;
  standardJsonInput: string;
  optimizerEnabled: "yes" | "no";
  optimizerRuns: number;
  evmVersion: EvmVersion;
}) => {
  const solcJsonInput = getSolcJsonInput({
    type,
    singleFile,
    standardJsonInput,
    optimizerEnabled,
    optimizerRuns,
    evmVersion,
  });
  const [compiled, account] = await Promise.all([
    solc.compile(version, solcJsonInput, true),
    prisma.account.findUnique({ where: { address } }),
  ]);
  const [firstPath] = Object.keys(solcJsonInput.sources);
  if (!firstPath) {
    throw new Error("No match found");
  }
  const contracts = compiled.contracts[firstPath];
  if (!contracts) {
    throw new Error("No match found");
  }
  const [contractName] = Object.keys(contracts);
  if (!contractName) {
    throw new Error("No match found");
  }
  const sources = Object.keys(solcJsonInput.sources).map((path) => ({
    path: `sources/${path}`,
    content: solcJsonInput.sources[path]?.content ?? "",
  }));
  sources.push({
    path: "metadata.json",
    content: contracts[contractName]?.metadata ?? "",
  });
  const pathBuffers = sources.map((source) => ({
    path: source.path,
    buffer: Buffer.from(source.content),
  }));
  const [checkedContract] = await checkFilesWithMetadata(
    solc,
    vyper,
    pathBuffers,
  );
  if (!checkedContract) {
    throw new Error("No match found");
  }
  const match = await verifyDeployed(
    checkedContract,
    sourcifyChain,
    address,
    account && account.transactionHash ? account.transactionHash : undefined,
    true,
  );
  if (!(isMatch(match.runtimeMatch) || isMatch(match.creationMatch))) {
    throw new Error("No match found");
  }
  const { name, metadata } = checkedContract;
  const contract = {
    info: {
      name,
      match: isMatch(match.runtimeMatch)
        ? match.runtimeMatch
        : isMatch(match.creationMatch)
          ? match.creationMatch
          : null,
      evmVersion: metadata.settings.evmVersion,
      compilerVersion: metadata.compiler.version,
      optimizer: metadata.settings.optimizer,
      license: "",
      language: metadata.language,
    },
    sources,
    abi: metadata.output.abi,
  };
  const accountUpsert = {
    address,
    bytecode: checkedContract.runtimeBytecode,
    contract: JSON.stringify(contract),
  };
  const signatures = signaturesFromAbi(contract.abi);
  await prisma.$transaction([
    prisma.account.upsert({
      where: { address },
      create: accountUpsert,
      update: accountUpsert,
    }),
    ...signatures.map((signature) =>
      prisma.signature.upsert({
        where: { signature: signature.signature },
        create: signature,
        update: signature,
      }),
    ),
  ]);
  redirect(`/address/${address}/contract`);
};
