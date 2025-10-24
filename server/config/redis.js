import { Redis } from "@upstash/redis";
import IORedis from "ioredis";

// Use local Redis for development, Upstash for production
const redis =
  process.env.NODE_ENV === "production"
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : new IORedis({
        host: process.env.REDIS_HOST || "localhost",
        port: process.env.REDIS_PORT || 6379,
      });

if (process.env.NODE_ENV === "production") {
  console.log("✅ Redis client initialized with Upstash REST API");
} else {
  redis.on("connect", () => {
    console.log("✅ Connected to local Redis");
  });
  redis.on("error", (err) => {
    console.error("❌ Local Redis connection error:", err);
  });
}

export default redis;