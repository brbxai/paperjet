import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import config from "../drizzle.config";

const migrationClient = postgres(process.env.DB_CONNECTION_STRING!, { max: 1 });

async function main() {
  if (!config.out) {
    throw new Error("No migrations folder specified in drizzle.config.ts");
  }

  await migrate(drizzle(migrationClient), {
    migrationsFolder: config.out,
  });
}

main()
  .catch((error) => {
    console.error("Migration failed:", error);
  })
  .finally(async () => {
    await migrationClient.end();
  });
