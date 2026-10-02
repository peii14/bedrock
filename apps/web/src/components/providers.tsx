"use client";

import { Toast } from "@heroui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, Suspense } from "react";
import { getQueryClient } from "@/lib/query-client";
import { RouteProgress } from "./route-progress";

export const Providers = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={getQueryClient()}>
    <Suspense>
      <RouteProgress />
    </Suspense>
    {children}
    <Toast.Provider placement="bottom end" />
  </QueryClientProvider>
);
