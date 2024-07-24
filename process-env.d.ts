declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // system
      readonly NODE_ENV: "development" | "production" | "test";
      // private
      readonly DATABASE_URL: string;
      readonly L1_RPC_WSS: string;
      readonly L2_RPC_WSS: string;
      // public
      // L1 chain config
      readonly NEXT_PUBLIC_L1_CHAIN_ID: string;
      readonly NEXT_PUBLIC_L1_NAME: string;
      readonly NEXT_PUBLIC_L1_RPC_URL: string;
      // L2 chain config
      readonly NEXT_PUBLIC_L2_CHAIN_ID: string;
      readonly NEXT_PUBLIC_L2_NAME: string;
      readonly NEXT_PUBLIC_L2_RPC_URL: string;
      // L1 contract addresses for L2
      readonly NEXT_PUBLIC_DISPUTE_GAME_FACTORY_ADDRESS: `0x${string}`;
      readonly NEXT_PUBLIC_L2_OUTPUT_ORACLE_ADDRESS: `0x${string}`;
      readonly NEXT_PUBLIC_OPTIMISM_PORTAL_ADDRESS: `0x${string}`;
      readonly NEXT_PUBLIC_L1_STANDARD_BRIDGE_ADDRESS: `0x${string}`;
      readonly NEXT_PUBLIC_L1_CROSS_DOMAIN_MESSENGER_ADDRESS: `0x${string}`;
      // constants
      readonly NEXT_PUBLIC_BLOCKS_PER_PAGE: string;
      readonly NEXT_PUBLIC_TXS_PER_PAGE: string;
      readonly NEXT_PUBLIC_L1L2TXS_PER_PAGE: string;
    }
  }
}

export {};
