// Structured CMS store, the single source of truth the whole website reads.
// Persists to localStorage (per-collection), seeded from src/data/seed.ts.
// When Supabase is connected, useContent() prefers Supabase rows; otherwise it reads this store,
// so every admin edit is instantly visible on the site.

import * as seed from '../data/seed'

export interface FieldDef {
  key: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'image' | 'select' | 'lines'
  options?: string[]
  help?: string
}

export interface CollectionDef {
  key: CollectionKey
  label: string
  singular: string
  addLabel: string
  ordered: boolean
  fields: FieldDef[]
}

export type CollectionKey =
  | 'heroSlides' | 'stats' | 'businessAreas' | 'services' | 'projects'
  | 'products' | 'news' | 'team' | 'timeline' | 'gallery' | 'documents' | 'jobs'

export type Item = { id: string } & Record<string, any>

export const IMAGE_OPTIONS = [
  '/assets/slider-one.jpg', '/assets/slider-two.jpg', '/assets/slider-three.jpg',
  '/assets/slider-five.jpg', '/assets/slider-six.jpg',
  '/assets/img-slide-one.jpg', '/assets/img-slide-two.jpg', '/assets/img-slide-three.jpg',
  '/assets/business-img.jpg', '/assets/power-gen.jpg', '/assets/ethonal-service.jpg',
  '/assets/solar-b.jpg', '/assets/jaggary.jpg', '/assets/sugar-cane.jpg',
  '/assets/about_carousel_bg.jpg', '/assets/service-one.jpg', '/assets/service-engg.jpg',
  '/assets/project-manage.jpg', '/assets/r-and-d.jpg',
  '/assets/jpma-director.jpg', '/assets/global-presence.jpg',
  '/assets/mcu-patent-certificate.jpg', '/assets/kenya-news.jpg',
  '/assets/business-banner.jpg', '/assets/services-banner.jpg', '/assets/project-banner.jpg',
  '/assets/contact-us-banner.jpg', '/assets/vision-mission.jpg',
  '/assets/board/karandikar.jpg', '/assets/board/tsrao.jpg', '/assets/board/dsnikam.jpg',
  '/assets/events/1.jpg', '/assets/events/2.jpg', '/assets/events/3.jpg',
  '/assets/events/4.jpg', '/assets/events/5.jpg', '/assets/events/8.jpg',
  '/assets/events/10.jpg', '/assets/events/11.jpg', '/assets/events/14.jpg',
  '/assets/events/19.jpg', '/assets/events/20.jpg', '/assets/events/21.jpg',
  '/assets/director.jpg', '/assets/about-img.jpg', '/assets/vision-mission.jpg',
  '/assets/jpma-values-banner.jpg', '/assets/sugar-refinary3.jpg',
  '/assets/surgarcane-agriculture.jpg', '/assets/banner-inter-domestic.jpg',
  '/assets/project-enquiry-bg.jpg',
]

