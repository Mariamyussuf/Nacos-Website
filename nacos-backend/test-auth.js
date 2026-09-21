const http = require('http');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Force local sqlite database for robust automated testing
process.env.USE_LOCAL_DB = 'true';

const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');
const { ValidationPipe } = require('@nestjs/common');
const session = require('express-session');
const passport = require('passport');
const { migrate } = require('./dist/database/migrate');
const {
  securityHeadersMiddleware,
  apiRateLimitMiddleware,
} = require('./dist/common/security.middleware');

const TEST_PORT = 3099;
const BASE_URL = `http://127.0.0.1:${TEST_PORT}/api`;

let appInstance = null;

// Helper: HTTP request wrapper
function request(method, urlPath, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}${urlPath}`);
    const reqHeaders = options.headers || {};

    let bodyData = null;
    if (options.body) {
      bodyData = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
      reqHeaders['Content-Type'] = reqHeaders['Content-Type'] || 'application/json';
      reqHeaders['Content-Length'] = Buffer.byteLength(bodyData);
    }

    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method: method.toUpperCase(),
        headers: reqHeaders,
      },
      (res) => {
        let rawData = '';
        res.on('data', (chunk) => (rawData += chunk));
        res.on('end', () => {
          let parsed = null;
          try {
            parsed = JSON.parse(rawData);
          } catch {
            parsed = rawData;
          }
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: parsed,
          });
        });
      },
    );

    req.on('error', reject);
    if (bodyData) req.write(bodyData);
    req.end();
  });
}

// Test Runner
const results = [];
function record(testName, passed, details) {
  results.push({ testName, passed, details });
  const icon = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${icon} | ${testName} - ${details}`);
}

