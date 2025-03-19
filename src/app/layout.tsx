import { ReactNode } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/lib/navbar";
import Providers from "@/components/lib/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_METADATA_TITLE,
  description: process.env.NEXT_PUBLIC_METADATA_DESCRIPTION,
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="en" suppressHydrationWarning>
    <body
      className={cn(
        "bg-background overscroll-none font-sans antialiased",
        geistSans.variable,
        geistMono.variable,
      )}
    >
      <Providers>
        <div className="flex w-full flex-col">
          <Navbar />
          {children}
        </div>
      </Providers>
    </body>
  </html>
);

export default RootLayout;
