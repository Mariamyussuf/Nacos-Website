import { Request, Response, NextFunction } from 'express';

// ─── Strict CORS Configuration ───────────────────────────────────────────────

export const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://nacos-bells.vercel.app',
];

export function getCorsOptions() {
  const envOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const allowedList = Array.from(new Set([...DEFAULT_ALLOWED_ORIGINS, ...envOrigins]));

  return {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      const isAllowed = allowedList.some((allowed) => {
        if (allowed === origin) return true;
        // Support subdomain wildcard (e.g. *.vercel.app)
        if (allowed.startsWith('*.')) {
          const domain = allowed.slice(2);
          return origin.endsWith(`.${domain}`) || origin === `https://${domain}`;
        }
        return false;
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy blocked access from origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
      'X-RateLimit-Limit',
      'X-Captcha-Token',
      'X-Captcha-Answer',
    ],
    exposedHeaders: [
      'X-RateLimit-Limit',
      'X-RateLimit-Remaining',
      'X-RateLimit-Reset',
      'Retry-After',
    ],
    maxAge: 86400, // 24 hours pre-flight cache
  };
}

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

// ─── Tiered Sliding-Window Rate Limiter & Anti-DDoS ──────────────────────────

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const authStore = new Map<string, RateLimitEntry>();
const publicFormStore = new Map<string, RateLimitEntry>();
const newsletterStore = new Map<string, RateLimitEntry>();
const captchaStore = new Map<string, RateLimitEntry>();
const generalStore = new Map<string, RateLimitEntry>();

export function apiRateLimitMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    (req.headers['cf-connecting-ip'] as string) ||
    req.ip ||
    req.socket.remoteAddress ||
    'unknown';

  const now = Date.now();
  const path = (req.originalUrl || req.url).toLowerCase();

  let maxLimit = 150;
  let windowMs = 60 * 1000; // 1 minute
  let store = generalStore;
  let category = 'general';

  // Tier 1: Auth endpoints
  if (path.includes('/api/auth/login')) {
    maxLimit = 10;
    windowMs = 10 * 60 * 1000; // 10 minutes
    store = authStore;
    category = 'auth';
  }
  // Tier 2: Public form submissions (dynamic forms, contact, event registrations)
  else if (
    path.includes('/submit') ||
    path.includes('/contact') ||
    path.includes('/register')
  ) {
    maxLimit = 10;
    windowMs = 60 * 1000; // 1 minute
    store = publicFormStore;
    category = 'forms';
  }
  // Tier 3: Newsletter subscribe & campaign dispatch
  else if (path.includes('/subscribe') || path.includes('/newsletter')) {
    maxLimit = 5;
    windowMs = 60 * 1000; // 1 minute
    store = newsletterStore;
    category = 'newsletter';
  }
  // Tier 4: CAPTCHA challenge requests
  else if (path.includes('/captcha')) {
    maxLimit = 30;
    windowMs = 60 * 1000;
    store = captchaStore;
    category = 'captcha';
  }

  const entry = store.get(ip) || { count: 0, resetAt: now + windowMs };

  // Reset counter when window elapses
  if (now > entry.resetAt) {
    entry.count = 1;
    entry.resetAt = now + windowMs;
  } else {
    entry.count += 1;
  }

  store.set(ip, entry);

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
      message: `Rate limit exceeded for ${category}. Please retry after ${resetSecs} seconds.`,
      retryAfter: resetSecs,
    });
    return;
  }

  // Periodic memory cleanup of expired IPs
  if (Math.random() < 0.002) {
    for (const s of [authStore, publicFormStore, newsletterStore, captchaStore, generalStore]) {
      for (const [key, val] of s.entries()) {
        if (now > val.resetAt) s.delete(key);
      }
    }
  }

  next();
}
