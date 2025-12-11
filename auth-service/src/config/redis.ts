import Redis from "ioredis";

let redis: any;

// Durante testes, usamos mock para evitar conexão real
if (process.env.NODE_ENV === "test") {
  redis = {
    on: () => {},
    get: async () => null,
    set: async () => "OK",
    del: async () => 1,
  } as any;

} else {
  redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379");

  redis.on("connect", () => {
    console.log("Redis connected");
  });

  redis.on("error", (err: unknown) => {
    console.error("Redis error:", err);
  });
}

export { redis };
