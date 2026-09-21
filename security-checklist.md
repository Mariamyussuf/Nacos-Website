# SECURITY CHECKLIST: NestJS + Next.js + Prisma + Turso

> **How to use this file (instructions for the AI model)**
>
> You are acting as a senior application security engineer.
> Stack: **NestJS** (backend API), **Next.js** (frontend), **Prisma ORM**, **Turso (libSQL/SQLite)**.
>
> You will use this file in one of two modes:
>
> **Mode A: AUDIT.** The user pastes code or a repo. Check it against every section below and report findings.
> **Mode B: GENERATE.** The user asks for new code. Write it so it already satisfies every applicable rule below.
>
> **Ground rules**
> 1. Treat every item as a hard requirement, not a suggestion.
> 2. Never assume something is secure because it "looks fine." Verify against the rule.
> 3. If code is missing so a rule can't be checked, mark it `UNVERIFIED` and say exactly what you need to see.
> 4. Never invent package names. If you're unsure a package exists, say so.
> 5. Never write fallback secrets (`process.env.X || 'secret'`), placeholder keys, `// TODO: add auth`, or disabled security checks.
> 6. Turso has **no Row-Level Security**. The database will not protect the app. All authorization is enforced in application code.
> 7. Anything the frontend does (hiding buttons, redirects, client validation) is UX only, never security. The API must enforce everything on its own.
>
> **Required output format for AUDIT mode**
>
> For each finding output:
> ```
> [SEVERITY] Short title
> Location: file:line (or "not visible")
> Rule violated: section number + rule
> Why it matters: one sentence, attacker's perspective
> Fix: concrete corrected code
> ```
> Severity levels: `CRITICAL` (exploitable now, data loss or account takeover), `HIGH`, `MEDIUM`, `LOW`, `UNVERIFIED`.
> End with a summary table: section number, PASS / FAIL / UNVERIFIED, count of findings.
> Sort findings by severity, most severe first. Do not pad the report with praise.

---

## PRIORITY ORDER (if time is short, check these first)

1. Secrets are out of the code and repo, and rotated if ever leaked
2. Global deny-by-default auth guard + owner-scoped Prisma queries in every service method
3. Global `ValidationPipe` (`whitelist` + `forbidNonWhitelisted`) + DTOs with real decorators everywhere
4. Turso token is backend-only and separated per environment
5. Cookie/CORS/CSRF strategy between Next.js and Nest is correct
6. Rate limiting (with `trust proxy`), webhook signature + idempotency, generic error responses
7. Dependency audit, security headers, monitoring, backups

---

## 1. SECRETS & ENVIRONMENT

- [ ] 1.1 No API keys, tokens, DB URLs, or JWT secrets hardcoded anywhere in source
- [ ] 1.2 `.env*` files are in `.gitignore`; only `.env.example` (with fake values) is committed
- [ ] 1.3 Full git history scanned for secrets (`gitleaks` / `trufflehog`). Deleting a file does not remove it from history
- [ ] 1.4 Any secret that ever touched a public repo, log, screenshot, or AI chat is **rotated**, not merely removed
- [ ] 1.5 Only `NEXT_PUBLIC_*` variables reach the browser, and none of them contain anything sensitive
- [ ] 1.6 `TURSO_AUTH_TOKEN`, `DATABASE_URL`, `JWT_SECRET`, payment secret keys, and LLM API keys exist **only** in backend env
- [ ] 1.7 Separate keys and separate Turso databases for dev / staging / production
- [ ] 1.8 Third-party keys use minimum scopes and have spend limits (payment gateway, LLM providers, email/SMS)
- [ ] 1.9 Config is loaded via `@nestjs/config` with a **validated schema** (Joi or Zod). The app refuses to boot if a required secret is missing or too short
- [ ] 1.10 **No fallback defaults** for secrets (`process.env.JWT_SECRET || 'secret'` is a CRITICAL finding)
- [ ] 1.11 Config objects and env values are never logged

