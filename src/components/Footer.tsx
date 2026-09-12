import { Link } from 'react-router-dom'
import { useContent } from '../hooks/useContent'

export default function Footer() {
  const c = useContent()
  const siteSettings = c.settings as any
  return (
    <footer className="bg-navydeep blueprint-dark text-white">
      <div className="w-full px-4 md:px-8 pt-12 pb-6">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <span className="inline-block bg-white px-3 py-2">
              <img src="/assets/jpma-logo-blue.png" alt="J.P. Mukherji & Associates" className="h-10 w-auto object-contain" />
            </span>
            <p className="mt-5 max-w-xs font-mono text-[11px] uppercase leading-relaxed tracking-[0.04em] text-white/60">
              {siteSettings.footerAbout || "India's first end-to-end sugar industry consultancy, concept to commissioning across 30+ countries since 1972."}
            </p>
            <Link to="/contact" className="cut-btn mt-6 inline-flex bg-brand px-6 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-white hover:bg-white hover:text-navy">Contact us →</Link>
          </div>
          <div>
            <p className="font-display text-2xl leading-[0.95]">Build with an industrialized and digital system</p>
            <Link to="/about" className="cut-btn mt-4 inline-block border border-white/40 px-5 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] hover:bg-white hover:text-navy">Learn more →</Link>
            <p className="mt-6 font-mono text-[11px] uppercase leading-relaxed text-white/55">{siteSettings.address || 'Kolkata · India'}<br />{siteSettings.email1 || 'info@jpma.org.in'}<br />{siteSettings.phone1 || ''}</p>
          </div>
          <div className="font-mono text-[11px] uppercase tracking-[0.14em]">
            <p className="text-white/50">Sitemap</p>
            <ul className="mt-3 space-y-2 text-white">
              {[['/', 'Home'], ['/expertise', 'Business'], ['/services', 'Services'], ['/about', 'Our Approach'], ['/projects', 'Projects'], ['/insights', 'Insights'], ['/innovation', 'Innovation'], ['/careers', 'Careers'], ['/contact', 'Contact']].map(([to, l]) => (
                <li key={to} className="border-b border-white/15 pb-1"><Link to={to} className="hover:text-white/60">{l}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-white/15 pt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-white/55">
          <p>© {new Date().getFullYear()} {siteSettings.company || 'J.P. Mukherji & Associates Pvt. Ltd.'}</p>
          <p>ISO 9001 · 14001 · 45001 · 50001 · SA 8000</p>
        </div>
      </div>
    </footer>
  )
}
