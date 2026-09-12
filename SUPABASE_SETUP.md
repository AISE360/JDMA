# JPMA — Supabase setup (5 minutes)

The website works **without** Supabase (built-in content + local lead queue).
Connect Supabase to make it **shared, multi-user and production-grade**.

## 1. Create project
1. Go to https://supabase.com → New project.
2. Copy **Project URL** and **anon public key** (Settings → API).

## 2. Create tables + seed
1. Open Supabase → **SQL Editor** → New query.
2. Paste the entire `supabase/schema.sql` and **Run**.
3. Check Table Editor: `site_settings`, `hero_slides`, `stats`, `business_areas`,
   `services`, `products`, `projects_domestic`, `projects_international`,
   `timeline`, `team`, `news`, `gallery`, `documents`,
   `brochure_leads`, `enquiries`, `job_applications`.

## 3. Storage (images + brochure PDF)
1. Storage → New bucket: `assets` (public).
2. Upload `public/assets/*` (or keep files in the web app — both work).
3. Upload the brochure PDF; keep its public URL in
   `site_settings.data.brochurePath` or `documents`.

## 4. Connect the website
Create `.env` next to `package.json`:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

Restart `npm run dev`.

## 5. Staff login (admin panel at `/admin`)
1. Supabase → Authentication → Users → Add user (email + password) for each employee.
2. Open `/admin`, sign in.
3. Tabs:
   - **Brochure leads** — every gated download: name, email, organisation,
     **country + country code + full phone**, timestamp. Export CSV.
   - **Enquiries / Job applications** — same treatment.
   - **Pages & content** — edit JSON overrides; mirror into tables for production.

## Security model
- Website content: **public read**, staff-only write.
- Leads: **anyone can insert** (forms work for visitors), **only staff can read**.
- Never expose the `service_role` key in the frontend.
