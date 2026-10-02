/** Building blocks shared by every resource: ids, list queries and list responses. */

import { z } from "zod";

export const MAX_PAGE_SIZE = 100;
export const DEFAULT_PAGE_SIZE = 20;

export const idParams = z.object({ id: z.uuid() });

/**
 * Builds a list query schema that only accepts whitelisted sort columns,
 * so user input never reaches an ORDER BY it was not meant to.
 */
export const listQuery = <const S extends readonly [string, ...string[]]>(sortable: S) =>
  z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
    sort: z.enum(sortable).default(sortable[0]),
    order: z.enum(["asc", "desc"]).default("desc"),
    search: z.string().trim().max(100).optional(),
  });

export type ListQuery<S extends string = string> = {
  page: number;
  pageSize: number;
  sort: S;
  order: "asc" | "desc";
  search?: string | undefined;
};

export const listResponse = <T extends z.ZodType>(item: T) =>
  z.object({
    items: z.array(item),
    total: z.number().int(),
    page: z.number().int(),
    pageSize: z.number().int(),
  });

export type ListResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export const problemDetails = z.object({
  type: z.string(),
  title: z.string(),
  status: z.number().int(),
  detail: z.string().optional(),
  requestId: z.string().optional(),
  errors: z.record(z.string(), z.array(z.string())).optional(),
});

export type ProblemDetails = z.infer<typeof problemDetails>;
