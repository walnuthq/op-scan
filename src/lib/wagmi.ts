import { cookieStorage, createStorage } from "wagmi";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { l2Chain, l2Transport } from "@/lib/chains";

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID,
  networks: [l2Chain],
  transports: {
    [l2Chain.id]: l2Transport,
  },
});

export const config = wagmiAdapter.wagmiConfig;
