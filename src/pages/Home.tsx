import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useContent, saveLead, getBlock } from '../hooks/useContent'
import { COUNTRIES } from '../data/countries'
import { CheckList, CircleImg, Kicker, Pill, Reveal, SectionHead } from '../components/ui'
import type { OpenBrochure } from '../components/BrochureModal'

/* ---------- slim serif stat strip ---------- */function StatStrip() {
  const c = useContent()
  return (
    <section className="border-b border-ink/10">
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-8 grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-3">
        {c.stats.map((s) => (
          <div key={s.label} className="text-center px-1">
            <p className="font-display text-[clamp(1.9rem,8vw,2.9rem)] leading-none whitespace-nowrap">{s.value}{s.suffix}</p>
            <p className="mt-2.5 text-[12.5px] font-semibold leading-snug">{s.label}</p>
            <p className="mt-1 text-[11px] leading-snug text-soft">{s.sub}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ---------- trusted-by client wall: one line, big, slow ---------- */
const CLIENT_LOGOS = Array.from({ length: 39 }, (_, i) => `/assets/clients/${i + 1}.png`)
const CLIENT_LOGOS_2 = Array.from({ length: 59 }, (_, i) => i + 1)
  .filter((n) => n !== 36)
  .map((n) => `/assets/clients/logo${n}.jpg`)
const ALL_LOGOS = [...CLIENT_LOGOS, ...CLIENT_LOGOS_2]

function ClientsWall() {
  const row = [...ALL_LOGOS, ...ALL_LOGOS]
  const [focus, setFocus] = useState<number | null>(null)
  const pick = (i: number) => setFocus((f) => (f === i % ALL_LOGOS.length ? null : i % ALL_LOGOS.length))
  return (
    <section className="logo-wall border-y border-ink/10 bg-white/60 py-14 md:py-16 overflow-hidden">
      <p className="text-center text-[11px] font-bold uppercase tracking-[0.26em] text-brand">Trusted by mills across India and 30+ countries</p>
      <p className="mt-2 text-center text-[11.5px] text-soft">Hover to pause · click a logo to focus it</p>
      <div className="relative mt-8">
        <div className="flex w-max animate-marquee-slow gap-14 md:gap-20 items-center">
          {row.map((src, i) => {
            const active = focus === null || focus === i % ALL_LOGOS.length
            return (
              <button
                key={i}
                onClick={() => pick(i)}
                aria-label={`Focus client logo ${i % ALL_LOGOS.length + 1}`}
                className={`shrink-0 transition-all duration-500 ${active ? '' : 'blur-[2.5px] opacity-25 saturate-0'}`}
              >
                <img
                  src={src} alt="JPMA client" loading="lazy"
                  className={`h-14 md:h-20 w-auto max-w-[190px] md:max-w-[240px] object-contain transition-all duration-500 ${focus === null ? 'opacity-90 hover:opacity-100 hover:scale-105' : focus === i % ALL_LOGOS.length ? 'opacity-100 scale-105' : ''}`}
                />
              </button>
            )
          })}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-paper to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-paper to-transparent" />
      </div>
    </section>
  )
}

/* ---------- inline brochure form for the dark resource band ---------- */
function ResourceForm({ brochurePath }: { brochurePath: string }) {
  const [f, setF] = useState({ name: '', email: '', iso: 'IN', phone: '' })
  const [msg, setMsg] = useState('')
  const dial = COUNTRIES.find((c) => c.iso === f.iso)?.dial ?? '91'
  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const digits = f.phone.replace(/\D/g, '')
    if (f.name.trim().length < 2) return setMsg('Please enter your full name.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) return setMsg('Please enter a valid email address.')
    if (digits.length < 6 || digits.length > 15) return setMsg('Please enter a valid phone number.')
    const cc = COUNTRIES.find((c) => c.iso === f.iso)!
    await saveLead('brochure_leads', {
      name: f.name.trim(), email: f.email.trim(), organisation: '',
      country: cc.name, country_iso: cc.iso, country_code: `+${cc.dial}`,
      phone: digits, full_phone: `+${cc.dial}${digits}`, source: 'homepage-resource-band',
    })
    setMsg(`Thank you, your download has started (${cc.name} +${cc.dial} ${digits}).`)
    const a = document.createElement('a')
    a.href = brochurePath
    a.download = 'JPMA_Brochure_2025.pdf'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }
  const inp = 'w-full rounded-lg bg-white px-4 py-3 text-[13px] text-ink outline-none placeholder:text-ink/40'
  return (
    <form onSubmit={submit} className="space-y-2.5">
      <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Your name" className={inp} />
      <div className="flex gap-2">
        <select value={f.iso} onChange={(e) => setF({ ...f, iso: e.target.value })} className="w-[42%] shrink-0 rounded-lg bg-white px-2 py-3 text-[12px] text-ink outline-none" aria-label="Country">
          {COUNTRIES.map((c) => (<option key={c.iso} value={c.iso}>{c.name} (+{c.dial})</option>))}
        </select>
        <div className="flex min-w-0 flex-1 items-center rounded-lg bg-white px-3">
          <span className="shrink-0 text-[13px] font-semibold text-ink/50">+{dial}</span>
          <input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value.replace(/[^\d\s-]/g, '') })} placeholder="Phone number" inputMode="tel" className="w-full min-w-0 bg-transparent px-2 py-3 text-[13px] outline-none" />
        </div>
      </div>
      <input value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="Email address" type="email" className={inp} />
      {msg && <p className="text-[12.5px] text-white/85">{msg}</p>}
      <button className="w-full rounded-full bg-white py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-brand hover:bg-mist transition-colors">
        Get download
      </button>
    </form>
  )
}

export default function Home({ onBrochure }: { onBrochure: OpenBrochure }) {
  const c = useContent()
  const B = (id: string) => getBlock(c, id)
  const [slide, setSlide] = useState(0)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    if (paused || c.heroSlides.length < 2) return
    const t = setInterval(() => setSlide((s) => (s + 1) % c.heroSlides.length), 5000)
    return () => clearInterval(t)
  }, [paused, c.heroSlides.length])
  const s = c.heroSlides[slide] ?? c.heroSlides[0]

  return (
    <div>
      {/* 1, HERO: full-bleed background changing every 9s, like the classic slider */}
      <section
        className="relative overflow-hidden flex items-center min-h-[88svh]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={slide}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <img src={s.image} alt="" className="h-full w-full object-cover img-soft" />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-paper/70 via-paper/85 to-paper md:bg-gradient-to-r md:from-paper md:via-paper/85 md:to-paper/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-paper via-transparent to-transparent md:hidden" />
        <div className="relative w-full mx-auto max-w-6xl px-6 py-16 md:py-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={`copy-${slide}`}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <Kicker>{s.eyebrow}</Kicker>
              <h1 className="font-display mt-4 max-w-xl text-[clamp(2.4rem,10vw,3.9rem)] md:text-6xl leading-[1.08] font-medium">
                {s.title}
              </h1>
              <p className="mt-4 max-w-md text-[0.95rem] md:text-base leading-relaxed text-soft">
                {s.copy}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Pill to={s.href}>{s.cta}</Pill>
                <button onClick={() => onBrochure()} className="rounded-full border border-ink/25 px-7 py-3 text-[11px] font-bold uppercase tracking-[0.2em] hover:border-brand hover:text-brand transition-colors">
                  Brochure
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <StatStrip />
      <ClientsWall />

      {/* 2, CHALLENGE */}
      <section className="relative overflow-hidden">
        <span aria-hidden className="giant-mark absolute -right-8 top-6 hidden md:block text-[16rem]">&</span>
        <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <Reveal>
            <img src={B('home-challenge').image} alt="Sugar plant" className="w-full aspect-[4/3] object-cover rounded-[2rem] img-soft lift" />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-3xl md:text-[2.4rem] leading-[1.15] font-medium">
              {B('home-challenge').title} <em className="font-light">{B('home-challenge').subtitle}</em>
            </h2>
            <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.24em] text-brand">{B('home-challenge').copy}</p>
            <CheckList items={B('home-challenge').items} />
          </Reveal>
        </div>
      </section>

      {/* 3, RIPPLE BAND */}
      <section className="bg-mist rounded-t-[2.5rem] md:rounded-t-[4rem] overflow-hidden">
        <div className="mx-auto max-w-3xl px-6 pt-16 md:pt-20 pb-10 text-center">
          <SectionHead center kicker="Why it matters" title={<>{B('home-ripple').title} <em>{B('home-ripple').subtitle}</em></>} copy={B('home-ripple').copy} />
          <div className="mt-8 space-y-6 text-left">
            {B('home-ripple').items.map((row) => {
              const [t = '', d = ''] = row.split(' | ')
              const path = t.toLowerCase().startsWith('people')
                ? 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75'
                : t.toLowerCase().startsWith('place')
                  ? 'M11 20A7 7 0 0 1 4 13c0-4 3-8 8-9 5 1 8 5 8 9a7 7 0 0 1-7 7M12 22v-8'
                  : 'M12 2v20M2 12h20'
              return (
                <Reveal key={t}>
                  <div className="flex gap-5 items-start">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-white">
                      <svg viewBox="0 0 24 24" className="h-5 w-5 text-brand" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={path} /></svg>
                    </span>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">{t}</p>
                      <p className="mt-1 text-[14px] text-ink/75">{d}</p>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
        <img src={B('home-ripple').image} alt="Sugarcane fields" className="h-56 md:h-72 w-full object-cover img-soft" />
      </section>

      {/* 4, HOW WE HELP */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <SectionHead kicker="What we do" title={B('home-help').title} copy={B('home-help').copy} />
        <div className="mt-10 grid md:grid-cols-3 gap-10">
          {B('home-help').items.map((row, i) => {
            const [t = '', h = '', rest = ''] = row.split(' || ')
            const bullets = rest.split(';').map((x) => x.trim()).filter(Boolean)
            const imgs = ['/assets/service-one.jpg', '/assets/service-engg.jpg', '/assets/solar-b.jpg']
            return (
              <Reveal key={t} delay={i * 0.08} className="text-center">
                <CircleImg src={imgs[i % imgs.length]} alt={t} />
                <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.24em] text-brand">{t}</p>
                <h3 className="font-display mt-2 text-[1.45rem] leading-snug">{h}</h3>
                <ul className="mt-4 space-y-1.5 text-[13px] text-soft">
                  {bullets.map((it) => (<li key={it}>· {it}</li>))}
                </ul>
              </Reveal>
            )
          })}
        </div>
        <div className="mt-12 text-center">
          <Pill to="/services">Explore offerings</Pill>
        </div>
      </section>

      {/* 5, SPLIT BAND */}
      <section className="bg-parchment rounded-[2.5rem] md:rounded-[3.5rem] mx-3 md:mx-6 overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-14 md:py-16 grid md:grid-cols-2 gap-10 items-center">
          <Reveal>
            <h2 className="font-display text-3xl md:text-[2.4rem] leading-[1.15] font-medium">
              {B('home-split').title} <em>{B('home-split').subtitle}</em>
            </h2>
            <p className="mt-4 text-[14.5px] text-soft leading-relaxed">{B('home-split').copy}</p>
            <div className="mt-7"><Pill to="/contact">Talk to us</Pill></div>
          </Reveal>
          <Reveal delay={0.1}>
            <img src={B('home-split').image} alt="Engineers at work" className="w-full aspect-[16/10] object-cover rounded-[2rem] img-soft" />
          </Reveal>
        </div>
      </section>

      {/* 6, UNIQUE */}
      <section className="relative overflow-hidden">
        <img src="/assets/about_carousel_bg.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-[0.08] img-soft" />
        <div className="relative mx-auto max-w-3xl px-6 py-20 text-center">
          <SectionHead center kicker="Difference" title={<>{B('home-unique').title} <em>{B('home-unique').subtitle}</em></>} />
          <ul className="mt-6 space-y-2 text-[13.5px] text-ink/75">
            {B('home-unique').items.map((t) => (
              <li key={t}>· {t}</li>
            ))}
          </ul>
          <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.22em] text-soft">{B('home-unique').copy}</p>
          <div className="mt-6"><Pill to="/about">Our story</Pill></div>
        </div>
      </section>

      {/* 7, LEADER */}
      <section className="mx-auto max-w-6xl px-6 pb-16 grid md:grid-cols-[280px_1fr] gap-10 items-center">
        <Reveal>
          <img src={B('home-leader').image} alt="JPMA leadership" className="w-full aspect-[4/5] object-cover object-top rounded-[1.75rem] img-soft" />
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-display text-3xl md:text-[2.4rem] leading-tight">{B('home-leader').title} <em>{B('home-leader').subtitle}</em></h2>
          <p className="mt-4 text-[14px] leading-relaxed text-soft max-w-2xl">
            {B('home-leader').copy}
          </p>
          <div className="mt-6"><Pill to="/about">Learn more</Pill></div>
        </Reveal>
      </section>

      {/* 7b, FILM */}
      <section className="mx-auto max-w-6xl px-6 pb-20 grid md:grid-cols-2 gap-10 items-center">
        <Reveal>
          <Kicker>The film</Kicker>
          <h2 className="font-display mt-3 text-3xl md:text-[2.4rem] leading-tight">{B('home-film').title} <em>{B('home-film').subtitle}</em></h2>
          <p className="mt-4 max-w-md text-[14px] leading-relaxed text-soft">{B('home-film').copy}</p>
          <div className="mt-6"><Pill to="/insights">More insights</Pill></div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="overflow-hidden rounded-[2rem] shadow-xl aspect-video bg-brand-deep">
            <iframe width="100%" height="100%" src={c.settings.heroVideo} title="JPMA company film" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy" className="h-full w-full border-0" />
          </div>
        </Reveal>
      </section>

      {/* 8, RESOURCE BAND */}
      <section className="mx-3 md:mx-6 mb-6 overflow-hidden rounded-[2.5rem] bg-brand-deep text-white">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-14 grid md:grid-cols-3 gap-10 items-center">
          <div>
            <Kicker><span className="text-white/60">{B('home-resource').subtitle}</span></Kicker>
            <h2 className="font-display mt-3 text-3xl leading-tight">{B('home-resource').title}</h2>
            <p className="mt-3 text-[13.5px] text-white/65 leading-relaxed">{B('home-resource').copy}</p>
          </div>
          <Reveal className="flex justify-center">
            <button onClick={() => onBrochure()} className="group relative block w-52 rotate-[-4deg] overflow-hidden rounded-xl bg-white p-2 shadow-2xl transition-transform hover:rotate-0">
              <img src={B('home-resource').image} alt="Brochure cover" className="h-64 w-full rounded-lg object-cover img-soft" />
              <span className="absolute inset-0 flex items-center justify-center bg-brand-deep/0 group-hover:bg-brand-deep/30 transition-colors">
                <span className="rounded-full bg-white px-5 py-2 text-[10.5px] font-bold uppercase tracking-[0.18em] text-brand opacity-0 group-hover:opacity-100 transition-opacity">Preview</span>
              </span>
            </button>
          </Reveal>
          <ResourceForm brochurePath={c.settings.brochurePath} />
        </div>
      </section>
    </div>
  )
}
