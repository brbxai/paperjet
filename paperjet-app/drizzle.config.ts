import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DB_CONNECTION_STRING!,
  },
  strict: true,
  verbose: true,
  migrations: {
    prefix: 'timestamp',
  },
});
