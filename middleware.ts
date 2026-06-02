import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

const rateLimits = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string, path: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const key = `${ip}:${path}`;
  const entry = rateLimits.get(key);

  if (!entry || now > entry.resetAt) {
    const windowMs = path === '/login' ? 15 * 60 * 1000 : 60 * 1000;
    const maxRequests = path === '/login' ? 5 : 100;
    rateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  entry.count++;
  const maxRequests = path === '/login' ? 5 : 100;
  if (entry.count > maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: maxRequests - entry.count };
}

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin')) {
    const session = req.auth;
    if (!session?.user) {
      const url = new URL('/login', req.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
    if ((session.user as any).role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  if (pathname.startsWith('/api/') || pathname === '/login') {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const limit = checkRateLimit(ip, pathname);

    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*', '/api/:path*', '/login'],
};
