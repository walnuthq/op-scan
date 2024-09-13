import { Address } from "viem";
import { whatsabi } from "@shazow/whatsabi";
import { l2PublicClient } from "@/lib/chains";

const defaultLoaders = () => {
  const abiLoader = new whatsabi.loaders.SourcifyABILoader({
    chainId: Number(process.env.NEXT_PUBLIC_L2_CHAIN_ID),
  });
  const signatureLookup = new whatsabi.loaders.MultiSignatureLookup([
    new whatsabi.loaders.OpenChainSignatureLookup(),
    new whatsabi.loaders.FourByteSignatureLookup(),
  ]);
  return { abiLoader, signatureLookup };
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
