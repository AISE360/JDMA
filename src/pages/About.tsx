import { useContent, getBlock } from '../hooks/useContent'
import { CheckList, Kicker, Pill, Reveal, SectionHead } from '../components/ui'

const VALUE_ICONS: Record<string, string> = {
  'customer orientation': 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 4-6 8-6s8 2 8 6',
  'sustainability': 'M7 12l3 3 7-7M12 21c-5 0-8-3-8-8 5 0 11-2 12-9 3 4 4 8 4 9 0 5-3 8-8 8z',
  'ethical behavior': 'M7 11v9H4v-9h3zM7 12l4-7c1.5 0 2 1 1.6 2.4L11 11h8a2 2 0 0 1-2 2.6l-3 4H7',
  'ethical behaviour': 'M7 11v9H4v-9h3zM7 12l4-7c1.5 0 2 1 1.6 2.4L11 11h8a2 2 0 0 1-2 2.6l-3 4H7',
  'social responsibility': 'M12 3l7 7-7 11L5 10l7-7zM5 10h14',
  'care for environment': 'M8 21v-2a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v2M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM16 4a3.5 3.5 0 0 1 0 7M17 15h1a3 3 0 0 1 3 3v1',
  'equal opportunity': 'M12 3v10M12 13c-4 0-7 2-7 6M12 13c4 0 7 2 7 6M12 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  'cooperation & loyalty': 'M3 12l4-4 4 4 4-4 4 4M3 12v6a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-6M3 12l2-2M21 12l-2-2',
}

