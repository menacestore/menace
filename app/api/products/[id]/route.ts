import { query } from '@/lib/db';
import { formatProduct } from '@/lib/format';
import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 3600; // 1 hour ISR

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const productQuery = `
    SELECT
      p.id,
      p.name,
      p.description,
      p.price,
      p.category,
      p.featured,
      p.new_arrival AS "newArrival",
      p.created_at AS "createdAt",
      json_agg(
        json_build_object(
          'id', pi.id,
          'url', pi.cloudinary_url,
          'alt', pi.alt_text,
          'sortOrder', pi.sort_order
        ) ORDER BY pi.sort_order
      ) FILTER (WHERE pi.id IS NOT NULL) AS images,
      json_agg(
        json_build_object(
          'id', pv.id,
          'size', pv.size,
          'color', pv.color,
          'colorId', pv.color_id,
          'hex', c.hex,
          'stock', pv.stock
        )
      ) FILTER (WHERE pv.id IS NOT NULL) AS variants
    FROM products p
    LEFT JOIN product_images pi ON pi.product_id = p.id
    LEFT JOIN product_variants pv ON pv.product_id = p.id
    LEFT JOIN colors c ON c.id = pv.color_id
    WHERE p.id = $1
    GROUP BY p.id
  `;

  const products = await query(productQuery, [id]);

  if (products.length === 0) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  const product = products[0];

  const formatted = formatProduct(product);

  return NextResponse.json({ data: formatted });
}
