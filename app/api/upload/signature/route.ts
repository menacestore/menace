import { cloudinary } from '@/lib/cloudinary';
import { NextRequest, NextResponse } from 'next/server';
import { checkDbRateLimit } from '@/lib/rate-limit';

const MAX_REQUESTS = 100;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const limit = await checkDbRateLimit(`upload:${ip}`, { maxRequests: MAX_REQUESTS, windowMs: WINDOW_MS });

  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Upload limit reached. Try again later.' },
      { status: 429 }
    );
  }

  const timestamp = Math.round(new Date().getTime() / 1000);

  const paramsToSign = {
    timestamp,
    folder: 'menace/products',
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );

  return NextResponse.json({
    signature,
    timestamp,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    folder: paramsToSign.folder,
  });
}
