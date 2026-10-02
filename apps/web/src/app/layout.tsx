import type { Metadata } from "next";
import { connection } from "next/server";
import type { ReactNode } from "react";
import { Providers } from "@/components/providers";
import "@fontsource-variable/inter";
import "@fontsource-variable/red-rose";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Starter", template: "%s · Starter" },
  description: "Fullstack Bun starter",
};

/** Every page renders per request so the CSP nonce from `proxy.ts` reaches Next's scripts. */
const RootLayout = async ({ children }: { children: ReactNode }) => {
  await connection();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background font-sans text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
