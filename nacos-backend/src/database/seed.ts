import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { getDb } from './db';
import { admins, blogPosts, bannerSettings } from './schema';
import { eq } from 'drizzle-orm';


function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const SEED_POSTS = [
  {
    title: 'NACOS Bells Chapter Kicks Off 2025 with a Bang!',
    date: 'Feb 12, 2025',
    category: 'News',
    author: 'PRO Team',
    authorRole: 'Public Relations Directorate',
    readTime: '5 min read',
    excerpt:
      'The new academic year started in style as NACOS Bells Chapter welcomed over 200 students at its annual Welcome Week event. From exciting introductions to fun socials, it was a week to remember.',
    content: `### A Fresh Start for 2025

The NACOS Bells Chapter Welcome Week 2025 was nothing short of spectacular. Over 200 students gathered at the university auditorium for what many are calling the best Welcome Week in chapter history.

### What Happened

The week kicked off with an opening ceremony featuring the Chapter President's address, followed by:

1. Ice-breaker sessions where new and returning students connected
2. A tech showcase featuring projects from senior students
3. Panel discussions on career paths in computing
4. Social events including a game night and networking dinner

> "NACOS isn't just an association — it's a family. Welcome Week proves that every single year." — Chapter President

### Looking Forward

With the momentum from Welcome Week, the chapter has announced an ambitious calendar of events for the rest of the semester, including hackathons, bootcamps, and industry talks.`,
    tags: JSON.stringify(['Welcome Week', 'NACOS', '2025', 'Community']),
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Highlights from the NACOS Coding Challenge 2025',
    date: 'Apr 25, 2025',
    category: 'Events',
    author: 'Tech Director',
    authorRole: 'Technology Directorate',
    readTime: '6 min read',
    excerpt:
      'The 2025 NACOS Coding Challenge saw over 60 participants compete across 3 rounds of algorithmic problem-solving. Here\'s a full recap.',
    content: `### The Competition

Sixty of Bells\' finest coders battled it out over three grueling rounds of algorithmic challenges. From dynamic programming to graph theory, the problems tested every aspect of computational thinking.

### Round Breakdown

1. **Round 1 — Warm-Up**: Basic data structures and string manipulation. 45 participants advanced.
2. **Round 2 — Core Algorithms**: Sorting, searching, and recursion challenges. 15 participants remained.
3. **Round 3 — Final Showdown**: Advanced problems involving dynamic programming and graph algorithms.

### Winners

- 🥇 **First Place**: Implemented an optimized solution in under 20 minutes
- 🥈 **Second Place**: Creative approach using memoization
- 🥉 **Third Place**: Clean, well-documented code that impressed the judges

> "This year's competition was on another level. The quality of solutions blew us away." — Lead Judge

### What Participants Learned

Beyond the competition, every participant walked away with improved problem-solving skills and new connections in the tech community.`,
    tags: JSON.stringify(['Coding Challenge', 'Competition', 'Algorithm', 'Hackathon']),
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: '5 Tech Skills Every CS Student Should Learn in 2025',
    date: 'Mar 20, 2025',
    category: 'Tech Tips',
    author: 'NACOS Bells',
    authorRole: 'Editorial Board',
    readTime: '8 min read',
    excerpt:
      'Whether you\'re in your 100 or 400 level, these five in-demand tech skills will make you stand out to employers.',
    content: `### The Skills That Matter

The tech industry evolves fast. Here are five skills that every computing student at Bells should invest in this year.

### 1. Cloud Computing (AWS / GCP / Azure)

Cloud is no longer optional. Understanding how to deploy, scale, and manage applications in the cloud is a fundamental skill for modern developers.

### 2. Version Control with Git

If you're not using Git, you're already behind. Every professional development team uses version control, and understanding branching, merging, and pull requests is essential.

### 3. API Development (REST & GraphQL)

Building and consuming APIs is a core skill. Learn how to design clean, documented APIs that other developers love to use.

### 4. Containerization with Docker

Docker simplifies deployment and ensures your code runs the same everywhere. Learn containers now — your future self will thank you.

### 5. AI/ML Fundamentals

You don't need to be a machine learning engineer, but understanding the basics of AI, prompt engineering, and how models work gives you a massive advantage.

> "The best time to learn these skills was yesterday. The second best time is now."

### How NACOS Can Help

Our bootcamp series covers all five of these skills. Check the events page for upcoming sessions.`,
    tags: JSON.stringify(['Skills', 'Career', 'Cloud', 'Git', 'Docker', 'AI']),
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'How to Make the Most of Your Time in NACOS',
    date: 'Jan 30, 2025',
    category: 'Student Life',
    author: 'Gen Sec',
    authorRole: 'General Secretary',
    readTime: '5 min read',
    excerpt:
      'Being in NACOS is more than just attending events. Here are practical ways to maximize your membership.',
    content: `### More Than Just Events

NACOS membership opens doors you didn't even know existed. But only if you actively engage. Here's how to get the most out of your time.

### Attend Everything (Seriously)

Every event — from small workshops to large conferences — is a chance to learn something new and meet someone who could change your career trajectory.

### Volunteer for Leadership

Don't wait until your final year. Start volunteering for committees and project teams early. Leadership experience is invaluable on your CV.

### Build Your Network

The connections you make in NACOS extend far beyond graduation. Alumni from past chapters are now working at top tech companies and are eager to help current members.

### Contribute to Projects

NACOS regularly builds tools and platforms. Contributing to these projects gives you real-world experience that's far more valuable than coursework alone.

> "I got my first internship through a connection I made at a NACOS event." — 400 Level Student`,
    tags: JSON.stringify(['Student Life', 'Leadership', 'Networking', 'Tips']),
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
  },
];

export async function seed() {
  const db = getDb();

  // Seed admin user if none exists
  const existingAdmins = await db.select().from(admins).limit(1);
  if (existingAdmins.length === 0) {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const rawPassword = process.env.ADMIN_PASSWORD || 'nacos2025';
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    await db.insert(admins).values({
      id: uuid(),
      username,
      password: hashedPassword,
      role: 'admin',
    });
    console.log(`✅ Admin user "${username}" seeded.`);
  } else {
    console.log('ℹ️  Admin user already exists, skipping seed.');
  }

  // Seed blog posts if none exist
  const existingPosts = await db.select().from(blogPosts).limit(1);
  if (existingPosts.length === 0) {
    for (const post of SEED_POSTS) {
      await db.insert(blogPosts).values({
        id: uuid(),
        slug: slugify(post.title),
        ...post,
      });
    }
    console.log(`✅ ${SEED_POSTS.length} blog posts seeded.`);
  } else {
    console.log('ℹ️  Blog posts already exist, skipping seed.');
  }

  // Seed default site banner if none exists
  const existingBanner = await db.select().from(bannerSettings).limit(1);
  if (existingBanner.length === 0) {
    await db.insert(bannerSettings).values({
      id: 'main-site-banner',
      enabled: true,
      badge: "NACOS Tech Fest '26",
      text: '— July 12–16, Main Auditorium.',
      linkText: 'Register Now →',
      linkUrl: '/events',
      accentColor: 'green',
    });
    console.log('✅ Default banner settings seeded.');
  }
}

