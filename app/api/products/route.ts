import { query } from '@/lib/db';
import { formatProduct } from '@/lib/format';
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, unstable_cache } from 'next/cache';

const PAGE_SIZE = 24;

export const revalidate = 3600; // 1 hour ISR

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const category = searchParams.get('category');
  const newArrival = searchParams.get('new');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const size = searchParams.get('size');
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const offset = (page - 1) * PAGE_SIZE;

  const conditions: string[] = [];
  const params: (string | number)[] = [];
  let paramIndex = 1;

  if (category) {
    conditions.push(`p.category = $${paramIndex}`);
    params.push(category);
    paramIndex++;
  }

  if (newArrival === 'true') {
    conditions.push(`p.new_arrival = true`);
  }

  if (minPrice) {
    conditions.push(`p.price >= $${paramIndex}`);
    params.push(parseFloat(minPrice));
    paramIndex++;
  }

  if (maxPrice) {
    conditions.push(`p.price <= $${paramIndex}`);
    params.push(parseFloat(maxPrice));
    paramIndex++;
  }

  if (size) {
    conditions.push(`EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id AND pv.size = $${paramIndex})`);
    params.push(size);
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  let orderBy = 'p.created_at DESC';
  if (sort === 'price-asc') orderBy = 'p.price ASC';
  else if (sort === 'price-desc') orderBy = 'p.price DESC';
  else if (sort === 'newest') orderBy = 'p.created_at DESC';

  const countQuery = `SELECT COUNT(*) FROM products p ${whereClause}`;
  const countResult = await query(countQuery, params);
  const total = parseInt(countResult[0].count, 10);

  const dataQuery = `
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
    ${whereClause}
    GROUP BY p.id
    ORDER BY ${orderBy}
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

  const dataParams = [...params, PAGE_SIZE, offset];
  const products = await query(dataQuery, dataParams);

  const formattedProducts = products.map(formatProduct);

  return NextResponse.json({
    data: formattedProducts,
    meta: {
      page,
      pageSize: PAGE_SIZE,
      total,
      totalPages: Math.ceil(total / PAGE_SIZE),
    },
  });
}
