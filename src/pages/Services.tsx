import { useContent, getBlock } from '../hooks/useContent'
import { Kicker, Pill, Reveal, SectionHead, useHashScroll } from '../components/ui'
import { PageHero } from './About'

export default function Services() {
  const c = useContent()
  const hb = getBlock(c, 'hero-services')
  useHashScroll()
  return (
    <div>
      <PageHero eyebrow={hb.subtitle} title={hb.title} copy={hb.copy} />
      <div className="mx-auto max-w-6xl px-6 py-14 space-y-12">
        {c.services.map((s, i) => (
          <div key={s.slug} id={s.slug} className="grid md:grid-cols-[240px_1fr] gap-8 scroll-mt-28 border-b border-ink/10 pb-12 last:border-0">
            <Reveal>
              <p className="font-display text-6xl text-brand/25">{s.no}</p>
              <img src={s.image} alt={s.title} className="mt-4 w-full aspect-square object-cover rounded-[1.5rem] img-soft" />
            </Reveal>
            <Reveal delay={0.08}>
              <Kicker>Service {s.no}</Kicker>
              <h2 className="font-display mt-3 text-3xl md:text-4xl">{s.title}</h2>
              <p className="mt-3 max-w-2xl text-[14.5px] text-soft leading-relaxed">{s.copy}</p>
              <div className="mt-5 grid sm:grid-cols-2 gap-x-8 gap-y-2 max-w-2xl">
                {s.items.map((it) => (
                  <p key={it} className="flex gap-2 text-[13.5px] text-ink/80"><span className="text-brand">·</span>{it}</p>
                ))}
              </div>
              {i % 2 === 1 && null}
            </Reveal>
          </div>
        ))}
      </div>
      <section className="mx-auto max-w-6xl px-6 pb-14 grid sm:grid-cols-2 gap-5">
        <Reveal>
          <div className="rounded-[1.5rem] border border-ink/10 bg-white p-6">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-brand">R&D product brochure</p>
            <h3 className="font-display mt-2 text-2xl">Moisture Control Unit</h3>
            <p className="mt-1.5 text-[13.5px] text-soft">Working, savings and installations of the patented MCU.</p>
            <div className="mt-4"><Pill to="/innovation">Get the brochure</Pill></div>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="rounded-[1.5rem] border border-ink/10 bg-white p-6">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-brand">R&D product brochure</p>
            <h3 className="font-display mt-2 text-2xl">JPMA Mill Coupling</h3>
            <p className="mt-1.5 text-[13.5px] text-soft">Rope coupling system for cane mills, proven in cane.</p>
            <div className="mt-4"><Pill to="/innovation">Get the brochure</Pill></div>
          </div>
        </Reveal>
      </section>
      <section className="bg-parchment rounded-t-[2.5rem] md:rounded-t-[3.5rem]">
        <div className="mx-auto max-w-6xl px-6 py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <SectionHead kicker="Next step" title="Send us your capacity, feedstock & location." copy="We respond with the right study scope and a site-visit plan, not a generic quote." />
          <Pill to="/contact" className="shrink-0">Enquire now</Pill>
        </div>
      </section>
    </div>
  )
}
