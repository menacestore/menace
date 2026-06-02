import { query } from '@/lib/db';
import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { productSchema } from '@/lib/validators';
import { z } from 'zod';

const uuidParam = z.string().uuid();

export async function GET(
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
    return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
  }

  const products = await query(`
    SELECT p.id, p.name, p.description, p.price, p.category, p.featured, p.new_arrival AS "newArrival"
    FROM products p WHERE p.id = $1
  `, [id]);

  if (products.length === 0) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  const images = await query(
    `SELECT id, cloudinary_url AS url, alt_text AS alt, sort_order AS sortOrder FROM product_images WHERE product_id = $1 ORDER BY sort_order`,
    [id]
  );

  const variants = await query(
    `SELECT pv.id, pv.size, pv.color, pv.color_id AS "colorId", pv.stock, c.hex
     FROM product_variants pv
     LEFT JOIN colors c ON c.id = pv.color_id
     WHERE pv.product_id = $1`,
    [id]
  );

  return NextResponse.json({
    data: {
      ...products[0],
      price: parseFloat(products[0].price),
      images,
      variants,
    },
  });
}

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
    return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
  }

  const body = await request.json();
  const validation = productSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ error: 'Invalid product data', details: validation.error.issues }, { status: 400 });
  }

  const { name, description, price, category, featured, newArrival, images, variants } = validation.data;

  await query(
    `UPDATE products SET name = $1, description = $2, price = $3, category = $4, featured = $5, new_arrival = $6, updated_at = NOW() WHERE id = $7`,
    [name, description, price, category, featured, newArrival, id]
  );

  await query(`DELETE FROM product_images WHERE product_id = $1`, [id]);
  if (images && images.length > 0) {
    for (let i = 0; i < images.length; i++) {
      await query(
        `INSERT INTO product_images (product_id, cloudinary_url, alt_text, sort_order) VALUES ($1, $2, $3, $4)`,
        [id, images[i].url || images[i], name, i]
      );
    }
  }

  await query(`DELETE FROM product_variants WHERE product_id = $1`, [id]);
  if (variants && variants.length > 0) {
    for (const v of variants) {
      const colorId = v.colorId || null;
      await query(
        `INSERT INTO product_variants (product_id, size, color, color_id, stock) VALUES ($1, $2, $3, $4, $5)`,
        [id, v.size, v.color, colorId, v.stock || 0]
      );
    }
  }

  return NextResponse.json({ message: 'Product updated' });
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
    return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
  }

  await query(`DELETE FROM products WHERE id = $1`, [id]);

  return NextResponse.json({ message: 'Product deleted' });
}