**Grep to run:**
```bash
grep -rnE "(sk-|api[_-]?key|secret|password|token)\s*[:=]\s*['\"]" src/
grep -rn "process.env.*||" src/
grep -rn "NEXT_PUBLIC_" .
```

---

## 2. NESTJS GLOBAL HARDENING (`main.ts`)

- [ ] 2.1 `helmet()` enabled
- [ ] 2.2 `app.disable('x-powered-by')`
- [ ] 2.3 Global `ValidationPipe` with `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`, and `enableImplicitConversion: false`
- [ ] 2.4 CORS uses an explicit origin allowlist (from env). Never `origin: '*'`, never `origin: true` with `credentials: true`
- [ ] 2.5 `app.set('trust proxy', 1)` when behind a reverse proxy or PaaS, so rate limiting sees real client IPs
- [ ] 2.6 `NODE_ENV=production` in production
- [ ] 2.7 Swagger/OpenAPI is disabled or protected in production
- [ ] 2.8 Request body size limit configured (e.g. `json({ limit: '100kb' })`)
- [ ] 2.9 A global exception filter returns generic messages for unexpected errors; details are logged server-side only

**Reference implementation:**
```ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.set('trust proxy', 1);
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false },
    }),
  );

  app.enableCors({
    origin: [process.env.FRONTEND_URL!],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
```

---

## 3. AUTHENTICATION

- [ ] 3.1 Use a proven mechanism (`@nestjs/passport` + `passport-jwt`, or a hosted provider). **Never hand-roll crypto or auth**
- [ ] 3.2 Passwords hashed with **argon2** or **bcrypt** (cost >= 12). Never MD5/SHA-1/SHA-256 alone, never plaintext
- [ ] 3.3 JWT verification checks signature **and** pins the algorithm (`algorithms: ['HS256']` or `RS256`); `ignoreExpiration: false`. `alg: none` must be impossible
- [ ] 3.4 `JWT_SECRET` is >= 32 random bytes
- [ ] 3.5 Access tokens are short-lived (~15 min); refresh tokens are rotating, single-use, and stored **hashed** in the DB
- [ ] 3.6 Logout and password change invalidate refresh tokens / sessions
- [ ] 3.7 Tokens are delivered as `httpOnly; Secure; SameSite=Lax|Strict` cookies. **Not** in `localStorage`
- [ ] 3.8 Email verification enforced before granting access to protected features
- [ ] 3.9 Password reset tokens are random, single-use, short-lived, and stored hashed
- [ ] 3.10 Login/reset responses do not reveal whether an email exists (same message, similar timing)
- [ ] 3.11 Strict rate limiting + lockout/backoff on login, signup, password reset, and OTP
- [ ] 3.12 MFA available for admin accounts
- [ ] 3.13 No debug/test login bypasses, hardcoded admin users, or default credentials

---

## 4. AUTHORIZATION: DENY BY DEFAULT

### 4A. Global guards

- [ ] 4.1 `JwtAuthGuard` is registered **globally** via `APP_GUARD`. Routes are protected unless explicitly marked `@Public()`
- [ ] 4.2 `RolesGuard` and `ThrottlerGuard` are also global `APP_GUARD` providers; order: auth → roles → throttler
- [ ] 4.3 Every `@Public()` usage is justified. Allowed only for: signup, login, refresh, health check, password-reset request, and signature-verified webhooks
- [ ] 4.4 Admin controllers are protected at the **class** level, so a new route added later is protected automatically
- [ ] 4.5 Roles come from the DB or a signed token, never from request input
- [ ] 4.6 If roles live inside the JWT, tokens are short-lived (or roles are re-checked from DB on sensitive actions)

```ts
// app.module.ts
providers: [
  { provide: APP_GUARD, useClass: JwtAuthGuard },
  { provide: APP_GUARD, useClass: RolesGuard },
  { provide: APP_GUARD, useClass: ThrottlerGuard },
],

// public.decorator.ts
export const IS_PUBLIC = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC, true);

// jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) { super(); }
  canActivate(ctx: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      ctx.getHandler(), ctx.getClass(),
    ]);
    return isPublic ? true : super.canActivate(ctx);
  }
}
```

