import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsEmail,
} from 'class-validator';
import { NewsletterService } from './newsletter.service';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';

class UpdateBannerDto {
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsString()
  badge?: string;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsString()
  linkText?: string;

  @IsOptional()
  @IsString()
  linkUrl?: string;

  @IsOptional()
  @IsString()
  accentColor?: string;
}

class BroadcastNewsletterDto {
  @IsString()
  subject: string;

  @IsOptional()
  @IsString()
  preheader?: string;

  @IsOptional()
  @IsString()
  eyebrow?: string;

  @IsString()
  headline: string;

  @IsOptional()
  @IsString()
  bannerImage?: string;

  @IsString()
  bodyContent: string;

  @IsOptional()
  @IsArray()
  highlights?: string[];

  @IsOptional()
  @IsString()
  ctaText?: string;

  @IsOptional()
  @IsString()
  ctaUrl?: string;

  @IsOptional()
  @IsString()
  template?: string;
}

class TestNewsletterDto extends BroadcastNewsletterDto {
  @IsEmail()
  testEmail: string;
}

@Controller()
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  // ─── Site Banner ───────────────────────────────────────────────────────────

  @Get('banner')
  getBanner() {
    return this.newsletterService.getBanner();
  }

  @UseGuards(AuthenticatedGuard)
  @Patch('banner')
  updateBanner(@Body() dto: UpdateBannerDto) {
    return this.newsletterService.updateBanner(dto);
  }

  // ─── Promotional Newsletter Dispatch ───────────────────────────────────────

  @UseGuards(AuthenticatedGuard)
  @Post('newsletter/send')
  broadcastNewsletter(@Body() dto: BroadcastNewsletterDto, @Req() req: any) {
    const adminUser = req.user?.username || 'admin';
    return this.newsletterService.broadcastNewsletter(dto, adminUser);
  }

  @UseGuards(AuthenticatedGuard)
  @Post('newsletter/test')
  sendTestEmail(@Body() dto: TestNewsletterDto) {
    return this.newsletterService.sendTestEmail(dto, dto.testEmail);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('newsletter/campaigns')
  getCampaigns() {
    return this.newsletterService.getCampaigns();
  }
}
