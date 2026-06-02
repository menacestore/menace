import React from 'react';
import { query } from '@/lib/db';
import { formatProduct } from '@/lib/format';
import { ProductCard } from '@/components/ProductCard';
import SearchClient from './SearchClient';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const searchQuery = resolvedSearchParams.q || '';
  
  let products: any[] = [];
  if (searchQuery) {
    const searchTerm = `%${searchQuery.toLowerCase()}%`;
    products = await query(`
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
            'stock', pv.stock
          )
        ) FILTER (WHERE pv.id IS NOT NULL) AS variants
      FROM products p
      LEFT JOIN product_images pi ON pi.product_id = p.id
      LEFT JOIN product_variants pv ON pv.product_id = p.id
      WHERE
        LOWER(p.name) LIKE $1 OR
        LOWER(p.description) LIKE $1 OR
        LOWER(p.category) LIKE $1 OR
        EXISTS (
          SELECT 1 FROM product_variants pv2
          WHERE pv2.product_id = p.id AND LOWER(pv2.color) LIKE $1
        )
      GROUP BY p.id
      ORDER BY p.created_at DESC
      LIMIT 50
    `, [searchTerm]);
  }

  const formattedProducts = products.map(formatProduct);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SearchClient initialQuery={searchQuery} />

      {searchQuery && (
        <>
          <div className="mb-12 pb-4 border-b border-black/10">
            <span className="text-[10px] uppercase tracking-widest text-[#1a1a1a] font-bold">
              {formattedProducts.length} {formattedProducts.length === 1 ? 'Result' : 'Results'} for &ldquo;{searchQuery}&rdquo;
            </span>
          </div>

          {formattedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
              {formattedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="text-gray-400 text-sm uppercase tracking-widest">No products found matching &ldquo;{searchQuery}&rdquo;</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
