import { type ReactNode } from "react";
import { ThemeProvider } from "@/components/lib/theme-provider";
import ContextProvider from "@/components/lib/context/provider";
import { AddressProvider } from "@/components/lib/context/AddressContext";

const Providers = ({ children }: { children: ReactNode }) => (
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    <ContextProvider>
      <AddressProvider>{children}</AddressProvider>
    </ContextProvider>
  </ThemeProvider>
);

export default Providers;
