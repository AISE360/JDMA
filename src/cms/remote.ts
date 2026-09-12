// Supabase read/write layer for the admin CMS.
// Maps the admin's uniform Item {id, ...fields} to each table's real shape:
//   data-tables (hero_slides, stats, business_areas, services, timeline, team, news, jobs)
//     <-> { id, sort_order, data: {...fields} }
//   projects_domestic / projects_international <-> { id, data }
//   products   <-> { id, sort_order, title }
//   gallery    <-> { id, sort_order, image_url, caption }
//   documents  <-> { id, title, file_url, category }
//   site_settings <-> single row { id: 1, data }

import { supabase } from '../lib/supabase'
import type { CollectionKey, Item } from './store'

const DATA_TABLES: Record<string, string> = {
  heroSlides: 'hero_slides',
  stats: 'stats',
  businessAreas: 'business_areas',
  services: 'services',
  timeline: 'timeline',
  team: 'team',
  news: 'news',
  jobs: 'jobs',
}

const ORDERED = new Set(['heroSlides', 'stats', 'businessAreas', 'services', 'timeline', 'team', 'news', 'jobs', 'products', 'gallery'])

function sb() {
  const c = supabase()
  if (!c) throw new Error('Supabase not configured')
  return c
}

const stripId = (it: Item) => {
  const { id, ...rest } = it
  return rest
}

export async function fetchCollection(key: CollectionKey): Promise<Item[]> {
  const db = sb()
  if (DATA_TABLES[key]) {
    const { data, error } = await db.from(DATA_TABLES[key]).select('*').order('sort_order', { ascending: true })
    if (error) throw error
    return (data ?? []).map((r: any) => ({ id: r.id, ...r.data }))
  }
  if (key === 'projects') {
    const [d, i] = await Promise.all([
      db.from('projects_domestic').select('*').order('created_at', { ascending: true }),
      db.from('projects_international').select('*').order('created_at', { ascending: true }),
    ])
    if (d.error) throw d.error
    if (i.error) throw i.error
    return [
      ...((i.data ?? []) as any[]).map((r) => ({ id: r.id, kind: 'international', ...r.data })),
      ...((d.data ?? []) as any[]).map((r) => ({ id: r.id, kind: 'domestic', ...r.data })),
    ]
  }
  if (key === 'products') {
    const { data, error } = await db.from('products').select('*').order('sort_order', { ascending: true })
    if (error) throw error
    return (data ?? []).map((r: any) => ({ id: r.id, text: r.title }))
  }
  if (key === 'gallery') {
    const { data, error } = await db.from('gallery').select('*').order('sort_order', { ascending: true })
    if (error) throw error
    return (data ?? []).map((r: any) => ({ id: r.id, url: r.image_url, caption: r.caption ?? '' }))
  }
  if (key === 'documents') {
    const { data, error } = await db.from('documents').select('*').order('created_at', { ascending: true })
    if (error) throw error
    return (data ?? []).map((r: any) => ({ id: r.id, title: r.title, file_url: r.file_url, category: r.category }))
  }
  throw new Error(`Unknown collection ${key}`)
}

