import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

// Use direct connection (not pooled) for reliable DDL support
const directUrl = process.env.DATABASE_URL.replace('-pooler.', '.');
const sql = neon(directUrl);

export async function query<T = any>(text: string, params?: unknown[]): Promise<T[]> {
  const res = await (sql as any).query(text, params || []);
  return Array.isArray(res) ? res : (res.rows || []);
}

export { sql };
