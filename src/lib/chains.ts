import { createPublicClient, http } from "viem";
import { localhost, mainnet, sepolia, optimism } from "viem/chains";

/* export const l1Chain =
  process.env.NODE_ENV !== "production" ? sepolia : mainnet; */

export const l1Chain = mainnet;

/* export const l2Chain =
  process.env.NODE_ENV !== "production" ? localhost : optimism; */

export const l2Chain = optimism;

export const l1PublicClient = createPublicClient({
  chain: l1Chain,
  transport: http(process.env.NEXT_PUBLIC_L1_RPC_URL, {
    batch: true,
    fetchOptions: { cache: "no-store" },
  }),
});

export const l2PublicClient = createPublicClient({
  chain: l2Chain,
  transport: http(process.env.NEXT_PUBLIC_L2_RPC_URL, {
    batch: true,
    fetchOptions: { cache: "no-store" },
  }),
});