export const SCHEMAS: CollectionDef[] = [
  {
    key: 'heroSlides', label: 'Homepage hero slides', singular: 'Slide', addLabel: 'Add slide', ordered: true,
    fields: [
      { key: 'eyebrow', label: 'Small kicker text', type: 'text' },
      { key: 'title', label: 'Headline', type: 'text' },
      { key: 'copy', label: 'Sub copy', type: 'textarea' },
      { key: 'image', label: 'Background image', type: 'image' },
      { key: 'cta', label: 'Button text', type: 'text' },
      { key: 'href', label: 'Button link', type: 'select', options: ['/expertise', '/about', '/services', '/projects', '/innovation', '/insights', '/careers', '/contact'] },
    ],
  },
  {
    key: 'stats', label: 'Stat strip numbers', singular: 'Stat', addLabel: 'Add stat', ordered: true,
    fields: [
      { key: 'value', label: 'Number', type: 'number' },
      { key: 'suffix', label: 'Suffix (e.g. +, MW)', type: 'text' },
      { key: 'label', label: 'Label', type: 'text' },
      { key: 'sub', label: 'Sub-label', type: 'text' },
    ],
  },
  {
    key: 'businessAreas', label: 'Expertise areas', singular: 'Area', addLabel: 'Add area', ordered: true,
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'image', label: 'Image', type: 'image' },
      { key: 'intro', label: 'Intro line', type: 'textarea' },
      { key: 'points', label: 'Bullet points (one per line)', type: 'lines' },
    ],
  },
  {
    key: 'services', label: 'Services', singular: 'Service', addLabel: 'Add service', ordered: true,
    fields: [
      { key: 'no', label: 'Number (01, 02…)', type: 'text' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'image', label: 'Image', type: 'image' },
      { key: 'copy', label: 'Description', type: 'textarea' },
      { key: 'items', label: 'Included items (one per line)', type: 'lines' },
    ],
  },
  {
    key: 'projects', label: 'Projects', singular: 'Project', addLabel: 'Add project', ordered: false,
    fields: [
      { key: 'kind', label: 'Type', type: 'select', options: ['domestic', 'international'] },
      { key: 'client', label: 'Client / plant name', type: 'text' },
      { key: 'scope', label: 'Scope of work', type: 'textarea' },
      { key: 'tag', label: 'Tag (e.g. Nigeria · PMC)', type: 'text' },
      { key: 'country', label: 'Country (international only)', type: 'text' },
      { key: 'image', label: 'Photo (optional)', type: 'image', help: 'Shown on the project card. Leave empty for text card.' },
    ],
  },
  {
    key: 'products', label: 'Product family', singular: 'Product', addLabel: 'Add product', ordered: true,
    fields: [{ key: 'text', label: 'Product line', type: 'text' }],
  },
  {
    key: 'news', label: 'News & insights', singular: 'Story', addLabel: 'Add story', ordered: false,
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'tag', label: 'Tag', type: 'select', options: ['Seminar', 'Culture', 'R&D', 'Ethanol', 'Sugar', 'Award', 'Visit'] },
      { key: 'date', label: 'Date (YYYY-MM-DD)', type: 'text' },
      { key: 'excerpt', label: 'Excerpt', type: 'textarea' },
      { key: 'image', label: 'Image', type: 'image' },
    ],
  },
  {
    key: 'team', label: 'Leadership team', singular: 'Member', addLabel: 'Add member', ordered: true,
    fields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'role', label: 'Role', type: 'text' },
      { key: 'photo', label: 'Photo', type: 'image' },
    ],
  },
  {
    key: 'timeline', label: 'Company timeline', singular: 'Milestone', addLabel: 'Add milestone', ordered: true,
    fields: [
      { key: 'year', label: 'Year', type: 'text' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'note', label: 'Note', type: 'text' },
    ],
  },
  {
    key: 'gallery', label: 'Photo gallery', singular: 'Photo', addLabel: 'Add photo', ordered: true,
    fields: [{ key: 'url', label: 'Image', type: 'image' }],
  },
  {
    key: 'documents', label: 'Documents', singular: 'Document', addLabel: 'Add document', ordered: false,
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'file_url', label: 'File (PDF URL or upload)', type: 'image', help: 'Brochure PDF lives at /assets/JPMA_Brochure_2025.pdf' },
      { key: 'category', label: 'Category', type: 'select', options: ['brochure', 'certificate', 'report', 'other'] },
    ],
  },
  {
    key: 'jobs', label: 'Open roles (Careers)', singular: 'Role', addLabel: 'Add role', ordered: false,
    fields: [
      { key: 'title', label: 'Job title', type: 'text' },
      { key: 'loc', label: 'Location', type: 'text' },
      { key: 'type', label: 'Type', type: 'select', options: ['Full-time', 'Part-time', 'Contract', 'Internship'] },
      { key: 'desc', label: 'Description', type: 'textarea' },
    ],
  },
]

export const SETTINGS_FIELDS: FieldDef[] = [
  { key: 'company', label: 'Company name', type: 'text' },
  { key: 'tagline', label: 'Tagline', type: 'text' },
  { key: 'phone1', label: 'Phone 1', type: 'text' },
  { key: 'phone2', label: 'Phone 2', type: 'text' },
  { key: 'fax', label: 'Fax', type: 'text' },
  { key: 'email1', label: 'Email 1', type: 'text' },
  { key: 'email2', label: 'Email 2', type: 'text' },
  { key: 'address', label: 'Address', type: 'textarea' },
  { key: 'facebook', label: 'Facebook URL', type: 'text' },
  { key: 'linkedin', label: 'LinkedIn URL', type: 'text' },
  { key: 'brochurePath', label: 'Brochure file path', type: 'text' },
  { key: 'heroVideo', label: 'Homepage film (YouTube embed URL)', type: 'text' },
]

