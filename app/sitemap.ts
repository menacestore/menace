import { query } from '@/lib/db';
import { MetadataRoute } from 'next';

const APP_URL = process.env.APP_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await query(`SELECT id, updated_at FROM products ORDER BY updated_at DESC`);

  const productUrls = products.map((p: any) => ({
    url: `${APP_URL}/product/${p.id}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  return [
    { url: APP_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${APP_URL}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${APP_URL}/products/shirts`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${APP_URL}/products/accessories`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${APP_URL}/order/track`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ...productUrls,
  ];
}
