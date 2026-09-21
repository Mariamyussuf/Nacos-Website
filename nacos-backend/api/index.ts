import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Request, Response } from 'express';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import session from 'express-session';
import passport from 'passport';
import { migrate } from '../src/database/migrate';
import { seed } from '../src/database/seed';
import { validateEnv } from '../src/common/env.validation';
import { AllExceptionsFilter } from '../src/common/all-exceptions.filter';
import {
  securityHeadersMiddleware,
  apiRateLimitMiddleware,
  getCorsOptions,
} from '../src/common/security.middleware';

const server = express();
let isInitialized = false;

// Apply security headers and throttling on express server
server.use(securityHeadersMiddleware);
server.use(apiRateLimitMiddleware);

server.get('/', (_req, res) => {
  res.json({
    status: 'online',
    message: 'NACOS Bells Chapter API is live & running smoothly 🚀',
    version: '1.0.0',
    college: 'College of Information and Communications Technology, Bells University of Technology',
    endpoints: {
      blogs: '/api/blogs',
      events: '/api/events',
      resources: '/api/resources',
      banner: '/api/banner',
      contact: '/api/contact',
      subscribers: '/api/subscribe',
      forms: '/api/forms',
      captcha: '/api/captcha/challenge',
    },
  });
});

async function bootstrap() {
  validateEnv();

  try {
    await migrate();
    await seed();
  } catch (err) {
    console.warn('Migration warning:', err);
  }

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // Security & Data-Leakage Protection
  app.useGlobalFilters(new AllExceptionsFilter());

  app.setGlobalPrefix('api');

  // Strict CORS Restrictions
  app.enableCors(getCorsOptions());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'dev-session-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  await app.init();
  isInitialized = true;
}

export default async function handler(req: Request, res: Response) {
  if (!isInitialized) {
    await bootstrap();
  }
  server(req, res);
}
