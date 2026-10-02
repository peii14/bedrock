import type { ReactNode } from "react";

/** Used by route `template.tsx` files: they remount on every navigation, so each page eases in. */
export const PageTransition = ({ children }: { children: ReactNode }) => (
  <div className="animate-enter">{children}</div>
);
