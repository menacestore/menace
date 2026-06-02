import { query } from '@/lib/db';
import { createHash } from 'node:crypto';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export async function checkDbRateLimit(
  key: string,
  { maxRequests, windowMs }: RateLimitConfig
): Promise<{ allowed: boolean; remaining: number }> {
  const now = Date.now();
  const hashedKey = 'rl:' + createHash('sha256').update(key).digest('hex').slice(0, 16);

  // Atomic upsert with read
  const existing = await query(
    `SELECT value FROM settings WHERE key = $1`,
    [hashedKey]
  );

  if (existing.length === 0) {
    const entry = JSON.stringify({ count: 1, resetAt: now + windowMs });
    try {
      await query(
        `INSERT INTO settings (key, value) VALUES ($1, $2)`,
        [hashedKey, entry]
      );
    } catch {
      // Race condition — another instance inserted first; fall through to read it
      const retry = await query(`SELECT value FROM settings WHERE key = $1`, [hashedKey]);
      if (retry.length > 0) {
        return checkEntry(JSON.parse(retry[0].value), maxRequests, now, hashedKey);
      }
    }
    return { allowed: true, remaining: maxRequests - 1 };
  }

  return checkEntry(JSON.parse(existing[0].value), maxRequests, now, hashedKey);
}

async function checkEntry(
  entry: { count: number; resetAt: number },
  maxRequests: number,
  now: number,
  hashedKey: string
): Promise<{ allowed: boolean; remaining: number }> {
  if (now > entry.resetAt) {
    entry.count = 1;
    entry.resetAt = now + windowMs;
    await query(
      `UPDATE settings SET value = $1, updated_at = NOW() WHERE key = $2`,
      [JSON.stringify(entry), hashedKey]
    );
    return { allowed: true, remaining: maxRequests - 1 };
  }

  entry.count++;
  if (entry.count > maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  await query(
    `UPDATE settings SET value = $1, updated_at = NOW() WHERE key = $2`,
    [JSON.stringify(entry), hashedKey]
  );

  return { allowed: true, remaining: maxRequests - entry.count };
}

const windowMs = 60 * 60 * 1000; // 1 hour
