import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import session from 'express-session';
import passport from 'passport';
import { migrate } from './database/migrate';
import { seed } from './database/seed';
import { validateEnv } from './common/env.validation';
import { AllExceptionsFilter } from './common/all-exceptions.filter';
import {
  securityHeadersMiddleware,
  apiRateLimitMiddleware,
  getCorsOptions,
} from './common/security.middleware';

async function bootstrap() {
  // 1. Validate environment configuration & secrets
  validateEnv();

  // 2. Run migrations and seed
  await migrate();
  await seed();

  const app = await NestFactory.create(AppModule);

  // 3. Security Headers (HSTS, X-Content-Type-Options, X-Frame-Options, XSS protection, strip X-Powered-By)
  app.use(securityHeadersMiddleware);

  // 4. Rate Limiting & Throttling (Tiered Anti-DDoS & Brute Force Defense)
  app.use(apiRateLimitMiddleware);

  // 5. Global Exception Filter (Error handling that doesn't leak stack traces, SQL, or disk paths)
  app.useGlobalFilters(new AllExceptionsFilter());

  // 6. Global prefix
  app.setGlobalPrefix('api');

  // 7. Strict CORS Restrictions
  app.enableCors(getCorsOptions());

  // 8. Strict Validation pipes (OWASP Mass Assignment Prevention & Whitelisting)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 9. Session middleware with signed secure cookies
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'dev-session-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      },
    }),
  );

  // 10. Passport Authentication
  app.use(passport.initialize());
  app.use(passport.session());

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 NACOS Backend running on http://localhost:${port}`);
}

bootstrap();
