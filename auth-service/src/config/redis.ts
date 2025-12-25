import Redis from "ioredis";

let redis: any;

if (process.env.NODE_ENV === "test") {
  // Mock para testes
  redis = {
    on: () => {},
    get: async () => null,
    set: async () => "OK",
    del: async () => 1,
  } as any;

} else {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    throw new Error("REDIS_URL is not defined");
  }

  redis = new Redis(redisUrl);

  redis.on("connect", () => {
    console.log("Redis connected");
  });

  redis.on("error", (err: unknown) => {
    console.error("Redis error:", err);
  });
}

export { redis };
