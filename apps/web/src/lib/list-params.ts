"use client";

/** Keeps list state (page, sort, search, filters) in the URL, validated by the shared schema. */

import type { Route } from "next";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { z } from "zod";
import { useProgressRouter } from "./progress-router";

export const useListParams = <S extends z.ZodType<Record<string, unknown>>>(schema: S) => {
  const router = useProgressRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = useMemo(
    () => schema.parse(Object.fromEntries(searchParams.entries())) as z.output<S>,
    [schema, searchParams],
  );

  const setParams = useCallback(
    (patch: Partial<Record<string, string | number | undefined>>) => {
      const next = new URLSearchParams(searchParams);
      for (const [key, value] of Object.entries(patch)) {
        if (value === undefined || value === "") next.delete(key);
        else next.set(key, String(value));
      }
      if (!("page" in patch)) next.delete("page");
      router.replace(`${pathname}?${next.toString()}` as Route, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return [params, setParams] as const;
};