// ---------- defaults (deep-cloned from seed) ----------
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v))

export function defaultsFor(key: CollectionKey): Item[] {
  switch (key) {
    case 'heroSlides': return clone(seed.heroSlides).map((s, i) => ({ id: `hero-${i + 1}`, ...s }))
    case 'stats': return clone(seed.stats).map((s, i) => ({ id: `stat-${i + 1}`, ...s }))
    case 'businessAreas': return clone(seed.businessAreas).map((s) => ({ id: s.slug, ...s }))
    case 'services': return clone(seed.services).map((s) => ({ id: s.slug, ...s }))
    case 'projects': return [
      ...clone(seed.internationalProjects).map((p, i) => ({ id: `iproj-${i + 1}`, kind: 'international', image: '', ...p })),
      ...clone(seed.domesticProjects).map((p, i) => ({ id: `dproj-${i + 1}`, kind: 'domestic', image: '', ...p })),
    ]
    case 'products': return clone(seed.products).map((t, i) => ({ id: `product-${i + 1}`, text: t }))
    case 'news': return clone(seed.news).map((n, i) => ({ id: `news-${i + 1}`, ...n }))
    case 'team': return clone(seed.team).map((m, i) => ({ id: `team-${i + 1}`, ...m }))
    case 'timeline': return clone(seed.timeline).map((t, i) => ({ id: `tl-${i + 1}`, ...t }))
    case 'gallery': {
      const base = clone(seed.gallery) as string[]
      ;[7, 8, 9, 12, 13, 15, 16, 17, 18].forEach((n) => {
        const u = `/assets/events/${n}.jpg`
        if (!base.includes(u)) base.push(u)
      })
      return base.map((g, i) => ({ id: `gal-${i + 1}`, url: g }))
    }
    case 'documents': return [{ id: 'doc-1', title: 'JPMA Company Brochure 2025', file_url: '/assets/JPMA_Brochure_2025.pdf', category: 'brochure' }]
    case 'jobs': return [
      { id: 'job-1', title: 'Process Design Engineer, Sugar & Distillery', loc: 'Pune · Hybrid site travel', type: 'Full-time', desc: 'Mass/energy balances, equipment sizing, P&IDs and vendor coordination for 100–600 KLPD ethanol and 3,500–10,000 TCD sugar.' },
      { id: 'job-2', title: 'PMC Site Engineer, Erection & Commissioning', loc: 'Project sites · India & abroad', type: 'Full-time', desc: 'Supervision, QA/QC, billing certification and monthly progress ownership on greenfield & expansion sites.' },
      { id: 'job-3', title: 'BEE Energy Auditor', loc: 'Pune + travel', type: 'Full-time', desc: 'Plant-wide audits with power analysers, flue-gas diagnostics and benchmarked savings roadmaps.' },
    ]
  }
}

// ---------- storage ----------
const lsKey = (k: string) => `jpma_cms_${k}`

