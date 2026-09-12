import { useEffect, useMemo, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import * as seed from '../data/seed'
import { EVENT, getCollection, getSettings } from '../cms/store'
import type { Block } from '../cms/store'

export interface ContentState {
  settings: typeof seed.siteSettings
  stats: typeof seed.stats
  heroSlides: typeof seed.heroSlides
  businessAreas: typeof seed.businessAreas
  services: typeof seed.services
  products: string[]
  domesticProjects: { client: string; scope: string; tag: string; image?: string }[]
  internationalProjects: { client: string; scope: string; tag: string; country?: string; image?: string }[]
  timeline: typeof seed.timeline
  team: typeof seed.team
  news: typeof seed.news
  gallery: string[]
  jobs: { title: string; loc: string; type: string; desc: string }[]
  documents: { id: string; title: string; file_url: string; category: string }[]
  blocks: Record<string, Block>
  source: 'supabase' | 'local'
}

const EMPTY_BLOCK: Block = { title: '', subtitle: '', copy: '', image: '', items: [] }

/** Read a page-content block. Always present locally (seeded defaults); Supabase rows override. */
export function getBlock(c: ContentState, id: string): Block {
  return c.blocks[id] ?? EMPTY_BLOCK
}

function buildFromStore(): ContentState {
  const num = (v: unknown, fb: number) => {
    const n = Number(v)
    return Number.isFinite(n) ? n : fb
  }
  const heroes = getCollection('heroSlides')
  const stats = getCollection('stats')
  const areas = getCollection('businessAreas')
  const services = getCollection('services')
  const projects = getCollection('projects')
  const products = getCollection('products')
  const news = getCollection('news')
  const team = getCollection('team')
  const timeline = getCollection('timeline')
  const gallery = getCollection('gallery')
  const jobs = getCollection('jobs')
  const documents = getCollection('documents')
  const settings = getSettings()
  const blockRows = getCollection('blocks')
  const blocks: Record<string, Block> = {}
  blockRows.forEach((b) => {
    blocks[String(b.id)] = {
      title: String(b.title ?? ''),
      subtitle: String(b.subtitle ?? ''),
      copy: String(b.copy ?? ''),
      image: String(b.image ?? ''),
      items: (Array.isArray(b.items) ? b.items : String(b.items ?? '').split('\n')).map(String).filter(Boolean),
    }
  })
  return {
    settings: { ...seed.siteSettings, ...settings },
    stats: stats.map((s) => ({ value: num(s.value, 0), suffix: String(s.suffix ?? ''), label: String(s.label ?? ''), sub: String(s.sub ?? '') })),
    heroSlides: heroes.map((h) => ({ eyebrow: String(h.eyebrow ?? ''), title: String(h.title ?? ''), copy: String(h.copy ?? ''), image: String(h.image ?? ''), cta: String(h.cta ?? ''), href: String(h.href ?? '/') })),
    businessAreas: areas.map((b) => ({ slug: String(b.id), title: String(b.title ?? ''), image: String(b.image ?? ''), intro: String(b.intro ?? ''), points: (Array.isArray(b.points) ? b.points : String(b.points ?? '').split('\n')).map(String).filter(Boolean) })),
    services: services.map((s) => ({ slug: String(s.id), no: String(s.no ?? ''), title: String(s.title ?? ''), image: String(s.image ?? ''), copy: String(s.copy ?? ''), items: (Array.isArray(s.items) ? s.items : String(s.items ?? '').split('\n')).map(String).filter(Boolean) })),
    products: products.map((p) => String(p.text ?? '')),
    domesticProjects: projects.filter((p) => p.kind !== 'international').map((p) => ({ client: String(p.client ?? ''), scope: String(p.scope ?? ''), tag: String(p.tag ?? ''), image: String(p.image ?? '') })),
    internationalProjects: projects.filter((p) => p.kind === 'international').map((p) => ({ client: String(p.client ?? ''), scope: String(p.scope ?? ''), tag: String(p.tag ?? ''), country: String(p.country ?? ''), image: String(p.image ?? '') })),
    timeline: timeline.map((t) => ({ year: String(t.year ?? ''), title: String(t.title ?? ''), note: String(t.note ?? '') })),
    team: team.map((m) => ({ name: String(m.name ?? ''), role: String(m.role ?? ''), photo: String(m.photo ?? '') })),
    news: news.map((n) => ({ date: String(n.date ?? ''), title: String(n.title ?? ''), tag: String(n.tag ?? ''), excerpt: String(n.excerpt ?? ''), image: String(n.image ?? '') })),
    gallery: gallery.map((g) => String(g.url ?? '')),
    jobs: jobs.map((j) => ({ title: String(j.title ?? ''), loc: String(j.loc ?? ''), type: String(j.type ?? ''), desc: String(j.desc ?? '') })),
    documents: documents.map((d) => ({ id: String(d.id), title: String(d.title ?? ''), file_url: String(d.file_url ?? ''), category: String(d.category ?? '') })),
    blocks,
    source: 'local',
  }
}

export function useContent() {
  const [version, setVersion] = useState(0)
  useEffect(() => {
    const fn = () => setVersion((v) => v + 1)
    window.addEventListener(EVENT, fn)
    return () => window.removeEventListener(EVENT, fn)
  }, [])
  const local = useMemo(() => buildFromStore(), [version])
  const [content, setContent] = useState<ContentState>(local)
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setContent(local)
      return
    }
    const sb = supabase()
    if (!sb) {
      setContent(local)
      return
    }
    ;(async () => {
      try {
        const next: ContentState = { ...local, source: 'supabase' }
        const get = async (table: string) => {
          const { data } = await sb.from(table).select('*')
          return data as any[] | null
        }
        const [settings, stats, slides, areas, services, products, dProj, iProj, timeline, team, news, gallery, documents, jobs, blocks] = await Promise.all([
          get('site_settings'), get('stats'), get('hero_slides'), get('business_areas'),
          get('services'), get('products'), get('projects_domestic'), get('projects_international'),
          get('timeline'), get('team'), get('news'), get('gallery'), get('documents'), get('jobs'), get('content_blocks'),
        ])
        if (settings?.[0]) next.settings = { ...next.settings, ...settings[0].data }
        if (stats?.length) next.stats = stats.sort((a, b) => a.sort_order - b.sort_order).map((r) => r.data)
        if (slides?.length) next.heroSlides = slides.sort((a, b) => a.sort_order - b.sort_order).map((r) => r.data)
        if (areas?.length) next.businessAreas = areas.sort((a, b) => a.sort_order - b.sort_order).map((r) => r.data)
        if (services?.length) next.services = services.sort((a, b) => a.sort_order - b.sort_order).map((r) => r.data)
        if (products?.length) next.products = products.sort((a, b) => a.sort_order - b.sort_order).map((r) => r.title)
        if (dProj?.length) next.domesticProjects = dProj.map((r) => r.data)
        if (iProj?.length) next.internationalProjects = iProj.map((r) => r.data)
        if (timeline?.length) next.timeline = timeline.sort((a, b) => a.sort_order - b.sort_order).map((r) => r.data)
        if (team?.length) next.team = team.map((r) => r.data)
        if (news?.length) next.news = news.sort((a, b) => String(b.data.date).localeCompare(String(a.data.date))).map((r) => r.data)
        if (gallery?.length) next.gallery = gallery.map((r) => r.image_url)
        if (documents?.length) next.documents = documents.map((r) => ({ id: r.id, title: r.title, file_url: r.file_url, category: r.category }))
        if (jobs?.length) next.jobs = jobs.sort((a, b) => a.sort_order - b.sort_order).map((r) => r.data)
        if (blocks?.length) {
          blocks.forEach((r: any) => {
            const bid = String(r.block_id ?? r.data?.id ?? '')
            if (!bid) return
            const d = r.data ?? r
            next.blocks[bid] = {
              title: String(d.title ?? next.blocks[bid]?.title ?? ''),
              subtitle: String(d.subtitle ?? next.blocks[bid]?.subtitle ?? ''),
              copy: String(d.copy ?? next.blocks[bid]?.copy ?? ''),
              image: String(d.image ?? next.blocks[bid]?.image ?? ''),
              items: Array.isArray(d.items) ? d.items.map(String) : (next.blocks[bid]?.items ?? []),
            }
          })
        }
        setContent(next)
      } catch {
        setContent(local)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSupabaseConfigured, version])
  return content
}

// ---- lead capture: Supabase when configured, else localStorage queue (visible in admin) ----
export async function saveLead(table: 'brochure_leads' | 'enquiries' | 'job_applications', payload: Record<string, unknown>) {
  const row = { ...payload, created_at: new Date().toISOString() }
  if (isSupabaseConfigured) {
    try {
      const sb = supabase()
      const { error } = await sb!.from(table).insert(row)
      if (error) throw error
      return { ok: true, stored: 'supabase' as const }
    } catch {
      // fall through to local queue
    }
  }
  try {
    const key = `jpma_${table}`
    const existing = JSON.parse(localStorage.getItem(key) || '[]')
    existing.unshift(row)
    localStorage.setItem(key, JSON.stringify(existing))
  } catch { /* ignore */ }
  return { ok: true, stored: 'local' as const }
}

export function readLocalLeads(table: string) {
  try {
    return JSON.parse(localStorage.getItem(`jpma_${table}`) || '[]')
  } catch {
    return []
  }
}
