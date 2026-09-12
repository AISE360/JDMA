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
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)
  const upAcc = useRef(0)
  const downAcc = useRef(0)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState(false)
  const loc = useLocation()

  useEffect(() => {
    const fn = () => {
      const y = window.scrollY
      setScrolled(y > 16)
      const dy = y - lastY.current
      lastY.current = y
      if (y <= 140) {
        upAcc.current = 0
        downAcc.current = 0
        setHidden(false)
        return
      }
      if (dy > 0) {
        upAcc.current = 0
        downAcc.current += dy
        if (downAcc.current > 64) setHidden(true)
      } else if (dy < 0) {
        downAcc.current = 0
        upAcc.current -= dy
        if (upAcc.current > 4) setHidden(false)
      }
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

  const openGate = () => onBrochure()

  return (
    <>
      <header className={`sticky top-0 z-40 bg-paper/92 backdrop-blur-md will-change-transform transition-transform duration-300 ease-out ${scrolled ? 'shadow-[0_14px_36px_-20px_rgba(38,49,62,0.4)]' : ''} ${hidden && !open ? '-translate-y-full' : 'translate-y-0'}`}>
        <div className="mx-auto max-w-7xl px-4 md:px-5 flex items-center justify-between gap-2 py-3">
          <Link to="/" aria-label="JPMA home" className="shrink-0 min-w-0">
            <img src="/assets/jpma-logo-blue.png" alt="J. P. Mukherji & Associates" className="h-8 sm:h-9 md:h-11 w-auto max-w-[148px] sm:max-w-[210px] md:max-w-none object-contain" />
          </Link>

          <nav className="hidden xl:flex items-center gap-6 text-[13.5px] font-medium text-ink/75">
            {MENU.map((m) => (
              <NavLink
                key={m.label}
                to={m.to}
                className={`py-2 hover:text-ink ${parentActive(m) ? 'text-ink' : ''}`}
              >
                <span className={`relative pb-1 ${parentActive(m) ? 'after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-brand' : ''}`}>
                  {m.label}
                </span>
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <button onClick={() => setSearch(true)} aria-label="Search" className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink/70 hover:border-brand hover:text-brand transition-colors">
              <svg viewBox="0 0 20 20" className="h-[17px] w-[17px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="9" cy="9" r="6" /><path d="m13.5 13.5 4 4" /></svg>
            </button>
            <span className="hidden sm:block h-8 w-px bg-ink/10" />
            <button onClick={openGate} className="hidden md:inline-flex rounded-full border-[1.5px] border-brand px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand hover:bg-brand hover:text-white transition-colors">
              Brochure
            </button>
            <Link to="/contact" className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-brand-deep px-4 py-2 text-[10px] md:px-6 md:py-[11px] md:text-[11px] font-bold uppercase tracking-[0.16em] md:tracking-[0.18em] text-white hover:bg-brand transition-colors">
              Contact
              <svg viewBox="0 0 16 16" className="h-3 w-3 md:h-3.5 md:w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M2 8h11M9 3.5 13.5 8 9 12.5" /></svg>
            </Link>
            <button onClick={() => setOpen(true)} className="xl:hidden shrink-0 p-2 -mr-1" aria-label="Open menu">
              <div className="w-6 space-y-1.5">
                <span className="block h-[1.5px] bg-ink" />
                <span className="block h-[1.5px] bg-ink" />
                <span className="block h-[1.5px] bg-ink" />
              </div>
            </button>
          </div>
        </div>

      </header>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="xl:hidden fixed inset-0 z-[90] bg-paper flex flex-col"
            role="dialog" aria-label="Site menu"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-ink/10">
              <img src="/assets/jpma-logo-blue.png" alt="J. P. Mukherji & Associates" className="h-8 w-auto max-w-[148px] object-contain" />
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-xl leading-none">
                ×
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-5 py-4">
              <button onClick={() => { setOpen(false); setSearch(true) }} className="flex w-full items-center gap-3 rounded-xl border border-ink/15 px-4 py-3.5 text-[14px] text-soft">
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="9" cy="9" r="6" /><path d="m13.5 13.5 4 4" /></svg>
                Search the site…
              </button>
              {MENU.map((m, mi) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + mi * 0.045, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="border-b border-ink/8"
                >
                  <Link to={m.to} className={`block py-3.5 font-display text-[1.35rem] ${parentActive(m) ? 'text-brand' : 'text-ink'}`}>{m.label}</Link>
                </motion.div>
              ))}
            </nav>
            <div className="px-5 pt-3 border-t border-ink/10" style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}>
              <div className="flex gap-2.5">
                <button onClick={() => { setOpen(false); openGate() }} className="flex-1 rounded-full border-[1.5px] border-brand py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
                  Brochure
                </button>
                <Link to="/contact" className="flex-1 rounded-full bg-brand-deep py-3.5 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                  Contact
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <SearchOverlay open={search} onClose={() => setSearch(false)} />
    </>
  )
}
