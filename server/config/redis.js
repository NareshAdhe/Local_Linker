import { Redis } from "@upstash/redis";
import IORedis from "ioredis";

const isProduction = process.env.NODE_ENV === "production";

const localRedisConfig = {
  host: process.env.REDIS_HOST || "redis",
  port: Number(process.env.REDIS_PORT) || 6379,

  retryStrategy: (times) => {
    return Math.min(times * 100, 2000);
  },

  reconnectOnError: (err) => {
    console.error("Redis reconnecting due to error:", err.message);
    return true;
  },

  maxRetriesPerRequest: 5,
  enableReadyCheck: true,
};

const redis = isProduction
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : new IORedis(localRedisConfig);

redis.on("connect", () => {
  console.log(`✅ Redis connected (${isProduction ? "Upstash" : "Local/Docker"})`);
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err.message);
});

export default redis;