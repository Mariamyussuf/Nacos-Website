import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

let db: ReturnType<typeof drizzle> | null = null;
let client: ReturnType<typeof createClient> | null = null;

export function getClient() {
  if (!client) {
    client = createClient({
      url: process.env.TURSO_DATABASE_URL || 'file:local.db',
      authToken: process.env.TURSO_AUTH_TOKEN,
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
