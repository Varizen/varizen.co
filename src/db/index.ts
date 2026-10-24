import "server-only";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

let pool: Pool | undefined;
export function getDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not configured.");
  pool ??= new Pool({ connectionString, max: 10, ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: true } : undefined, idleTimeoutMillis: 30_000, connectionTimeoutMillis: 5_000 });
  return drizzle(pool, { schema });
}
export async function closeDb() { await pool?.end(); pool = undefined; }
