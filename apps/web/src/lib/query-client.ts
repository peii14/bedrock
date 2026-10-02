/** One QueryClient per request on the server, one per tab in the browser. */

import { isServer, QueryClient } from "@tanstack/react-query";
import { ApiError } from "./api";

const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: (count, error) => !(error instanceof ApiError && error.status < 500) && count < 2,
      },
    },
  });

let browserClient: QueryClient | undefined;

export const getQueryClient = () => {
  if (isServer) return makeQueryClient();
  browserClient ??= makeQueryClient();
  return browserClient;
};
