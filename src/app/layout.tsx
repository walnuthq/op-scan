import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { headers } from "next/headers";
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

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const cookies = headers().get("cookie");
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers cookies={cookies}>
          <div className="flex min-h-screen w-full flex-col">
            <Navbar />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
};

export const dynamic = "force-dynamic";

export default RootLayout;
