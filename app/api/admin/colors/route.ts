import { query } from '@/lib/db';
import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const createSchema = z.object({
  name: z.string().min(1).max(50).transform(s => s.trim()),
  hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color (e.g. #000000)'),
});

export async function GET() {
  const session = await auth();
  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const colors = await query(
    'SELECT id, name, hex, slug, created_at FROM colors ORDER BY name ASC'
  );

  return NextResponse.json({ data: colors });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const validation = createSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: 'Invalid color data', details: validation.error.issues }, { status: 400 });
  }

  const { name, hex } = validation.data;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  try {
    const result = await query(
      `INSERT INTO colors (name, hex, slug) VALUES ($1, $2, $3) RETURNING id, name, hex, slug, created_at`,
      [name, hex, slug]
    );
    return NextResponse.json({ data: result[0] }, { status: 201 });
  } catch (err: any) {
    if (err.message?.includes('duplicate key')) {
      return NextResponse.json({ error: 'A color with this name already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create color' }, { status: 500 });
  }
}
