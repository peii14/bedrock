import { describe, expect, test } from "bun:test";
import { MAX_PAGE_SIZE } from "./common";
import { projectListQuery } from "./projects";

describe("listQuery", () => {
  test("applies defaults", () => {
    expect(projectListQuery.parse({})).toEqual({
      page: 1,
      pageSize: 20,
      sort: "createdAt",
      order: "desc",
    });
  });

  test("rejects sort columns outside the whitelist", () => {
    expect(projectListQuery.safeParse({ sort: "password" }).success).toBe(false);
  });

  test("caps the page size", () => {
    expect(projectListQuery.safeParse({ pageSize: MAX_PAGE_SIZE + 1 }).success).toBe(false);
  });
});
