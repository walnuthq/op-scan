import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/lib/theme-provider";
import Navbar from "@/components/lib/navbar";
import { AddressProvider } from "@/components/lib/context/AddressContext";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "OP Scan",
  description: "OP Stack Blockchain Explorer",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => (
  <html lang="en">
    <AddressProvider>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen w-full flex-col">
            <Navbar />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </AddressProvider>
  </html>
);

export const dynamic = "force-dynamic";

export default RootLayout;
