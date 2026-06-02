import { v2 as cloudinary } from 'cloudinary';

if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL,
  });
} else {
  if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
    throw new Error('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set');
  }
  if (!process.env.CLOUDINARY_API_KEY) {
    throw new Error('CLOUDINARY_API_KEY is not set');
  }
  if (!process.env.CLOUDINARY_API_SECRET) {
    throw new Error('CLOUDINARY_API_SECRET is not set');
  }

  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export { cloudinary };

export const CLOUDINARY_FOLDER = 'menace/products';

export function getOptimizedUrl(url: string): string {
  if (!url.includes('cloudinary.com')) return url;

  const parts = url.split('/upload/');
  if (parts.length < 2) return url;

  return `${parts[0]}/upload/f_auto,q_auto,w_800/${parts[1]}`;
}

export function getThumbnailUrl(url: string): string {
  if (!url.includes('cloudinary.com')) return url;

  const parts = url.split('/upload/');
  if (parts.length < 2) return url;

  return `${parts[0]}/upload/f_auto,q_auto,w_400/${parts[1]}`;
}
