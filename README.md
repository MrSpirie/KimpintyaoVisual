# KimpintyaoVisual

Pulse-style landing website for the Minecraft visual pack.

## Included now

- Main landing page (`/`) with:
  - hero section
  - visual pack features
  - modes
  - roadmap
  - FAQ
- Separate auth tab (`/auth`) with:
  - registration
  - login
  - logout/profile block
- Session-based backend auth (email + password)

## Quick start

1. Install Node.js 18+.
2. Copy `.env.example` to `.env`.
3. Fill `.env` values.
4. Install dependencies:
   ```bash
   npm install
   ```
5. Run:
   ```bash
   npm start
   ```
6. Open:
   - `http://localhost:3000`
   - `http://localhost:3000/auth`

## Project files

- `index.js` - backend (Express + JSON DB + auth API)
- `public/index.html` - main landing page
- `public/auth/index.html` - auth page
- `public/styles.css` - shared styles
- `public/app.js` - frontend logic
- `data/db.json` - local JSON database (auto-created)

## Deploy notes for Vercel

- Set `SESSION_SECRET` in Vercel Environment Variables (long random string).
- Keep `NODE_ENV=production` (default on Vercel).
- Optional: set `DATA_DIR=/tmp/kimpintyaovisual-data`.
- On Vercel the app now switches to cookie-based sessions automatically.
