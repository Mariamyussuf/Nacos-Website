import { Request, Response, NextFunction } from 'express';

// ─── Security Headers (HSTS, NoSniff, Clickjacking Defense) ─────────────────

export function securityHeadersMiddleware(
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  // Enforce HTTPS via HSTS (1 year + includeSubDomains + preload)
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload',
  );

  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Prevent Clickjacking by disallowing framing
  res.setHeader('X-Frame-Options', 'DENY');

  // Legacy XSS filter protection
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Strict Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Restrict unused browser device APIs
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()',
  );

  // Hide server fingerprint
  res.removeHeader('X-Powered-By');

  next();
}

// ─── Sliding-Window Request Throttling & DDoS Defense ────────────────────────

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const generalRateLimitStore = new Map<string, RateLimitEntry>();
const sensitiveRateLimitStore = new Map<string, RateLimitEntry>();

// Sensitive endpoints with stricter limits
const SENSITIVE_PATH_PATTERNS = [
  /\/api\/auth\/login/i,
  /\/api\/forms\/[^/]+\/submit/i,
  /\/api\/subscribe/i,
  /\/api\/contact/i,
  /\/api\/newsletter\/send/i,
];

export function apiRateLimitMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.ip ||
    req.socket.remoteAddress ||
    'unknown';

  const now = Date.now();
  const path = req.originalUrl || req.url;

  const isSensitive = SENSITIVE_PATH_PATTERNS.some((pattern) =>
    pattern.test(path),
  );

  const windowMs = 60 * 1000; // 1 minute window
  const maxLimit = isSensitive ? 20 : 150; // 20 req/min for sensitive, 150 for general
  const store = isSensitive ? sensitiveRateLimitStore : generalRateLimitStore;

  const entry = store.get(ip) || { count: 0, resetAt: now + windowMs };

  // If window has passed, reset counter
  if (now > entry.resetAt) {
    entry.count = 1;
    entry.resetAt = now + windowMs;
  } else {
    entry.count += 1;
  }

  store.set(ip, entry);

  // Set rate limit headers
  const remaining = Math.max(0, maxLimit - entry.count);
  const resetSecs = Math.ceil((entry.resetAt - now) / 1000);

  res.setHeader('X-RateLimit-Limit', maxLimit.toString());
  res.setHeader('X-RateLimit-Remaining', remaining.toString());
  res.setHeader('X-RateLimit-Reset', resetSecs.toString());

  if (entry.count > maxLimit) {
    res.setHeader('Retry-After', resetSecs.toString());
    res.status(429).json({
      statusCode: 429,
      error: 'Too Many Requests',
      message: isSensitive
        ? 'Too many attempts on this sensitive action. Please wait before retrying.'
        : 'Rate limit exceeded. Please slow down your requests.',
      retryAfter: resetSecs,
    });
    return;
  }

  // Periodic cleanup of stale IPs (every ~1000 requests)
  if (Math.random() < 0.001) {
    for (const [key, val] of store.entries()) {
      if (now > val.resetAt) store.delete(key);
    }
  }

  next();
}
