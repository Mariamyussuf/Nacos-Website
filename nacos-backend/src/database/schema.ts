import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─── Blog Posts ─────────────────────────────────────────────────────────────

export const blogPosts = sqliteTable('blog_posts', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').unique().notNull(),
  date: text('date'),
  category: text('category').notNull().default('News'),
  author: text('author').notNull(),
  authorRole: text('author_role'),
  readTime: text('read_time').default('4 min read'),
  excerpt: text('excerpt'),
  content: text('content'),
  tags: text('tags'), // JSON stringified array
  image: text('image'), // URL or relative path
  published: integer('published', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').default(sql`(datetime('now'))`),
});

// ─── Events ─────────────────────────────────────────────────────────────────

export const events = sqliteTable('events', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  date: text('date'),
  venue: text('venue'),
  description: text('description'),
  category: text('category').default('Seminar'),
  status: text('status').default('upcoming'), // "upcoming" | "past"
  flier: text('flier'), // image URL
  commentary: text('commentary'),
  gallery: text('gallery'), // JSON stringified array of image URLs
  createdAt: text('created_at').default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').default(sql`(datetime('now'))`),
});

// ─── Resources (Past Questions) ─────────────────────────────────────────────

export const resources = sqliteTable('resources', {
  id: text('id').primaryKey(),
  code: text('code').notNull(), // e.g. "CSC 311"
  title: text('title').notNull(),
  dept: text('dept').default('Computer Sciences'),
  level: text('level').default('100 Level'),
  semester: text('semester').default('1st Semester'),
  year: text('year').default('2025/2026'),
  size: text('size').default('1.0 MB'),
  filePath: text('file_path'), // path to uploaded PDF
  createdAt: text('created_at').default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').default(sql`(datetime('now'))`),
});

// ─── Newsletter Subscribers ─────────────────────────────────────────────────

export const subscribers = sqliteTable('subscribers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').unique().notNull(),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
});

// ─── Admin Users ────────────────────────────────────────────────────────────

export const admins = sqliteTable('admins', {
  id: text('id').primaryKey(),
  username: text('username').unique().notNull(),
  password: text('password').notNull(), // bcrypt hash
  role: text('role').default('admin'),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
});

// ─── Sessions ───────────────────────────────────────────────────────────────

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  sid: text('sid').unique().notNull(),
  data: text('data').notNull(),
  expiresAt: integer('expires_at'),
});

// ─── Site Banner / Announcement Settings ────────────────────────────────────

export const bannerSettings = sqliteTable('banner_settings', {
  id: text('id').primaryKey(),
  enabled: integer('enabled', { mode: 'boolean' }).default(true),
  badge: text('badge').default("NACOS Tech Fest '26"),
  text: text('text').default('— July 12–16, Main Auditorium.'),
  linkText: text('link_text').default('Register Now →'),
  linkUrl: text('link_url').default('/events'),
  accentColor: text('accent_color').default('green'), // "green" | "amber" | "cyan" | "coral"
  updatedAt: text('updated_at').default(sql`(datetime('now'))`),
});

// ─── Promotional Newsletter Campaigns ───────────────────────────────────────

export const newsletterCampaigns = sqliteTable('newsletter_campaigns', {
  id: text('id').primaryKey(),
  subject: text('subject').notNull(),
  preheader: text('preheader'),
  eyebrow: text('eyebrow').default('ANNOUNCEMENT'),
  headline: text('headline').notNull(),
  bannerImage: text('banner_image'),
  bodyContent: text('body_content').notNull(),
  highlights: text('highlights'), // JSON stringified array of key bullet points
  ctaText: text('cta_text').default('Learn More →'),
  ctaUrl: text('cta_url').default('https://nacos-bells.vercel.app'),
  template: text('template').default('event'), // "event" | "blog" | "general" | "custom"
  recipientCount: integer('recipient_count').default(0),
  sentBy: text('sent_by').default('admin'),
  status: text('status').default('sent'), // "sent" | "failed" | "test"
  createdAt: text('created_at').default(sql`(datetime('now'))`),
});

// ─── Contact Form Inquiries / Messages ──────────────────────────────────────

export const contactMessages = sqliteTable('contact_messages', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject'),
  message: text('message').notNull(),
  status: text('status').default('unread'), // "unread" | "read"
  createdAt: text('created_at').default(sql`(datetime('now'))`),
});

// ─── Event Registrations & Attendee Rosters ──────────────────────────────────

export const eventRegistrations = sqliteTable('event_registrations', {
  id: text('id').primaryKey(),
  eventId: text('event_id').notNull(),
  eventTitle: text('event_title').notNull(),
  fullName: text('full_name').notNull(),
  matricNumber: text('matric_number').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  department: text('department').default('Computer Sciences'),
  level: text('level').default('100 Level'),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
});



