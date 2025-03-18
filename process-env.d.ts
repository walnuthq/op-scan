declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // system
      readonly NODE_ENV: "development" | "production" | "test";
      // private
      readonly DATABASE_URL: string;
      readonly CRON_SECRET: string;
      // public
      // L1 chain config
      readonly NEXT_PUBLIC_L1_CHAIN_ID: string;
      readonly NEXT_PUBLIC_L1_NAME: string;
      readonly NEXT_PUBLIC_L1_RPC_URL: string;
      readonly NEXT_PUBLIC_L1_BLOCK_EXPLORER_NAME: string;
      readonly NEXT_PUBLIC_L1_BLOCK_EXPLORER_URL: string;
      // L2 chain config
      readonly NEXT_PUBLIC_L2_CHAIN_ID: string;
      readonly NEXT_PUBLIC_L2_NAME: string;
      readonly NEXT_PUBLIC_L2_RPC_URL: string;
      readonly NEXT_PUBLIC_L2_BLOCK_EXPLORER_NAME: string;
      readonly NEXT_PUBLIC_L2_BLOCK_EXPLORER_URL: string;
      // L1 contract addresses for L2
      readonly NEXT_PUBLIC_OPTIMISM_PORTAL_ADDRESS: `0x${string}`;
      readonly NEXT_PUBLIC_L1_CROSS_DOMAIN_MESSENGER_ADDRESS: `0x${string}`;
      // constants
      readonly NEXT_PUBLIC_L1_BLOCK_TIME?: string;
      readonly NEXT_PUBLIC_L2_BLOCK_TIME?: string;
      readonly NEXT_PUBLIC_BLOCKS_PER_PAGE?: string;
      readonly NEXT_PUBLIC_TXS_PER_PAGE?: string;
      readonly NEXT_PUBLIC_TXS_ENQUEUED_PER_PAGE?: string;
      readonly NEXT_PUBLIC_EVENTS_PER_PAGE?: string;
      readonly NEXT_PUBLIC_TRANSACTIONS_HISTORY_COUNT?: string;
      // metadata
      readonly NEXT_PUBLIC_METADATA_TITLE: string;
      readonly NEXT_PUBLIC_METADATA_DESCRIPTION: string;
      readonly NEXT_PUBLIC_METADATA_URL: string;
      readonly NEXT_PUBLIC_METADATA_ICON: string;
      // fallback rpc urls
      readonly NEXT_PUBLIC_L1_FALLBACK1_RPC_URL?: string;
      readonly NEXT_PUBLIC_L2_FALLBACK1_RPC_URL?: string;
      readonly NEXT_PUBLIC_L1_FALLBACK2_RPC_URL?: string;
      readonly NEXT_PUBLIC_L2_FALLBACK2_RPC_URL?: string;
      readonly NEXT_PUBLIC_L1_FALLBACK3_RPC_URL?: string;
      readonly NEXT_PUBLIC_L2_FALLBACK3_RPC_URL?: string;
      readonly NEXT_PUBLIC_L1_FALLBACK4_RPC_URL?: string;
      readonly NEXT_PUBLIC_L2_FALLBACK4_RPC_URL?: string;
      readonly NEXT_PUBLIC_L1_FALLBACK5_RPC_URL?: string;
      readonly NEXT_PUBLIC_L2_FALLBACK5_RPC_URL?: string;
      // reown
      readonly NEXT_PUBLIC_REOWN_PROJECT_ID: string;
    }
  }
}

export {};