// One-way migrations for browsers seeded by older defaults. Additive only,
// never deletes user content.
const MIGRATION_VERSION = 4
function migrateOnce() {
  try {
    const cur = Number(localStorage.getItem('jpma_cms_version') || 1)
    if (cur >= MIGRATION_VERSION) return
    if (cur < 2) {
      const rawAreas = localStorage.getItem(lsKey('businessAreas'))
      if (rawAreas) {
        const areas = JSON.parse(rawAreas) as Item[]
        const ag = areas.find((a) => a.id === 'agriculture' && a.image === '/assets/jaggary.jpg')
        if (ag) {
          ag.image = '/assets/surgarcane-agriculture.jpg'
          localStorage.setItem(lsKey('businessAreas'), JSON.stringify(areas))
        }
      }
      const rawGal = localStorage.getItem(lsKey('gallery'))
      if (rawGal) {
        const gal = JSON.parse(rawGal) as Item[]
        const have = new Set(gal.map((g) => String(g.url)))
        const extra = [7, 8, 9, 12, 13, 15, 16, 17, 18].map((n) => `/assets/events/${n}.jpg`).filter((u) => !have.has(u))
        if (extra.length) {
          extra.forEach((u, i) => gal.push({ id: `gal-topup-${u.replace(/\D/g, '')}-${i}`, url: u }))
          localStorage.setItem(lsKey('gallery'), JSON.stringify(gal))
        }
      }
    }
    if (cur < 3) {
      // restore the classic 5th hero slide (500+ projects, slider-six)
      const rawHero = localStorage.getItem(lsKey('heroSlides'))
      if (rawHero) {
        const heroes = JSON.parse(rawHero) as Item[]
        if (!heroes.some((h) => String(h.image || '').includes('slider-six'))) {
          heroes.push({
            id: 'hero-5', eyebrow: '500+ projects',
            title: 'Specialized in all aspects of sugarcane, sugar, cogeneration and ethanol.',
            copy: 'Sugar, cogeneration, ethanol and byproducts, from concept to commissioning.',
            image: '/assets/slider-six.jpg', cta: 'See projects', href: '/projects',
          })
          localStorage.setItem(lsKey('heroSlides'), JSON.stringify(heroes))
        }
      }
    }
    if (cur < 4) {
      // product family grew from 10 to the full 14: reseed only untouched defaults
      const rawProd = localStorage.getItem(lsKey('products'))
      if (rawProd) {
        const prods = JSON.parse(rawProd) as Item[]
        const ids = prods.map((p) => p.id).sort()
        const legacy = Array.from({ length: 10 }, (_, i) => `product-${i + 1}`).sort()
        if (JSON.stringify(ids) === JSON.stringify(legacy)) {
          localStorage.removeItem(lsKey('products'))
          getCollection('products')
        }
      }
    }
    localStorage.setItem('jpma_cms_version', String(MIGRATION_VERSION))
  } catch { /* never break the site for a migration */ }
}
if (typeof window !== 'undefined') migrateOnce()
export const EVENT = 'jpma-cms-changed'
export const notify = () => window.dispatchEvent(new Event(EVENT))
export const uid = (p: string) => `${p}-${Date.now().toString(36)}${Math.floor(Math.random() * 999)}`

function read<T>(key: string, fallback: () => T): T {
  try {
    const raw = localStorage.getItem(lsKey(key))
    if (raw) return JSON.parse(raw) as T
  } catch { /* corrupted → reseed */ }
  const v = fallback()
  try { localStorage.setItem(lsKey(key), JSON.stringify(v)) } catch { /* ignore */ }
  return v
}

export function getCollection(key: CollectionKey): Item[] {
  return read<Item[]>(key, () => defaultsFor(key))
}

export function setCollection(key: CollectionKey, items: Item[]) {
  localStorage.setItem(lsKey(key), JSON.stringify(items))
  notify()
}

export function addItem(key: CollectionKey, item: Item) {
  setCollection(key, [...getCollection(key), item])
}

export function saveItem(key: CollectionKey, item: Item) {
  setCollection(key, getCollection(key).map((it) => (it.id === item.id ? item : it)))
}

export function deleteItem(key: CollectionKey, id: string) {
  setCollection(key, getCollection(key).filter((it) => it.id !== id))
}

export function moveItem(key: CollectionKey, id: string, dir: -1 | 1) {
  const arr = [...getCollection(key)]
  const i = arr.findIndex((it) => it.id === id)
  const j = i + dir
  if (i < 0 || j < 0 || j >= arr.length) return
  ;[arr[i], arr[j]] = [arr[j], arr[i]]
  setCollection(key, arr)
}

export function resetCollection(key: CollectionKey) {
  localStorage.removeItem(lsKey(key))
  getCollection(key) // reseed
  notify()
}

export function resetAll() {
  SCHEMAS.forEach((s) => localStorage.removeItem(lsKey(s.key)))
  localStorage.removeItem(lsKey('settings'))
  notify()
}

export function getSettings(): Record<string, string> {
  return read<Record<string, string>>('settings', () => defaultSettings())
}

export function defaultSettings(): Record<string, string> {
  return clone(seed.siteSettings) as unknown as Record<string, string>
}

export function saveSettings(s: Record<string, string>) {
  localStorage.setItem(lsKey('settings'), JSON.stringify(s))
  notify()
}
