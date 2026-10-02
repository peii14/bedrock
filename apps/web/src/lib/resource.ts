/** Query keys and query options for a CRUD resource. Safe to use on the server for prefetching. */

import type { ListResponse } from "@repo/validators";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";

export type ResourceEndpoints<TItem, TQuery, TCreate, TUpdate> = {
  list: (query: TQuery) => Promise<ListResponse<TItem>>;
  get: (id: string) => Promise<TItem>;
  create: (body: TCreate) => Promise<TItem>;
  update: (id: string, body: TUpdate) => Promise<TItem>;
  remove: (id: string) => Promise<unknown>;
};

export const createResource = <TItem, TQuery, TCreate, TUpdate>(
  name: string,
  endpoints: ResourceEndpoints<TItem, TQuery, TCreate, TUpdate>,
) => {
  const keys = {
    all: [name] as const,
    list: (query: TQuery) => [name, "list", query] as const,
    detail: (id: string) => [name, "detail", id] as const,
  };

  return {
    name,
    keys,
    endpoints,
    list: (query: TQuery) =>
      queryOptions({
        queryKey: keys.list(query),
        queryFn: () => endpoints.list(query),
        placeholderData: keepPreviousData,
      }),
    detail: (id: string) =>
      queryOptions({ queryKey: keys.detail(id), queryFn: () => endpoints.get(id) }),
  };
};

export type Resource<TItem, TQuery, TCreate, TUpdate> = ReturnType<
  typeof createResource<TItem, TQuery, TCreate, TUpdate>
>;
