"use client";

/** Top progress bar for route changes: starts on internal link clicks or progress router calls, ends when the URL settles. */

import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import { useEffect } from "react";

NProgress.configure({ showSpinner: false, trickleSpeed: 120, minimum: 0.15 });

const isInternalNavigation = (event: MouseEvent) => {
  if (event.defaultPrevented || event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  const anchor = (event.target as Element | null)?.closest("a");
  if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return false;
  const url = new URL(anchor.href, window.location.href);
  return url.origin === window.location.origin && url.href !== window.location.href;
};

export const startProgress = () => NProgress.start();

export const RouteProgress = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const onClick = (event: MouseEvent) => isInternalNavigation(event) && NProgress.start();
    const onPopState = () => NProgress.start();
    document.addEventListener("click", onClick, { capture: true });
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: finishing on every URL change is the point
  useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams]);

  return null;
};
