import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import SearchOverlay from './SearchOverlay'
import type { OpenBrochure } from './BrochureModal'

export interface MenuItem { label: string; to: string }

export const MENU: MenuItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Business', to: '/expertise' },
  { label: 'Services', to: '/services' },
  { label: 'Our Approach', to: '/about' },
  { label: 'Projects', to: '/projects' },
  { label: 'Insights', to: '/insights' },
  { label: 'Innovation', to: '/innovation' },
  { label: 'Careers', to: '/careers' },
]

export default function Navbar({ onBrochure }: { onBrochure: OpenBrochure }) {
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)
  const downAcc = useRef(0)
  const upAcc = useRef(0)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState(false)
  const loc = useLocation()

  useEffect(() => {
    const fn = () => {
      const y = window.scrollY
      const dy = y - lastY.current
      lastY.current = y
      if (y <= 140) { upAcc.current = 0; downAcc.current = 0; setHidden(false); return }
      if (dy > 0) { upAcc.current = 0; downAcc.current += dy; if (downAcc.current > 64) setHidden(true) }
      else if (dy < 0) { downAcc.current = 0; upAcc.current -= dy; if (upAcc.current > 4) setHidden(false) }
    }
    fn()
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  useEffect(() => { setOpen(false); lastY.current = window.scrollY; upAcc.current = 0; downAcc.current = 0; setHidden(false) }, [loc.pathname, loc.search, loc.hash])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open ])

  const parentActive = (m: MenuItem) => {
    if (m.to === '/') return loc.pathname === '/'
    return loc.pathname.startsWith(m.to)
  }

  return (
    <>
      <header className={`sticky top-0 z-40 bg-white border-b border-navy/10 will-change-transform transition-transform duration-300 ${hidden && !open ? '-translate-y-full' : 'translate-y-0'}`}>
        <div className="w-full pl-3 pr-3 md:pl-6 md:pr-5 flex items-center gap-2 sm:gap-3 md:gap-5 h-[56px] md:h-[68px] min-w-0">
          <Link to="/" aria-label="JPMA home" className="min-w-0 flex-1 sm:flex-none sm:shrink-0 flex items-center">
            <img src="/assets/jpma-logo-blue.png" alt="J.P. Mukherji & Associates" className="h-[22px] sm:h-8 md:h-9 w-auto max-w-[42vw] sm:max-w-[220px] md:max-w-[300px] object-contain object-left" />
          </Link>

          <nav className="hidden xl:flex items-center gap-[26px] mx-auto">
            {MENU.map((m) => (
              <NavLink
                key={m.label}
                to={m.to}
                className={`py-2 font-mono text-[11px] uppercase tracking-[0.1em] whitespace-nowrap ${parentActive(m) ? 'text-ink font-bold' : 'text-ink/50 hover:text-ink'}`}
              >
                <span className={`relative pb-[7px] ${parentActive(m) ? 'after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-brand' : ''}`}>
                  {m.label}
                </span>
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2.5 shrink-0 ml-auto xl:ml-0">
            <button onClick={() => setSearch(true)} aria-label="Search" className="hidden sm:flex h-9 w-9 items-center justify-center text-navy hover:text-brand">
              <svg viewBox="0 0 20 20" className="h-[17px] w-[17px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="9" cy="9" r="6" /><path d="m13.5 13.5 4 4" /></svg>
            </button>
            <button onClick={() => onBrochure()} className="cut-btn hidden md:inline-flex items-center gap-2 bg-brand pl-6 pr-7 py-[11px] font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-white hover:bg-navy">
              Brochure <span aria-hidden>→</span>
            </button>
            <Link to="/contact" className="cut-btn hidden md:inline-flex items-center gap-2 border border-navy/50 pl-6 pr-7 py-[10px] font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-navy hover:bg-navy hover:text-white">
              Contact <span aria-hidden>→</span>
            </Link>
            <span className="hidden xl:block text-right font-mono text-[8.5px] uppercase leading-[1.7] tracking-[0.14em] text-ink/45 pl-2">Est. 1972<br />Kolkata, India</span>
            <button onClick={() => setOpen(true)} className="xl:hidden cut-btn inline-flex shrink-0 items-center gap-2 bg-navy px-3.5 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white">
              Menu ≡
            </button>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }} className="fixed inset-0 z-[90] bg-navydeep blueprint-dark flex flex-col" role="dialog" aria-label="Site menu">
            <div className="w-full pl-3 pr-3 flex items-center justify-between gap-2 h-[56px] bg-white border-b border-navy/10 shrink-0 min-w-0">
              <img src="/assets/jpma-logo-blue.png" alt="J.P. Mukherji & Associates" className="h-[22px] w-auto max-w-[42vw] object-contain object-left min-w-0" />
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="cut-btn inline-flex shrink-0 items-center gap-2 bg-navy px-3.5 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white">Close ×</button>
            </div>
            <nav className="flex-1 overflow-y-auto px-5 md:px-8 py-6">
              {MENU.map((m, mi) => (
                <motion.div key={m.label} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 + mi * 0.04 }} className="border-b border-white/10">
                  <Link to={m.to} className="flex items-center justify-between py-3.5 font-display text-3xl text-white/90 hover:text-white">
                    {m.label}<span className="font-mono text-xs text-white/40">0{mi + 1} →</span>
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="px-5 md:px-8 pb-8 flex gap-3">
              <button onClick={() => { setOpen(false); onBrochure() }} className="cut-btn flex-1 bg-brand px-6 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-white">Brochure →</button>
              <Link to="/contact" className="cut-btn flex-1 border border-white/30 px-6 py-3.5 text-center font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-white">Contact →</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <SearchOverlay open={search} onClose={() => setSearch(false)} />
    </>
  )
}
