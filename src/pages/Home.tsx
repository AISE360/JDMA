import { Link } from 'react-router-dom'
import { useContent } from '../hooks/useContent'
import { Reveal } from '../components/ui'
import type { OpenBrochure } from '../components/BrochureModal'

const HERO_IMG = '/assets/slider-one.jpg'

function StatItem({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-4 px-5 md:px-8 py-5 border-b lg:border-b-0 lg:border-r border-navy/10 last:border-0 min-w-0">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-navy text-white">{icon}</span>
      <span className="min-w-0">
        <span className="block font-display text-3xl md:text-4xl text-ink leading-none whitespace-nowrap">{value}</span>
        <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.16em] text-soft">{label}</span>
      </span>
    </div>
  )
}

function ServiceImageCard({ img, title, to }: { img: string; title: string; to: string }) {
  return (
    <Link to={to} className="cut-card group relative block overflow-hidden bg-navydeep min-h-[300px] lg:min-h-[360px]">
      <img src={img} alt={title} className="absolute inset-0 h-full w-full object-cover img-industrial opacity-90 group-hover:scale-105 transition-transform duration-700" />
      <span className="absolute inset-0 bg-gradient-to-t from-navydeep via-navydeep/35 to-transparent" />
      <span className="absolute inset-x-0 bottom-0 p-5">
        <span className="block font-display text-xl leading-[0.95] text-white max-w-[12ch]">{title}</span>
        <span className="mt-4 block font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/80 group-hover:text-white">Learn more →</span>
      </span>
    </Link>
  )
}

