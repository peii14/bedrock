import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { treaty } from "@elysiajs/eden";
import { createApp } from "./app";
import { createDeps } from "./deps";

const deps = await createDeps();
const app = await createApp(deps);
const origin = "http://localhost:3000";
let cookie = "";

const client = treaty(app, { headers: () => ({ origin, cookie }) }).api;

beforeAll(async () => {
  const response = await app.handle(
    new Request("http://localhost/api/auth/sign-up/email", {
      method: "POST",
      headers: { origin, "content-type": "application/json" },
      body: JSON.stringify({
        name: "Test",
        email: `test-${Bun.randomUUIDv7()}@example.com`,
        password: "a-strong-test-password",
      }),
    }),
  );
  cookie = response.headers
    .getSetCookie()
    .map((value) => value.split(";")[0])
    .join("; ");
});

afterAll(() => deps.redis.close());

const newProject = { name: "Test project", description: null, status: "active" } as const;

describe("api", () => {
  test("health and readiness", async () => {
    expect((await client.health.get()).status).toBe(200);
    expect((await client.ready.get()).data).toEqual({ database: true, cache: true });
  });

  test("rejects anonymous access with problem details", async () => {
    const response = await app.handle(new Request("http://localhost/api/v1/projects"));
    expect(response.status).toBe(401);
    expect(response.headers.get("content-type")).toContain("application/problem+json");
  });

  test("validates input with field errors", async () => {
    const { status, error } = await client.v1.projects.post({ ...newProject, name: "" });
    expect(status).toBe(422);
    expect(error?.value).toHaveProperty("errors.name");
  });

  test("project lifecycle", async () => {
    const created = await client.v1.projects.post(newProject);
    expect(created.status).toBe(201);
    const id = created.data?.id ?? "";

    const updated = await client.v1.projects({ id }).patch({ status: "archived" });
    expect(updated.data?.status).toBe("archived");

    const list = await client.v1.projects.get({
      query: { page: 1, pageSize: 20, sort: "createdAt", order: "desc", search: "Test" },
    });
    expect(list.data?.items.map((item) => item.id)).toContain(id);

    expect((await client.v1.projects({ id }).delete()).status).toBe(204);
    expect((await client.v1.projects({ id }).get()).status).toBe(404);
  });

  test("whitelists sort columns", async () => {
    const response = await app.handle(
      new Request("http://localhost/api/v1/projects?sort=ownerId", { headers: { cookie } }),
    );
    expect(response.status).toBe(422);
  });
});
