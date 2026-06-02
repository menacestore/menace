import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const settings = await query(`SELECT key, value FROM settings WHERE key IN ('shipping_threshold', 'shipping_cost')`);
  const result: Record<string, number> = {};
  for (const row of settings) {
    result[row.key] = parseFloat(row.value);
  }

  return NextResponse.json({
    shippingThreshold: result.shipping_threshold || 15000,
    shippingCost: result.shipping_cost || 250,
  });
}
