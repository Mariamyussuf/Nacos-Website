import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import { getDb } from '../database/db';
import { bannerSettings, newsletterCampaigns, subscribers } from '../database/schema';

export interface BannerSettingsDto {
  enabled?: boolean;
  badge?: string;
  text?: string;
  linkText?: string;
  linkUrl?: string;
  accentColor?: string;
}

export interface BroadcastCampaignDto {
  subject: string;
  preheader?: string;
  eyebrow?: string;
  headline: string;
  bannerImage?: string;
  bodyContent: string;
  highlights?: string[];
  ctaText?: string;
  ctaUrl?: string;
  template?: string;
}

@Injectable()
export class NewsletterService {
  constructor() {
    const apiKey = process.env.SENDBYTE_API_KEY;
    if (apiKey) {
      console.log('📧 Sendbyte email API configured.');
    } else {
      console.log('ℹ️  SENDBYTE_API_KEY not set. Running in simulated email broadcast mode.');
    }
  }

  // ─── Sendbyte HTTP API Helper ──────────────────────────────────────────────

  private async sendViaSendbyte(to: string | string[], subject: string, html: string): Promise<boolean> {
    const apiKey = process.env.SENDBYTE_API_KEY;
    const from = process.env.SENDBYTE_FROM || 'bellsnacos@gmail.com';
    const fromName = process.env.SENDBYTE_FROM_NAME || 'NACOS Bells Chapter';

    if (!apiKey) return false;

    const recipients = Array.isArray(to) ? to : [to];

    try {
      const response = await fetch('https://api.sendbyte.africa/v1/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `${fromName} <${from}>`,
          to: recipients,
          subject,
          html,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Sendbyte API error ${response.status}:`, errorBody);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Sendbyte fetch error:', err);
      return false;
    }
  }

  private get db() {
    return getDb();
  }

  // ─── Site Banner Settings ──────────────────────────────────────────────────

  async getBanner() {
    const db = this.db;
    const rows = await db.select().from(bannerSettings).limit(1);
    if (rows.length === 0) {
      return {
        id: 'main-site-banner',
        enabled: true,
        badge: "NACOS Tech Fest '26",
        text: '— July 12–16, Main Auditorium.',
        linkText: 'Register Now →',
        linkUrl: '/events',
        accentColor: 'green',
      };
    }
    return rows[0];
  }

  async updateBanner(dto: BannerSettingsDto) {
    const db = this.db;
    const existing = await db.select().from(bannerSettings).limit(1);

    if (existing.length === 0) {
      await db.insert(bannerSettings).values({
        id: 'main-site-banner',
        enabled: dto.enabled !== undefined ? dto.enabled : true,
        badge: dto.badge || "NACOS Tech Fest '26",
        text: dto.text || '— July 12–16, Main Auditorium.',
        linkText: dto.linkText || 'Register Now →',
        linkUrl: dto.linkUrl || '/events',
        accentColor: dto.accentColor || 'green',
      });
    } else {
      await db
        .update(bannerSettings)
        .set({
          ...dto,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(bannerSettings.id, existing[0].id));
    }

    return this.getBanner();
  }

  // ─── Responsive Promotional HTML Email Builder ─────────────────────────────

  generatePromotionalHtml(dto: BroadcastCampaignDto): string {
    const accentColor = '#2D7A22';
    const accentHover = '#3A9C2D';
    const bgColor = '#0A0A08';
    const cardBg = '#111110';
    const textColor = '#F0EDE6';
    const mutedColor = '#888880';
    const borderColor = '#222220';

    const highlightsHtml =
      dto.highlights && dto.highlights.length > 0
        ? `
        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0; background-color: #161614; border: 1px solid ${borderColor}; border-radius: 8px; padding: 16px;">
          <tr>
            <td>
              <p style="margin: 0 0 10px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: ${accentColor}; font-weight: 600;">Key Details & Highlights</p>
              <ul style="margin: 0; padding-left: 20px; color: ${textColor}; font-size: 13px; line-height: 1.6;">
                ${dto.highlights.map((h) => `<li style="margin-bottom: 6px;">${h}</li>`).join('')}
              </ul>
            </td>
          </tr>
        </table>
      `
        : '';

    const heroImageHtml = dto.bannerImage
      ? `
        <tr>
          <td style="padding: 0 0 24px 0;">
            <img src="${dto.bannerImage}" alt="Promo Banner" style="width: 100%; max-height: 320px; object-fit: cover; border-radius: 8px; display: block; border: 1px solid ${borderColor};" />
          </td>
        </tr>
      `
      : '';

    const formattedBody = (dto.bodyContent || '')
      .split('\n\n')
      .map((p) => `<p style="margin: 0 0 16px 0; color: #CCCCCC; font-size: 14px; line-height: 1.7;">${p.replace(/\n/g, '<br/>')}</p>`)
      .join('');

    const ctaHtml = dto.ctaText && dto.ctaUrl
      ? `
        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 28px 0 10px 0;">
          <tr>
            <td align="center">
              <a href="${dto.ctaUrl}" target="_blank" style="display: inline-block; background-color: ${accentColor}; color: #FFFFFF; text-decoration: none; padding: 13px 32px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; border-radius: 6px; box-shadow: 0 4px 14px rgba(45, 122, 34, 0.4);">
                ${dto.ctaText}
              </a>
            </td>
          </tr>
        </table>
      `
      : '';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${dto.subject}</title>
  <style>
    body { margin: 0; padding: 0; background-color: ${bgColor}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    table { border-collapse: collapse; }
    img { max-width: 100%; height: auto; }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; padding: 16px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 24px 0; background-color: ${bgColor};">
  ${dto.preheader ? `<div style="display: none; max-height: 0px; overflow: hidden;">${dto.preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>` : ''}

  <!-- Main Container -->
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding: 10px;">
        <table class="email-container" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: ${cardBg}; border: 1px solid ${borderColor}; border-radius: 12px; overflow: hidden; padding: 32px 28px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          
          <!-- Header / Logo -->
          <tr>
            <td style="padding-bottom: 24px; border-bottom: 1px solid ${borderColor};">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span style="display: inline-block; width: 10px; height: 10px; background-color: ${accentColor}; border-radius: 50%; margin-right: 6px;"></span>
                      <strong style="color: ${textColor}; font-size: 16px; letter-spacing: 0.5px;">NACOS BELLS CHAPTER</strong>
                    </div>
                  </td>
                  <td align="right">
                    <span style="font-size: 10px; color: ${mutedColor}; text-transform: uppercase; letter-spacing: 1.5px;">Official Broadcast</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Eyebrow Badge -->
          <tr>
            <td style="padding-top: 24px;">
              <span style="display: inline-block; background-color: rgba(45, 122, 34, 0.15); border: 1px solid rgba(45, 122, 34, 0.3); color: ${accentHover}; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; padding: 4px 10px; border-radius: 4px; margin-bottom: 12px;">
                ${dto.eyebrow || 'COMMUNITY UPDATE'}
              </span>
            </td>
          </tr>

          <!-- Headline -->
          <tr>
            <td>
              <h1 style="margin: 0 0 20px 0; color: #FFFFFF; font-size: 22px; font-weight: 700; line-height: 1.35; letter-spacing: -0.3px;">
                ${dto.headline}
              </h1>
            </td>
          </tr>

          <!-- Hero Promotional Banner Image -->
          ${heroImageHtml}

          <!-- Main Body Text -->
          <tr>
            <td>
              ${formattedBody}
            </td>
          </tr>

          <!-- Highlights Box (Optional) -->
          ${highlightsHtml ? `<tr><td>${highlightsHtml}</td></tr>` : ''}

          <!-- Call to Action Button -->
          ${ctaHtml ? `<tr><td>${ctaHtml}</td></tr>` : ''}

          <!-- Footer -->
          <tr>
            <td style="padding-top: 36px; margin-top: 24px; border-top: 1px solid ${borderColor}; text-align: center;">
              <p style="margin: 0 0 8px 0; color: ${mutedColor}; font-size: 11px;">
                Nigeria Association of Computing Students (NACOS) — Bells Chapter
              </p>
              <p style="margin: 0 0 12px 0; color: #555550; font-size: 10px; line-height: 1.5;">
                Bells University of Technology, Ota, Ogun State, Nigeria<br/>
                Empowering computing students through technology, innovation, and leadership.
              </p>
              <p style="margin: 0; color: #444440; font-size: 10px;">
                You are receiving this official communication because you subscribed at nacosbells.org.<br/>
                <a href="https://nacos-bells.vercel.app" style="color: ${accentColor}; text-decoration: none;">Visit Website</a> &bull; 
                <a href="https://nacos-bells.vercel.app/contact" style="color: ${accentColor}; text-decoration: none;">Contact Executives</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }

  // ─── Broadcast to All Subscribers ──────────────────────────────────────────

  async broadcastNewsletter(dto: BroadcastCampaignDto, sentBy: string = 'admin') {
    const db = this.db;

    // Fetch all active subscribers
    const subList = await db.select().from(subscribers);
    const recipientEmails = subList.map((s) => s.email);

    const htmlContent = this.generatePromotionalHtml(dto);

    let deliveredCount = 0;
    let status: 'sent' | 'failed' | 'test' = 'sent';

    if (process.env.SENDBYTE_API_KEY && recipientEmails.length > 0) {
      // Send individually to preserve recipient privacy (no BCC exposure)
      let failCount = 0;
      for (const email of recipientEmails) {
        const ok = await this.sendViaSendbyte(email, dto.subject, htmlContent);
        if (ok) deliveredCount++; else failCount++;
      }
      if (failCount > 0 && deliveredCount === 0) status = 'failed';
    } else {
      // Simulated / dev dispatch
      console.log(`📡 [Dev Mode] Simulated broadcast of "${dto.subject}" to ${recipientEmails.length} subscribers.`);
      deliveredCount = recipientEmails.length;
    }

    // Save campaign record in DB
    const campaignId = uuid();
    await db.insert(newsletterCampaigns).values({
      id: campaignId,
      subject: dto.subject,
      preheader: dto.preheader || '',
      eyebrow: dto.eyebrow || 'ANNOUNCEMENT',
      headline: dto.headline,
      bannerImage: dto.bannerImage || '',
      bodyContent: dto.bodyContent,
      highlights: dto.highlights ? JSON.stringify(dto.highlights) : null,
      ctaText: dto.ctaText || 'Learn More →',
      ctaUrl: dto.ctaUrl || 'https://nacos-bells.vercel.app',
      template: dto.template || 'event',
      recipientCount: deliveredCount,
      sentBy,
      status,
    });

    return {
      success: status !== 'failed',
      campaignId,
      recipientCount: deliveredCount,
      message: `Broadcast successfully sent to ${deliveredCount} subscriber(s)!`,
    };
  }

  // ─── Send Test Email ───────────────────────────────────────────────────────

  async sendTestEmail(dto: BroadcastCampaignDto, recipientEmail: string) {
    const htmlContent = this.generatePromotionalHtml(dto);

    if (process.env.SENDBYTE_API_KEY) {
      const ok = await this.sendViaSendbyte(recipientEmail, `[TEST] ${dto.subject}`, htmlContent);
      if (!ok) {
        throw new InternalServerErrorException('Failed to send test email via Sendbyte. Check your API key and logs.');
      }
    } else {
      console.log(`📡 [Dev Mode] Simulated test email sent to "${recipientEmail}".`);
    }

    return {
      success: true,
      message: `Test email successfully sent to ${recipientEmail}!`,
    };
  }

  // ─── Campaign History ──────────────────────────────────────────────────────

  async getCampaigns() {
    const db = this.db;
    return db
      .select()
      .from(newsletterCampaigns)
      .orderBy(sql`${newsletterCampaigns.createdAt} DESC`);
  }
}
