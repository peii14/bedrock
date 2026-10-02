/** Project contracts used by the API routes, the OpenAPI spec and the web forms. */

import { z } from "zod";
import { listQuery, listResponse } from "./common";

export const projectStatuses = ["active", "archived"] as const;

export const projectSortable = ["createdAt", "name", "updatedAt"] as const;

export const project = z.object({
  id: z.uuid(),
  ownerId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  status: z.enum(projectStatuses),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const projectCreate = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  description: z.string().trim().max(2000).nullable(),
  status: z.enum(projectStatuses),
});

export const projectUpdate = projectCreate.partial();

export const projectListQuery = listQuery(projectSortable).extend({
  status: z.enum(projectStatuses).optional(),
});

export const projectList = listResponse(project);

export type Project = z.infer<typeof project>;
export type ProjectCreate = z.output<typeof projectCreate>;
export type ProjectUpdate = z.output<typeof projectUpdate>;
export type ProjectListQuery = z.output<typeof projectListQuery>;
export type ProjectStatus = (typeof projectStatuses)[number];
