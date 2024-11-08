"use client";
import { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { wagmiAdapter, config } from "@/lib/wagmi";
import { ThemeProvider } from "@/components/lib/theme-provider";
import ContextProvider from "@/components/lib/context/provider";
import { l2Chain } from "@/lib/chains";

const queryClient = new QueryClient();

export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID,
  networks: [l2Chain],
  metadata: {
    name: "op-scan",
    description: "op-scan",
    url: "https://www.opscan.co/",
    icons: ["https://www.opscan.co/img/logo.png"],
  },
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "hsl(var(--destructive))",
  },
});

const Providers = ({ children }: { children: ReactNode }) => (
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ContextProvider>{children}</ContextProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </ThemeProvider>
);

export default Providers;
