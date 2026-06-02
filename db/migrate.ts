import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

// Use direct connection (not pooled) for DDL statements
const directUrl = process.env.DATABASE_URL.replace('-pooler.', '.');
const sql = neon(directUrl);
const migrationsDir = join(process.cwd(), 'db', 'migrations');

async function runMigrations() {
  console.log('Running migrations...');

  // Ensure migrations table exists
  await sql`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  const files = readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const existing = await sql`SELECT 1 FROM migrations WHERE name = ${file}`;

    if (existing.length > 0) {
      console.log(`  ✓ ${file} (already applied)`);
      continue;
    }

    const filePath = join(migrationsDir, file);
    const migrationSql = readFileSync(filePath, 'utf-8');

    // Split by semicolons, strip comments, execute each statement using template syntax
    const statements = migrationSql
      .split(';')
      .map(s => s.replace(/--.*$/gm, '').trim())
      .filter(s => s.length > 0);

    for (const stmt of statements) {
      // Use sql.query for raw SQL statements
      await (sql as any).query(stmt);
    }

    await sql`INSERT INTO migrations (name) VALUES (${file})`;

    console.log(`  ✓ ${file} (applied)`);
  }

  console.log('All migrations complete.');
}

runMigrations().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
