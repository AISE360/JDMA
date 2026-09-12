import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { readLocalLeads } from '../hooks/useContent'
import {
  SCHEMAS, SETTINGS_FIELDS, IMAGE_OPTIONS,
  getCollection, addItem, saveItem, deleteItem, moveItem, resetCollection, resetAll,
  getSettings, saveSettings, defaultSettings, defaultsFor, uid,
  type CollectionDef, type CollectionKey, type FieldDef, type Item,
} from '../cms/store'
import {
  fetchCollection, addRemoteItem, saveRemoteItem, deleteRemoteItem, reorderRemote,
  fetchSettings, saveSettingsRemote,
} from '../cms/remote'

type Lead = Record<string, any>
type Section =
  | { kind: 'dashboard' }
  | { kind: 'leads'; table: 'brochure_leads' | 'enquiries' | 'job_applications' }
  | { kind: 'collection'; key: CollectionKey }
  | { kind: 'settings' }

const LEAD_TABS = [
  { key: 'brochure_leads', label: 'Brochure leads', note: 'Every gated brochure download, name, country code + full phone.' },
  { key: 'enquiries', label: 'Enquiries', note: 'Contact-page enquiries.' },
  { key: 'job_applications', label: 'Job applications', note: 'Careers-page applications.' },
] as const

// ---------------- image field ----------------
function ImageField({ value, onChange, help }: { value: string; onChange: (v: string) => void; help?: string }) {
  const custom = value && !IMAGE_OPTIONS.includes(value) && !value.startsWith('data:')
  function upload(file: File | undefined) {
    if (!file) return
    const r = new FileReader()
    r.onload = () => onChange(String(r.result))
    r.readAsDataURL(file)
  }
  return (
    <div className="rounded-xl border border-ink/15 p-3 space-y-2.5 bg-white">
      <div className="flex gap-3 items-start">
        {value ? (
          value.endsWith('.pdf') ? (
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-mist text-[10px] font-bold text-brand">PDF</span>
          ) : (
            <img src={value} alt="preview" className="h-16 w-16 shrink-0 rounded-lg object-cover border border-ink/10" />
          )
        ) : (
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-mist text-[10px] text-soft">No image</span>
        )}
        <div className="flex-1 space-y-2">
          <select value={IMAGE_OPTIONS.includes(value) ? value : ''} onChange={(e) => e.target.value && onChange(e.target.value)} className="w-full rounded-lg border border-ink/15 px-3 py-2 text-[13px] outline-none">
            <option value=""> Pick from site library </option>
            {IMAGE_OPTIONS.map((o) => (<option key={o} value={o}>{o}</option>))}
          </select>
          <input value={custom ? value : ''} onChange={(e) => onChange(e.target.value)} placeholder="…or paste image / file URL" className="w-full rounded-lg border border-ink/15 px-3 py-2 text-[13px] outline-none" />
        </div>
      </div>
      <label className="flex items-center gap-2 text-[12.5px] text-soft cursor-pointer">
        <span className="rounded-full border border-ink/20 px-4 py-1.5 font-semibold text-ink hover:border-brand">Upload from computer</span>
        <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
        {value.startsWith('data:') && <span className="text-brand font-semibold">Uploaded ✓</span>}
      </label>
      {help && <p className="text-[11.5px] text-soft">{help}</p>}
    </div>
  )
}

// ---------------- generic field ----------------
function FieldInput({ field, value, onChange }: { field: FieldDef; value: any; onChange: (v: any) => void }) {
  const cls = 'w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand'
  if (field.type === 'textarea' || field.type === 'lines')
    return <textarea value={field.type === 'lines' && Array.isArray(value) ? value.join('\n') : String(value ?? '')} onChange={(e) => onChange(field.type === 'lines' ? e.target.value.split('\n') : e.target.value)} rows={field.type === 'lines' ? 5 : 3} placeholder={field.type === 'lines' ? 'One per line…' : ''} className={cls} />
  if (field.type === 'number')
    return <input type="number" value={value ?? ''} onChange={(e) => onChange(Number(e.target.value))} className={cls} />
  if (field.type === 'select')
    return (
      <select value={String(value ?? field.options?.[0] ?? '')} onChange={(e) => onChange(e.target.value)} className={cls}>
        {(field.options ?? []).map((o) => (<option key={o} value={o}>{o}</option>))}
      </select>
    )
  if (field.type === 'image') return <ImageField value={String(value ?? '')} onChange={onChange} help={field.help} />
  return <input value={String(value ?? '')} onChange={(e) => onChange(e.target.value)} className={cls} />
}

