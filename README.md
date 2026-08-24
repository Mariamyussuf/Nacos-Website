# NACOS Bells Chapter — Official Web Application & Student Portal

The official web platform and community hub for the **Nigeria Association of Computing Students (NACOS) — Bells University of Technology Chapter**, Ota. Built to serve computing students across Computer Science, Information Technology, and Cyber Security with academic resources, event tracking, leadership directories, publications, and an administrative control center.

---

##  Project Leadership & Authorship

- **Author & President:** Yussuf Mariam Agbeke — *President, NACOS Bells Chapter*
- **Institution:** Bells University of Technology, Ota, Ogun State, Nigeria
- **College:** College of Information and Communications Technology (CIS)

---

##  Full-Stack Technology Stack

### Frontend
- **Framework:** React.js (Create React App / Webpack)
- **Styling:** Vanilla CSS + Tailwind CSS utilities with custom dark glassmorphism design system
- **Motion & Interactions:** Framer Motion, Three.js / Canvas 3D particle hero
- **Typography:** Clash Display (Display Serif) + Satoshi (Sans-Serif) via Fontshare CDN
- **Icons:** Tabler Icons Webfont (`@tabler/icons-webfont`)
- **State & Sync:** Modular React architecture, cross-tab custom events (`window.dispatchEvent`), and localStorage offline caching

### Backend (`nacos-backend`)
- **Framework:** NestJS (Node.js + TypeScript)
- **Database & ORM:** SQLite / LibSQL with Drizzle ORM and automatic schema migrations
- **Authentication:** Passport.js (Local Strategy) + express-session cookie authentication
- **Email & Communications:** Nodemailer SMTP engine supporting Gmail, Brevo, SendGrid, and university mail servers
- **File Management:** Multer storage for cover images, event fliers, and PDF past question documents

---

##  Features & Architecture

### 1. Public Student Community Pages
- **Hero & Tracks:** Interactive particle canvas, computing track deep-dives (Software Engineering, AI/ML, Cybersecurity, UI/UX).
- **Events Directory (`/events`):** Upcoming & past events, category filtering, flier downloads, event galleries, and post-event commentary.
- **Academic Course Vault (`/resources`):** Searchable & filterable repository of past exam questions across 100L–400L for Computer Science, IT, and Cyber Security with direct PDF downloads.
- **Blog & Publications (`/blog`):** Community stories with category filters, estimated reading times, tag browsing, reading progress bar, bookmarks, and one-click social sharing (WhatsApp, X/Twitter, LinkedIn).
- **Student Portal (`/portal`):** Student verification, course registration overview, GPA tracker, and dues clearance verification.
- **Executive Council (`/executives`):** Leadership profiles, executive portfolios, and official social handles.
- **Contact & Inquiries (`/contact`):** Direct inquiry form with asynchronous delivery into the Admin inbox.

### 2. Administrator Control Center (`/admin`)
Modular control panel with password-gated access:
- ** Blog Stories:** Create, edit, preview, and delete markdown publications with cover image uploads.
- ** Event Records:** Schedule events, upload fliers, update attendance status, and publish post-event commentary.
- ** Course Vault:** Upload course exam PDFs, assign department/level/semester codes, and manage repository records.
- ** Site Announcement Banner:** Real-time customization of the top site banner (toggle on/off, custom badge, text, link, and 4 theme accent colors: *Emerald Green*, *Electric Amber*, *Tech Cyan*, *Alert Coral*).
- ** Promotional Newsletter Campaign Studio:**
  - Standard branded HTML email generator with hero banner, category eyebrow tag, formatted paragraphs, bullet highlights, and CTA button.
  - Pre-built templates for Event Promos, Story Digests, and Executive Communiques.
  - Live interactive Desktop & Mobile inbox simulator.
  - Direct dispatch engine with test sending and bulk broadcasting to all registered student subscribers.
  - One-click CSV subscriber export and BCC email copy.
- ** Contact Inquiries Inbox:** Review incoming inquiries from students/partners, unread counters, mark as read, direct `mailto:` reply actions, and message management.

---

##  Getting Started

### Prerequisites
- **Node.js:** v18+ or v20+
- **npm:** v9+

---

### 1. Clone the Repository

```bash
git clone https://github.com/Mariamyussuf/Nacos-Website.git
cd Nacos-Website
```

---

### 2. Backend Setup (`nacos-backend`)

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd nacos-backend
   npm install
   ```

2. Configure environment variables by creating `.env`:
   ```bash
   cp .env.example .env
   ```

   **Sample `.env` configuration:**
   ```env
   # Admin Credentials
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=adminpassword

   # Session Security
   SESSION_SECRET=nacos_secret_session_key_2026

   # Database
   DATABASE_URL=file:./nacos.db

   # CORS & Port
   CORS_ORIGIN=http://localhost:3000
   PORT=3001

   # SMTP Email Configuration (Optional - for live promotional email delivery)
   # Works with Gmail App Passwords, SendGrid, Brevo, or University SMTP
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM="NACOS Bells Chapter <nacos@bellsuniversity.edu.ng>"
   ```

3. Initialize database tables and seed default administrator:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. Start the NestJS backend server:
   ```bash
   npm run start:dev
   ```
   *Backend runs on `http://localhost:3001/api`.*

---

### 3. Frontend Setup (React App)

1. In the root directory, install dependencies:
   ```bash
   npm install
   ```

2. Start the React development server:
   ```bash
   npm start
   ```
   *Frontend opens automatically at `http://localhost:3000`.*

---

## 🔐 Default Administrator Login

Access the CMS dashboard at **`http://localhost:3000/admin`**:
- **Username:** `admin`
- **Password:** `adminpassword` *(Configurable in `nacos-backend/.env`)*

---

## 📦 Building for Production

### Frontend Production Build
```bash
npm run build
```
Creates an optimized, production-ready build in the `build/` directory.

### Backend Production Build
```bash
cd nacos-backend
npm run build
npm run start:prod
```

---

## 🌐 Production Deployment Guide

- **Frontend:** Deploy the root project to [Vercel](https://vercel.com) or [Netlify](https://netlify.com) with root directory set to `./` and build command `npm run build`.
- **Backend:** Deploy `nacos-backend` to [Render](https://render.com), [Railway](https://railway.app), or [Fly.io](https://fly.io). For serverless databases, configure `DATABASE_URL` with a hosted [Turso LibSQL](https://turso.tech) instance.

---

## 📄 License & Attribution

Developed with pride for the **Nigeria Association of Computing Students (NACOS), Bells University of Technology Chapter**.
All rights reserved © 2026.
