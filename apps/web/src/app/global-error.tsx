"use client";

import "@fontsource-variable/inter";
import "@fontsource-variable/red-rose";
import "./globals.css";
import { ServerError } from "@/components/server-error";

/** Catches errors in the root layout itself, so it renders its own html and body. */
const GlobalError = (props: { error: Error & { digest?: string }; reset: () => void }) => (
  <html lang="en">
    <body className="bg-background font-sans text-foreground antialiased">
      <ServerError {...props} fullPage />
    </body>
  </html>
);

export default GlobalError;