### 4B. Ownership checks (guards do NOT do this for you)

Guards answer "who are you / what role." They do **not** answer "is this *your* record." That is the service layer's job, and it is the most common vulnerability in AI-generated code.

- [ ] 4.7 `userId` (and `orgId`/`tenantId`) comes **only** from the authenticated session (`@CurrentUser()`), never from `@Body()`, `@Param()`, or `@Query()`
- [ ] 4.8 Every Prisma query on user-owned data includes the owner in the filter: `where: { id, userId }`
- [ ] 4.9 `update` and `delete` never use `where: { id }` alone. Use `updateMany`/`deleteMany` with the owner in the filter and check `count`, or verify ownership first
- [ ] 4.10 Not-found and not-yours both return **404** (avoid leaking that a record exists)
- [ ] 4.11 Users cannot set their own `role`, `isAdmin`, `plan`, `balance`, `userId`, `emailVerified`, or similar privileged fields
- [ ] 4.12 Service methods take `userId` as an explicit parameter so it is hard to forget
- [ ] 4.13 Optional but recommended: a Prisma client extension that auto-injects `userId`/`orgId` into `where` clauses
- [ ] 4.14 Multi-tenant apps: consider one Turso database per tenant for hard isolation

```ts
async findOne(id: string, userId: string) {
  const post = await this.prisma.post.findFirst({
    where: { id, userId },
    select: { id: true, title: true, body: true },
  });
  if (!post) throw new NotFoundException();
  return post;
}

async remove(id: string, userId: string) {
  const { count } = await this.prisma.post.deleteMany({ where: { id, userId } });
  if (count === 0) throw new NotFoundException();
}
```

**IDOR test to run mentally on every route:** if User A sends User B's ID, what happens? The only acceptable answer is 404.

---

## 5. INPUT VALIDATION & INJECTION

- [ ] 5.1 Every `@Body()`, `@Query()`, `@Param()` uses a **DTO class** with `class-validator` decorators. Interfaces and `any` do not validate at runtime
- [ ] 5.2 A DTO with no decorators = no validation. Every property has at least one decorator
- [ ] 5.3 Nested objects use `@ValidateNested()` + `@Type(() => X)`; arrays use `@IsArray()` + `@ArrayMaxSize()`
- [ ] 5.4 Strings have `@MaxLength()`; numbers have `@Min()`/`@Max()`; IDs use `@IsUUID()` / `@IsString()` with format checks
- [ ] 5.5 Enum-like fields use `@IsEnum()`; free-form JSON fields are avoided or strictly schema-validated
- [ ] 5.6 **Operator injection guard:** inputs going into Prisma `where` / `orderBy` / `include` are confirmed to be primitives (string/number), never objects. `{"email": {"contains": ""}}` and `{"token": {"not": ""}}` must be rejected
- [ ] 5.7 `orderBy` / `select` / `include` fields are chosen from an **allowlist**, never taken directly from the client
- [ ] 5.8 No `prisma.x.create({ data: dto })` / `update({ data: req.body })` with unvalidated or over-broad objects (mass assignment). Pick fields explicitly
- [ ] 5.9 No `$queryRawUnsafe` / `$executeRawUnsafe`. Raw SQL uses tagged templates (`` prisma.$queryRaw`... ${x}` ``) only
- [ ] 5.10 No `eval`, `new Function`, `child_process.exec` with user input
- [ ] 5.11 File paths from users are sanitized (no `../` traversal)
- [ ] 5.12 Server-side fetches of user-supplied URLs are protected against SSRF (domain allowlist, block private/internal IP ranges)
- [ ] 5.13 Output is encoded/sanitized. Never render user content with `dangerouslySetInnerHTML` unless sanitized with DOMPurify

**Grep to run:**
```bash
grep -rn "Unsafe" src/
grep -rnE "@Body\(\)[^)]*: any" src/
grep -rnE "data:\s*(req\.body|body|dto)\b" src/
grep -rn "eval(\|new Function(\|exec(" src/
```

