import { Address } from "viem";
import { whatsabi } from "@shazow/whatsabi";
import { l2PublicClient } from "@/lib/chains";

const defaultLoaders = () => {
  const { abiLoader, signatureLookup } = whatsabi.loaders.defaultsWithEnv({
    SOURCIFY_CHAIN_ID: process.env.NEXT_PUBLIC_L2_CHAIN_ID,
    //ETHERSCAN_BASE_URL: process.env.ETHERSCAN_BASE_URL,
    //ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY,
  }) as {
    abiLoader: whatsabi.loaders.ABILoader;
    signatureLookup: whatsabi.loaders.SignatureLookup;
  };
  return { abiLoader, signatureLookup };
};

export const loadFunctions = async (selector: string) => {
  if (selector === "0x") {
    return "";
  }
  const { signatureLookup } = defaultLoaders();
  const signatures = await signatureLookup.loadFunctions(selector);
  return signatures.length > 0 ? signatures[0] : "";
};

export const loadEvents = async (hash?: string) => {
  if (!hash) {
    return "";
  }
  const { signatureLookup } = defaultLoaders();
  const signatures = await signatureLookup.loadEvents(hash);
  return signatures.length > 0 ? signatures[0] : "";
};

export const autoload = (address: Address) =>
  whatsabi.autoload(address, {
    provider: l2PublicClient,
    ...defaultLoaders(),
  });

export const getContract = (address: Address) => {
  const { abiLoader } = defaultLoaders();
  return abiLoader.getContract(address);
};
