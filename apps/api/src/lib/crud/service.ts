/** Generic owner scoped CRUD over a Drizzle table. Admins see every row. */

import type { Database } from "@repo/db";
import { and, asc, count, desc, eq, ilike, isNull, type SQL } from "drizzle-orm";
import { notFound } from "../errors";
import type { Actor, CrudListQuery, CrudOptions, OwnedTable } from "./types";

const escapeLike = (value: string) => value.replace(/[\\%_]/g, (char) => `\\${char}`);

export const createCrudService = <T extends OwnedTable, S extends string>(
  db: Database,
  options: CrudOptions<T, S>,
) => {
  type Row = T["$inferSelect"];
  type Insert = T["$inferInsert"];
  const { table, resource } = options;

  const scope = (actor: Actor, ...conditions: (SQL | undefined)[]) =>
    and(
      isNull(table.deletedAt),
      actor.role === "admin" ? undefined : eq(table.ownerId, actor.id),
      ...conditions,
    );

  const filters = (query: CrudListQuery<S>) =>
    Object.entries(options.filterColumns ?? {}).map(([key, column]) =>
      query[key] === undefined ? undefined : eq(column, query[key]),
    );

  const list = async (actor: Actor, query: CrudListQuery<S>) => {
    const search =
      query.search && options.searchColumn
        ? ilike(options.searchColumn, `%${escapeLike(query.search)}%`)
        : undefined;
    const where = scope(actor, search, ...filters(query));
    const direction = query.order === "asc" ? asc : desc;

    const [items, [totals]] = await Promise.all([
      db
        .select()
        .from(table as OwnedTable)
        .where(where)
        .orderBy(direction(options.sortColumns[query.sort]), desc(table.id))
        .limit(query.pageSize)
        .offset((query.page - 1) * query.pageSize),
      db
        .select({ total: count() })
        .from(table as OwnedTable)
        .where(where),
    ]);

    return {
      items: items as Row[],
      total: totals?.total ?? 0,
      page: query.page,
      pageSize: query.pageSize,
    };
  };

  const get = async (actor: Actor, id: string) => {
    const [row] = await db
      .select()
      .from(table as OwnedTable)
      .where(scope(actor, eq(table.id, id)))
      .limit(1);
    if (!row) throw notFound(resource);
    return row as Row;
  };

  const create = async (actor: Actor, values: Omit<Insert, "id" | "ownerId">) => {
    const [row] = await db
      .insert(table)
      .values({ ...values, ownerId: actor.id } as Insert)
      .returning();
    return row as Row;
  };

  const update = async (actor: Actor, id: string, values: Partial<Insert>) => {
    const { id: _id, ownerId: _owner, ...safe } = values as Record<string, unknown>;
    const [row] = await db
      .update(table)
      .set(safe as Partial<Insert>)
      .where(scope(actor, eq(table.id, id)))
      .returning();
    if (!row) throw notFound(resource);
    return row as Row;
  };

  const remove = async (actor: Actor, id: string) => {
    const [row] = await db
      .update(table)
      .set({ deletedAt: new Date() } as Partial<Insert>)
      .where(scope(actor, eq(table.id, id)))
      .returning({ id: table.id });
    if (!row) throw notFound(resource);
  };

  return { list, get, create, update, remove };
};

export type CrudService<T extends OwnedTable, S extends string> = ReturnType<
  typeof createCrudService<T, S>
>;
