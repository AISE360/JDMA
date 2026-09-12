import { useContent } from '../hooks/useContent'
import { CheckList, Kicker, Pill, Reveal, SectionHead, useHashScroll } from '../components/ui'
import type { OpenBrochure } from '../components/BrochureModal'
import { PageHero } from './About'

export default function Expertise({ onBrochure }: { onBrochure: OpenBrochure }) {
  const c = useContent()
  useHashScroll()
  return (
    <div>
      <PageHero eyebrow="Expertise · Business areas" title="Anything and everything in sugar." copy="Four decades of concept-to-commissioning across sugar, refinery, cogeneration, ethanol, agriculture and special studies." />
      <div className="mx-auto max-w-6xl px-6 py-14 space-y-12">
        {c.businessAreas.map((b, i) => (
          <div key={b.slug} id={b.slug} className="grid md:grid-cols-2 gap-8 items-center scroll-mt-28">
            <Reveal className={i % 2 ? 'md:order-2' : ''}>
              <img src={b.image} alt={b.title} className="w-full aspect-[4/3] object-cover rounded-[2rem] img-soft lift" />
            </Reveal>
            <Reveal delay={0.08}>
              <Kicker>0{i + 1} · Business area</Kicker>
              <h2 className="font-display mt-3 text-3xl md:text-4xl leading-tight">{b.title}</h2>
              <p className="mt-3 text-[14.5px] text-soft leading-relaxed">{b.intro}</p>
              <CheckList items={b.points} />
            </Reveal>
          </div>
        ))}
      </div>
      <section className="mx-3 md:mx-6 mb-6 rounded-[2.5rem] bg-brand-deep text-white">
        <div className="mx-auto max-w-6xl px-6 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-white/60">Capability proof</p>
            <h2 className="font-display mt-2 text-3xl">Get the full capability statement.</h2>
          </div>
          <button onClick={() => onBrochure()} className="shrink-0 rounded-full bg-white px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-brand hover:bg-mist transition-colors">Download brochure</button>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-6 pb-16">
        <SectionHead kicker="At a glance" title="Numbers boards remember." />
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {c.stats.map((s) => (
            <div key={s.label} className="border-l border-ink/10 pl-5">
              <p className="font-display text-4xl">{s.value}{s.suffix}</p>
              <p className="mt-1 text-[12.5px] font-semibold">{s.label}</p>
              <p className="text-[11.5px] text-soft">{s.sub}</p>
            </div>
          ))}
        </div>
        <div className="mt-10"><Pill to="/contact">Discuss your project</Pill></div>
      </div>
    </div>
  )
}
