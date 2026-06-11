# Umami Arena 🍜

A gamified loyalty platform for the Umami instant ramen brand. Redeem pack codes, climb ranks, maintain streaks, and compete on the leaderboard.

## Setup

**Requirements:** Node.js 18+, npm 9+

```bash
git clone <repo-url>
cd umami-arena
npm install
```

## Run (Development)

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

Both start concurrently via a single command.

## Demo Account

| Field    | Value                  |
|----------|------------------------|
| Email    | demo@umamiarena.com    |
| Password | ramen123               |
| Level    | Broth Samurai (12 packs) |
| Streak   | 3 days                 |

## Getting Test Codes

On first server start, **200 pack codes** are printed to the console:

```
=== 200 PACK CODES GENERATED ===
UMA-AB12-CD34
UMA-EF56-GH78
...
================================
```

Codes follow the format `UMA-XXXX-XXXX` (uppercase alphanumeric).

### Generate More Codes

```
GET /api/admin/generate-codes
```

Generates 50 additional codes and logs them to the server console. No auth required.

```bash
curl http://localhost:3001/api/admin/generate-codes
```

## API Reference

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | No | `{ name, email, password }` |
| POST | `/api/auth/login` | No | `{ email, password }` |
| GET | `/api/user/me` | Yes | Full user object + 7-day activity |
| POST | `/api/redeem` | Yes | `{ code }` → redemption result |
| GET | `/api/leaderboard` | Yes | Top 10 + caller's rank |
| GET | `/api/admin/generate-codes` | No | Generate 50 more codes |

## Level System

| Packs | Level | Title            |
|-------|-------|------------------|
| 0     | 0     | Unranked         |
| 1–3   | 1     | Genin            |
| 4–10  | 2     | Ramen Apprentice |
| 11–25 | 3     | Broth Samurai    |
| 26–45 | 4     | Umami Oni        |
| 46+   | 5     | The Ramen God    |

## Tech Stack

- **Frontend:** React 18, Tailwind CSS, Vite
- **Backend:** Node.js, Express
- **Database:** SQLite (better-sqlite3)
- **Auth:** JWT + bcrypt
