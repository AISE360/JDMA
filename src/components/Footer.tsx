import { Link } from 'react-router-dom'
import { useContent } from '../hooks/useContent'

export default function Footer() {
  const c = useContent()
  const siteSettings = c.settings as any
  const address: string = siteSettings.address || 'Kolkata · India'
  const email: string = siteSettings.email1 || 'info@jpma.org.in'
  const phone: string = siteSettings.phone1 || ''
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
  const telHref = `tel:${phone.replace(/[^+\d]/g, '')}`
  return (
    <footer className="bg-navydeep blueprint-dark text-white">
      <div className="w-full px-4 md:px-8 pt-12 pb-6">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <span className="inline-block bg-white px-3 py-2">
              <img src="/assets/jpma-logo-blue.png" alt="J.P. Mukherji & Associates" className="h-7 md:h-8 w-auto max-w-[200px] object-contain" />
            </span>
            <p className="mt-5 max-w-xs font-sans text-[14px] leading-[1.7] text-white/90">
              {siteSettings.footerAbout || "India's first end-to-end sugar industry consultancy, concept to commissioning across 30+ countries since 1972."}
            </p>
            <Link to="/contact" className="cut-btn mt-6 inline-flex bg-brand px-6 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-white hover:bg-white hover:text-navy">Contact us →</Link>
          </div>
          <div>
            <p className="font-display text-2xl leading-[0.95]">Build with an industrialized and digital system</p>
            <Link to="/about" className="cut-btn mt-4 inline-block border border-white/40 px-5 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] hover:bg-white hover:text-navy">Learn more →</Link>
            <div className="mt-6 space-y-2 font-sans text-[14px] leading-[1.7] text-white/90">
              <a href={mapsHref} target="_blank" rel="noreferrer" title="Open in Google Maps" className="block underline decoration-white/30 underline-offset-4 hover:text-white hover:decoration-white/80">{address}</a>
              <a href={`mailto:${email}`} className="block underline decoration-white/30 underline-offset-4 hover:text-white hover:decoration-white/80">{email}</a>
              {phone ? <a href={telHref} className="block underline decoration-white/30 underline-offset-4 hover:text-white hover:decoration-white/80">{phone}</a> : null}
            </div>
          </div>
          <div className="font-mono text-[13px] uppercase tracking-[0.1em]">
            <p className="text-white/50">Sitemap</p>
            <ul className="mt-3 space-y-2 text-white">
              {[['/', 'Home'], ['/expertise', 'Business'], ['/services', 'Services'], ['/about', 'Our Approach'], ['/projects', 'Projects'], ['/insights', 'Insights'], ['/innovation', 'Innovation'], ['/careers', 'Careers'], ['/contact', 'Contact']].map(([to, l]) => (
                <li key={to} className="border-b border-white/15 pb-1"><Link to={to} className="hover:text-white/60">{l}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-white/15 pt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-white/70">
          <p>© {new Date().getFullYear()} {siteSettings.company || 'J.P. Mukherji & Associates Pvt. Ltd.'}</p>
          <p>ISO 9001 · 14001 · 45001 · 50001 · SA 8000</p>
        </div>
      </div>
    </footer>
  )
}
