import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import { formatProduct } from '@/lib/format';
import ProductDetailClient from './ProductDetailClient';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const products = await query(`SELECT name, description FROM products WHERE id = $1`, [id]);
  
  if (products.length === 0) return { title: 'Product Not Found' };

  const product = products[0];
  return {
    title: `${product.name} | MENACE`,
    description: product.description,
  };
}

function generateJsonLd(product: any) {
  const APP_URL = process.env.APP_URL || 'http://localhost:3000';
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images?.map((img: any) => img.url) || [],
    sku: product.id,
    category: product.category,
    offers: {
      '@type': 'Offer',
      price: parseFloat(product.price),
      priceCurrency: 'PKR',
      availability: product.variants?.some((v: any) => v.stock > 0)
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${APP_URL}/product/${product.id}`,
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const products = await query(`
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
    WHERE p.id = $1
    GROUP BY p.id
  `, [id]);

  if (products.length === 0) {
    return notFound();
  }

  const product = products[0];

  const relatedProducts = await query(`
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
    WHERE p.category = $1 AND p.id != $2
    GROUP BY p.id
    ORDER BY p.created_at DESC
    LIMIT 5
  `, [product.category, id]);

  const formattedProduct = formatProduct(product);
  const formattedRelated = relatedProducts.map(formatProduct);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateJsonLd(product)) }}
      />
      <ProductDetailClient product={formattedProduct} relatedProducts={formattedRelated} />
    </>
  );
}
