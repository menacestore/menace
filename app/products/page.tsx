import React from 'react';
import { query } from '@/lib/db';
import { formatProduct } from '@/lib/format';
import { ProductCard } from '@/components/ProductCard';
import SortDropdown from './SortDropdown';

export default async function AllProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; sort?: string; minPrice?: string; maxPrice?: string; size?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  
  let sqlQuery = `
    SELECT
      p.id,
      p.name,
      p.description,
      p.price,
      p.category,
      p.featured,
      p.new_arrival AS "newArrival",
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
  `;

  const conditions: string[] = [];
  const params: (string | number)[] = [];
  let paramIndex = 1;

  if (resolvedSearchParams.filter === 'new') {
    conditions.push(`p.new_arrival = true`);
  }

  if (resolvedSearchParams.minPrice) {
    conditions.push(`p.price >= $${paramIndex}`);
    params.push(parseFloat(resolvedSearchParams.minPrice));
    paramIndex++;
  }

  if (resolvedSearchParams.maxPrice) {
    conditions.push(`p.price <= $${paramIndex}`);
    params.push(parseFloat(resolvedSearchParams.maxPrice));
    paramIndex++;
  }

  if (resolvedSearchParams.size) {
    conditions.push(`EXISTS (SELECT 1 FROM product_variants pv2 WHERE pv2.product_id = p.id AND pv2.size = $${paramIndex})`);
    params.push(resolvedSearchParams.size);
    paramIndex++;
  }

  if (conditions.length > 0) {
    sqlQuery += ` WHERE ${conditions.join(' AND ')}`;
  }

  sqlQuery += ` GROUP BY p.id`;

  const sort = resolvedSearchParams.sort;
  if (sort === 'price-asc') sqlQuery += ` ORDER BY p.price ASC`;
  else if (sort === 'price-desc') sqlQuery += ` ORDER BY p.price DESC`;
  else sqlQuery += ` ORDER BY p.created_at DESC`;

  sqlQuery += ` LIMIT 24`;

  const products = await query(sqlQuery, params);

  const formattedProducts = products.map(formatProduct);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-16">
        <h1 className="text-4xl md:text-6xl font-bold font-display mb-4">
          All <span className="italic font-normal">Archive</span>
        </h1>
        <p className="text-gray-500 max-w-xl text-sm leading-relaxed">
          Our complete collection. Every piece engineered for endurance and aesthetics.
        </p>
      </div>

      <div className="flex justify-between items-end mb-12 pb-4 border-b border-black/10">
        <span className="text-[10px] uppercase tracking-widest text-[#1a1a1a] font-bold">{formattedProducts.length} Products</span>
        <SortDropdown defaultSort={sort || 'newest'} />
      </div>

      {formattedProducts.length === 0 ? (
        <div className="text-center py-32">
          <p className="text-[11px] uppercase tracking-[0.15em] text-gray-400 font-medium">No products found</p>
          <p className="text-[10px] text-gray-300 mt-2">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
          {formattedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
