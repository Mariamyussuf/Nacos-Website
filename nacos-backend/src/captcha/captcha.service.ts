import { Injectable, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import { v4 as uuid } from 'uuid';

export interface CaptchaChallenge {
  challengeId: string;
  question: string;
  token: string;
  expiresInSeconds: number;
}

@Injectable()
export class CaptchaService {
  private readonly secret = process.env.SESSION_SECRET || 'nacos-captcha-secret-key-2026';
  private readonly TTL_MS = 5 * 60 * 1000; // 5 minutes
  private readonly usedChallenges = new Set<string>();

  /**
   * Generates a new cryptographic math/text verification challenge.
   */
  generateChallenge(): CaptchaChallenge {
    const challengeId = uuid();
    const expiresAt = Date.now() + this.TTL_MS;

    // Randomize operation between addition and subtraction
    const isAddition = Math.random() > 0.35;
    let question = '';
    let answer = 0;

    if (isAddition) {
      const a = Math.floor(Math.random() * 20) + 3;
      const b = Math.floor(Math.random() * 15) + 2;
      question = `What is ${a} + ${b}?`;
      answer = a + b;
    } else {
      const a = Math.floor(Math.random() * 25) + 10;
      const b = Math.floor(Math.random() * 9) + 1;
      question = `What is ${a} - ${b}?`;
      answer = a - b;
    }

    const answerHash = crypto
      .createHmac('sha256', this.secret)
      .update(String(answer).trim().toLowerCase())
      .digest('hex');

    // Create tamper-proof payload
    const payload = JSON.stringify({
      challengeId,
      answerHash,
      expiresAt,
    });

    const signature = crypto
      .createHmac('sha256', this.secret)
      .update(payload)
      .digest('hex');

    const token = Buffer.from(JSON.stringify({ payload, signature })).toString('base64url');

    return {
      challengeId,
      question,
      token,
      expiresInSeconds: Math.ceil(this.TTL_MS / 1000),
    };
  }

  /**
   * Verifies the client's answer against the signed token.
   * Defends against replay attacks, tampering, and expiration.
   */
  verify(token?: string, answer?: string | number): boolean {
    if (!token || answer === undefined || answer === null || String(answer).trim() === '') {
      throw new BadRequestException('Security verification (CAPTCHA) is required');
    }

    let parsedToken: { payload: string; signature: string };
    try {
      parsedToken = JSON.parse(Buffer.from(token, 'base64url').toString('utf-8'));
    } catch {
      throw new BadRequestException('Invalid CAPTCHA security token format');
    }

    const { payload, signature } = parsedToken;

    // 1. Verify HMAC signature to prevent tampering
    const expectedSig = crypto
      .createHmac('sha256', this.secret)
      .update(payload)
      .digest('hex');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      throw new BadRequestException('CAPTCHA token signature verification failed');
    }

    const data: { challengeId: string; answerHash: string; expiresAt: number } = JSON.parse(payload);

    // 2. Check expiration
    if (Date.now() > data.expiresAt) {
      throw new BadRequestException('CAPTCHA challenge has expired. Please refresh and try again.');
    }

    // 3. Prevent Replay Attack
    if (this.usedChallenges.has(data.challengeId)) {
      throw new BadRequestException('This CAPTCHA challenge has already been used. Please refresh.');
    }

    // 4. Verify answer match
    const cleanAnswer = String(answer).trim().toLowerCase();
    const candidateHash = crypto
      .createHmac('sha256', this.secret)
      .update(cleanAnswer)
      .digest('hex');

    if (candidateHash !== data.answerHash) {
      throw new BadRequestException('Incorrect security challenge answer. Please try again.');
    }

    // Mark as used
    this.usedChallenges.add(data.challengeId);

    // Housekeeping: remove old challenge IDs
    if (this.usedChallenges.size > 2000) {
      this.usedChallenges.clear();
    }

    return true;
  }
}
