import { query } from '@/lib/db';
import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const uuidParam = z.string().uuid();
const updateSchema = z.object({
  name: z.string().min(1).max(50).transform(s => s.trim()),
  hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color (e.g. #000000)'),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const idValidation = uuidParam.safeParse(id);
  if (!idValidation.success) {
    return NextResponse.json({ error: 'Invalid color ID' }, { status: 400 });
  }

  const body = await request.json();
  const validation = updateSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: 'Invalid color data', details: validation.error.issues }, { status: 400 });
  }

  const { name, hex } = validation.data;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  try {
    const result = await query(
      `UPDATE colors SET name = $1, hex = $2, slug = $3 WHERE id = $4 RETURNING id, name, hex, slug, created_at`,
      [name, hex, slug, id]
    );
    if (result.length === 0) {
      return NextResponse.json({ error: 'Color not found' }, { status: 404 });
    }
    return NextResponse.json({ data: result[0] });
  } catch (err: any) {
    if (err.message?.includes('duplicate key')) {
      return NextResponse.json({ error: 'A color with this name already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update color' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const idValidation = uuidParam.safeParse(id);
  if (!idValidation.success) {
    return NextResponse.json({ error: 'Invalid color ID' }, { status: 400 });
  }

  await query(`UPDATE product_variants SET color_id = NULL WHERE color_id = $1`, [id]);
  await query(`DELETE FROM colors WHERE id = $1`, [id]);

  return NextResponse.json({ message: 'Color deleted' });
}
