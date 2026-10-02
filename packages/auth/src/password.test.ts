import { describe, expect, test } from "bun:test";
import { createPasswordHasher } from "./password";

const key = (fill: number) => Buffer.alloc(32, fill).toString("base64");
const v1 = createPasswordHasher({ peppers: { v1: key(1) }, current: "v1" });
const v2 = createPasswordHasher({ peppers: { v1: key(1), v2: key(2) }, current: "v2" });

describe("password hasher", () => {
  test("hashes with argon2id and the current pepper version", async () => {
    const stored = await v1.hash("correct horse battery staple");
    expect(stored).toStartWith("v1$$argon2id$");
    expect(await v1.verify("correct horse battery staple", stored)).toBe(true);
    expect(await v1.verify("wrong password", stored)).toBe(false);
  });

  test("salts every hash", async () => {
    expect(await v1.hash("same input")).not.toBe(await v1.hash("same input"));
  });

  test("verifies old versions and flags them for rehash", async () => {
    const stored = await v1.hash("rotate me please");
    expect(await v2.verify("rotate me please", stored)).toBe(true);
    expect(v2.needsRehash(stored)).toBe(true);
    expect(v1.needsRehash(stored)).toBe(false);
  });

  test("rejects unknown versions and malformed values", async () => {
    const stored = await v2.hash("unknown version");
    expect(await v1.verify("unknown version", stored)).toBe(false);
    expect(await v1.verify("anything", "not-a-hash")).toBe(false);
  });
});
