import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useContent } from '../hooks/useContent'

interface Hit { group: string; title: string; desc: string; to: string }

const PAGES: Hit[] = [
  { group: 'Pages', title: 'About, Our Approach', desc: 'Story, leadership, timeline, values', to: '/about' },
  { group: 'Pages', title: 'Contact', desc: 'Enquire about your plant', to: '/contact' },
  { group: 'Pages', title: 'Careers', desc: 'Open roles at JPMA', to: '/careers' },
  { group: 'Pages', title: 'Innovation & R&D', desc: 'MCU, couplings, product family', to: '/innovation' },
]

export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const c = useContent()
  const [q, setQ] = useState('')

  useEffect(() => {
    setQ('')
    if (!open) return
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [open, onClose])

  const hits = useMemo<Hit[]>(() => {
    const query = q.trim().toLowerCase()
    if (query.length < 2) return []
    const all: Hit[] = [
      ...PAGES,
      ...c.businessAreas.map((b) => ({ group: 'Expertise', title: b.title, desc: b.intro, to: `/expertise#${b.slug}` })),
      ...c.services.map((s) => ({ group: 'Services', title: s.title, desc: s.copy, to: `/services#${s.slug}` })),
      ...c.domesticProjects.map((p) => ({ group: 'Projects · India', title: p.client, desc: p.scope, to: '/projects?tab=domestic' })),
      ...c.internationalProjects.map((p) => ({ group: 'Projects · World', title: p.client, desc: p.scope, to: '/projects?tab=international' })),
      ...c.news.map((n) => ({ group: 'Insights', title: n.title, desc: n.excerpt, to: '/insights' })),
      ...c.jobs.map((j) => ({ group: 'Careers', title: j.title, desc: j.loc, to: '/careers' })),
    ]
    return all.filter((h) => `${h.title} ${h.desc} ${h.group}`.toLowerCase().includes(query)).slice(0, 12)
  }, [q, c])

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[100]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-brand-deep/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto mt-24 w-[min(620px,92vw)] overflow-hidden rounded-[1.5rem] bg-paper shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-ink/10 px-6 py-4">
              <svg viewBox="0 0 20 20" className="h-5 w-5 text-soft" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="9" cy="9" r="6" /><path d="m13.5 13.5 4 4" /></svg>
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search services, projects, news…" className="w-full bg-transparent text-[15px] outline-none placeholder:text-ink/35" />
              <button onClick={onClose} className="text-xl text-soft hover:text-ink">×</button>
            </div>
            <div className="max-h-[50vh] overflow-y-auto p-3">
              {q.trim().length >= 2 && !hits.length && (
                <p className="px-4 py-8 text-center text-[13.5px] text-soft">No matches, try "ethanol", "PMC", "Nigeria", "MCU"…</p>
              )}
              {q.trim().length < 2 && (
                <p className="px-4 py-6 text-center text-[13px] text-soft">Type at least 2 letters. Try "sugar", "audit", "Kenya".</p>
              )}
              {hits.map((h, i) => (
                <Link key={`${h.to}-${i}`} to={h.to} onClick={onClose} className="flex items-start justify-between gap-3 rounded-xl px-4 py-3 hover:bg-mist">
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-semibold">{h.title}</span>
                    <span className="block text-[12.5px] text-soft truncate">{h.desc}</span>
                  </span>
                  <span className="shrink-0 rounded-full bg-parchment px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-soft">{h.group}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
