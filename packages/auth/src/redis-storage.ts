/** Better Auth secondary storage on Bun's native Redis client (works with Valkey). */

import type { SecondaryStorage } from "better-auth";
import type { RedisClient } from "bun";

const PREFIX = "auth:";

export const createRedisStorage = (redis: RedisClient): SecondaryStorage => ({
  get: (key) => redis.get(PREFIX + key),
  getAndDelete: (key) => redis.getdel(PREFIX + key),
  set: async (key, value, ttl) => {
    if (ttl) await redis.set(PREFIX + key, value, "EX", ttl);
    else await redis.set(PREFIX + key, value);
  },
  delete: async (key) => {
    await redis.del(PREFIX + key);
  },
  increment: async (key, ttl) => {
    const count = await redis.incr(PREFIX + key);
    if (count === 1) await redis.expire(PREFIX + key, ttl);
    return count;
  },
});
