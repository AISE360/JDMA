import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect, type ReactNode } from 'react'

/* scroll to #anchor when the URL hash changes (dropdown links) */
export function useHashScroll() {
  const { hash } = useLocation()
  useEffect(() => {
    if (!hash) return
    const t = setTimeout(() => {
      document.getElementById(hash.replace('#', ''))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 120)
    return () => clearTimeout(t)
  }, [hash])
}

export function Reveal({ children, delay = 0, y = 26, className = '' }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* technical mono kicker */
export function Kicker({ children, center = false }: { children: ReactNode; center?: boolean }) {
  return (
    <p className={`font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-[0.18em] leading-[1.7] text-brand ${center ? 'text-center' : ''}`}>
      {children}
    </p>
  )
}

export function Pill({
  children, to, onClick, tone = 'brand', className = '',
}: {
  children: ReactNode; to?: string; onClick?: () => void; tone?: 'brand' | 'outline' | 'light'; className?: string
}) {
  const styles =
    tone === 'brand'
      ? 'bg-brand text-white hover:bg-navy'
      : tone === 'light'
        ? 'bg-navy text-white hover:bg-brand'
        : 'border border-navy/30 text-navy hover:border-brand hover:text-brand'
  const cls = `cut-sm inline-flex items-center justify-center px-7 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.18em] transition-colors ${styles} ${className}`
  if (to) return <Link to={to} className={cls}>{children}</Link>
  return <button onClick={onClick} className={cls}>{children}</button>
}

export function SectionHead({ kicker, title, copy, center = false }: { kicker: string; title: ReactNode; copy?: string; center?: boolean }) {
  return (
    <Reveal className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <Kicker center={center}>{kicker}</Kicker>
      <h2 className="font-display mt-3 text-4xl md:text-[3rem] leading-[0.95] text-current">
        {title}
      </h2>
      {copy && <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.04em] leading-relaxed opacity-70">{copy}</p>}
    </Reveal>
  )
}

/* chamfered image block */
export function CircleImg({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="mx-auto w-fit">
      <img src={src} alt={alt} className="cut h-36 w-36 md:h-44 md:w-44 object-cover img-industrial" />
    </div>
  )
}

export function CheckList({ items, dark = false }: { items: string[]; dark?: boolean }) {
  return (
    <ul className="mt-5 space-y-2.5">
      {items.map((it) => (
        <li key={it} className={`flex gap-2.5 font-mono text-[12px] uppercase tracking-[0.03em] leading-relaxed ${dark ? 'text-white/80' : 'text-black/70'}`}>
          <span className="mt-[2px] inline-flex h-4 w-4 shrink-0 items-center justify-center bg-brand text-[10px] font-bold text-white">+</span>
          {it}
        </li>
      ))}
    </ul>
  )
}
