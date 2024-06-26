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
      readonly NEXT_PUBLIC_L1_CROSS_DOMAIN_MESSENGER_ADDRESS?: `0x${string}`;
      readonly NEXT_PUBLIC_L1_RPC_URL: string;
      readonly NEXT_PUBLIC_L2_RPC_URL: string;
    }
  }
}

export {};
