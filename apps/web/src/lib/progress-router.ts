"use client";

/** Same API as Next's router, but shows the progress bar for programmatic navigation. */

import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { startProgress } from "@/components/route-progress";

const changesUrl = (href: string) =>
  new URL(href, window.location.href).href !== window.location.href;

export const useProgressRouter = () => {
  const router = useRouter();
  return useMemo(
    () => ({
      ...router,
      push: (href: Route, options?: Parameters<typeof router.push>[1]) => {
        if (changesUrl(href)) startProgress();
        router.push(href, options);
      },
      replace: (href: Route, options?: Parameters<typeof router.replace>[1]) => {
        if (changesUrl(href)) startProgress();
        router.replace(href, options);
      },
    }),
    [router],
  );
};
