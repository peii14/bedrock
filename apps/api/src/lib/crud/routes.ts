/** One call gives a resource its service and five typed REST routes, documented in OpenAPI from the shared schemas. */

import type { Auth } from "@repo/auth";
import type { Database } from "@repo/db";
import { idParams, listResponse } from "@repo/validators";
import { Elysia } from "elysia";
import type { z } from "zod";
import { authPlugin } from "../../plugins/auth";
import { createCrudService } from "./service";
import type { CrudListQuery, CrudOptions, OwnedTable } from "./types";

type Schemas<I extends z.ZodType, C extends z.ZodType, U extends z.ZodType, Q extends z.ZodType> = {
  item: I;
  create: C;
  update: U;
  query: Q;
};

export type CreateCrudOptions<
  P extends string,
  T extends OwnedTable,
  S extends string,
  I extends z.ZodType,
  C extends z.ZodType,
  U extends z.ZodType,
  Q extends z.ZodType,
> = CrudOptions<T, S> & {
  db: Database;
  auth: Auth;
  prefix: P;
  tag: string;
  schemas: Schemas<I, C, U, Q>;
};

/**
 * Builds the service and its five REST routes from one config.
 * Responses are passed through the item schema, so columns the schema does not
 * declare (owner internals, soft delete markers) never reach the client.
 */
export const createCrud = <
  P extends string,
  T extends OwnedTable,
  S extends string,
  I extends z.ZodType,
  C extends z.ZodType,
  U extends z.ZodType,
  Q extends z.ZodType,
>({
  db,
  auth,
  prefix,
  tag,
  schemas,
  ...options
}: CreateCrudOptions<P, T, S, I, C, U, Q>) => {
  const service = createCrudService(db, options);
  const list = listResponse(schemas.item);
  const toItem = (row: unknown): z.output<I> => schemas.item.parse(row);
  const detail = (summary: string) => ({ tags: [tag], summary });

  return new Elysia({ prefix })
    .use(authPlugin(auth))
    .get(
      "",
      async ({ query, actor }) => {
        const result = await service.list(actor, query as CrudListQuery<S>);
        return { ...result, items: result.items.map(toItem) };
      },
      { auth: true, query: schemas.query, response: { 200: list }, detail: detail(`List ${tag}`) },
    )
    .get("/:id", async ({ params, actor }) => toItem(await service.get(actor, params.id)), {
      auth: true,
      params: idParams,
      response: { 200: schemas.item },
      detail: detail(`Get one of ${tag}`),
    })
    .post(
      "",
      async ({ body, actor, set }) => {
        const row = await service.create(actor, body as Parameters<typeof service.create>[1]);
        set.status = 201;
        return toItem(row);
      },
      {
        auth: true,
        body: schemas.create,
        response: { 201: schemas.item },
        detail: detail(`Create one of ${tag}`),
      },
    )
    .patch(
      "/:id",
      async ({ params, body, actor }) =>
        toItem(
          await service.update(actor, params.id, body as Parameters<typeof service.update>[2]),
        ),
      {
        auth: true,
        params: idParams,
        body: schemas.update,
        response: { 200: schemas.item },
        detail: detail(`Update one of ${tag}`),
      },
    )
    .delete(
      "/:id",
      async ({ params, actor, set }) => {
        await service.remove(actor, params.id);
        set.status = 204;
      },
      { auth: true, params: idParams, detail: detail(`Delete one of ${tag}`) },
    );
};
