# NACOS Bells Chapter — Official Website

The official website for the **NACOS Bells Chapter** at Bells University of Technology, Ota. Built to serve computing students with events, resources, executive listings, blog posts, and community updates.

## Author

**Yussuf Mariam Agbeke** — President, NACOS Bells Chapter

## Tech Stack

- **Frontend:** React, JavaScript, Tailwind CSS, Framer Motion
- **Backend:** Python, Flask
- **Database:** SQLite
- **Fonts:** Clash Display + Satoshi (via Fontshare)
- **Deployment:** Vercel (frontend) + Flask API

## Features

- Home page with animated hero, tracks overview, student projects, events timeline, and community stats
- Executives directory with initials avatars
- Events page with upcoming/past event listings and gallery
- Resources vault — past questions downloadable by department and level
- Blog with admin CMS (create, edit, delete posts)
- Contact form with newsletter subscription
- Light / Dark mode toggle
- Fully responsive (mobile-first)

## Getting Started

### Prerequisites

Ensure you have the following installed:
- Node.js & npm
- Python 3
- Flask

### 1. Clone the Repository

```bash
git clone https://github.com/Mariamyussuf/Nacos-Website.git
cd Nacos-Website
```

### 2. Install Dependencies

**Backend (Flask)**
```bash
pip install -r requirements.txt
```

**Frontend (React)**
```bash
npm install
```

### 3. Run the Project

**Start the Flask Backend**
```bash
python app.py
```
Runs at `http://127.0.0.1:5000/`

**Start the React Frontend**
```bash
npm start
```
Runs at `http://localhost:3000/`

### Build for Production

```bash
npm run build
```

Creates a production-ready `build/` folder for the frontend.

## Notes

- Admin panel is accessible at `/admin` — manage blogs, events, and resources from the dashboard.
- Newsletter subscriptions are stored in `subscribers.db`.
- Past questions are stored via `localStorage` and managed through the admin CMS.
