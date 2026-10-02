import type { ListQuery } from "@repo/validators";
import type { PgColumn, PgTable } from "drizzle-orm/pg-core";

/** Any table the CRUD factory can serve: uuid id, owner column and soft delete. */
export type OwnedTable = PgTable & {
  id: PgColumn;
  ownerId: PgColumn;
  deletedAt: PgColumn;
};

export type Actor = { id: string; role: string };

export type CrudOptions<T extends OwnedTable, S extends string> = {
  resource: string;
  table: T;
  sortColumns: Record<S, PgColumn>;
  searchColumn?: PgColumn;
  filterColumns?: Record<string, PgColumn>;
};

export type CrudListQuery<S extends string> = ListQuery<S> & Record<string, unknown>;
