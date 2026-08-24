import { getClient } from './db';

/**
 * Run raw SQL to create all tables.
 * Drizzle-kit push would do this automatically, but this ensures
 * tables exist on cold starts without needing drizzle-kit CLI.
 */
export async function migrate() {
  const client = getClient();

  const statements = [
    `CREATE TABLE IF NOT EXISTS blog_posts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      date TEXT,
      category TEXT NOT NULL DEFAULT 'News',
      author TEXT NOT NULL,
      author_role TEXT,
      read_time TEXT DEFAULT '4 min read',
      excerpt TEXT,
      content TEXT,
      tags TEXT,
      image TEXT,
      published INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      date TEXT,
      venue TEXT,
      description TEXT,
      category TEXT DEFAULT 'Seminar',
      status TEXT DEFAULT 'upcoming',
      flier TEXT,
      commentary TEXT,
      gallery TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS resources (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL,
      title TEXT NOT NULL,
      dept TEXT DEFAULT 'Computer Sciences',
      level TEXT DEFAULT '100 Level',
      semester TEXT DEFAULT '1st Semester',
      year TEXT DEFAULT '2025/2026',
      size TEXT DEFAULT '1.0 MB',
      file_path TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      sid TEXT UNIQUE NOT NULL,
      data TEXT NOT NULL,
      expires_at INTEGER
    )`,
    `CREATE TABLE IF NOT EXISTS banner_settings (
      id TEXT PRIMARY KEY,
      enabled INTEGER DEFAULT 1,
      badge TEXT DEFAULT 'NACOS Tech Fest ''26',
      text TEXT DEFAULT '— July 12–16, Main Auditorium.',
      link_text TEXT DEFAULT 'Register Now →',
      link_url TEXT DEFAULT '/events',
      accent_color TEXT DEFAULT 'green',
      updated_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS newsletter_campaigns (
      id TEXT PRIMARY KEY,
      subject TEXT NOT NULL,
      preheader TEXT,
      eyebrow TEXT DEFAULT 'ANNOUNCEMENT',
      headline TEXT NOT NULL,
      banner_image TEXT,
      body_content TEXT NOT NULL,
      highlights TEXT,
      cta_text TEXT DEFAULT 'Learn More →',
      cta_url TEXT DEFAULT 'https://nacos-bells.vercel.app',
      template TEXT DEFAULT 'event',
      recipient_count INTEGER DEFAULT 0,
      sent_by TEXT DEFAULT 'admin',
      status TEXT DEFAULT 'sent',
      created_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS contact_messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'unread',
      created_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS event_registrations (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      event_title TEXT NOT NULL,
      full_name TEXT NOT NULL,
      matric_number TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      department TEXT DEFAULT 'Computer Sciences',
      level TEXT DEFAULT '100 Level',
      created_at TEXT DEFAULT (datetime('now'))
    )`,
  ];

  for (const stmt of statements) {
    await client.execute(stmt);
  }

  console.log('✅ Database tables created / verified.');
}