export default function Home({ onBrochure }: { onBrochure: OpenBrochure }) {
  const c = useContent()

  return (
    <div className="w-full bg-white text-ink overflow-x-clip">
      {/* ---------- HERO: full-bleed 3 columns ---------- */}
      <section className="w-full">
        <div className="grid w-full lg:grid-cols-[minmax(340px,430px)_1fr_minmax(260px,330px)] border-b border-navy/10">
          {/* left copy */}
          <div className="blueprint relative p-6 md:p-10 flex flex-col bg-white min-w-0">
            <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-soft">
              <span className="h-px w-8 bg-navy/30" /> Engineering&nbsp;&nbsp;People&nbsp;&nbsp;Progress
            </p>
            <h1 className="mt-5 font-display text-[clamp(2.6rem,4.2vw,4.4rem)]">
              <span className="block text-ink">Building with precision.</span>
              <span className="block text-brand">Delivering with confidence.</span>
            </h1>
            <p className="mt-5 max-w-[42ch] font-mono text-[11.5px] leading-relaxed text-soft">
              From sugar plants to large-scale cogeneration, J.P. Mukherji & Associates brings expertise, accountability and execution to every project.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={() => onBrochure()} className="cut-sm bg-brand px-7 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-white hover:bg-navy">
                Our brochure →
              </button>
              <Link to="/contact" className="cut-sm border border-navy/40 px-7 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-navy hover:bg-navy hover:text-white">
                Contact us →
              </Link>
            </div>
            <p className="mt-auto pt-10 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-soft">
              <span className="h-px w-8 bg-navy/40" /> People <span className="text-brand">|</span> Process <span className="text-brand">|</span> Performance
            </p>
          </div>

          {/* center image */}
          <div className="relative min-h-[320px] lg:min-h-[600px] min-w-0">
            <img src={HERO_IMG} alt="Sugar and cogeneration plant" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 blueprint" />
            <span className="absolute left-[18%] top-[24%] font-mono text-xl text-navy">+</span>
            <span className="absolute left-[18%] top-[24%] mt-4 h-20 w-px bg-navy/40" />
            <span className="absolute left-[18%] top-[24%] ml-4 mt-2 h-px w-28 bg-navy/40" />
            <svg className="absolute inset-y-0 right-0 h-full w-[30%] hidden md:block" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon points="100,0 0,100 100,100" fill="#0e2a5e" opacity="0.9" />
            </svg>
          </div>

          {/* right operating panel */}
          <div className="blueprint-blue relative bg-navy p-6 md:p-8 text-white flex flex-col min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/70">Operating system</p>
            <p className="mt-4 font-mono text-[11.5px] leading-relaxed text-white/85">
              Every project runs on one operating system — shared schedules, shared accountability, shared standards. So clients build, authorities stay informed and works all stay at the same level of precision.
            </p>
            <p className="mt-8 font-mono text-[11px] uppercase leading-loose tracking-[0.2em] text-white/80">
              Plan<br />Engineer<br />Execute<br />Sustain
            </p>
            <p className="mt-auto pt-10 text-right font-mono text-[11px] uppercase leading-relaxed tracking-[0.2em] text-white/80">
              We build<br />a stronger<br />tomorrow
            </p>
          </div>
        </div>
      </section>

      {/* ---------- STATS STRIP: full-bleed ---------- */}
      <section className="w-full bg-white border-b border-navy/10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_1.1fr]">
          <StatItem value="54" label="Years of practice" icon={<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 20V10h3v10M10 20V4h3v16M16 20v-7h3v7M2 20h20" /></svg>} />
          <StatItem value="30+" label="Countries served" icon={<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="8" /><path d="M4 12h16M12 4c3 3 3 13 0 16M12 4c-3 3-3 13 0 16" /></svg>} />
          <StatItem value="500+" label="Projects delivered" icon={<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" /></svg>} />
          <StatItem value="1000 MW" label="Cogeneration advised" icon={<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" /></svg>} />
          <div className="hidden lg:flex items-center gap-3 px-8 py-5">
            <span className="h-px w-10 bg-navy/40 shrink-0" />
            <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-soft">Trusted partners<br />in industrial growth.</p>
          </div>
        </div>
      </section>

      {/* ---------- SERVICES + APPROACH: full-bleed ---------- */}
      <section className="w-full">
        <div className="grid gap-px bg-navy/10 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_360px] border-b border-navy/10">
          <Reveal className="bg-white"><ServiceImageCard img="/assets/img-slide-two.jpg" title="Sugar plant engineering" to="/expertise" /></Reveal>
          <Reveal delay={0.05} className="bg-white"><ServiceImageCard img="/assets/service-engg.jpg" title="Cogeneration & power" to="/services" /></Reveal>
          <Reveal delay={0.1} className="bg-white"><ServiceImageCard img="/assets/img-slide-three.jpg" title="Infrastructure development" to="/expertise" /></Reveal>
          <Reveal delay={0.15} className="bg-white"><ServiceImageCard img="/assets/r-and-d.jpg" title="Project management" to="/services" /></Reveal>
          <div className="blueprint bg-white p-6 md:p-8 flex flex-col min-w-0">
            <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-soft"><span className="h-px w-8 bg-navy/30" /> Our approach</p>
            <h2 className="mt-4 font-display text-[1.8rem] leading-[0.95] text-ink">Construction expertise backed by experience.</h2>
            <p className="mt-4 font-mono text-[11px] leading-relaxed text-soft">
              J.P. Mukherji & Associates partners with developers, businesses and public organizations to deliver projects that meet the highest standards of quality, safety and performance.
            </p>
            <Link to="/about" className="cut-sm mt-6 w-fit bg-brand px-6 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-white hover:bg-navy">Our approach →</Link>
          </div>
        </div>
      </section>

      {/* ---------- TRUST BAND: full-bleed ---------- */}
      <section className="w-full">
        <div className="grid w-full lg:grid-cols-[1fr_340px] bg-navydeep text-white">
          <div className="relative min-w-0">
            <img src="/assets/about_carousel_bg.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-25 img-industrial" />
            <div className="absolute inset-0 blueprint-dark" />
            <div className="relative grid sm:grid-cols-2 xl:grid-cols-4">
              {[
                { t: 'Sustainable development', icon: 'M12 21c-5 0-8-3-8-8 5 0 11-2 12-9 3 4 4 8 4 9 0 5-3 8-8 8zM7 12l3 3 7-7' },
                { t: 'People first', icon: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' },
                { t: 'Safety always', icon: 'M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4zM9 12l2 2 4-4' },
                { t: 'Long-term partnership', icon: 'M4 20V10h3v10M10 20V4h3v16M16 20v-7h3v7M2 20h20' },
              ].map((x) => (
                <div key={x.t} className="flex items-center gap-4 border-b sm:border-b-0 sm:border-r border-white/10 px-6 py-6 last:border-0 min-w-0">
                  <svg viewBox="0 0 24 24" className="h-7 w-7 shrink-0 text-white/80" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d={x.icon} /></svg>
                  <p className="font-mono text-[10.5px] uppercase leading-snug tracking-[0.16em] text-white/85">{x.t}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="blueprint-blue bg-brand p-6 md:p-8 flex items-center justify-between gap-4 min-w-0">
            <p className="font-display text-2xl leading-[0.95] text-white">Let's build<br />what's next.</p>
            <Link to="/contact" className="cut-sm shrink-0 border border-white/70 px-6 py-3 font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-white hover:bg-white hover:text-navy">Enquire now →</Link>
          </div>
        </div>
      </section>

      {/* slim brochure line */}
      <section className="w-full bg-white border-b border-navy/10 px-4 md:px-8 py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-soft">
          {c.settings.heroVideo ? 'Company film available · ' : ''}Brochure leads go to Admin → Brochure leads with country + full phone.
        </p>
        <button onClick={() => onBrochure()} className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-brand hover:text-navy shrink-0">Download brochure →</button>
      </section>
    </div>
  )
}
