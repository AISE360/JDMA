# CHANGES.md — JPMA website complete transformation

> **Design v2 (elegant editorial):** dark navy + gold skin replaced per the Elephante reference —
> light paper `#faf8f4`, slate ink, steel-blue `#2f4a5e`, Fraunces serif with italics, small-caps
> kickers, pill buttons, rounded cards, curved bands, ringed circular imagery, outlined "&" motifs.
> Homepage restructured on the reference narrative; all pages/modal recolored.
>
> **Navbar v2 (screenshot spec):** logo image alone (removed the "J. P. Mukherji & Associates /
> Sugar consultants · Est. 1972" text block), menu rebuilt as Home · Business ▾ · Services ▾ ·
> Our Approach · Projects ▾ · Insights · Innovation · Careers with hover dropdown cards on desktop
> (7 business areas → /expertise anchors, 6 services → /services anchors, Domestic/International →
> /projects?tab=…), accordion sub-menus in the mobile drawer, working site-wide search overlay
> (services, areas, projects, news, roles, pages), divider + BROCHURE outline pill + CONTACT dark
> pill with arrow, active-section underline.
>
> **Unused-image audit:** every mirrored asset now placed — founder band (director.jpg),
> about collage (about-img.jpg), vision card (vision-mission.jpg), values backdrop
> (jpma-values-banner.jpg), agriculture chapter (surgarcane-agriculture.jpg), projects banner
> (banner-inter-domestic.jpg), full 21-photo gallery, 39-logo grayscale client marquee on Home,
> and the two product PDFs (MCU + mill-coupling brochures) as gated downloads on Innovation
> with per-document lead sources in admin. Deliberately skipped: footer-bg.jpg (dark texture,
> clashes with light theme), iconm.png/left-right-angle.png (UI sprites), slider-four/
> domestic-img/happynewyear (absent from mirror).
>
> **Splash (2s, white):** full-screen intro on site start (skipped in admin) with the exact timeline —
> JP mark+TM drop 0→0.55s with overshoot/spring settle, J.P. MUKHERJI 0.45→1.05s, & ASSOCIATES
> 0.85→1.40s, PVT. LTD. 1.20→1.70s, final lock scale 1.70→1.90s, shimmer sweep into the site.
> Equal-width responsive lockup, click-to-skip, scroll locked during play. Needs
> `logo-jp.png`, `jp-mukherji.png`, `associates.png`, `pvt-ltd.png` in `public/assets/` —
> all four received, verified serving (HTTP 200), staged splash now live. (Note: files had been
> placed in `dist/assets/` first — moved to `public/assets/` source so rebuilds don't wipe them.)
> Client wall extended to two marquee rows covering all 39 PNG + 58 JPG client logos.
>
> **Mobile-first pass:** global guards (border-box, overflow-x clip, img max-width, 20px mobile
> gutters with desktop max-widths intact, reduced-motion support incl. Lenis guard); header rebuilt
> for small screens (compact uncropped logo with TM, compact CONTACT, hamburger → full-screen
> staggered menu with accordions, safe-area footer buttons, body scroll-lock); hero restructured
> eyebrow→heading→description→CTA with clamp() serif type and mobile gradient overlay; stats
> redesigned as a centered 2-column grid with fluid nowrap numerals (1000 MW never collides);
> floating Enquire pill given safe-area offset and compact mobile size; phone/code flex rows and
> search hits hardened with min-w-0 against 320px overflow. Desktop composition unchanged.
>
> **Navbar v3 (no dropdowns):** all hover dropdown cards and mobile accordions removed per request.
> Menu is now plain links only: Home, Business, Services, Our Approach, Projects, Insights,
> Innovation, Careers.
>
> **Copy cleanup:** all 95 em-dashes removed from site text across 15 files (replaced with commas
> or dropped where decorative). En-dashes in numeric ranges (100-600 KLPD) intentionally kept.
>
> **Client wall v2:** two marquee rows merged into ONE slow line with bigger logos,
> matching the reference: all 97 client marks in a single row.
>
> **Live-site audit (jpma.org.in fetched page-by-page):** live matches the mirror, nothing new.
> Restored the YouTube company film as a "Five decades, four minutes" section on Home (it was on
> the old homepage and got dropped in the redesign). Individual brochures verified: MCU and mill
> coupling PDFs are gated downloads on Innovation, now also cross-linked from a product brochure
> band on Services. No other product PDFs exist on the live site, so nothing else to attach.
>
> **Product family fixed to 14:** heading said fourteen but only ten items existed. Split merged
> entries and restored Milling System Improvement and Pressure Feeders. Auto-migration upgrades
> existing browsers without touching user edits.
>
> **Deploy wired (GitHub/Netlify/Supabase):** repo pushed to GitHub `main`; `netlify.toml` (build
> dist, SPA fallback, asset caching); `jobs` content table added to schema; admin CMS now reads
> AND writes Supabase when keys are present (local mode unchanged without keys).
>
> **Admin coverage v3 (page text & sections):** audit found ~40 hardcoded strings outside the CMS.
> New `blocks` collection (27 fixed slots: all 8 page headers, home challenge/ripple/help/split/
> unique/leader/film/resource, about overview/founder/vision/team/values/certs/global, expertise
> CTA, projects recent band, innovation MCU, careers footnote) plus footer blurb and contact details
> wired to settings. Every headline, paragraph, checklist, image and value label is now editable
> from Admin, locally and in Supabase (`content_blocks` table). Deliberately code-level only:
> nav structure, button labels/links, form labels, footer link list.
>
> **Navbar scroll v3:** reveal on ~4px cumulative upward travel (effectively immediate, jitter-safe),
> hide after 64px deliberate downward travel, transform-only transition (zero layout shift), state
> reset on route change, never hides with the mobile menu open.
>
> **Admin v2 (proper CMS):** the JSON-textarea editor was replaced with a standalone admin app —
> no website navbar/footer/floating button on `/admin` (only the logo in its own sidebar/topbar).
> New: dark sidebar with Dashboard, 3 lead inboxes, 12 form-based content collections and Site
> settings. Every collection has Add/Edit/Delete (+ reorder where order matters); fields are real
> inputs — text, textarea, numbers, dropdowns, one-per-line bullet editors, and an image field with
> site-library picker, URL paste and computer upload (preview included). Projects support an optional
> photo shown on the card; Careers roles are now admin-managed. All edits persist to a structured
> local store (`src/cms/store.ts`) that the whole site reads reactively, so changes go live instantly.

Legacy source: HTTrack mirror of `https://www.jpma.org.in/` (Bootstrap 4 + jQuery + AOS + Owl Carousel,
PHP form posts to `saveData.php`), found in `www.jpma.org.in/`.
New site: `jpma-modern/` (Vite + React 18 + TS + Tailwind v4 + Framer Motion + GSAP + Lenis + Supabase).
Production build verified: `npm run build` → `dist/` ✅. All 43 asset references resolve ✅.

---

## 1. Pages removed
- `index-2.html` (duplicate of `index.html`) — deleted, single canonical `/` route.
- `popper.html`, `slideWiz.html`/`slideShow.html` (JS files saved with `.html` extension), `thankyou.html`
  (static post-submit page) — removed; replaced by in-app success states.
- HTTrack artefacts (`hts-cache/`, `hts-log.txt`, mirror index) — not carried forward.

## 2. Pages renamed
| Old | New | Why |
|---|---|---|
| `index.html` | `/` Home | — |
| `about-us.html` | `/about` | clean slugs |
| `business.html` | `/expertise` | "Business" was jargon; content is capability areas |
| `services.html` | `/services` | kept, rewritten |
| `domestic-projects.html` + `international-projects.html` | `/projects` (tabbed) | see Merged |
| `our-products.html` | `/innovation` | was near-empty; now R&D story + product family |
| `news.html` | `/insights` | news + gallery + seminars in one narrative hub |
| `careers.html` | `/careers` | rebuilt with real role cards |
| `contact-us.html` | `/contact` | — |
| `/admin` | **NEW** | staff CMS + leads (did not exist) |

## 3. Pages merged
- **Domestic + International projects → one `/projects` page** with All/Domestic/International
  filter tabs. Old split forced two page loads for one mental task ("show me your work").
- Business + Services overlap (Energy Audit appeared in both) deduplicated: `/expertise` = *what*
  (6 business areas), `/services` = *how* (6 delivery services, incl. PMC, QIS, R&D).
- The 21-image event carousel + news list merged into `/insights` (cards + gallery grid).

## 4. Pages added
- `/innovation` — MCU patent story (certificate image), CEAI award, 14-product family grid.
- `/admin` — full CMS: Brochure leads, Enquiries, Job applications (search + CSV export),
  Pages & content editor (13 collections), staff auth via Supabase, demo mode without keys.
- Supabase docs: `supabase/schema.sql`, `SUPABASE_SETUP.md`, `.env.example`, `README.md`.

## 5. Sections removed (site-wide)
- Top info bar duplicated on every page → single slim utility strip (address/phone/email/LinkedIn).
- Fake `search` box (submitted to `#`, did nothing) — removed.
- Dead commented-out blocks (ongoing-projects marquees, footer variants, `onLoadModal`) — deleted.
- "Our Clients" 39-logo Owl carousel (unlabelled PNGs, no alt text) — removed from homepage;
  logos preserved in `public/assets/clients/` for reintroduction with names in admin.
- Duplicate brochure buttons, "Enqurire Now" typo fixed → "Enquire now".
- AOS `disable: 'mobile'`, jQuery fade-image slider, slideWiz/slideShow dead scripts — gone.

## 6. Sections added
- Cinematic auto-rotating hero (4 messages from old slider captions, rewritten) with progress indicators.
- Animated stat band (54 yrs · 500+ projects · 30+ countries · 1000 MW) with GSAP counters.
- "Concept → Commissioning" 4-step process strip (new — the firm's core promise, never visualised before).
- Featured-projects cards, film + brochure CTA band, certification marquee.
- About: leadership cards, vertical roadmap timeline (replaces broken horizontal scroll-timeline),
  values chips, certifications panel, global-presence + registrations.
- Expertise: 6 alternating image/detail chapters with anchor links (`/expertise#ethanol`…).
- Projects: filter tabs + "recently completed in last year" summary band (content was buried in news).
- Contact: info card + embedded map + validated enquiry form.
- Floating "Enquire now" pill + rich footer with brochure CTA.

## 7. Major UX / design changes
- Design system from scratch: ink navy `#0a1628` + gold `#c9a227` + cream `#faf7f0`,
  Fraunces display serif + Inter, 24px+ radii, film-grain overlay, duotone imagery.
- Sticky glass navbar with active-link underlines + animated mobile menu (was Bootstrap collapse).
- One consistent page-hero pattern (image + gradient + eyebrow + display title) replaces 6 ad-hoc banners.
- Fully responsive (mobile-first grids, hamburger nav, sticky forms); old site broke below tablet.
- Copy rewritten throughout: shorter, benefit-led, typo-free; preserved facts untouched
  (founded 1972/inc. 1974, ISO list, board names, all project/client names, contact details).

## 8. Animation / interaction changes
- Removed: AOS-on-everything, Owl carousels, `<marquee>`, jQuery fade slider, Bootstrap carousels.
- Added (intentional, restrained): Lenis buttery smooth scroll; Framer Motion reveal-on-scroll;
  GSAP hero entrance + stat counters; hero Ken Burns crossfade (6s); hover lift + image zoom on cards;
  animated mobile menu + modal spring; certification marquee (CSS only). No autoplay video, no cursor toys.

## 9. Admin / CMS features added (all new)
- Supabase Auth staff login (`/admin`); demo mode when keys absent.
- Lead management: `brochure_leads` (name/email/org/**country/country-code/full-phone**/timestamp),
  `enquiries`, `job_applications` — searchable tables + one-click CSV export.
- Content management for 13 collections: settings, hero, stats, business areas, services, products,
  domestic/international projects, timeline, team, news, gallery, documents (+ local-override editor).
- `supabase/schema.sql`: 16 tables, RLS (public-read content, insert-only leads, staff-only reads),
  seed data migrated from legacy site.

## 10. Database / content changes
- Old: no database; PHP `saveData.php` endpoint (not in mirror — lead storage unverifiable).
- New: Postgres via Supabase (or localStorage queue fallback with identical shape).
- Seed migrated: settings/contact, stats, 6 business areas, 6 services, 7 domestic + 6 international
  projects (all client names/scopes preserved), 10-step timeline, 3 directors, 6 news items, 12 gallery
  images, values, certs, brochure document row.

## 11. Existing content migrated (verified)
- All contact details, address, fax, socials; hero captions → 4 hero slides; YouTube film embed kept;
  business/services copy condensed (no fact dropped); all domestic/international project entries;
  board photos/names; global-presence map; ISO/membership/registration lists; roadmap years;
  values; news/ethanol project lists → insights + projects band; careers/enquiry/brochure forms →
  validated versions; `JPMA_Brochure_2025.pdf` → `public/assets/`; all photography reused.

## 12. Features intentionally NOT carried forward
- Client-logo carousel → logos kept on disk but hidden until names/alt text exist (unlabelled logos
  look unprofessional and hurt accessibility/SEO).
- Non-functional search box → removed rather than faked; real search can be a phase-2 admin-driven feature.
- `thankyou.html` redirect → inline success states (faster, no dead end).
- `saveData.php` POST → replaced by Supabase/local lead capture (old endpoint absent from mirror,
  so no behaviour could be preserved; new path is strictly more capable).
- Marquee tickers, hit-counter-era widgets, commented dead code → cut for performance and polish.

## 13. New functionality introduced
- **Brochure gate exactly as requested**: click Download → popup → **country dropdown (161 dial
  codes, every major market incl. India/Nigeria/Kenya/Fiji/Indonesia/Egypt/Cuba/Saudi)** → phone
  validation (6–15 digits) → lead with **country + code + full international number** stored →
  PDF auto-downloads → employees see it in **Admin → Brochure leads** (search/export).
- Filterable unified projects, role-based careers applications, gallery, timeline, counters,
  CSV exports, local-override CMS, sitemap-clean routing.

## 14. How to go live
1. `cd jpma-modern && npm install && npm run dev` (preview) / `npm run build` (ship `dist/`).
2. Optional: Supabase project → run `supabase/schema.sql` → set `.env` → create staff users.
3. Replace/extend photography and logo as needed; edit copy in `/admin` or `src/data/seed.ts`.
