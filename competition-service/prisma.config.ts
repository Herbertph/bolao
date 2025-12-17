// prisma/prisma.config.ts
import "dotenv/config";
import path from "path";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  engine: "classic",
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    provider: "postgresql",
    url: env("DATABASE_URL"),
  },
});