// ---------------- item editor modal ----------------
function ItemEditor({ def, initial, onSave, onClose }: { def: CollectionDef; initial: Item; onSave: (it: Item) => void; onClose: () => void }) {
  const [form, setForm] = useState<Item>({ ...initial })
  const set = (k: string) => (v: any) => setForm({ ...form, [k]: v })
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand-deep/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-[1.5rem] bg-paper shadow-2xl">
        <div className="sticky top-0 bg-paper/95 backdrop-blur px-7 pt-6 pb-4 border-b border-ink/10 flex items-center justify-between">
          <h3 className="font-display text-2xl">{initial.id.startsWith('new-') ? def.addLabel : `Edit ${def.singular.toLowerCase()}`}</h3>
          <button onClick={onClose} className="text-2xl text-soft hover:text-ink">×</button>
        </div>
        <div className="px-7 py-6 space-y-4">
          {def.fields.map((f) => (
            <div key={f.key}>
              <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand">{f.label}</p>
              <FieldInput field={f} value={form[f.key]} onChange={set(f.key)} />
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <button onClick={() => { onSave(form); onClose() }} className="flex-1 rounded-full bg-brand py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:bg-brand-deep">Save</button>
            <button onClick={onClose} className="rounded-full border border-ink/20 px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em]">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------- leads ----------------
function useLeads(table: string, refresh: number) {
  const [rows, setRows] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(true)
    ;(async () => {
      let data: Lead[] = []
      if (isSupabaseConfigured) {
        try {
          const { data: d } = await supabase()!.from(table).select('*').order('created_at', { ascending: false }).limit(500)
          if (d) data = d
        } catch { /* fallback */ }
      }
      if (!data.length) data = readLocalLeads(table)
      setRows(data)
      setLoading(false)
    })()
  }, [table, refresh])
  return { rows, loading }
}

function toCSV(rows: Lead[]) {
  if (!rows.length) return ''
  const cols = Array.from(new Set(rows.flatMap((r) => Object.keys(r))))
  const esc = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`
  return [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n')
}

function LeadsTable({ table }: { table: 'brochure_leads' | 'enquiries' | 'job_applications' }) {
  const [refresh, setRefresh] = useState(0)
  const [query, setQuery] = useState('')
  const { rows, loading } = useLeads(table, refresh)
  const filtered = useMemo(() => {
    if (!query) return rows
    const q = query.toLowerCase()
    return rows.filter((r) => JSON.stringify(r).toLowerCase().includes(q))
  }, [rows, query])
  return (
    <div className="rounded-[1.5rem] border border-ink/10 bg-white overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-ink/10">
        <p className="text-[13px] text-soft">{loading ? 'Loading…' : `${filtered.length} record${filtered.length === 1 ? '' : 's'}`}</p>
        <div className="flex gap-2">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, phone, email…" className="rounded-full border border-ink/15 px-4 py-2 text-[13px] outline-none w-60" />
          <button onClick={() => setRefresh((r) => r + 1)} className="rounded-full border border-ink/20 px-5 py-2 text-[12px] font-bold">Refresh</button>
          <button onClick={() => {
            const blob = new Blob([toCSV(filtered)], { type: 'text/csv' })
            const a = document.createElement('a')
            a.href = URL.createObjectURL(blob)
            a.download = `jpma_${table}.csv`
            a.click()
          }} className="rounded-full bg-brand px-5 py-2 text-[12px] font-bold text-white">Export CSV ↓</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[13px] min-w-[780px]">
          <thead>
            <tr className="bg-mist text-[10.5px] uppercase tracking-[0.16em] text-soft">
              <th className="px-5 py-3">When</th>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Phone (code + number)</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Detail</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={i} className="border-t border-ink/5 hover:bg-paper">
                <td className="px-5 py-3 whitespace-nowrap text-soft">{r.created_at ? new Date(r.created_at).toLocaleString() : ''}</td>
                <td className="px-5 py-3 font-semibold">{r.name || ''}</td>
                <td className="px-5 py-3 font-mono font-semibold">{r.full_phone || (r.country_code ? `${r.country_code} ${r.phone || ''}` : r.phone) || ''}{r.country ? <span className="ml-2 font-sans text-[11px] text-soft">{r.country}</span> : null}</td>
                <td className="px-5 py-3">{r.email || ''}</td>
                <td className="px-5 py-3 text-soft">{r.organisation || r.message || r.role || r.note || ''}</td>
              </tr>
            ))}
            {!filtered.length && !loading && (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-soft">No records yet, submit the brochure gate, enquiry or careers form to see numbers appear here.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ---------------- collection manager ----------------
function thumbFor(def: CollectionDef, it: Item): string {
  const v = it.image || it.photo || it.url || it.file_url || ''
  return typeof v === 'string' && !v.endsWith('.pdf') ? v : ''
}

function titleFor(def: CollectionDef, it: Item): string {
  return String(it.title || it.client || it.name || it.text || it.year || it.url || it.file_url || it.id)
}

function CollectionManager({ def }: { def: CollectionDef }) {
  const remote = isSupabaseConfigured
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState('')
  const [editing, setEditing] = useState<Item | null>(null)

  const reload = async () => {
    setLoading(true)
    try {
      setItems(remote ? await fetchCollection(def.key) : getCollection(def.key))
    } catch (e: any) {
      setBusy(`Could not load: ${e?.message || e}`)
      try { setItems(getCollection(def.key)) } catch { /* ignore */ }
    }
    setLoading(false)
  }
  useEffect(() => { reload() }, [def.key])

  const blank: Item = { id: `new-${uid(def.key)}` }
  def.fields.forEach((f) => {
    if (blank[f.key] !== undefined) return
    blank[f.key] = f.type === 'number' ? 0 : f.type === 'select' ? (f.key === 'kind' ? 'domestic' : f.options?.[0] ?? '') : f.type === 'lines' ? [] : ''
  })

  const onSave = async (it: Item) => {
    setBusy('Saving…')
    try {
      if (remote) {
        if (it.id.startsWith('new-')) {
          const { id, ...rest } = it
          await addRemoteItem(def.key, rest as Item)
        } else {
          await saveRemoteItem(def.key, it)
        }
      } else if (it.id.startsWith('new-')) addItem(def.key, { ...it, id: uid(def.key) })
      else saveItem(def.key, it)
      setEditing(null)
      await reload()
      setBusy('')
    } catch (e: any) {
      setBusy(`Save failed: ${e?.message || e}`)
    }
  }

  const doDelete = async (it: Item) => {
    if (!confirm('Delete this item?')) return
    setBusy('Deleting…')
    try {
      if (remote) await deleteRemoteItem(def.key, it.id, it.kind)
      else deleteItem(def.key, it.id)
      await reload()
      setBusy('')
    } catch (e: any) {
      setBusy(`Delete failed: ${e?.message || e}`)
    }
  }

  const doMove = async (id: string, dir: -1 | 1) => {
    const arr = [...items]
    const i = arr.findIndex((it) => it.id === id)
    const j = i + dir
    if (i < 0 || j < 0 || j >= arr.length) return
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
    if (remote) {
      setItems(arr)
      try { await reorderRemote(def.key, arr) } catch (e: any) { setBusy(`Reorder failed: ${e?.message || e}`) }
    } else {
      moveItem(def.key, id, dir)
      reload()
    }
  }

  const doReset = async () => {
    if (!confirm(`Reset "${def.label}" to original content?`)) return
    setBusy('Resetting…')
    try {
      if (remote) {
        const cur = await fetchCollection(def.key)
        for (const it of cur) await deleteRemoteItem(def.key, it.id, it.kind)
        for (const d of defaultsFor(def.key)) {
          const { id, ...rest } = d
          await addRemoteItem(def.key, rest as Item)
        }
      } else resetCollection(def.key)
      await reload()
      setBusy('')
    } catch (e: any) {
      setBusy(`Reset failed: ${e?.message || e}`)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[13px] text-soft">
          {loading ? 'Loading…' : `${items.length} item${items.length === 1 ? '' : 's'}`} · live on the website as soon as you save
        </p>
        <div className="flex gap-2">
          <button onClick={doReset} className="rounded-full border border-ink/20 px-5 py-2 text-[12px] font-bold">Reset</button>
          <button onClick={() => setEditing({ ...blank, id: `new-${uid(def.key)}` })} className="rounded-full bg-brand px-5 py-2 text-[12px] font-bold text-white">+ {def.addLabel}</button>
        </div>
      </div>
      {busy && <p className="mt-3 rounded-xl bg-mist px-4 py-2 text-[13px]">{busy}</p>}
      <div className="mt-5 grid md:grid-cols-2 gap-4">
        {items.map((it) => {
          const th = thumbFor(def, it)
          return (
            <div key={it.id} className="rounded-2xl border border-ink/10 bg-white p-4 flex gap-4 items-start">
              {th ? <img src={th} alt="" className="h-16 w-16 rounded-xl object-cover shrink-0 border border-ink/10" /> : null}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[14px] truncate">{titleFor(def, it)}</p>
                <p className="text-[12px] text-soft truncate">
                  {[it.kind, it.tag, it.role, it.loc, it.type, it.date, it.category].filter(Boolean).join(' · ') || it.id}
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  <button onClick={() => setEditing(it)} className="rounded-full bg-brand px-4 py-1.5 text-[11px] font-bold text-white">Edit</button>
                  {def.ordered && (
                    <>
                      <button onClick={() => doMove(it.id, -1)} className="rounded-full border border-ink/20 px-3 py-1.5 text-[11px] font-bold" title="Move up">↑</button>
                      <button onClick={() => doMove(it.id, 1)} className="rounded-full border border-ink/20 px-3 py-1.5 text-[11px] font-bold" title="Move down">↓</button>
                    </>
                  )}
                  <button onClick={() => doDelete(it)} className="rounded-full border border-red-200 px-4 py-1.5 text-[11px] font-bold text-red-600">Delete</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {editing && (
        <ItemEditor
          def={def}
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={onSave}
        />
      )}
    </div>
  )
}

// ---------------- settings ----------------
function SettingsEditor() {
  const remote = isSupabaseConfigured
  const [form, setForm] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const base = getSettings()
        if (remote) {
          try {
            const r = await fetchSettings()
            setForm({ ...base, ...r })
          } catch {
            setForm(base)
          }
        } else setForm(base)
      } catch {
        setForm(defaultSettings())
      }
      setLoading(false)
    })()
  }, [remote])

  const save = async () => {
    setMsg('Saving…')
    try {
      if (remote) await saveSettingsRemote(form)
      else saveSettings(form)
      setMsg('Saved, live on the website now.')
    } catch (e: any) {
      setMsg(`Save failed: ${e?.message || e}`)
    }
  }

  const restore = async () => {
    if (!confirm('Restore original settings?')) return
    const d = defaultSettings()
    try {
      if (remote) await saveSettingsRemote(d)
      else saveSettings(d)
      setForm(d)
      setMsg('Original settings restored.')
    } catch (e: any) {
      setMsg(`Restore failed: ${e?.message || e}`)
    }
  }

  if (loading) return <p className="text-sm text-soft">Loading settings…</p>
  return (
    <div className="max-w-3xl">
      <div className="rounded-[1.5rem] border border-ink/10 bg-white p-6 space-y-4">
        {SETTINGS_FIELDS.map((f) => (
          <div key={f.key}>
            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand">{f.label}</p>
            <FieldInput field={f} value={form[f.key]} onChange={(v) => setForm({ ...form, [f.key]: v })} />
          </div>
        ))}
        {msg && <p className="text-[13px] text-brand font-semibold">{msg}</p>}
        <div className="flex gap-3">
          <button onClick={save} className="rounded-full bg-brand px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white">Save settings</button>
          <button onClick={restore} className="rounded-full border border-ink/20 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em]">Restore originals</button>
          {!remote && <button onClick={() => { if (confirm('Reset ALL website content to original?')) { resetAll(); setForm(getSettings()); setMsg('Everything reset to original.') } }} className="rounded-full border border-red-200 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-red-600">Reset everything</button>}
        </div>
      </div>
    </div>
  )
}

// ---------------- dashboard ----------------
function Dashboard({ go }: { go: (s: Section) => void }) {
  const counts = useMemo(() => {
    const leads = (['brochure_leads', 'enquiries', 'job_applications'] as const).map((t) => ({ t, n: readLocalLeads(t).length }))
    const content = SCHEMAS.map((s) => ({ label: s.label, n: getCollection(s.key).length, key: s.key }))
    return { leads, content }
  }, [])
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        {counts.leads.map((l) => (
          <button key={l.t} onClick={() => go({ kind: 'leads', table: l.t })} className="text-left rounded-2xl border border-ink/10 bg-white p-5 hover:border-brand transition-colors">
            <p className="font-display text-4xl">{l.n}</p>
            <p className="mt-1 text-[12px] font-bold uppercase tracking-[0.16em] text-brand">{LEAD_TABS.find((t) => t.key === l.t)?.label}</p>
          </button>
        ))}
      </div>
      <div className="rounded-2xl border border-ink/10 bg-white p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand">Website content</p>
        <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {counts.content.map((c) => (
            <button key={c.key} onClick={() => go({ kind: 'collection', key: c.key })} className="flex items-center justify-between rounded-xl bg-paper px-4 py-2.5 text-[13px] hover:bg-mist">
              <span className="font-medium">{c.label}</span>
              <span className="text-soft">{c.n} →</span>
            </button>
          ))}
          <button onClick={() => go({ kind: 'settings' })} className="flex items-center justify-between rounded-xl bg-paper px-4 py-2.5 text-[13px] hover:bg-mist">
            <span className="font-medium">Site settings</span><span className="text-soft">→</span>
          </button>
        </div>
      </div>
      {!isSupabaseConfigured && (
        <p className="rounded-2xl bg-mist p-5 text-[13px] text-soft leading-relaxed">
          <strong className="text-ink">Local mode:</strong> edits save in this browser and show on the site instantly.
        </p>
      )}
    </div>
  )
}

// ---------------- shell ----------------
export default function Admin() {
  const [authed, setAuthed] = useState(!isSupabaseConfigured)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authMsg, setAuthMsg] = useState('')
  const [section, setSection] = useState<Section>({ kind: 'dashboard' })
  const [staff, setStaff] = useState('')

  useEffect(() => {
    if (!isSupabaseConfigured) return
    supabase()!.auth.getSession().then(({ data }) => {
      setAuthed(!!data.session)
      setStaff(data.session?.user.email ?? '')
    })
    const { data: sub } = supabase()!.auth.onAuthStateChange((_e, s) => {
      setAuthed(!!s)
      setStaff(s?.user.email ?? '')
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  async function login(e: React.FormEvent) {
    e.preventDefault()
    setAuthMsg('')
    try {
      const { error } = await supabase()!.auth.signInWithPassword({ email, password })
      if (error) throw error
    } catch (err: any) {
      setAuthMsg(err.message || 'Login failed. Create this user in Supabase → Authentication first.')
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center px-4 py-10 relative overflow-hidden">
        <span aria-hidden className="giant-mark absolute -right-10 -top-16 text-[18rem]">J</span>
        <span aria-hidden className="giant-mark absolute -left-12 -bottom-20 text-[16rem]">P</span>
        <div className="relative w-full max-w-4xl overflow-hidden rounded-[2rem] bg-white shadow-[0_40px_90px_-40px_rgba(38,49,62,0.5)] border border-ink/10 grid md:grid-cols-2">
          <div className="bg-brand-deep text-white p-8 md:p-10 flex flex-col justify-between min-h-[280px]">
            <div>
              <img src="/assets/jpma-logo-blue.png" alt="JPMA" className="h-10 w-auto bg-white rounded-lg px-2.5 py-1" />
              <p className="mt-6 text-[10.5px] font-bold uppercase tracking-[0.28em] text-white/50">JPMA command center</p>
              <h1 className="font-display mt-3 text-4xl leading-tight">Every lead,<br />every pixel,<br />manageable.</h1>
            </div>
            <ul className="mt-8 space-y-2.5 text-[13px] text-white/70">
              <li className="flex gap-2.5"><span className="text-white">◆</span> Brochure, enquiry & job leads with phone numbers</li>
              <li className="flex gap-2.5"><span className="text-white">◆</span> All website text, images, projects & news</li>
              <li className="flex gap-2.5"><span className="text-white">◆</span> One-click CSV exports for the team</li>
            </ul>
          </div>
          <div className="p-8 md:p-10 flex flex-col justify-center">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.28em] text-brand">Staff sign in</p>
            <h2 className="font-display mt-2 text-3xl">Welcome back.</h2>
            <p className="mt-2 text-[13.5px] text-soft">
              {isSupabaseConfigured ? 'Sign in with your staff ID to open the admin.' : 'Local demo mode, no password needed.'}
            </p>
            {isSupabaseConfigured ? (
              <form onSubmit={login} className="mt-6 space-y-3">
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.18em] text-soft">Admin ID</label>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@jpma.org.in" type="email" className="w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 text-sm outline-none placeholder:text-ink/35 focus:border-brand" />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.18em] text-soft">Password</label>
                  <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" type="password" className="w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 text-sm outline-none placeholder:text-ink/35 focus:border-brand" />
                </div>
                {authMsg && <p className="rounded-xl bg-red-50 px-4 py-2.5 text-[13px] font-medium text-red-700">{authMsg}</p>}
                <button className="w-full rounded-full bg-brand py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:bg-brand-deep transition-colors">Sign in →</button>
              </form>
            ) : (
              <button onClick={() => setAuthed(true)} className="mt-6 w-full rounded-full bg-brand py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:bg-brand-deep transition-colors">Enter admin →</button>
            )}
            <Link to="/" className="mt-5 text-center text-[12.5px] text-soft hover:text-brand">← Back to website</Link>
          </div>
        </div>
      </div>
    )
  }

  const title =
    section.kind === 'dashboard' ? 'Dashboard' :
    section.kind === 'leads' ? LEAD_TABS.find((t) => t.key === section.table)?.label ?? '' :
    section.kind === 'settings' ? 'Site settings' :
    SCHEMAS.find((s) => s.key === section.key)?.label ?? ''

  const sub =
    section.kind === 'dashboard' ? 'Overview of leads and content.' :
    section.kind === 'leads' ? LEAD_TABS.find((t) => t.key === section.table)?.note ?? '' :
    section.kind === 'settings' ? 'Phone numbers, emails, address, links, brochure file.' :
    'Add, edit, reorder and delete. Changes go live instantly.'

  const navBtn = (active: boolean) => `block w-full text-left rounded-xl px-4 py-2 text-[13px] font-medium transition-colors ${active ? 'bg-brand text-white' : 'text-ink/70 hover:bg-mist'}`

  return (
    <div className="min-h-screen bg-paper text-ink flex">
      {/* sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-brand-deep text-white p-5">
        <Link to="/" className="flex items-center justify-center gap-2.5 pb-5 border-b border-white/10" aria-label="JPMA admin home">
          <img src="/assets/jpma-logo-blue.png" alt="JPMA" className="h-9 w-auto bg-white rounded-lg px-2 py-1" />
        </Link>
        <nav className="mt-5 space-y-5 overflow-y-auto">
          <div>
            <p className="px-2 text-[9.5px] font-bold uppercase tracking-[0.24em] text-white/40">Workspace</p>
            <div className="mt-1.5 space-y-0.5">
              <button onClick={() => setSection({ kind: 'dashboard' })} className={`w-full text-left rounded-xl px-4 py-2 text-[13px] font-medium ${section.kind === 'dashboard' ? 'bg-white text-brand-deep' : 'text-white/75 hover:bg-white/10'}`}>Dashboard</button>
            </div>
          </div>
          <div>
            <p className="px-2 text-[9.5px] font-bold uppercase tracking-[0.24em] text-white/40">Leads</p>
            <div className="mt-1.5 space-y-0.5">
              {LEAD_TABS.map((t) => (
                <button key={t.key} onClick={() => setSection({ kind: 'leads', table: t.key })} className={`w-full text-left rounded-xl px-4 py-2 text-[13px] font-medium ${section.kind === 'leads' && section.table === t.key ? 'bg-white text-brand-deep' : 'text-white/75 hover:bg-white/10'}`}>{t.label}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="px-2 text-[9.5px] font-bold uppercase tracking-[0.24em] text-white/40">Website content</p>
            <div className="mt-1.5 space-y-0.5">
              {SCHEMAS.map((s) => (
                <button key={s.key} onClick={() => setSection({ kind: 'collection', key: s.key })} className={`w-full text-left rounded-xl px-4 py-2 text-[13px] font-medium ${section.kind === 'collection' && section.key === s.key ? 'bg-white text-brand-deep' : 'text-white/75 hover:bg-white/10'}`}>{s.label}</button>
              ))}
              <button onClick={() => setSection({ kind: 'settings' })} className={`w-full text-left rounded-xl px-4 py-2 text-[13px] font-medium ${section.kind === 'settings' ? 'bg-white text-brand-deep' : 'text-white/75 hover:bg-white/10'}`}>Site settings</button>
            </div>
          </div>
        </nav>
        <div className="mt-auto pt-5 border-t border-white/10 space-y-2">
          {staff && <p className="px-2 text-[11.5px] text-white/50 truncate">{staff}</p>}
          <Link to="/" className="block rounded-xl border border-white/20 px-4 py-2 text-[12.5px] text-center hover:bg-white/10">← View website</Link>
          {isSupabaseConfigured
            ? <button onClick={() => supabase()!.auth.signOut()} className="w-full rounded-xl border border-white/20 px-4 py-2 text-[12.5px] hover:bg-white/10">Sign out</button>
            : <button onClick={() => setAuthed(false)} className="w-full rounded-xl border border-white/20 px-4 py-2 text-[12.5px] hover:bg-white/10">Lock</button>}
        </div>
      </aside>

      {/* main */}
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-paper/90 backdrop-blur border-b border-ink/10 px-5 md:px-8 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img src="/assets/jpma-logo-blue.png" alt="JPMA" className="md:hidden h-8 w-auto" />
              <div>
                <h1 className="font-display text-2xl leading-none">{title}</h1>
                <p className="mt-1 text-[12px] text-soft">{sub}</p>
              </div>
            </div>
            <Link to="/" className="md:hidden rounded-full border border-ink/20 px-4 py-2 text-[11px] font-bold">← Site</Link>
          </div>
          {/* mobile section nav */}
          <div className="md:hidden mt-3 flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <button onClick={() => setSection({ kind: 'dashboard' })} className={navBtn(section.kind === 'dashboard') + ' whitespace-nowrap border border-ink/10'}>Dashboard</button>
            {LEAD_TABS.map((t) => (
              <button key={t.key} onClick={() => setSection({ kind: 'leads', table: t.key })} className={navBtn(section.kind === 'leads' && section.table === t.key) + ' whitespace-nowrap border border-ink/10'}>{t.label}</button>
            ))}
            {SCHEMAS.map((s) => (
              <button key={s.key} onClick={() => setSection({ kind: 'collection', key: s.key })} className={navBtn(section.kind === 'collection' && section.key === s.key) + ' whitespace-nowrap border border-ink/10'}>{s.label}</button>
            ))}
            <button onClick={() => setSection({ kind: 'settings' })} className={navBtn(section.kind === 'settings') + ' whitespace-nowrap border border-ink/10'}>Settings</button>
          </div>
        </header>
        <main className="px-5 md:px-8 py-6 max-w-6xl">
          {section.kind === 'dashboard' && <Dashboard go={setSection} />}
          {section.kind === 'leads' && <LeadsTable table={section.table} />}
          {section.kind === 'collection' && <CollectionManager key={section.key} def={SCHEMAS.find((s) => s.key === section.key)!} />}
          {section.kind === 'settings' && <SettingsEditor />}
        </main>
      </div>
    </div>
  )
}
