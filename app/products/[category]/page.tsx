import React from 'react';
import { query } from '@/lib/db';
import { formatProduct } from '@/lib/format';
import { ProductCard } from '@/components/ProductCard';
import { notFound } from 'next/navigation';
import SortDropdown from '../SortDropdown';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return [
    { category: 'shirts' },
    { category: 'accessories' },
  ];
}

const categoryMeta: Record<string, { label: string; heading: string; italic: string; description: string }> = {
  shirts: {
    label: 'Shirts',
    heading: 'Wear Your',
    italic: 'Demons',
    description: 'Definitive tops designed for layering and pure statement.',
  },
  accessories: {
    label: 'Accessories',
    heading: 'Complete',
    italic: 'the Look',
    description: 'Essential accessories to finish your fit.',
  },
};

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const category = resolvedParams.category;

  if (!['shirts', 'accessories'].includes(category)) notFound();

  const meta = categoryMeta[category];

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
    WHERE p.category = $1
    GROUP BY p.id
  `;

  const sort = resolvedSearchParams.sort;
  if (sort === 'price-asc') sqlQuery += ` ORDER BY p.price ASC`;
  else if (sort === 'price-desc') sqlQuery += ` ORDER BY p.price DESC`;
  else sqlQuery += ` ORDER BY p.created_at DESC`;

  const products = await query(sqlQuery, [category]);
  const formattedProducts = products.map(formatProduct);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <span className="text-[10px] uppercase tracking-[0.4em] text-accent">{meta.label}</span>
        <h1 className="mt-3 text-5xl md:text-7xl font-heading uppercase tracking-tight leading-none">
          {meta.heading}{' '}
          <span className="italic font-display font-normal lowercase tracking-normal text-accent">{meta.italic}</span>
        </h1>
        <p className="mt-4 text-zinc-400 max-w-xl text-sm leading-relaxed">{meta.description}</p>
      </div>

      <div className="flex justify-between items-center mb-12 pb-4 border-b border-white/10">
        <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">{formattedProducts.length} Products</span>
        <SortDropdown defaultSort={sort || 'newest'} />
      </div>

      {formattedProducts.length === 0 ? (
        <div className="text-center py-32">
          <p className="text-[11px] uppercase tracking-[0.15em] text-zinc-500 font-medium">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-8 sm:gap-y-16">
          {formattedProducts.map((product) => (
            <ProductCard key={product.id} product={product} variant="dark" />
          ))}
        </div>
      )}
    </div>
  );
}
