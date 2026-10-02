import type { Project, ProjectCreate, ProjectListQuery, ProjectUpdate } from "@repo/validators";
import { type Api, api, unwrap } from "@/lib/api";
import { createResource } from "@/lib/resource";

export const createProjectsResource = (client: Api) =>
  createResource<Project, ProjectListQuery, ProjectCreate, ProjectUpdate>("projects", {
    list: (query) => unwrap(client.v1.projects.get({ query })),
    get: (id) => unwrap(client.v1.projects({ id }).get()),
    create: (body) => unwrap(client.v1.projects.post(body)),
    update: (id, body) => unwrap(client.v1.projects({ id }).patch(body)),
    remove: (id) => unwrap(client.v1.projects({ id }).delete()),
  });

export const projectsResource = createProjectsResource(api);