function ValueBadge({ label, i }: { label: string; i: number }) {
  return (
    <Reveal delay={Math.min(i * 0.05, 0.3)} className="text-center">
      <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-brand/70 bg-parchment">
        <svg viewBox="0 0 24 24" className="h-8 w-8 text-brand-deep" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d={VALUE_ICONS[label.toLowerCase()] ?? 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z'} />
        </svg>
      </span>
      <p className="mt-3 text-[13px] font-semibold leading-snug">{label}</p>
    </Reveal>
  )
}
export function PageHero({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string; image?: string }) {
  return (
    <section className="relative overflow-hidden border-b border-ink/10">      <span aria-hidden className="giant-mark absolute -left-6 -top-10 text-[12rem]">&</span>
      <div className="relative mx-auto max-w-3xl px-6 py-16 md:py-20 text-center">
        <Reveal>
          <Kicker center>{eyebrow}</Kicker>
          <h1 className="font-display mt-3 text-4xl md:text-5xl leading-[1.1] font-medium">{title}</h1>
          {copy && <p className="mt-4 text-[14.5px] leading-relaxed text-soft">{copy}</p>}
        </Reveal>
      </div>
    </section>
  )
}

export default function About() {
  const c = useContent()
  const B = (id: string) => getBlock(c, id)
  const hb = B('hero-about')
  return (
    <div>
      <PageHero eyebrow={hb.subtitle} title={hb.title} copy={hb.copy} />

      <section className="mx-auto max-w-6xl px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <Reveal>
          <img src={B('about-overview').image} alt="JPMA" className="w-full aspect-[4/3] object-cover rounded-[2rem] img-soft lift" />
        </Reveal>
        <Reveal delay={0.1}>
          <Kicker>Overview</Kicker>
          <h2 className="font-display mt-3 text-3xl md:text-4xl leading-tight">{B('about-overview').title}</h2>
          <div className="mt-4 space-y-3 text-[14.5px] leading-relaxed text-soft">
            <p>{B('about-overview').copy}</p>
            <p>{B('about-overview').subtitle}</p>
          </div>
        </Reveal>
      </section>

      {/* founder band: full photo, faces visible */}
      <section className="bg-brand-deep text-white rounded-[2.5rem] md:rounded-[3.5rem] mx-3 md:mx-6 overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-14 md:py-16 grid md:grid-cols-2 gap-10 items-center">
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-white/60">The founder</p>
            <h2 className="font-display mt-3 text-3xl md:text-[2.6rem] leading-[1.15]">{B('about-founder').title}</h2>
            <p className="mt-4 max-w-lg text-[14.5px] leading-relaxed text-white/75">
              {B('about-founder').copy}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <img src={B('about-founder').image} alt="JPMA leadership team with the founder's bust, Pune head office" className="w-full aspect-[16/10] object-cover object-top rounded-[2rem] shadow-2xl img-soft" />
            <p className="mt-3 text-[12px] text-white/55">{B('about-founder').subtitle}</p>
          </Reveal>
        </div>
      </section>

      {/* vision / mission */}
      <section className="mx-auto max-w-6xl px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <Reveal>
          <img src={B('about-vision').image} alt="Vision and mission" className="w-full aspect-[4/3] object-cover rounded-[2rem] img-soft lift" />
        </Reveal>
        <Reveal delay={0.1}>
          <Kicker>Where we're headed</Kicker>
          <h2 className="font-display mt-3 text-3xl md:text-4xl leading-tight">{B('about-vision').title}</h2>
          <div className="mt-6 space-y-4">
            {B('about-vision').items.map((row) => {
              const [label = '', text = ''] = row.split(' | ')
              return (
                <div key={label} className="rounded-2xl bg-parchment p-5">
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-brand">{label}</p>
                  <p className="mt-1 text-[13.5px]">{text}</p>
                </div>
              )
            })}
          </div>
        </Reveal>
      </section>

      <section className="bg-mist rounded-[2.5rem] md:rounded-[3.5rem] mx-3 md:mx-6 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHead center kicker="Leadership" title={B('about-team').title} copy={B('about-team').copy} />
          <div className="mt-10 grid sm:grid-cols-3 gap-8">
            {c.team.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.08} className="text-center">
                <div className="mx-auto w-fit rounded-full border border-brand/30 p-2">
                  <img src={m.photo} alt={m.name} className="h-44 w-44 rounded-full object-cover object-top img-soft" />
                </div>
                <h3 className="font-display mt-4 text-xl">{m.name}</h3>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand mt-1">{m.role}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16">
        <SectionHead center kicker="Journey" title="Roadmap of the company." />
        <div className="mt-8 relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-brand/25" />
          <div className="space-y-5">
            {c.timeline.map((t, i) => (
              <Reveal key={t.year} delay={Math.min(i * 0.03, 0.25)}>
                <div className={`relative flex ${i % 2 ? 'justify-start' : 'justify-end'}`}>
                  <span className="absolute left-1/2 top-6 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-brand ring-4 ring-brand/15" />
                  <div className={`w-[46%] rounded-2xl border border-ink/10 bg-white p-4 ${i % 2 ? 'text-right' : ''}`}>
                    <p className="font-display text-2xl text-brand">{t.year}</p>
                    <p className="text-[13.5px] font-semibold">{t.title}</p>
                    {t.note && <p className="text-[12.5px] text-soft">{t.note}</p>}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <img src="/assets/jpma-values-banner.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-[0.07] img-soft" />
      <div className="relative mx-auto max-w-6xl px-6 py-16 grid md:grid-cols-2 gap-10 items-start">
        <div>
          <SectionHead kicker="Values & systems" title={B('about-values').title} />
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
            {B('about-values').items.map((v, i) => (
              <ValueBadge key={v} label={v} i={i} />
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-ink/10 bg-white p-6">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-brand">{B('about-certs').title}</p>
            <CheckList items={B('about-certs').items} />
          </div>
        </div>
        <Reveal delay={0.1}>
          <img src={B('about-global').image} alt="Global presence" className="w-full rounded-[2rem] img-soft lift" />
          <p className="mt-3 text-[12.5px] text-soft">{B('about-global').copy}</p>
          <div className="mt-5"><Pill to="/contact">Talk to us</Pill></div>
        </Reveal>
      </div>
      </section>
    </div>
  )
}
