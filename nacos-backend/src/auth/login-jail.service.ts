import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

interface JailRecord {
  attempts: number;
  jailUntil: number | null;
  lastAttempt: number;
}

@Injectable()
export class LoginJailService {
  private readonly MAX_ATTEMPTS = 5;
  private readonly JAIL_DURATION_MS = 15 * 60 * 1000; // 15 minutes
  private readonly WINDOW_RESET_MS = 30 * 60 * 1000; // 30 minutes window

  private readonly records = new Map<string, JailRecord>();

  /** Generates a tracking key combining IP and username */
  private getKey(ip: string, username: string): string {
    return `${ip.trim().toLowerCase()}::${username.trim().toLowerCase()}`;
  }

  /**
   * Checks whether an IP / username pair is currently jailed.
   * Throws HTTP 429 if jailed.
   */
  checkJail(ip: string, username: string): void {
    const key = this.getKey(ip, username);
    const record = this.records.get(key);

    if (!record) return;

    const now = Date.now();

    // If jail period has expired, clear the jail
    if (record.jailUntil && now > record.jailUntil) {
      this.records.delete(key);
      return;
    }

    // If still in jail, block immediately
    if (record.jailUntil && now <= record.jailUntil) {
      const remainingSecs = Math.ceil((record.jailUntil - now) / 1000);
      const remainingMins = Math.ceil(remainingSecs / 60);
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          error: 'Too Many Requests',
          message: `Account is temporarily locked due to ${this.MAX_ATTEMPTS} failed login attempts. Please try again in ${remainingMins} minute(s).`,
          retryAfter: remainingSecs,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Reset attempt counter if last attempt was outside the window
    if (now - record.lastAttempt > this.WINDOW_RESET_MS) {
      this.records.delete(key);
    }
  }

  /**
   * Registers a failed login attempt. Jails the account if limit reached.
   */
  recordFailure(ip: string, username: string): number {
    const key = this.getKey(ip, username);
    const now = Date.now();
    const record = this.records.get(key) || { attempts: 0, jailUntil: null, lastAttempt: now };

    record.attempts += 1;
    record.lastAttempt = now;

    if (record.attempts >= this.MAX_ATTEMPTS) {
      record.jailUntil = now + this.JAIL_DURATION_MS;
      this.records.set(key, record);
      const remainingMins = Math.ceil(this.JAIL_DURATION_MS / 60000);
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          error: 'Too Many Requests',
          message: `Too many failed login attempts. You are temporarily locked out for ${remainingMins} minutes.`,
          retryAfter: Math.ceil(this.JAIL_DURATION_MS / 1000),
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    this.records.set(key, record);
    return this.MAX_ATTEMPTS - record.attempts;
  }

  /**
   * Resets failed attempt counters on successful authentication.
   */
  recordSuccess(ip: string, username: string): void {
    const key = this.getKey(ip, username);
    this.records.delete(key);
  }
}
