-- ============================================================
-- JPMA CMS — Supabase schema (run in Supabase → SQL Editor)
-- Content tables (admin-editable) + lead tables (brochure/enquiries/jobs)
-- ============================================================

-- ---------- helpers ----------
create extension if not exists "pgcrypto";

-- ---------- content tables (generic: id, sort_order, data/title) ----------
create table if not exists site_settings (
  id int primary key default 1,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

create table if not exists hero_slides (
  id uuid primary key default gen_random_uuid(),
  sort_order int default 0,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists stats (
  id uuid primary key default gen_random_uuid(),
  sort_order int default 0,
  data jsonb not null default '{}'::jsonb
);

create table if not exists business_areas (
  id uuid primary key default gen_random_uuid(),
  sort_order int default 0,
  data jsonb not null default '{}'::jsonb
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  sort_order int default 0,
  data jsonb not null default '{}'::jsonb
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  sort_order int default 0,
  title text not null
);

create table if not exists projects_domestic (
  id uuid primary key default gen_random_uuid(),
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists projects_international (
  id uuid primary key default gen_random_uuid(),
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists timeline (
  id uuid primary key default gen_random_uuid(),
  sort_order int default 0,
  data jsonb not null default '{}'::jsonb
);

create table if not exists team (
  id uuid primary key default gen_random_uuid(),
  sort_order int default 0,
  data jsonb not null default '{}'::jsonb
);

create table if not exists news (
  id uuid primary key default gen_random_uuid(),
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists gallery (
  id uuid primary key default gen_random_uuid(),
  sort_order int default 0,
  image_url text not null,
  caption text default ''
);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  file_url text not null,
  category text default 'brochure',
  created_at timestamptz default now()
);

create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  sort_order int default 0,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Fixed-slot page content blocks (ids like hero-about, home-ripple).
-- Missing rows fall back to built-in defaults, so seeding is optional.
create table if not exists content_blocks (
  block_id text primary key,
  page text default '',
  section text default '',
  title text default '',
  subtitle text default '',
  copy text default '',
  image text default '',
  items jsonb default '[]'::jsonb,
  updated_at timestamptz default now()
);

-- ---------- lead tables ----------
create table if not exists brochure_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  organisation text,
  country text,
  country_iso text,
  country_code text,
  phone text,
  full_phone text,
  source text default 'brochure-gate',
  created_at timestamptz default now()
);

create table if not exists enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  organisation text,
  message text,
  country text,
  country_code text,
  phone text,
  full_phone text,
  source text default 'contact-page',
  created_at timestamptz default now()
);

create table if not exists job_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  role text,
  note text,
  source text default 'careers-page',
  created_at timestamptz default now()
);

-- ---------- RLS ----------
alter table site_settings enable row level security;
alter table hero_slides enable row level security;
alter table stats enable row level security;
alter table business_areas enable row level security;
alter table services enable row level security;
alter table products enable row level security;
alter table projects_domestic enable row level security;
alter table projects_international enable row level security;
alter table timeline enable row level security;
alter table team enable row level security;
alter table news enable row level security;
alter table gallery enable row level security;
alter table documents enable row level security;
alter table jobs enable row level security;
alter table content_blocks enable row level security;
alter table brochure_leads enable row level security;
alter table enquiries enable row level security;
alter table job_applications enable row level security;

-- Public read for website content
create policy "public read settings" on site_settings for select using (true);
create policy "public read slides" on hero_slides for select using (true);
create policy "public read stats" on stats for select using (true);
create policy "public read areas" on business_areas for select using (true);
create policy "public read services" on services for select using (true);
create policy "public read products" on products for select using (true);
create policy "public read dproj" on projects_domestic for select using (true);
create policy "public read iproj" on projects_international for select using (true);
create policy "public read timeline" on timeline for select using (true);
create policy "public read team" on team for select using (true);
create policy "public read news" on news for select using (true);
create policy "public read gallery" on gallery for select using (true);
create policy "public read docs" on documents for select using (true);
create policy "public read jobs" on jobs for select using (true);
create policy "public read blocks" on content_blocks for select using (true);

-- Anyone can submit leads (brochure gate / forms); only staff reads them
create policy "anyone can insert brochure lead" on brochure_leads for insert with check (true);
create policy "anyone can insert enquiry" on enquiries for insert with check (true);
create policy "anyone can insert application" on job_applications for insert with check (true);

-- Staff (authenticated) full access everywhere
create policy "staff all settings" on site_settings for all using (auth.role() = 'authenticated');
create policy "staff all slides" on hero_slides for all using (auth.role() = 'authenticated');
create policy "staff all stats" on stats for all using (auth.role() = 'authenticated');
create policy "staff all areas" on business_areas for all using (auth.role() = 'authenticated');
create policy "staff all services" on services for all using (auth.role() = 'authenticated');
create policy "staff all products" on products for all using (auth.role() = 'authenticated');
create policy "staff all dproj" on projects_domestic for all using (auth.role() = 'authenticated');
create policy "staff all iproj" on projects_international for all using (auth.role() = 'authenticated');
create policy "staff all timeline" on timeline for all using (auth.role() = 'authenticated');
create policy "staff all team" on team for all using (auth.role() = 'authenticated');
create policy "staff all news" on news for all using (auth.role() = 'authenticated');
create policy "staff all gallery" on gallery for all using (auth.role() = 'authenticated');
create policy "staff all docs" on documents for all using (auth.role() = 'authenticated');
create policy "staff all jobs" on jobs for all using (auth.role() = 'authenticated');
create policy "staff all blocks" on content_blocks for all using (auth.role() = 'authenticated');
create policy "staff read brochure leads" on brochure_leads for select using (auth.role() = 'authenticated');
create policy "staff read enquiries" on enquiries for select using (auth.role() = 'authenticated');
create policy "staff read applications" on job_applications for select using (auth.role() = 'authenticated');

-- ---------- seed (migrated from legacy site) ----------
insert into site_settings (id, data) values (1, '{"company":"J. P. Mukherji & Associates Pvt. Ltd.","phone1":"+91 20 25397303","phone2":"+91 7756891500","email1":"info@jpma.org.in","email2":"marketing@jpma.org.in","address":"''Jyoti House'', 172, Dahanukar Colony, Kothrud, Pune - 411 038, INDIA","brochurePath":"/assets/JPMA_Brochure_2025.pdf","heroVideo":"https://www.youtube.com/embed/g7SYnthaIKk?si=FtzKPmG_e7khwPId","footerAbout":"India''s first end-to-end sugar industry consultancy, concept to commissioning across 30+ countries since 1972."}'::jsonb)
on conflict (id) do nothing;

insert into stats (sort_order, data) values
 (1, '{"value":54,"suffix":"","label":"Years of practice","sub":"est. 1972"}'),
 (2, '{"value":500,"suffix":"+","label":"Projects delivered","sub":"concept to commissioning"}'),
 (3, '{"value":30,"suffix":"+","label":"Countries served","sub":"across 4 continents"}'),
 (4, '{"value":1000,"suffix":" MW","label":"Cogeneration advised","sub":"bagasse, biomass & coal"}');

insert into business_areas (sort_order, data) values
 (1, '{"slug":"sugar","title":"Sugar Plants","image":"/assets/business-img.jpg","intro":"Raw, plantation-white & refined sugar, jaggery and value-added sugars.","points":["Greenfield turnkey sugar & jaggery plants","Milling & diffuser design, process house balancing","Expansion, modernisation, BMRE & automation","Steam economy < 36% on cane"]}'),
 (2, '{"slug":"cogeneration","title":"Cogeneration & Captive Power","image":"/assets/power-gen.jpg","intro":"~1000 MW advised — bagasse, biomass, coal & IPPs.","points":["Low/medium/high-pressure steam systems","Bagasse & coal cogeneration, captive & DG sets","Electrification, automation & grid evacuation","Boiler/turbine PG tests"]}'),
 (3, '{"slug":"ethanol","title":"Distillery & Ethanol","image":"/assets/ethonal-service.jpg","intro":"Molasses, juice/syrup & grain ethanol with zero-liquid discharge.","points":["100-600 KLPD molasses/grain/dual-feed plants","B-heavy & C-heavy diversion","Bio-methanation, composting, incineration","Bankable DPRs lenders clear"]}'),
 (4, '{"slug":"energy-audit","title":"Energy Audit","image":"/assets/solar-b.jpg","intro":"BEE-certified auditors with lab-grade instruments.","points":["Plant-wide generation-to-use audit","Benchmarked savings roadmap","Boiler, turbine & process optimisation"]}'),
 (5, '{"slug":"agriculture","title":"Sugarcane Agriculture","image":"/assets/jaggary.jpg","intro":"Soil survey to cane yard — yield, logistics & mechanisation.","points":["Topography, soil & hydrology studies","Irrigation, agronomy & variety selection","Harvest mechanisation & cane transport"]}'),
 (6, '{"slug":"renewables","title":"Renewables & Special Studies","image":"/assets/about_carousel_bg.jpg","intro":"Solar TEFS, hybrids, financial & environmental studies.","points":["Solar & biomass-hybrid TEFS","Financial viability & asset valuation","EIA, socio-economic & market studies"]}');

insert into services (sort_order, data) values
 (1, '{"slug":"conceptual","no":"01","title":"Conceptual Studies","image":"/assets/service-one.jpg","copy":"Pre-feasibility to bankable DPR.","items":["Pre-feasibility & feasibility","Detailed & bankable DPRs","Due diligence & valuation","Market & viability studies"]}'),
 (2, '{"slug":"engineering","no":"02","title":"Engineering Services","image":"/assets/service-engg.jpg","copy":"FEED to vendor finalisation.","items":["FEED, P&IDs, layouts","Specs, BOQs & bid evaluation","Civil design & vendors","Drawing approval"]}'),
 (3, '{"slug":"pmc","no":"03","title":"Project Management (PMC)","image":"/assets/project-manage.jpg","copy":"Single owner for time, cost & quality.","items":["Planning & contract management","Site supervision & QA/QC","Bill certification & safety","Commissioning & handover"]}'),
 (4, '{"slug":"quality","no":"04","title":"Quality Inspection","image":"/assets/service-engg.jpg","copy":"QAP to clearance certification.","items":["QAP review","Vendor-shop inspection","FAT witnessing","Monthly reporting"]}'),
 (5, '{"slug":"energy-audit-service","no":"05","title":"Energy Audit Service","image":"/assets/solar-b.jpg","copy":"Optimum bagasse-to-process efficiency.","items":["BEE-certified team","Power & thermal diagnostics","Customised savings","Benchmark compliance"]}'),
 (6, '{"slug":"rnd","no":"06","title":"R&D & Innovation","image":"/assets/r&d.jpg","copy":"Patented in-house designs.","items":["MCU — CEAI award","Mill coupling & fibrizer","Clarifier upgrades","Modern jaggery plants"]}');

insert into team (sort_order, data) values
 (1, '{"name":"Mr. Shirish Karandikar","role":"Chairman & Managing Director","photo":"/assets/board/karandikar.jpg"}'),
 (2, '{"name":"Mr. T. S. Rao","role":"Director","photo":"/assets/board/tsrao.jpg"}'),
 (3, '{"name":"Mr. D. S. Nikam","role":"Director","photo":"/assets/board/dsnikam.jpg"}');

insert into documents (title, file_url, category) values
 ('JPMA Company Brochure 2025', '/assets/JPMA_Brochure_2025.pdf', 'brochure');

insert into jobs (sort_order, data) values
 (1, '{"title":"Process Design Engineer, Sugar & Distillery","loc":"Pune · Hybrid site travel","type":"Full-time","desc":"Mass/energy balances, equipment sizing, P&IDs and vendor coordination."}'),
 (2, '{"title":"PMC Site Engineer, Erection & Commissioning","loc":"Project sites · India & abroad","type":"Full-time","desc":"Supervision, QA/QC, billing certification and monthly progress ownership."}'),
 (3, '{"title":"BEE Energy Auditor","loc":"Pune + travel","type":"Full-time","desc":"Plant-wide audits with power analysers and benchmarked savings roadmaps."}');
