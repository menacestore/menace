import { getOptimizedUrl } from './cloudinary';

export function formatProduct(p: any) {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: parseFloat(p.price),
    category: p.category,
    featured: p.featured,
    newArrival: p.newArrival,
    images: (p.images || [])
    .filter((img: any) => img && img.url)
    .map((img: any) => ({
      ...img,
      url: getOptimizedUrl(img.url),
    })),
    variants: p.variants || [],
  };
}