export async function addRemoteItem(key: CollectionKey, item: Item, atEnd = true): Promise<Item> {
  const db = sb()
  if (DATA_TABLES[key]) {
    const rows = await fetchCollection(key)
    const payload = { data: stripId(item), ...(ORDERED.has(key) ? { sort_order: atEnd ? rows.length + 1 : 0 } : {}) }
    const { data, error } = await db.from(DATA_TABLES[key]).insert(payload).select('*').single()
    if (error) throw error
    return { id: data.id, ...data.data }
  }
  if (key === 'projects') {
    const table = item.kind === 'international' ? 'projects_international' : 'projects_domestic'
    const { data, error } = await db.from(table).insert({ data: stripId({ ...item, kind: undefined } as Item) }).select('*').single()
    if (error) throw error
    return { id: data.id, kind: item.kind, ...data.data }
  }
  if (key === 'products') {
    const rows = await fetchCollection(key)
    const { data, error } = await db.from('products').insert({ title: String(item.text ?? ''), sort_order: rows.length + 1 }).select('*').single()
    if (error) throw error
    return { id: data.id, text: data.title }
  }
  if (key === 'gallery') {
    const rows = await fetchCollection(key)
    const { data, error } = await db.from('gallery').insert({ image_url: String(item.url ?? ''), caption: String(item.caption ?? ''), sort_order: rows.length + 1 }).select('*').single()
    if (error) throw error
    return { id: data.id, url: data.image_url, caption: data.caption ?? '' }
  }
  if (key === 'documents') {
    const { data, error } = await db.from('documents').insert({ title: String(item.title ?? ''), file_url: String(item.file_url ?? ''), category: String(item.category ?? 'brochure') }).select('*').single()
    if (error) throw error
    return { id: data.id, title: data.title, file_url: data.file_url, category: data.category }
  }
  throw new Error(`Unknown collection ${key}`)
}

export async function saveRemoteItem(key: CollectionKey, item: Item): Promise<void> {
  const db = sb()
  if (DATA_TABLES[key]) {
    const { error } = await db.from(DATA_TABLES[key]).update({ data: stripId(item) }).eq('id', item.id)
    if (error) throw error
    return
  }
  if (key === 'projects') {
    // kind may have changed: delete from both, insert into the right one (id changes, acceptable)
    await db.from('projects_domestic').delete().eq('id', item.id)
    await db.from('projects_international').delete().eq('id', item.id)
    await addRemoteItem(key, item)
    return
  }
  if (key === 'products') {
    const { error } = await db.from('products').update({ title: String(item.text ?? '') }).eq('id', item.id)
    if (error) throw error
    return
  }
  if (key === 'gallery') {
    const { error } = await db.from('gallery').update({ image_url: String(item.url ?? ''), caption: String(item.caption ?? '') }).eq('id', item.id)
    if (error) throw error
    return
  }
  if (key === 'documents') {
    const { error } = await db.from('documents').update({ title: String(item.title ?? ''), file_url: String(item.file_url ?? ''), category: String(item.category ?? 'brochure') }).eq('id', item.id)
    if (error) throw error
    return
  }
  throw new Error(`Unknown collection ${key}`)
}

export async function deleteRemoteItem(key: CollectionKey, id: string, kind?: string): Promise<void> {
  const db = sb()
  if (DATA_TABLES[key]) {
    const { error } = await db.from(DATA_TABLES[key]).delete().eq('id', id)
    if (error) throw error
    return
  }
  if (key === 'projects') {
    const tables = kind === 'international' ? ['projects_international'] : kind === 'domestic' ? ['projects_domestic'] : ['projects_domestic', 'projects_international']
    for (const t of tables) {
      const { error } = await db.from(t).delete().eq('id', id)
      if (error) throw error
    }
    return
  }
  const table = key === 'products' ? 'products' : key === 'gallery' ? 'gallery' : 'documents'
  const { error } = await db.from(table).delete().eq('id', id)
  if (error) throw error
}

export async function reorderRemote(key: CollectionKey, items: Item[]): Promise<void> {
  // persists the on-screen order into sort_order for ordered tables
  const db = sb()
  if (key === 'projects' || key === 'documents') return
  const table = DATA_TABLES[key] ?? key
  for (let i = 0; i < items.length; i++) {
    const { error } = await db.from(table).update({ sort_order: i + 1 }).eq('id', items[i].id)
    if (error) throw error
  }
}

export async function fetchSettings(): Promise<Record<string, string>> {
  const { data, error } = await sb().from('site_settings').select('data').eq('id', 1).single()
  if (error) throw error
  return (data?.data ?? {}) as Record<string, string>
}

export async function saveSettingsRemote(s: Record<string, string>): Promise<void> {
  const { error } = await sb().from('site_settings').update({ data: s }).eq('id', 1)
  if (error) throw error
}
