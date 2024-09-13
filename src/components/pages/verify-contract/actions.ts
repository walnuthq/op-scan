"use server";
import { Address } from "viem";
import { redirect } from "next/navigation";
import { CompilerType, CompilerVersion, EvmVersion } from "@/lib/types";
import {
  JsonInput,
  checkFiles,
  verifyDeployed,
  Status,
} from "@ethereum-sourcify/lib-sourcify";
import { prisma } from "@/lib/prisma";
import { solc, sourcifyChain } from "@/lib/sourcify";

export const submitContractDetails = async ({
  address,
  type,
  version,
}: {
  address: Address;
  type: CompilerType;
  version: CompilerVersion;
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
  version: CompilerVersion;
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
  const [path] = Object.keys(solcJsonInput.sources);
  const contracts = compiled.contracts[path];
  const [contractName] = Object.keys(contracts);
  const sources = Object.keys(solcJsonInput.sources).map((path) => ({
    path: `sources/${path}`,
    content: solcJsonInput.sources[path].content ?? "",
  }));
  sources.push({
    path: "metadata.json",
    content: contracts[contractName].metadata,
  });
  const pathBuffers = sources.map((source) => ({
    path: source.path,
    buffer: Buffer.from(source.content),
  }));
  const [checkedContract] = await checkFiles(solc, pathBuffers);
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
  await prisma.account.upsert({
    where: { address },
    create: accountUpsert,
    update: accountUpsert,
  });
  redirect(`/address/${address}/contract`);
};
