import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const directUrl = process.env.DATABASE_URL.replace('-pooler.', '.');
const sql = neon(directUrl);

const ADMIN_EMAIL = 'admin@menace.com';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_NAME = 'Admin';

async function seedAdmin() {
  console.log('Seeding admin user...');

  const existing = await sql`SELECT id FROM users WHERE email = ${ADMIN_EMAIL}`;
  if (existing.length > 0) {
    console.log('Admin user already exists. Updating password...');
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await sql`UPDATE users SET password_hash = ${passwordHash}, role = 'admin' WHERE email = ${ADMIN_EMAIL}`;
    console.log('Admin password updated.');
  } else {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await sql`
      INSERT INTO users (email, password_hash, name, role)
      VALUES (${ADMIN_EMAIL}, ${passwordHash}, ${ADMIN_NAME}, 'admin')
    `;
    console.log('Admin user created.');
  }

  console.log('\nAdmin credentials:');
  console.log(`  Email:    ${ADMIN_EMAIL}`);
  console.log(`  Password: ${ADMIN_PASSWORD}`);
  console.log('\nChange the password after first login.');
}

seedAdmin().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
