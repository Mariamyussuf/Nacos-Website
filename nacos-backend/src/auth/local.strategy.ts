import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginJailService } from './login-jail.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private jailService: LoginJailService,
  ) {
    super({ usernameField: 'username', passReqToCallback: true });
  }

  async validate(req: Request, username: string, password: string): Promise<any> {
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.ip ||
      'unknown';

    // 1. Max Retry & Jail check
    this.jailService.checkJail(ip, username);

    // 2. Validate credentials
    const admin = await this.authService.validateAdmin(username, password);
    if (!admin) {
      const remainingAttempts = this.jailService.recordFailure(ip, username);
      throw new UnauthorizedException(
        `Invalid username or password. ${remainingAttempts} attempt(s) remaining before temporary lockout.`,
      );
    }

    // 3. Reset failed attempts on success
    this.jailService.recordSuccess(ip, username);
    return admin;
  }
}
