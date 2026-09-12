import { Link } from 'react-router-dom'
import { useContent } from '../hooks/useContent'
import { Reveal } from '../components/ui'
import type { OpenBrochure } from '../components/BrochureModal'

const HERO_IMG = '/assets/slider-one.jpg'

const CLIENT_LOGOS = Array.from({ length: 39 }, (_, i) => `/assets/clients/${i + 1}.png`)
const CLIENT_LOGOS_2 = Array.from({ length: 59 }, (_, i) => i + 1)
  .filter((n) => n !== 36)
  .map((n) => `/assets/clients/logo${n}.jpg`)
const ALL_LOGOS = [...CLIENT_LOGOS, ...CLIENT_LOGOS_2]

function ClientsWall() {
  const row = [...ALL_LOGOS, ...ALL_LOGOS]
  return (
    <div className="clients-wall overflow-hidden">
      <div className="flex w-max animate-clients items-center gap-12 md:gap-16 px-6">
        {row.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Client ${(i % ALL_LOGOS.length) + 1}`}
            loading="lazy"
            className="h-11 md:h-14 w-auto max-w-[170px] object-contain opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
          />
        ))}
      </div>
    </div>
  )
}

function StatItem({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-4 px-5 md:px-9 py-[20px] md:py-[22px] border-b xl:border-b-0 xl:border-r border-navy/10 last:border-0 min-w-0 overflow-hidden">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#0e2a5e] text-white">{icon}</span>
      <span className="min-w-0">
        <span className="block font-display text-[28px] md:text-[38px] font-semibold text-ink leading-none break-words">{value}</span>
        <span className="mt-[5px] block font-mono text-[9.5px] uppercase tracking-[0.18em] text-soft leading-snug">{label}</span>
      </span>
    </div>
  )
}

function ServiceImageCard({ img, title, to }: { img: string; title: string; to: string }) {
  return (
    <Link to={to} className="cut-card group relative block w-full min-w-0 overflow-hidden bg-navydeep h-[280px] sm:h-[300px] xl:h-[320px] 2xl:h-[330px]">
      <img src={img} alt={title} className="absolute inset-0 h-full w-full object-cover img-industrial opacity-90 group-hover:scale-105 transition-transform duration-700" />
      <span className="absolute inset-0 bg-gradient-to-t from-[#081a3a] via-[#081a3a]/30 to-transparent" />
      <span className="absolute inset-x-0 bottom-0 p-6">
        <span className="block font-display text-[21px] font-semibold leading-[1.02] text-white max-w-[13ch]">{title}</span>
        <span className="mt-5 block font-mono text-[9.5px] font-bold uppercase tracking-[0.2em] text-white/75 group-hover:text-white">Learn more&nbsp;&nbsp;→</span>
      </span>
    </Link>
  )
}

export default function Home({ onBrochure }: { onBrochure: OpenBrochure }) {
  const c = useContent()

  return (
    <div className="w-full bg-white text-ink overflow-x-clip">
      {/* ---------- HERO ---------- */}
      <section className="w-full overflow-hidden">
        <div className="grid w-full grid-cols-1 lg:grid-cols-[minmax(0,30%)_minmax(0,1fr)_minmax(0,26%)] xl:grid-cols-[minmax(0,27%)_minmax(0,1fr)_minmax(0,21%)] lg:min-h-[560px] xl:min-h-[600px] 2xl:min-h-[640px] border-b border-navy/10">
          {/* left copy */}
          <div className="blueprint relative px-6 md:px-8 xl:px-10 pt-8 md:pt-9 pb-7 flex flex-col bg-white min-w-0 overflow-hidden">
            <p className="flex min-w-0 items-center gap-3 md:gap-4 font-mono text-[8.5px] md:text-[9.5px] uppercase tracking-[0.18em] md:tracking-[0.24em] text-soft">
              <span className="h-px w-8 md:w-10 shrink-0 bg-navy/25" />
              <span className="min-w-0 truncate">Engineering&nbsp;&nbsp;&nbsp;People&nbsp;&nbsp;&nbsp;Progress</span>
              <span className="h-px flex-1 bg-navy/10" />
            </p>
            <h1 className="mt-6 md:mt-7 font-display font-semibold text-[clamp(2rem,1.35rem+2.6vw,4.3rem)] leading-[0.98] break-words [overflow-wrap:anywhere]">
              <span className="block text-[#101418]">Building with precision.</span>
              <span className="block text-brand">Delivering with confidence.</span>
            </h1>
            <p className="mt-6 max-w-[44ch] font-mono text-[11px] leading-[1.75] text-soft">
              From sugar plants to large-scale cogeneration, J.P. Mukherji & Associates brings expertise, accountability and execution to every project.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => onBrochure()} className="cut-btn bg-brand pl-7 pr-8 py-[13px] font-mono text-[10.5px] font-bold uppercase tracking-[0.12em] text-white hover:bg-navy">
                Our brochure&nbsp;&nbsp;→
              </button>
              <Link to="/contact" className="cut-btn border border-navy/45 pl-7 pr-8 py-[12px] font-mono text-[10.5px] font-bold uppercase tracking-[0.12em] text-navy hover:bg-navy hover:text-white">
                Contact us&nbsp;&nbsp;→
              </Link>
            </div>
            <p className="mt-auto pt-8 md:pt-10 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[9.5px] uppercase tracking-[0.2em] text-soft">
              <span className="h-px w-10 shrink-0 bg-navy/40" />
              <span className="min-w-0">People <span className="text-brand font-bold">|</span> Process <span className="text-brand font-bold">|</span> <span className="text-navy font-bold">Performance</span></span>
            </p>
          </div>

          {/* center image */}
          <div className="relative min-h-[280px] sm:min-h-[340px] lg:min-h-[560px] xl:min-h-[600px] min-w-0 overflow-hidden">
            <img src={HERO_IMG} alt="Sugar and cogeneration plant" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 blueprint" />
            {/* crosshair survey mark */}
            <span className="absolute font-mono text-[22px] font-light text-[#0e2a5e] hidden sm:block" style={{ left: '30%', top: '21%' }}>+</span>
            <span className="absolute w-px bg-[#0e2a5e]/50 hidden sm:block" style={{ left: 'calc(30% + 10px)', top: '21%', height: '88px' }} />
            <span className="absolute h-px bg-[#0e2a5e]/50 hidden sm:block" style={{ left: '30%', top: 'calc(21% + 44px)', width: '120px' }} />
            {/* navy diagonal wedge — only in 3-col desktop layout so stacked tablets never shift */}
            <svg className="absolute inset-0 h-full w-full hidden lg:block" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon points="100,0 55,100 100,100" fill="#123a7d" opacity="0.94" />
              <line x1="100" y1="0" x2="55" y2="100" stroke="rgba(255,255,255,0.4)" strokeWidth="0.25" />
            </svg>
          </div>

          {/* right operating panel */}
          <div className="blueprint-blue relative bg-[#123a7d] px-6 md:px-8 pt-7 md:pt-8 pb-7 text-white flex flex-col min-w-0 overflow-hidden">
            <p className="font-mono text-[9.5px] uppercase tracking-[0.24em] text-white/70">Operating system</p>
            <p className="mt-5 font-mono text-[11px] leading-[1.8] text-white/85">
              Every project runs on one operating system — shared schedules, shared accountability, shared standards. So clients build, authorities stay informed and works all stay at the same level of precision.
            </p>
            <div className="my-7 h-px w-10 bg-white/35" />
            <p className="font-mono text-[11px] uppercase leading-[2.1] tracking-[0.22em] text-white/85">
              Plan<br />Engineer<br />Execute<br />Sustain
            </p>
            <div className="mt-auto pt-8">
              <svg className="ml-auto block w-[130px]" viewBox="0 0 130 22" fill="none">
                <polyline points="0,21 88,21 108,1" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
              </svg>
              <p className="mt-2 text-right font-mono text-[10.5px] uppercase leading-[1.8] tracking-[0.22em] text-white/85">
                We build<br />a stronger<br />tomorrow
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- STATS STRIP ---------- */}
      <section className="w-full bg-white border-b border-navy/10 overflow-hidden">
        <div className="grid sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_1.15fr]">
          <StatItem value="54" label="Years of practice" icon={<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M3 21h18M5 21V10l4-2v13M11 21V4l5 2v15M16 21v-6h3v6" /></svg>} />
          <StatItem value="30+" label="Countries served" icon={<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c3.2 3.2 3.2 13.8 0 17M12 3.5c-3.2 3.2-3.2 13.8 0 17M5.5 6.5c3 2 9 2 13 0M5.5 17.5c3-2 9-2 13 0" /></svg>} />
          <StatItem value="500+" label="Projects delivered" icon={<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3.2" /><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.2 5.2l2.1 2.1M16.7 16.7l2.1 2.1M18.8 5.2l-2.1 2.1M7.3 16.7l-2.1 2.1" /></svg>} />
          <StatItem value="1000 MW" label="Cogeneration advised" icon={<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M13 2.5 4.5 13.5H11l-1.5 8 8.5-11H12l1-8z" /></svg>} />
          <div className="hidden xl:flex items-center gap-4 px-9 py-[22px] min-w-0">
            <span className="h-px w-12 bg-navy/40 shrink-0" />
            <p className="font-mono text-[9.5px] uppercase leading-[1.9] tracking-[0.2em] text-soft">Trusted partners<br />in industrial growth.</p>
          </div>
        </div>
      </section>

      {/* ---------- SERVICES + APPROACH ---------- */}
      <section className="w-full bg-[#edf0f4] p-2 overflow-hidden">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-[1fr_1fr_1fr_1fr_350px]">
          <Reveal><ServiceImageCard img="/assets/img-slide-two.jpg" title="Sugar plant engineering" to="/expertise" /></Reveal>
          <Reveal delay={0.05}><ServiceImageCard img="/assets/service-engg.jpg" title="Cogeneration & power" to="/services" /></Reveal>
          <Reveal delay={0.1}><ServiceImageCard img="/assets/img-slide-three.jpg" title="Infrastructure development" to="/expertise" /></Reveal>
          <Reveal delay={0.15}><ServiceImageCard img="/assets/r-and-d.jpg" title="Project management" to="/services" /></Reveal>
          <div className="blueprint bg-white px-6 md:px-7 py-8 flex flex-col min-w-0 sm:col-span-2 lg:col-span-2 2xl:col-span-1 overflow-hidden">
            <p className="flex items-center gap-4 font-mono text-[9.5px] uppercase tracking-[0.2em] text-soft"><span className="h-px w-10 shrink-0 bg-navy/30" /> Our approach</p>
            <h2 className="mt-5 font-display font-semibold text-[clamp(1.4rem,1.1rem+1.2vw,1.625rem)] leading-[1.05] text-[#101418] break-words">Construction expertise backed by experience.</h2>
            <p className="mt-4 font-mono text-[10.5px] leading-[1.8] text-soft">
              J.P. Mukherji & Associates partners with developers, businesses and public organizations to deliver projects that meet the highest standards of quality, safety and performance.
            </p>
            <Link to="/about" className="cut-btn mt-7 w-fit bg-brand pl-6 pr-7 py-[11px] font-mono text-[10.5px] font-bold uppercase tracking-[0.12em] text-white hover:bg-navy">Our approach&nbsp;&nbsp;→</Link>
          </div>
        </div>
      </section>

      {/* ---------- CLIENTS ---------- */}
      <section className="w-full bg-white border-y border-navy/10 py-9 md:py-11">
        <p className="flex items-center justify-center gap-4 px-4 font-mono text-[9.5px] uppercase tracking-[0.24em] text-soft">
          <span className="h-px w-10 bg-navy/30" /> Trusted by mills across India and 30+ countries <span className="h-px w-10 bg-navy/30" />
        </p>
        <h2 className="mt-3 px-4 text-center font-display font-semibold text-[clamp(1.5rem,2.6vw,2.3rem)] text-[#101418]">
          Our <span className="text-brand">clients</span> & partners
        </h2>
        <div className="mt-8">
          <ClientsWall />
        </div>
        <p className="mt-6 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-soft/60">Hover to pause</p>
      </section>

      {/* ---------- TRUST BAND ---------- */}
      <section className="w-full">
        <div className="grid w-full lg:grid-cols-[1fr_350px] bg-[#0a1f45] text-white">
          <div className="relative min-w-0">
            <img src="/assets/about_carousel_bg.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-20 img-industrial" />
            <div className="absolute inset-0 blueprint-dark" />
            <div className="relative grid h-full sm:grid-cols-2 xl:grid-cols-4">
              {[
                { t: 'Sustainable development', icon: 'M12 21c-5 0-8-3-8-8 5 0 11-2 12-9 3 4 4 8 4 9 0 5-3 8-8 8zM7 12l3 3 7-7' },
                { t: 'People first', icon: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20c0-3.5 3-5.5 6.5-5.5s6.5 2 6.5 5.5M16 4.5a3.5 3.5 0 0 1 0 6.8M17.5 14.7c2.4.7 4 2.3 4 5.3' },
                { t: 'Safety always', icon: 'M12 2.5 4.5 6v6c0 4.8 3.2 8.2 7.5 9.5 4.3-1.3 7.5-4.7 7.5-9.5V6L12 2.5zM9 12l2.2 2.2L15.5 10' },
                { t: 'Long-term partnership', icon: 'M3 21h18M5 21v-8M10 21V8M15 21v-5M20 21V6M5 13l5-3 4 2 6-4' },
              ].map((x) => (
                <div key={x.t} className="flex items-center gap-4 px-7 py-6 border-b sm:border-b-0 sm:border-r border-white/10 last:border-0 min-w-0">
                  <svg viewBox="0 0 24 24" className="h-[30px] w-[30px] shrink-0 text-white/85" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d={x.icon} /></svg>
                  <p className="font-mono text-[10px] uppercase leading-[1.7] tracking-[0.18em] text-white/85">{x.t}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="blueprint-blue bg-brand px-8 py-7 flex items-center justify-between gap-5 min-w-0">
            <p className="font-display font-semibold text-[24px] leading-[1.0] text-white">Let's build<br />what's next.</p>
            <Link to="/contact" className="cut-btn shrink-0 border border-white/80 pl-6 pr-7 py-[13px] font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white hover:bg-white hover:text-navy">Enquire now&nbsp;&nbsp;→</Link>
          </div>
        </div>
      </section>

      {/* slim brochure line */}
      <section className="w-full bg-white border-b border-navy/10 px-4 md:px-8 py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-soft">
          {c.settings.heroVideo ? 'Company film available · ' : ''}Brochure leads go to Admin → Brochure leads with country + full phone.
        </p>
        <button onClick={() => onBrochure()} className="font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-brand hover:text-navy shrink-0">Download brochure →</button>
      </section>
    </div>
  )
}
