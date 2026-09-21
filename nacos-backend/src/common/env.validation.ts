import { Logger } from '@nestjs/common';

const logger = new Logger('EnvironmentValidator');

export function validateEnv(): void {
  const isProd = process.env.NODE_ENV === 'production';
  const sessionSecret = process.env.SESSION_SECRET;
  const adminPassword = process.env.ADMIN_PASSWORD;

  const INSECURE_SECRETS = [
    'your-session-secret-change-me',
    'dev-session-secret',
    'test-secret',
    'secret',
    '123456',
  ];

  const INSECURE_PASSWORDS = [
    'adminpassword',
    'admin',
    '123456',
    'password',
  ];

  if (!sessionSecret) {
    if (isProd) {
      throw new Error('CRITICAL SECURITY ERROR: SESSION_SECRET environment variable is missing.');
    } else {
      logger.warn('⚠️  SESSION_SECRET is not set. Falling back to development secret.');
    }
  } else if (INSECURE_SECRETS.includes(sessionSecret.trim())) {
    if (isProd) {
      throw new Error(
        'CRITICAL SECURITY ERROR: Default/placeholder SESSION_SECRET detected in production. Generate a strong 32+ char secret.',
      );
    } else {
      logger.warn('⚠️  Using default development SESSION_SECRET. Change before production deployment.');
    }
  }

  if (isProd && adminPassword && INSECURE_PASSWORDS.includes(adminPassword.trim().toLowerCase())) {
    logger.warn('⚠️  ADMIN_PASSWORD in .env is using an insecure default. Please change it immediately.');
  }

  // Validate PORT
  if (process.env.PORT && isNaN(parseInt(process.env.PORT, 10))) {
    throw new Error(`Invalid PORT specified: ${process.env.PORT}`);
  }

  logger.log(`🔒 Environment configuration validated (Mode: ${process.env.NODE_ENV || 'development'}).`);
}
