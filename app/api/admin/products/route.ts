import { query } from '@/lib/db';
import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { productSchema } from '@/lib/validators';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const validation = productSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ error: 'Invalid product data', details: validation.error.issues }, { status: 400 });
  }

  const { name, description, price, category, featured, newArrival, images, variants } = validation.data;

  const result = await query(
    `INSERT INTO products (name, description, price, category, featured, new_arrival) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    [name, description, price, category, featured || false, newArrival || false]
  );

  const productId = result[0].id;

  if (images && images.length > 0) {
    for (let i = 0; i < images.length; i++) {
      await query(
        `INSERT INTO product_images (product_id, cloudinary_url, alt_text, sort_order) VALUES ($1, $2, $3, $4)`,
        [productId, images[i].url, name, i]
      );
    }
  }

  if (variants && variants.length > 0) {
    for (const v of variants) {
      const colorId = v.colorId || null;
      await query(
        `INSERT INTO product_variants (product_id, size, color, color_id, stock) VALUES ($1, $2, $3, $4, $5)`,
        [productId, v.size, v.color, colorId, v.stock || 0]
      );
    }
  }

  return NextResponse.json({ id: productId, message: 'Product created' });
}
