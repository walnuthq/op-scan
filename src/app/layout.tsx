import { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/lib/navbar";
import Providers from "@/components/lib/providers";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "OP Scan",
  description: "OP Stack Blockchain Explorer",
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
    <body
      className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable,
      )}
    >
      <Providers>
        <div className="flex min-h-screen w-full flex-col">
          <Navbar />
          {children}
        </div>
      </Providers>
    </body>
  </html>
);

export default RootLayout;
