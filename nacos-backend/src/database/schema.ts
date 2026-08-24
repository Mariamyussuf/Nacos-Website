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
