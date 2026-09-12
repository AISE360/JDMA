import { useContent } from '../hooks/useContent'
import { Kicker, Pill, Reveal, SectionHead } from '../components/ui'
import type { OpenBrochure } from '../components/BrochureModal'
import { PageHero } from './About'

export default function Innovation({ onBrochure }: { onBrochure: OpenBrochure }) {
  const c = useContent()
  return (
    <div>
      <PageHero eyebrow="R&D · Products" title="Patented designs, proven in cane." copy="MCU (patent 2023 · CEAI innovation award) and a family of mill, clarification and evaporation upgrades, supplied via Jyoti Sugar Engineering." />
      <section className="mx-auto max-w-6xl px-6 py-14 grid md:grid-cols-2 gap-10 items-center">
        <Reveal>
          <img src="/assets/mcu-patent-certificate.jpg" alt="MCU patent certificate 2023" className="w-full rounded-[2rem] img-soft lift" />
        </Reveal>
        <Reveal delay={0.1}>
          <Kicker>Flagship · Moisture Control Unit</Kicker>
          <h2 className="font-display mt-3 text-3xl md:text-4xl leading-tight">The MCU, <em>moisture & pol, under control.</em></h2>
          <p className="mt-4 text-[14.5px] text-soft leading-relaxed">Developed in-house, patented in 2023 and recognised by CEAI for innovation. Installed with mill-improvement systems (rope couplings, GRPF) across India and Indonesia.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Pill onClick={onBrochure}>Brochure with specs</Pill>
            <Pill to="/contact" tone="outline">Ask an engineer</Pill>
          </div>
        </Reveal>
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-16 grid sm:grid-cols-2 gap-5">
        {[
          { t: 'MCU product brochure', d: 'Moisture Control Unit, working, savings and installations.', f: '/assets/brochure/JPMA-mcu-brochure.pdf', s: 'mcu-brochure' },
          { t: 'Mill coupling brochure', d: 'JPMA rope coupling system for cane mills.', f: '/assets/brochure/JPMA-mill-coupling-brochure.pdf', s: 'coupling-brochure' },
        ].map((b, i) => (
          <Reveal key={b.t} delay={i * 0.08}>
            <button
              onClick={() => onBrochure(b.f, { title: `Enter your number to download`, kicker: `Free resource · ${b.t}`, source: b.s })}
              className="w-full text-left rounded-[1.5rem] border border-ink/10 bg-white p-6 flex items-center justify-between gap-4 lift"
            >
              <span>
                <span className="block text-[10.5px] font-bold uppercase tracking-[0.2em] text-brand">PDF download</span>
                <span className="font-display mt-1 block text-xl">{b.t}</span>
                <span className="mt-1 block text-[13px] text-soft">{b.d}</span>
              </span>
              <span className="shrink-0 rounded-full bg-brand px-5 py-2.5 text-[10.5px] font-bold uppercase tracking-[0.16em] text-white">Get ↓</span>
            </button>
          </Reveal>
        ))}
      </section>
      <section className="bg-brand-deep text-white rounded-[2.5rem] md:rounded-[3.5rem] mx-3 md:mx-6 mb-6 py-14">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHead kicker="Product family" title={<span className="text-white">Fourteen upgrades mills actually order.</span>} />
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-3">
            {c.products.map((p, i) => (
              <Reveal key={p} delay={Math.min(i * 0.02, 0.2)}>
                <p className="border-b border-white/10 pb-3 text-[13.5px] text-white/80"><span className="mr-3 font-display italic text-white/40">{String(i + 1).padStart(2, '0')}</span>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
