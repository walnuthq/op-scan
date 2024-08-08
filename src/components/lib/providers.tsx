import { type ReactNode } from "react";
import { ThemeProvider } from "@/components/lib/theme-provider";
import ContextProvider from "@/components/lib/context/provider";

const Providers = ({ children }: { children: ReactNode }) => (
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    <ContextProvider>{children}</ContextProvider>
  </ThemeProvider>
);

export default Providers;
