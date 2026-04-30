# Pulkit Singh — Portfolio

A full-stack portfolio website built with **Next.js 14**, **Three.js**, **Tailwind CSS**, and **MongoDB**.

## ✨ Features

- 🌌 **Three.js Loading Screen** — Animated particle field with icosahedron wireframe
- 🎭 **Three.js Hero Background** — Interactive torus knot with mouse parallax
- ⌨️ **Typewriter Effect** — Cycling role titles in the hero
- 📱 **Fully Responsive** — Mobile-first design
- 🗄️ **MongoDB Backend** — All content stored and editable from admin
- 🔐 **Admin Panel** — Protected CRUD dashboard for all sections
- 🎨 **Dark Cyberpunk Theme** — Cyan/violet accent palette

## 🗂️ Project Structure

```
pulkit-portfolio/
├── app/
│   ├── page.tsx                    # Main portfolio page
│   ├── layout.tsx                  # Root layout with SessionProvider
│   ├── globals.css                 # Global styles + Tailwind
│   ├── api/
│   │   ├── auth/[...nextauth]/     # NextAuth credentials
│   │   ├── projects/               # CRUD API
│   │   ├── experience/             # CRUD API
│   │   ├── skills/                 # CRUD API
│   │   └── achievements/           # CRUD API
│   └── admin/
│       ├── login/                  # Admin login page
│       ├── page.tsx                # Admin dashboard
│       ├── projects/               # Projects CRUD UI
│       ├── experience/             # Experience CRUD UI
│       ├── skills/                 # Skills CRUD UI
│       └── achievements/           # Achievements CRUD UI
├── components/
│   ├── Navbar.tsx                  # Sticky navbar
│   ├── Providers.tsx               # NextAuth SessionProvider
│   ├── three/
│   │   ├── LoadingScreen.tsx       # Three.js intro animation
│   │   └── HeroBackground.tsx      # Three.js hero 3D bg
│   └── sections/
│       ├── Hero.tsx                # Hero section
│       ├── Skills.tsx              # Skills with progress bars
│       ├── Experience.tsx          # Experience tab layout
│       ├── Projects.tsx            # Project cards
│       ├── Achievements.tsx        # Hackathon wins
│       └── Contact.tsx             # Contact & footer
├── lib/
│   ├── dbConnect.ts                # MongoDB connection (cached)
│   └── models/
│       ├── Project.ts              # Mongoose schema
│       ├── Experience.ts
│       ├── Skill.ts
│       └── Achievement.ts
├── scripts/
│   └── seed.ts                     # One-time DB seeder
└── middleware.ts                   # Admin route protection
```

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy the example file and fill in your values:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/portfolio
NEXTAUTH_SECRET=your-random-secret-32-chars-minimum
NEXTAUTH_URL=http://<your-domain>:3000
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-secure-admin-password
```

### 3. Get a MongoDB URI

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas) → create a free cluster
2. Click **Connect** → **Drivers** → copy the connection string
3. Replace `<password>` with your Atlas password
4. Paste it as `MONGODB_URI` in `.env.local`

### 4. Seed the database

```bash
npx ts-node -r tsconfig-paths/register scripts/seed.ts
```

This populates MongoDB with all your resume data (projects, experience, skills, achievements).

### 5. Run the dev server

```bash
npm run dev
```

Open your browser to `http://<your-domain>:3000` 🎉

## 🔐 Admin Panel

Navigate to `/admin` on your local or deployed domain

Login with the credentials you set in `.env.local`:
- **Email**: `ADMIN_EMAIL`
- **Password**: `ADMIN_PASSWORD`

From the admin dashboard you can:
- ➕ Add / ✏️ Edit / 🗑️ Delete **Projects**
- ➕ Add / ✏️ Edit / 🗑️ Delete **Experience** entries
- ➕ Add / ✏️ Edit / 🗑️ Delete **Skills** with proficiency sliders
- ➕ Add / ✏️ Edit / 🗑️ Delete **Achievements**

## 🌐 Deploying to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

In the Vercel dashboard → **Settings → Environment Variables**, add:
- `MONGODB_URI`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` → set to your production URL (e.g. `https://pulkit.vercel.app`)
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

## 📐 MongoDB Schemas

### `projects`
| Field | Type | Description |
|-------|------|-------------|
| title | String | Project name |
| description | String | Short description |
| techStack | String[] | Technologies used |
| highlights | String[] | Bullet points |
| liveUrl | String | Live demo URL |
| githubUrl | String | GitHub repo URL |
| featured | Boolean | Show featured badge |
| order | Number | Display order |

### `experiences`
| Field | Type | Description |
|-------|------|-------------|
| role | String | Job title |
| company | String | Company/club name |
| type | Enum | internship/research/club/leadership/part-time |
| location | String | City, Country |
| startDate | String | e.g. "Apr 2025" |
| endDate | String | e.g. "Jul 2025" |
| current | Boolean | Ongoing role |
| bullets | String[] | Achievement bullets |
| techStack | String[] | Technologies |
| order | Number | Display order |

### `skills`
| Field | Type | Description |
|-------|------|-------------|
| name | String | Skill name |
| category | Enum | technical/frontend/backend/ml/data |
| proficiency | Number | 1–100 percentage |
| icon | String | Emoji or text icon |
| order | Number | Display order |

### `achievements`
| Field | Type | Description |
|-------|------|-------------|
| title | String | Achievement title |
| event | String | Event/competition name |
| year | Number | Year |
| description | String | What was achieved |
| rank | String | e.g. "3rd Place" |
| international | Boolean | International event |
| order | Number | Display order |

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| 3D Graphics | Three.js |
| Styling | Tailwind CSS |
| Database | MongoDB + Mongoose |
| Auth | NextAuth.js (Credentials) |
| Animation | CSS + Framer Motion |
| Deployment | Vercel |

---

Built by **Pulkit Singh** · VIT Chennai · B.Tech CSE 2027
