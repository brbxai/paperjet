import * as schema from "./schema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export const client = postgres(process.env.DB_CONNECTION_STRING!);
export const db = drizzle(client, { schema, logger: true });
