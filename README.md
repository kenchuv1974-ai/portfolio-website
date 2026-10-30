# SUSHMITA — THE SERIES (Full Editable Portfolio CMS)

A cinematic, streaming-inspired portfolio with a **Secure Admin CMS Dashboard** allowing full real-time content management without touching source code, while preserving 100% of the public website's visual identity, Framer Motion animations, Lenis smooth scrolling, and responsive layouts.

> A personal portfolio with a fictional streaming-platform look. It is not affiliated with Netflix or any other streaming service and uses none of their logos.

---

## ⚡ Quick Start

### Prerequisites
- **Node.js 18+** or higher
- **npm** or **pnpm**

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/kenchuv1974-ai/portfolio-website.git
cd portfolio-website

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173/` in your browser.

### Production Build & Preview

```bash
# Typecheck & bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🔐 Administrator Access & Credentials

The portfolio includes an embedded, high-security admin terminal accessible from anywhere on the public site:

### Accessing the Admin Console
- **Direct Hash Link:** Append `#admin` to the URL (e.g., `http://localhost:5173/#admin`).
- **Keyboard Shortcut:** Press `Ctrl + Shift + A` (or `Ctrl + Alt + A`).
- **Navigation Shortcuts:** Click the **⚡ Admin** button located in the top navigation bar or the footer console trigger.



> **Security Note:** Authentication uses cryptographic client/server-compatible SHA-256 salted hashing with brute-force rate-limiting (max 5 failed attempts locks the terminal for 15 minutes) and signed session expiration tokens (24 hours).

---

## 🛠️ Content Management System (CMS) Features

All portfolio sections are fully editable via the Admin Dashboard:

| Section | Capabilities |
| :--- | :--- |
| **Profile & Hero** | Full name, display name, first name, professional title, subtitle, bio, series tag, location, email, LinkedIn, GitHub, portrait upload, resume PDF upload. |
| **Originals (Projects)** | Full CRUD: title, year, genre, logline, technology tags, build details, metrics, live URLs, GitHub repos, custom color palettes, and hero motifs. |
| **Achievements** | Full CRUD: title, subtitle, organization, year, laurel badge text, verification URLs, and display order. |
| **Certifications** | Full CRUD: credential title, issuer, issue date, verification link, and credential ID. |
| **Skills & Tech** | Category grouping (Frontend, Backend, AI/ML, Tools), badge chips with custom monospace tags and contextual notes, plus cross-project evidence. |
| **Education** | Institution, degree, specialization, study period, and GPA/percentage scores. |
| **Experience** | Role, company, duration, location, responsibilities, and key metrics. |
| **Journey & Seasons** | Multi-season breakdown with individual episode synopses, runtimes, palettes, and episode codes. |
| **Top Picks (Top 10)** | Top 10 carousel ranking, match percentages, tags, and category labels. |
| **Intro Slides** | Interactive "▶ Play Intro" slideshow sequence cards with kickers, titles, chips, and bullet highlights. |
| **Viewer Profiles** | "Who's Watching?" profile avatars, custom subtitle blurbs, and theme colors. |
| **Media Storage** | Local and cloud media manager, image uploader, resume PDF uploader, and instant Data-URI copier. |
| **Site Settings & Backup** | Global metadata, page title, SEO meta description, OG social image, copyright, footer quotes, one-click JSON backup export and restore. |

---

## 💾 Architecture & Data Persistence

1. **Local Persistent Storage Engine (`localStorage` + Data URI):**
   - Out of the box, all edits, uploaded images, and PDFs are persisted in the browser's persistent local storage engine with immediate draft and publish states.
   - Supports **Save Draft** (work-in-progress edits) and **Publish Live** (pushes to the live public site without rebuilding).
   - Includes **Preview Draft** toggle to visually test drafts in the public layout before publishing.
   - Built-in **JSON Backup Export & Restore** under *Site Settings & Backup* allows backing up and moving data across machines.

2. **Supabase Cloud Database & Storage (Optional / Production):**
   - A complete PostgreSQL schema is included in [`supabase/schema.sql`](supabase/schema.sql).
   - To connect Supabase, copy `.env.example` to `.env` and fill in:
     ```env
     VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key
     ```
   - Row Level Security (RLS) ensures public read access for published content and restricted write access for authenticated administrators.

---

## 🎨 Visual Identity & Animation Preservation

The public website retains 100% of its original design system:
- **Streaming Aesthetics:** Cinematic black `#0b0b0f`, deep crimson `#e50914`, and gold accents.
- **Typography:** `Bebas Neue` for cinematic headlines, `Inter` for clean body typography, and `JetBrains Mono` for metadata tags.
- **Framer Motion 11:** Preserves all horizontal carousels, billboard reveal sequences, modal viewports, spring physics, and cursor tracking.
- **Lenis Smooth Scroll:** Smooth momentum scrolling preserved throughout public routes.

---

## 🚀 Deployment Guide

### Vercel / Netlify
1. Connect your GitHub repository (`portfolio-website`).
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Add environment variables if using Supabase (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).

### GitHub Pages / Static Hosting
1. Run `npm run build`.
2. Deploy the resulting `dist/` directory.

---

## 📜 License

Created for personal portfolio presentation and educational demonstration.
