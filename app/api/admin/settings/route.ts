import { query } from '@/lib/db';
import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { settingsSchema } from '@/lib/validators';

export async function GET() {
  const session = await auth();
  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const settings = await query(`SELECT key, value FROM settings WHERE key IN ('shipping_threshold', 'shipping_cost')`);
  const result: Record<string, string> = {};
  for (const row of settings) {
    result[row.key] = row.value;
  }

  return NextResponse.json(result);
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const validation = settingsSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ error: 'Invalid settings data', details: validation.error.issues }, { status: 400 });
  }

  const { shipping_threshold, shipping_cost } = validation.data;

  await query(`UPDATE settings SET value = $1, updated_at = NOW() WHERE key = 'shipping_threshold'`, [String(shipping_threshold)]);
  await query(`UPDATE settings SET value = $1, updated_at = NOW() WHERE key = 'shipping_cost'`, [String(shipping_cost)]);

  return NextResponse.json({ message: 'Settings updated' });
}
