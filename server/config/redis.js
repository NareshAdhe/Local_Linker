import { Redis } from "@upstash/redis";

// Use Upstash Redis with REST API
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "https://dynamic-monitor-18235.upstash.io",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

// Test connection (optional, will log on first use)
console.log("✅ Redis client initialized with Upstash REST API");

export default redis;