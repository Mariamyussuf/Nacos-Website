import { Controller, Get, Post, Body } from '@nestjs/common';
import { CaptchaService } from './captcha.service';

@Controller('captcha')
export class CaptchaController {
  constructor(private readonly captchaService: CaptchaService) {}

  /** Get a new challenge puzzle */
  @Get('challenge')
  getChallenge() {
    return this.captchaService.generateChallenge();
  }

  /** Explicit verification endpoint */
  @Post('verify')
  verifyChallenge(
    @Body('token') token: string,
    @Body('answer') answer: string | number,
  ) {
    const isValid = this.captchaService.verify(token, answer);
    return { success: isValid, message: 'Verification successful' };
  }
}
