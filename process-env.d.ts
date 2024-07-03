declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // system
      readonly NODE_ENV: "development" | "production" | "test";
      // private
      readonly LOCAL: string;
      readonly DATABASE_URL: string;
      readonly L1_RPC_WSS: string;
      readonly L2_RPC_WSS: string;
      // public
      readonly NEXT_PUBLIC_DISPUTE_GAME_FACTORY_ADDRESS: `0x${string}`;
      readonly NEXT_PUBLIC_L2_OUTPUT_ORACLE_ADDRESS: `0x${string}`;
      readonly NEXT_PUBLIC_OPTIMISM_PORTAL_ADDRESS: `0x${string}`;
      readonly NEXT_PUBLIC_L1_STANDARD_BRIDGE_ADDRESS: `0x${string}`;
      readonly NEXT_PUBLIC_L1_CROSS_DOMAIN_MESSENGER_ADDRESS: `0x${string}`;
      readonly NEXT_PUBLIC_L1_RPC_URL: string;
      readonly NEXT_PUBLIC_L2_CHAIN_ID: string;
      readonly NEXT_PUBLIC_L2_RPC_URL: string;
    }
  }
}

export {};