---

## 6. PRISMA + TURSO (DATABASE LAYER)

### 6A. Prisma

- [ ] 6.1 Prisma is only ever called from the NestJS backend. Never from the client or Next.js browser code
- [ ] 6.2 Every query uses `select` (or `omit`) so sensitive columns (`passwordHash`, tokens, internal flags, other users' emails) are never fetched by default
- [ ] 6.3 Raw Prisma results are never returned directly. Map to response DTOs (or use `ClassSerializerInterceptor` with `@Exclude()`)
- [ ] 6.4 `include` / nested relations don't leak related users' sensitive fields
- [ ] 6.5 All list endpoints enforce pagination with a hard cap on `take` (e.g. max 100)
- [ ] 6.6 Multi-step operations (balance changes, stock decrements, payment fulfillment, coupon redemption) use `prisma.$transaction` to prevent race conditions and double-spend
- [ ] 6.7 Uniqueness/idempotency is enforced with DB **unique constraints** (e.g. gateway payment reference), not only application checks
- [ ] 6.8 `PrismaClientKnownRequestError` is caught and mapped (P2002 → 409, P2025 → 404). Prisma error messages are never sent to clients
- [ ] 6.9 Sensitive stored values (third-party OAuth tokens, etc.) are encrypted at the application layer before storage. SQLite has no native column encryption

### 6B. Turso / libSQL

- [ ] 6.10 `TURSO_AUTH_TOKEN` is backend-only and never appears in the client bundle (search built JS for `libsql://` and `TURSO`)
- [ ] 6.11 Separate Turso databases + separate tokens per environment
- [ ] 6.12 Prefer scoped tokens: read-only where only reading is needed; tokens with expiry rather than permanent ones
- [ ] 6.13 The token is rotated if it ever appears in a repo, log, or chat
- [ ] 6.14 Local `.db` / SQLite / embedded-replica files are gitignored and never served statically
- [ ] 6.15 `@prisma/adapter-libsql` reads URL + token from server env only
- [ ] 6.16 Foreign keys are actually enforced. Verify cascades and orphan handling with a test
- [ ] 6.17 SQLite is loosely typed: rely on DTO/Zod validation **before** writes; don't expect the DB to reject bad data
- [ ] 6.18 Backups / point-in-time recovery enabled; a restore has been tested at least once
- [ ] 6.19 Use Turso branching to test risky migrations away from production

### 6C. Migrations

- [ ] 6.20 `prisma migrate reset` and `db push --accept-data-loss` are **never** run against production. Confirm `DATABASE_URL` in the shell before every migration command
- [ ] 6.21 Generated SQL migrations are reviewed before applying (SQLite migrations often recreate tables; AI-suggested schema changes can drop columns)
- [ ] 6.22 Take a Turso branch/backup before migrating production
- [ ] 6.23 The `migrations/` folder is committed; applied migrations are never hand-edited

---

## 7. API SECURITY

- [ ] 7.1 Global rate limit via `@nestjs/throttler` (e.g. 60 req/min) **plus** much stricter limits on login, signup, password reset, OTP/email/SMS sends, and anything that calls a paid API
- [ ] 7.2 Throttler uses a shared store (Redis) if running multiple instances; in-memory is per-instance only
- [ ] 7.3 No unauthenticated endpoint can trigger emails, SMS, or paid third-party calls (this is a bill-drain attack)
- [ ] 7.4 CSRF protection is in place for cookie-based auth (see section 9)
- [ ] 7.5 Error responses contain no stack traces, SQL/Prisma messages, file paths, or internal IDs
- [ ] 7.6 Response DTOs never include internal fields
- [ ] 7.7 Consistent error format; 401 vs 403 vs 404 used deliberately (see 4.10)
- [ ] 7.8 Request timeouts and payload size limits prevent resource exhaustion
- [ ] 7.9 Expensive operations (exports, reports, AI calls) have per-user quotas

```ts
ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }])

@Throttle({ default: { limit: 5, ttl: 60_000 } })
@Post('login')
```

---

## 8. PAYMENTS & WEBHOOKS (Paystack / Flutterwave / others)

- [ ] 8.1 Prices, amounts, and "payment succeeded" are **never** trusted from the client. Always verify with the gateway server-to-server
- [ ] 8.2 Webhook route uses the **raw body** (`NestFactory.create(AppModule, { rawBody: true })`, then `req.rawBody`)
- [ ] 8.3 Signature verified with HMAC and compared using `crypto.timingSafeEqual`, never `===` (Paystack: `x-paystack-signature`, HMAC-SHA512; Flutterwave: `verif-hash`)
- [ ] 8.4 Webhook route is `@Public()` **and** signature-verified. It is the only kind of route allowed to skip JWT auth
- [ ] 8.5 Amount + currency + customer are compared against **your own order record** before fulfilling
- [ ] 8.6 Idempotency: unique constraint on the gateway reference + `$transaction` for fulfillment, so duplicate webhooks never grant access or credit twice
- [ ] 8.7 Secret keys are backend-only; only public keys reach the frontend
- [ ] 8.8 Failed/unsigned webhooks are logged (without secrets) and return a non-2xx response

---

## 9. NEXT.JS <-> NEST BOUNDARY

- [ ] 9.1 **The API enforces everything.** Next.js middleware/redirects/hidden UI are UX only, since anyone can call the Nest API directly with curl
- [ ] 9.2 Auth tokens are stored in `httpOnly; Secure; SameSite` cookies set by Nest, not in `localStorage`/`sessionStorage`
- [ ] 9.3 CSRF: with cookie auth, use `SameSite=Lax|Strict` **and** either a CSRF token or a required custom header on state-changing requests; state-changing actions never use GET
- [ ] 9.4 CORS `origin` matches the exact frontend origin(s); `credentials: true` is never combined with a wildcard
- [ ] 9.5 The only public env var is `NEXT_PUBLIC_API_URL` (plus genuinely public keys). Everything else is server-only
- [ ] 9.6 Next.js server components / route handlers that call Nest forward the **user's** credentials. Do not use a shared service token that bypasses per-user checks
- [ ] 9.7 Security headers set in `next.config.js`: `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `frame-ancestors` / `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS
- [ ] 9.8 Next.js is kept on a patched version (it has had serious middleware authorization-bypass CVEs). Do not rely on middleware as the sole auth check
- [ ] 9.9 No secrets or sensitive logic in client bundles. Search the built JS
- [ ] 9.10 Source maps disabled or restricted in production
- [ ] 9.11 Open redirects prevented (validate `?redirect=` / `next=` against an allowlist of relative paths)
- [ ] 9.12 `target="_blank"` links use `rel="noopener noreferrer"`
- [ ] 9.13 `dangerouslySetInnerHTML` only with DOMPurify-sanitized content
- [ ] 9.14 Third-party scripts minimized and pinned; SRI hashes where possible
- [ ] 9.15 `postMessage` handlers check `event.origin`

---

## 10. FILE UPLOADS

- [ ] 10.1 File type validated by **content** (magic bytes), not just extension or client-supplied MIME type
- [ ] 10.2 Size limits enforced server-side
- [ ] 10.3 Files stored in a private bucket / outside the web root; never in a location that can execute
- [ ] 10.4 Random server-generated filenames; original names never used for paths
- [ ] 10.5 Access via short-lived signed URLs or authorized download endpoints, with ownership checks on **download**, not just upload
- [ ] 10.6 Image metadata (EXIF/GPS) stripped where relevant
- [ ] 10.7 Uploads rate-limited and quota-limited per user

---

## 11. DEPENDENCIES & SUPPLY CHAIN

- [ ] 11.1 `npm audit` / `pnpm audit` run; critical and high issues fixed
- [ ] 11.2 **Every AI-suggested package verified to exist and be legitimate** (check npm page, publish date, downloads, maintainers). LLMs hallucinate package names and attackers register them ("slopsquatting")
- [ ] 11.3 Lockfile committed; CI uses `npm ci` / `pnpm install --frozen-lockfile`
- [ ] 11.4 Unused dependencies removed
- [ ] 11.5 Dependabot or Renovate enabled
- [ ] 11.6 Unfamiliar packages checked for suspicious `postinstall` scripts
- [ ] 11.7 GitHub Actions pinned to versions or commit SHAs; CI secrets scoped minimally

---

## 12. LLM / AI FEATURES (only if the app calls models)

- [ ] 12.1 LLM API keys are backend-only
- [ ] 12.2 Per-user rate limits and spend caps so no one can drain credits
- [ ] 12.3 Model output is treated as **untrusted input**. It is never executed as code/SQL/shell without validation
- [ ] 12.4 Model output is sanitized before rendering as HTML/Markdown
- [ ] 12.5 Assume prompt injection is possible. Never place secrets or other users' data in shared prompts
- [ ] 12.6 Agent/tool permissions are least-privilege; destructive actions require human confirmation
- [ ] 12.7 User-provided documents/URLs fed to the model are treated as hostile

---

## 13. LOGGING, MONITORING, INCIDENT RESPONSE

- [ ] 13.1 Auth events logged: logins, failures, password changes, permission denials, token refreshes
- [ ] 13.2 Passwords, tokens, card data, and full request bodies are **never** logged; PII redacted
- [ ] 13.3 Error monitoring (e.g. Sentry) with PII scrubbing
- [ ] 13.4 Alerts on spikes of 401/403/429/500 and on billing anomalies (cloud, LLM, SMS providers)
- [ ] 13.5 A written runbook exists for rotating every secret quickly
- [ ] 13.6 A plan exists for "I leaked a key": revoke, rotate, audit logs, notify if user data was exposed

---

## 14. DATA PRIVACY & COMPLIANCE (Nigeria: NDPA 2023)

- [ ] 14.1 Collect only the data that is needed
- [ ] 14.2 Privacy policy published; lawful basis for processing documented
- [ ] 14.3 Users can access and delete their data; deletion actually removes it (including backups on a defined schedule)
- [ ] 14.4 Breach response process exists (NDPA requires notification within 72 hours of a qualifying breach)
- [ ] 14.5 Real user data is never pasted into AI tools or used in dev/staging

---

## 15. DEPLOYMENT & INFRASTRUCTURE

- [ ] 15.1 HTTPS everywhere; HTTP redirected; HSTS enabled; auto-renewing certificates
- [ ] 15.2 `DEBUG` off; no dev servers, verbose errors, or exposed admin panels in production
- [ ] 15.3 Default credentials and seed/sample data removed
- [ ] 15.4 Only ports 80/443 exposed publicly; DB access restricted
- [ ] 15.5 Containers run as non-root; minimal images; no secrets baked into image layers
- [ ] 15.6 Cloud storage buckets are not publicly listable
- [ ] 15.7 Least-privilege IAM/roles for cloud and CI
- [ ] 15.8 Domain hardening: registrar lock, 2FA on registrar/DNS, SPF/DKIM/DMARC configured
- [ ] 15.9 Production data is never used in dev or staging

---

## 16. ACCOUNT & ACCESS HYGIENE

- [ ] 16.1 2FA on GitHub, hosting, cloud, Turso, domain registrar, email, and payment gateway accounts
- [ ] 16.2 Branch protection on `main`; no direct pushes; required reviews/CI
- [ ] 16.3 Deploy keys/tokens scoped narrowly and rotated
- [ ] 16.4 Collaborators and tokens removed when people leave
- [ ] 16.5 Private repos for private code

---

## 17. VIBE-CODING-SPECIFIC RED FLAGS (AI-generated code failure modes)

When auditing or generating code, actively look for these. Each is at least a HIGH finding:

- [ ] 17.1 Placeholder or fallback secrets (`'secret'`, `'changeme'`, `process.env.X || 'default'`)
- [ ] 17.2 `// TODO: add auth`, `// TODO: validate`, or commented-out guards/checks
- [ ] 17.3 `cors({ origin: '*' })`, `origin: true`, or wildcard with credentials
- [ ] 17.4 `rejectUnauthorized: false` or disabled TLS verification
- [ ] 17.5 `where: { id }` on user-owned data without the owner filter
- [ ] 17.6 `data: req.body` / `data: dto` passed straight to Prisma
- [ ] 17.7 Business logic or price/amount trusted from the client
- [ ] 17.8 Auth enforced only in the Next.js frontend or middleware, not in Nest
- [ ] 17.9 Routes added without guards because the global guard was removed or bypassed
- [ ] 17.10 Untyped `any` bodies; DTOs without decorators
- [ ] 17.11 Hallucinated or unverified npm packages
- [ ] 17.12 Regenerated code that silently removed earlier security fixes. Re-audit after every "quick fix"
- [ ] 17.13 Secrets pasted into prompts, comments, or example files

---

## 18. REQUIRED TESTS (the ones AI usually skips)

- [ ] 18.1 e2e (supertest): unauthenticated request to a protected route → **401**
- [ ] 18.2 e2e: User A requesting User B's resource → **404** (or 403 by explicit design)
- [ ] 18.3 e2e: wrong role → **403**
- [ ] 18.4 e2e: unknown extra body field → **400** (proves `forbidNonWhitelisted` works)
- [ ] 18.5 e2e: object sent where a string is expected (`{"email":{"contains":""}}`) → **400**
- [ ] 18.6 **Route-sweep test:** iterate every registered route, call it with no token, assert 401 (except explicit `@Public()` routes). This permanently catches "forgot the guard"
- [ ] 18.7 Rate limiting on login returns **429** after the threshold
- [ ] 18.8 Webhook with invalid/missing signature is rejected; duplicate valid webhook is processed exactly once
- [ ] 18.9 Pagination cap: `?limit=999999` is clamped or rejected

---

## 19. PRE-LAUNCH SMOKE TEST (30 minutes)

1. Open the app **logged out** and call every API route directly. What responds?
2. Log in as User A and try to read/modify User B's data by swapping IDs on every route that touches Prisma
3. Send objects where strings are expected to login, search, and lookup endpoints
4. Search the production JS bundle for `libsql://`, `TURSO`, `sk-`, `secret`, `apikey`. Nothing should match
5. Run `gitleaks`, `npm audit`, and scan the deployed site with securityheaders.com
6. Submit `<script>alert(1)</script>` and `' OR 1=1--` in every input field
7. Hammer login/signup with a script and confirm rate limiting triggers
8. Fire the same valid webhook twice; confirm the order is fulfilled once. Send one with a bad signature; confirm rejection
9. Hit list endpoints with `?limit=999999`
10. Confirm Swagger/admin panels are not reachable in production

**Master grep list:**
```bash
grep -rn "@Public" src/                        # justify every one
grep -rn "Unsafe" src/                         # raw Prisma queries
grep -rnE "@Body\(\)[^)]*: any" src/           # untyped bodies
grep -rnE "origin:\s*\[?['\"]\*['\"]" src/     # wildcard CORS
grep -rn "process.env.*||" src/                # insecure fallbacks
grep -rn "ignoreExpiration: true" src/         # disabled JWT expiry
grep -rn "rejectUnauthorized" src/             # disabled TLS checks
grep -rnE "data:\s*(req\.body|body|dto)\b" src/ # mass assignment
grep -rn "migrate reset\|accept-data-loss" .   # dangerous DB commands
grep -rnE "TODO|FIXME|bypass|debug" src/       # leftover shortcuts
```

---

## FINAL INSTRUCTION TO THE MODEL

Before finishing any audit or code generation:

1. Re-read sections 4, 5, and 6. These cause the majority of real breaches in this stack.
2. Confirm every route in the code has an answer to: **Who can call this? Whose data can it touch? What input does it trust?**
3. If you could not verify a rule, say `UNVERIFIED`. Never say "looks secure."
4. Provide corrected code for every CRITICAL and HIGH finding, not just a description.
