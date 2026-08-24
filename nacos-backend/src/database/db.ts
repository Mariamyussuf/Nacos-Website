import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

let db: ReturnType<typeof drizzle> | null = null;
let client: ReturnType<typeof createClient> | null = null;

export function getClient() {
  if (!client) {
    const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_VERSION);
    const dbUrl =
      process.env.DATABASE_URL ||
      process.env.TURSO_DATABASE_URL ||
      (isVercel ? 'file:/tmp/nacos.db' : 'file:local.db');
    const authToken =
      process.env.DATABASE_AUTH_TOKEN ||
      process.env.TURSO_AUTH_TOKEN;

    client = createClient({
      url: dbUrl,
      authToken: authToken,
    });
  }
  return client;
}

export function getDb() {
  if (!db) {
    db = drizzle(getClient(), { schema });
  }
  return db;
}


export { schema };