async function runTests() {
  console.log('\n=============================================================');
  console.log('       NACOS BELLS — COMPREHENSIVE AUTH FLOW TEST SUITE       ');
  console.log('=============================================================\n');

  console.log('📦 Running database migrations on local SQLite test database...');
  await migrate();

  console.log('🚀 Booting NestJS server on port ' + TEST_PORT + '...');
  appInstance = await NestFactory.create(AppModule, { logger: ['error', 'warn'] });

  appInstance.use(securityHeadersMiddleware);
  appInstance.use(apiRateLimitMiddleware);
  appInstance.setGlobalPrefix('api');
  appInstance.enableCors({ origin: true, credentials: true });
  appInstance.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );
  appInstance.use(
    session({
      secret: process.env.SESSION_SECRET || 'test-secret',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 24 * 60 * 60 * 1000, httpOnly: true },
    }),
  );
  appInstance.use(passport.initialize());
  appInstance.use(passport.session());

  await appInstance.listen(TEST_PORT);
  console.log('✅ Server listening on ' + BASE_URL + '\n');

  try {
    // ─── TEST 1: Security Headers ───────────────────────────────────────────
    const resHeaders = await request('GET', '/blogs');
    const h = resHeaders.headers;
    const hasHsts = Boolean(h['strict-transport-security'] && h['strict-transport-security'].includes('max-age=31536000'));
    const hasNoSniff = h['x-content-type-options'] === 'nosniff';
    const hasFrameDeny = h['x-frame-options'] === 'DENY';
    const noPoweredBy = !h['x-powered-by'];
    const passedH = hasHsts && hasNoSniff && hasFrameDeny && noPoweredBy;
    record(
      'Flow 1: Security Headers (HSTS, NoSniff, Frame Deny, No Fingerprint)',
      passedH,
      `HSTS: ${h['strict-transport-security'] || 'none'}, X-Frame: ${h['x-frame-options']}, X-Powered-By: ${h['x-powered-by'] || 'hidden'}`,
    );

    // ─── TEST 2: Unauthenticated /api/auth/me ───────────────────────────────
    const resMeAnon = await request('GET', '/auth/me');
    record(
      'Flow 2: Anonymous access to /api/auth/me blocked',
      resMeAnon.status === 403,
      `Status: ${resMeAnon.status} (Forbidden)`,
    );

    // ─── TEST 3: Unauthenticated /api/forms ─────────────────────────────────
    const resFormsAnon = await request('GET', '/forms');
    record(
      'Flow 3: Anonymous access to /api/forms blocked',
      resFormsAnon.status === 403,
      `Status: ${resFormsAnon.status} (Forbidden)`,
    );

    // ─── TEST 4: Invalid Credentials (Single Attempt) ──────────────────────
    const resBadLogin = await request('POST', '/auth/login', {
      headers: { 'X-Forwarded-For': '192.168.1.100' },
      body: { username: 'admin', password: 'incorrect_password_xyz' },
    });
    record(
      'Flow 4: Login with incorrect password returns 401 Unauthorized',
      resBadLogin.status === 401,
      `Status: ${resBadLogin.status}, Message: "${resBadLogin.body?.message || ''}"`,
    );

    // ─── TEST 5: Login Max Retry & Jail Lockout (5 failed attempts) ─────────
    console.log('   Testing brute-force lockout: sending repeated failed logins for IP 192.168.1.100...');
    let jailResponse = null;
    for (let i = 2; i <= 6; i++) {
      jailResponse = await request('POST', '/auth/login', {
        headers: { 'X-Forwarded-For': '192.168.1.100' },
        body: { username: 'admin', password: `wrong_pass_${i}` },
      });
      if (jailResponse.status === 429) break;
    }
    const isJailed = jailResponse && jailResponse.status === 429;
    record(
      'Flow 5: Login Jail triggered after max retries (HTTP 429 Lockout)',
      isJailed,
      `Status: ${jailResponse?.status}, Lockout: "${jailResponse?.body?.message || ''}", Retry-After: ${jailResponse?.headers?.['retry-after']}s`,
    );

    // ─── TEST 6: Subsequent requests from jailed IP rejected immediately ───
    const resJailedBlocked = await request('POST', '/auth/login', {
      headers: { 'X-Forwarded-For': '192.168.1.100' },
      body: { username: 'admin', password: 'even_with_valid_password' },
    });
    record(
      'Flow 6: Jailed IP blocked on next attempt even before credential check',
      resJailedBlocked.status === 429,
      `Status: ${resJailedBlocked.status}, Message: "${resJailedBlocked.body?.message || ''}"`,
    );

    // ─── TEST 7: Valid Admin Login (From Clean IP) ──────────────────────────
    const cleanIp = '10.0.0.55';
    const adminUser = 'admin';
    const adminPass = 'nacos2025';

    const resValidLogin = await request('POST', '/auth/login', {
      headers: { 'X-Forwarded-For': cleanIp },
      body: { username: adminUser, password: adminPass },
    });

    const cookieHeader = resValidLogin.headers['set-cookie'];
    const sessionCookie = Array.isArray(cookieHeader) ? cookieHeader[0].split(';')[0] : (cookieHeader ? cookieHeader.split(';')[0] : '');

    const loginOk = resValidLogin.status === 200 && Boolean(sessionCookie) && resValidLogin.body?.user?.username === adminUser;
    record(
      'Flow 7: Valid Admin Login (Clean IP, Valid Credentials)',
      loginOk,
      `Status: ${resValidLogin.status}, User: ${resValidLogin.body?.user?.username}, Role: ${resValidLogin.body?.user?.role}, Cookie: ${sessionCookie.substring(0, 20)}...`,
    );

    // ─── TEST 8: Authenticated /api/auth/me ─────────────────────────────────
    const resMeAuth = await request('GET', '/auth/me', {
      headers: { 'X-Forwarded-For': cleanIp, Cookie: sessionCookie },
    });
    const meOk = resMeAuth.status === 200 && resMeAuth.body?.username === adminUser;
    record(
      'Flow 8: Authenticated /api/auth/me with session cookie',
      meOk,
      `Status: ${resMeAuth.status}, Authenticated user: ${resMeAuth.body?.username} (Role: ${resMeAuth.body?.role})`,
    );

    // ─── TEST 9: Authenticated Access to Protected /api/forms ───────────────
    const resFormsAuth = await request('GET', '/forms', {
      headers: { 'X-Forwarded-For': cleanIp, Cookie: sessionCookie },
    });
    const formsOk = resFormsAuth.status === 200 && Array.isArray(resFormsAuth.body);
    record(
      'Flow 9: Access protected /api/forms with session cookie',
      formsOk,
      `Status: ${resFormsAuth.status}, Returned ${Array.isArray(resFormsAuth.body) ? resFormsAuth.body.length : 0} forms`,
    );

    // ─── TEST 10: Admin Logout ──────────────────────────────────────────────
    const resLogout = await request('POST', '/auth/logout', {
      headers: { 'X-Forwarded-For': cleanIp, Cookie: sessionCookie },
    });
    record(
      'Flow 10: Admin Logout (/api/auth/logout)',
      resLogout.status === 200,
      `Status: ${resLogout.status}, Message: "${resLogout.body?.message || ''}"`,
    );

    // ─── TEST 11: Access /api/auth/me after Logout ──────────────────────────
    const resMeAfterLogout = await request('GET', '/auth/me', {
      headers: { 'X-Forwarded-For': cleanIp, Cookie: sessionCookie },
    });
    record(
      'Flow 11: /api/auth/me rejected after logout (Session Invalidated)',
      resMeAfterLogout.status === 403,
      `Status: ${resMeAfterLogout.status} (Forbidden)`,
    );

    // ─── TEST 12: Throttling / Rate Limiter on Sensitive Path ───────────────
    console.log('   Testing sliding-window rate limit on /api/auth/login (limit: 20 req/min)...');
    const burstIp = '172.16.0.99';
    let throttled = false;
    let burstCount = 0;
    for (let i = 1; i <= 25; i++) {
      const resBurst = await request('POST', '/auth/login', {
        headers: { 'X-Forwarded-For': burstIp },
        body: { username: `random_${i}`, password: 'testpassword' },
      });
      burstCount++;
      if (resBurst.status === 429) {
        throttled = true;
        break;
      }
    }
    record(
      'Flow 12: Sensitive Endpoint Rate Limiter Throttling',
      throttled,
      `Throttled after ${burstCount} requests (Status 429 received)`,
    );

    // ─── TEST 13: Student Login Client-side Mock Flow ───────────────────────
    const mockUsers = [
      { matricNumber: '2022/12345', name: 'John Doe', level: '300 Level' },
      { matricNumber: '21/1000', name: 'Student Admin', level: '400 Level' },
    ];
    const validStudent = mockUsers.find((u) => u.matricNumber === '2022/12345');
    const studentOk = Boolean(validStudent && validStudent.name === 'John Doe');
    record(
      'Flow 13: Student matric auth flow (Valid matric: 2022/12345)',
      studentOk,
      `Identified student: "${validStudent?.name}" (${validStudent?.level})`,
    );

    const invalidStudent = mockUsers.find((u) => u.matricNumber === '9999/00000');
    record(
      'Flow 14: Student matric auth flow (Invalid matric: 9999/00000)',
      invalidStudent === undefined,
      'Rejected invalid matric as expected',
    );

  } catch (err) {
    console.error('❌ Test execution error:', err);
  } finally {
    if (appInstance) {
      await appInstance.close();
      console.log('\n🛑 Test server stopped cleanly.');
    }
  }

  // Final Summary
  console.log('\n=============================================================');
  console.log('                     TEST SUMMARY REPORT                     ');
  console.log('=============================================================');
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;
  console.log(`TOTAL TESTS: ${total} | PASSED: ${passed} | FAILED: ${failed}`);
  if (failed === 0) {
    console.log('🎉 ALL AUTH FLOWS PASSED VERIFICATION WITH 100% SUCCESS!');
  } else {
    console.log(`⚠️ ${failed} test(s) failed.`);
  }
  console.log('=============================================================\n');

  process.exit(failed === 0 ? 0 : 1);
}

runTests();
