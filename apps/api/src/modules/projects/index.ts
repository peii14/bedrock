/** Projects: the example resource, built entirely from the CRUD factory. */

import { projects } from "@repo/db";
import { project, projectCreate, projectListQuery, projectUpdate } from "@repo/validators";
import type { Deps } from "../../deps";
import { createCrud } from "../../lib/crud";

export const projectsModule = ({ db, auth }: Pick<Deps, "db" | "auth">) =>
  createCrud({
    db,
    auth,
    prefix: "/projects",
    tag: "Projects",
    resource: "Project",
    table: projects,
    schemas: {
      item: project,
      create: projectCreate,
      update: projectUpdate,
      query: projectListQuery,
    },
    sortColumns: {
      createdAt: projects.createdAt,
      updatedAt: projects.updatedAt,
      name: projects.name,
    },
    searchColumn: projects.name,
    filterColumns: { status: projects.status },
  });
