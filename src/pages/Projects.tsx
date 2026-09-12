import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useContent, getBlock } from '../hooks/useContent'
import { Kicker, Pill, Reveal, SectionHead } from '../components/ui'
import { PageHero } from './About'

// Client marks split the way the old site did: project-grid marks,
// domestic set and international set, shown in bordered boxes.
const DOM_LOGOS = Array.from({ length: 59 }, (_, i) => i + 1)
  .filter((n) => n !== 36 && n >= 25)
  .map((n) => `/assets/clients/logo${n}.jpg`)
const INTL_LOGOS = Array.from({ length: 24 }, (_, i) => i + 1)
  .map((n) => `/assets/clients/logo${n}.jpg`)

function LogoGrid({ logos }: { logos: string[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {logos.map((src) => (
        <div key={src} className="bg-white border border-ink/10 rounded-xl h-24 md:h-28 flex items-center justify-center p-3 lift">
          <img src={src} alt="JPMA project client" loading="lazy" className="max-h-full max-w-full object-contain" />
        </div>
      ))}
    </div>
  )
}

export default function Projects() {
  const c = useContent()
  const [params] = useSearchParams()
  const initial = params.get('tab') === 'international' ? 'international' : params.get('tab') === 'domestic' ? 'domestic' : 'all'
  const [tab, setTab] = useState<'all' | 'domestic' | 'international'>(initial)
  useEffect(() => {
    const t = params.get('tab')
    setTab(t === 'international' ? 'international' : t === 'domestic' ? 'domestic' : 'all')
  }, [params])
  const all = [
    ...c.internationalProjects.map((p) => ({ ...p, kind: 'International' as const })),
    ...c.domesticProjects.map((p) => ({ ...p, kind: 'Domestic' as const })),
  ]
  const list = tab === 'all' ? all : all.filter((p) => p.kind.toLowerCase() === tab)
  const hb = getBlock(c, 'hero-projects')
  const recent = getBlock(c, 'projects-recent')
  return (
    <div>
      <PageHero eyebrow={hb.subtitle} title={hb.title} copy={hb.copy} />
      <div className="mx-auto max-w-6xl px-6 pt-10">
        <Reveal>
          <img src="/assets/banner-inter-domestic.jpg" alt="JPMA projects across India and the world" className="h-60 md:h-80 w-full object-cover rounded-[2rem] img-soft" />
        </Reveal>
      </div>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-wrap justify-center gap-2">
          {(['all', 'domestic', 'international'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-full px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] capitalize transition-colors ${tab === t ? 'bg-brand text-white' : 'border border-ink/15 hover:border-brand hover:text-brand'}`}>
              {t}
            </button>
          ))}
        </div>
        {(tab === 'all' || tab === 'domestic') && (
          <div className="mt-10">
            <Kicker>Domestic client marks</Kicker>
            <div className="mt-4"><LogoGrid logos={DOM_LOGOS} /></div>
          </div>
        )}
        {(tab === 'all' || tab === 'international') && (
          <div className="mt-10">
            <Kicker>International client marks</Kicker>
            <div className="mt-4"><LogoGrid logos={INTL_LOGOS} /></div>
          </div>
        )}
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((p, i) => (
            <Reveal key={`${p.client}-${i}`} delay={Math.min(i * 0.04, 0.25)}>
              <div className="h-full rounded-[1.5rem] border border-ink/10 bg-white overflow-hidden flex flex-col lift">
                {(p as { image?: string }).image ? (
                  <img src={(p as { image?: string }).image} alt={p.client} className="h-44 w-full object-cover img-soft" />
                ) : null}
                <div className="p-6 flex flex-col flex-1">
                <span className={`w-fit rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${p.kind === 'International' ? 'bg-brand text-white' : 'bg-parchment text-ink/70'}`}>{p.kind}</span>
                <h3 className="font-display mt-3 text-[1.3rem] leading-snug">{p.client}</h3>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-soft">{p.scope}</p>
                <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-brand">{p.tag}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 rounded-[2rem] bg-mist p-8 md:p-10 text-center">
          <SectionHead center kicker={recent.subtitle} title={recent.title} copy={recent.copy} />
          <div className="mt-6"><Pill to="/contact">Discuss your project</Pill></div>
        </div>
      </div>
    </div>
  )
}
