# JPMA 2.0 — modern, premium, fully dynamic website + admin

Vite + React 18 + TypeScript + Tailwind CSS v4 + Framer Motion + GSAP + Lenis + Supabase.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production → dist/
```
## Supabase (optional but recommended)

Works without keys (built-in content + local lead queue).
For shared team data: create project → run `supabase/schema.sql` → set `.env`
(see `.env.example`) → create staff users → open `/admin`.
Full guide: `SUPABASE_SETUP.md`.

## Routes

`/` home · `/about` · `/expertise` · `/services` · `/projects` (filterable domestic/international)
· `/innovation` (R&D/products) · `/insights` (news + gallery) · `/careers` · `/contact` · `/admin`

## Brochure gate

Any "Download brochure" button opens the gate: name + email + **country dropdown
(161 countries with dial codes)** + phone + organisation + consent → lead saved
(Supabase `brochure_leads`, else local queue) → PDF downloads instantly.
Employees see every number in **Admin → Brochure leads** (search + CSV export).

## Deploy: GitHub → Netlify → Supabase

One-time setup (5–10 min):

1. **Supabase SQL** — Supabase dashboard → SQL Editor → paste `supabase/schema.sql` → Run.
   Re-run any time; it uses `if not exists` (safe).
2. **Staff login** — Authentication → Users → Add user (one per employee).
3. **Push** — `git push` this repo to GitHub (already configured remote `origin`).
4. **Netlify** — Add new site → Import from GitHub → build `npm run build`, publish `dist`
   (already in `netlify.toml`). Then Site settings → Environment variables:
   `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (anon/public key only, never service_role).
5. **Redeploy** after setting env vars. Open `/admin`, sign in, done.

Local `.env` (never committed) mirrors the same two keys — see `.env.example`.
