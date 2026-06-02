import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const directUrl = process.env.DATABASE_URL!.replace('-pooler.', '.');
const sql = neon(directUrl);

async function checkTables() {
  const tables = await sql`
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name
  `;
  console.log('Tables in database:');
  tables.forEach((t: any) => console.log(`  - ${t.table_name}`));
}

checkTables().catch(console.error);
