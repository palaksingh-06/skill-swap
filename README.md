<div align="center">

# SkillSwap

**A peer-to-peer learning platform where students teach what they know and learn what they need.**

[Live Demo](https://skill-swap-1-4w1n.onrender.com/) · [Report a Bug](../../issues) · [Request a Feature](../../issues)

![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?logo=socketdotio&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)

</div>

> **Note:** The demo runs on Render's free tier. If the backend has been idle, the first request can take 30-60 seconds while the server wakes up.

---

## Table of Contents

- [About](#about)
- [Screenshots](#screenshots)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [API Overview](#api-overview)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment Notes](#deployment-notes)
- [Roadmap](#roadmap)
- [Author](#author)

---

## About

SkillSwap connects learners and mentors through **mutual skill exchange**. You list the skills you can teach and the skills you want to learn, and the platform matches you with people whose lists complement yours. Matched users can send requests, schedule sessions, meet over built-in video calls, chat, leave reviews and earn XP and badges as they go.

It also includes **Skill Buddy**, an AI learning assistant that answers questions and recommends real mentors from the platform's own database.

---

## Screenshots

> Add your images to `docs/screenshots/` using the file names below, and they will show up here automatically.
> Tip: use a consistent browser width (about 1440px) and PNG or WebP files under 500 KB each.

### 1. Landing Page

![Landing page](docs/screenshots/01-landing.png)

*Hero section, featured skill swaps and call to action.*

### 2. Dashboard

![Dashboard](docs/screenshots/02-dashboard.png)

*Overview of upcoming sessions, XP, level progress and activity.*

### 3. Skill Discovery and Matching

![Skill discovery and matches](docs/screenshots/03-skill-matching.png)

*Browse skills by category, search users, and see mutual teach/learn matches.*

### 4. Profile and Public Profile

![Profile](docs/screenshots/04-profile.png)

*Skills to teach and learn, reviews, badges and public mentor profile.*

### 5. Video Session

![Video call](docs/screenshots/05-video-call.png)

*In-app video call with chat, reactions and session recording.*

### 6. Skill Buddy (AI Assistant)

![Skill Buddy chatbot](docs/screenshots/06-skill-buddy.png)

*AI chatbot that answers learning questions and recommends real mentors.*

### 7. Badges and Leaderboard

![Badges and leaderboard](docs/screenshots/07-badges-leaderboard.png)

*Gamification: earn badges, gain XP, level up and climb the leaderboard.*

<details>
<summary><b>Optional: compact two-column gallery layout</b></summary>

<br>

If you would rather show smaller thumbnails side by side, replace the sections above with this:

<table>
  <tr>
    <td align="center"><img src="docs/screenshots/01-landing.png" width="400"><br><sub>Landing</sub></td>
    <td align="center"><img src="docs/screenshots/02-dashboard.png" width="400"><br><sub>Dashboard</sub></td>
  </tr>
  <tr>
    <td align="center"><img src="docs/screenshots/03-skill-matching.png" width="400"><br><sub>Skill Matching</sub></td>
    <td align="center"><img src="docs/screenshots/04-profile.png" width="400"><br><sub>Profile</sub></td>
  </tr>
  <tr>
    <td align="center"><img src="docs/screenshots/05-video-call.png" width="400"><br><sub>Video Session</sub></td>
    <td align="center"><img src="docs/screenshots/06-skill-buddy.png" width="400"><br><sub>Skill Buddy</sub></td>
  </tr>
  <tr>
    <td align="center" colspan="2"><img src="docs/screenshots/07-badges-leaderboard.png" width="400"><br><sub>Badges and Leaderboard</sub></td>
  </tr>
</table>

</details>

---

## Features

**Authentication and accounts**
- Email and password registration and login with JWT-based sessions
- Google OAuth 2.0 sign-in
- Forgot-password flow with a time-limited email OTP
- Profile picture uploads via Cloudinary, editable profile and public profile pages

**Skill exchange**
- Add skills you can teach and skills you want to learn
- Browse skills by category and search for users
- Automatic matching when two users teach what the other wants to learn
- Send, accept and decline exchange requests

**Sessions and collaboration**
- Schedule sessions with date, time and notes
- In-app video calls powered by Stream Video, with session recording saved through webhooks
- Real-time chat between users (Stream Chat) and in-call chat with reactions
- Post-call reviews and session summaries

**Gamification**
- XP for completing sessions, leaving reviews, completing your profile and more
- Five levels from Beginner to Expert
- Unlockable badges and a top-20 leaderboard

**Notifications**
- Real-time toast notifications over Socket.IO for matches, requests and messages
- Persistent notification history

**Skill Buddy (AI assistant)**
- Llama model served through the Groq API
- Detects mentor-related questions and injects real mentor data from MongoDB to reduce made-up answers
- Persistent chat history per user

**Experience**
- Responsive layout, light and dark mode
- Animated UI with Framer Motion and celebratory badge effects

---

## Tech Stack

| Layer | Technologies |
| --- | --- |
| **Frontend** | React 18, Vite, React Router, Tailwind CSS, DaisyUI, TanStack Query, Axios, Framer Motion, Lucide Icons |
| **Backend** | Node.js, Express 5, Mongoose, Passport (Google OAuth, JWT), Multer |
| **Database** | MongoDB Atlas |
| **Real-time** | Socket.IO, Stream Chat, Stream Video |
| **AI** | Groq API (Llama) |
| **Storage and email** | Cloudinary (images), Nodemailer / email API (OTP) |
| **Deployment** | Render (frontend static site and backend web service) |

---

## Architecture

```text
┌──────────────────────┐        HTTPS / REST         ┌──────────────────────────┐
│   React + Vite SPA   │ ──────────────────────────► │  Express API (Node.js)   │
│  (Render static)     │ ◄────────────────────────── │  JWT auth · Passport     │
└─────────┬────────────┘                             └───────┬─────────┬────────┘
          │                                                  │         │
          │  WebSocket (Socket.IO)                           │         │ Mongoose
          └──────────────────────────────────────────────────┤         ▼
          │                                                  │   ┌────────────┐
          │  Stream Chat / Video SDK                         │   │  MongoDB   │
          └──────────────► Stream ── webhooks ───────────────┤   │   Atlas    │
                                                             │   └────────────┘
                                          Groq (AI) · Cloudinary · Email API
```

---

## Project Structure

```text
skill-swap/
├── backend/
│   ├── config/          # DB, Passport (Google OAuth), Cloudinary
│   ├── controllers/     # Route handlers (auth, sessions, matches, AI, ...)
│   ├── middleware/      # JWT auth, file upload
│   ├── models/          # Mongoose schemas (User, Session, Skill, Badge, ...)
│   ├── routes/          # Express routers
│   ├── utils/           # XP and badge logic, Stream helpers
│   └── server.js        # App entry, Socket.IO setup
│
└── frontend/
    ├── public/
    └── src/
        ├── components/  # Navbar, modals, review and badge components
        ├── context/     # Auth, dark mode, notifications
        ├── lib/         # API and Stream clients
        ├── pages/       # Landing, Dashboard, Skills, VideoCall, SkillBuddy, ...
        └── App.jsx      # Routes
```

---

## API Overview

All routes are prefixed with `/api`. Protected routes require an `Authorization: Bearer <token>` header.

| Prefix | Purpose |
| --- | --- |
| `/auth` | Register, login, Google OAuth, forgot and reset password |
| `/user` | Current user, profile updates, avatar upload |
| `/skills` | List and manage skills |
| `/match` | Mutual teach/learn matching |
| `/requests` | Send, accept and decline exchange requests |
| `/sessions` | Schedule, update and complete sessions |
| `/video` | Stream video tokens and call data |
| `/chat` | Stream chat tokens |
| `/reviews` | Create and fetch reviews |
| `/notifications` | Notification history and read status |
| `/dashboard` | Aggregated stats for the dashboard |
| `/leaderboard` | Top users by XP |
| `/ai` | Skill Buddy chat and history |
| `/public` | Public profile data |
| `/swaps` | Featured skill swaps |
| `/webhooks` | Stream webhooks (recording ready) |

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- A MongoDB Atlas cluster (or a local MongoDB instance)
- Accounts and keys for Stream, Cloudinary, Google Cloud (OAuth) and Groq

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/skill-swap.git
cd skill-swap
```

### 2. Set up the backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The API starts on `http://localhost:5000`.

### 3. Set up the frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The app starts on `http://localhost:5173`.

---

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/skillswap
JWT_SECRET=replace_with_a_long_random_string

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

STREAM_API_KEY=
STREAM_API_SECRET=

GROQ_API_KEY=

EMAIL_USER=
EMAIL_PASS=
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
VITE_SERVER_URL=http://localhost:5000
VITE_STREAM_API_KEY=
```

> Never commit real `.env` files. Add them to `.gitignore` and share only an `.env.example` with placeholder values.

---

## Deployment Notes

The backend and frontend are deployed as two separate Render services. A few things learned along the way:

- **Free-tier cold starts.** Idle services sleep, so the first request can be slow. A health-check ping and a loading state in the UI help.
- **Outbound SMTP is blocked on Render's free tier.** Sending OTP emails through Gmail SMTP will hang there, so use an HTTPS email API (such as Brevo, Resend or SendGrid) in production.
- **MongoDB Atlas network access.** Allow Render's outbound traffic (for example `0.0.0.0/0`) and URL-encode special characters in the database password.
- **Google OAuth.** The callback URL in Google Cloud Console must match `GOOGLE_CALLBACK_URL` exactly, and the backend must redirect to the deployed frontend rather than localhost.
- **CORS and Socket.IO.** Add your deployed frontend origin to the backend's CORS and Socket.IO allowed origins.

---

## Roadmap

- [ ] Move all hard-coded URLs into environment variables
- [ ] Rate limiting and input validation on authentication and AI routes
- [ ] Streamed AI responses with Markdown rendering
- [ ] Automated tests (Jest and Supertest) for the auth and session flows
- [ ] Session ratings analytics and mentor recommendations
- [ ] Email and push notifications for upcoming sessions
- [ ] Docker setup and CI pipeline

---

## Author

**Palak**
4th-year B.Tech Computer Science student, Banasthali Vidyapith

- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [your-profile](https://www.linkedin.com/in/your-profile)

---

<div align="center">

If you found this project useful, consider giving it a star.

</div>
