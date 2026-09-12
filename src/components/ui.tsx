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
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* small-caps kicker with hairline, like the reference */
export function Kicker({ children, center = false }: { children: ReactNode; center?: boolean }) {
  return (
    <p className={`text-[10px] md:text-[11px] font-bold uppercase tracking-[0.18em] md:tracking-[0.26em] leading-[1.8] text-brand ${center ? 'text-center' : ''}`}>
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
      ? 'bg-brand text-white hover:bg-brand-deep'
      : tone === 'light'
        ? 'bg-white text-brand hover:bg-mist'
        : 'border border-ink/25 text-ink hover:border-brand hover:text-brand'
  const cls = `inline-flex items-center justify-center rounded-full px-7 py-3 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors ${styles} ${className}`
  if (to) return <Link to={to} className={cls}>{children}</Link>
  return <button onClick={onClick} className={cls}>{children}</button>
}

export function SectionHead({ kicker, title, copy, center = false }: { kicker: string; title: ReactNode; copy?: string; center?: boolean }) {
  return (
    <Reveal className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <Kicker center={center}>{kicker}</Kicker>
      <h2 className="font-display mt-3 text-4xl md:text-[2.8rem] leading-[1.12] font-medium text-ink">
        {title}
      </h2>
      {copy && <p className="mt-4 text-[14.5px] leading-relaxed text-soft">{copy}</p>}
    </Reveal>
  )
}

/* ringed circular image, per reference "How We Help" */
export function CircleImg({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="mx-auto w-fit rounded-full border border-brand/30 p-2.5">
      <div className="rounded-full border-[3px] border-brand/15 p-1">
        <img src={src} alt={alt} className="h-36 w-36 md:h-44 md:w-44 rounded-full object-cover img-soft" />
      </div>
    </div>
  )
}

export function CheckList({ items, dark = false }: { items: string[]; dark?: boolean }) {
  return (
    <ul className="mt-5 space-y-2.5">
      {items.map((it) => (
        <li key={it} className={`flex gap-2.5 text-[13.5px] leading-relaxed ${dark ? 'text-white/80' : 'text-ink/80'}`}>
          <span className="mt-[3px] inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[10px] font-bold text-brand">✓</span>
          {it}
        </li>
      ))}
    </ul>
  )
}
