import { type Address } from "viem";
import { type Metadata } from "@ethereum-sourcify/lib-sourcify";
import { type Contract } from "@/lib/types";

type SourcifyContractFile = {
  name: string;
  path: string;
  content: string;
};

type SourcifyContractFilesResult = {
  status: "partial" | "perfect";
  files: SourcifyContractFile[];
};

const stripPathPrefix = (path: string) =>
  path.replace(
    /^\/contracts\/(full|partial)_match\/\d*\/\w*\/(sources\/)?/,
    "",
  );

export const fetchContract = async (
  address: Address,
): Promise<Contract | null> => {
  const sourcifyBaseUrl = "https://sourcify.dev/server/files/any";
  const url = `${sourcifyBaseUrl}/${process.env.NEXT_PUBLIC_L2_CHAIN_ID}/${address}`;
  const response = await fetch(url, { cache: "force-cache" });
  if (!response.ok) {
    return null;
  }
  const json = await response.json();
  const { status, files } = json as SourcifyContractFilesResult;
  const metadataFile = files.find((f) => f.name === "metadata.json");
  if (!metadataFile) {
    return null;
  }
  const metadata = JSON.parse(metadataFile.content) as Metadata;
  return {
    info: {
      name: metadata.output.devdoc.title ?? "",
      match: status,
      evmVersion: metadata.settings.evmVersion ?? "default",
      compilerVersion: metadata.compiler.version,
      optimizer: metadata.settings.optimizer!,
      license: "",
      language: metadata.language,
    },
    sources: files.map((file) => ({
      path: stripPathPrefix(`/${file.path}`),
      content: file.content,
    })),
    abi: metadata.output.abi,
  };
};
