import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema.js';

let DATABASE_URL;
try {
  const mod = await import('$env/dynamic/private');
  DATABASE_URL = mod.env?.DATABASE_URL;
} catch {
  DATABASE_URL = process.env.DATABASE_URL;
}
if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = createClient({ url: DATABASE_URL });
export const db = drizzle(client, { schema });
