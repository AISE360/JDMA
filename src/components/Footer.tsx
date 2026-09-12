import { Link } from 'react-router-dom'
import { useContent } from '../hooks/useContent'

export default function Footer() {
  const c = useContent()
  const siteSettings = c.settings
  return (
    <footer className="bg-paper">
      <div className="mx-auto max-w-6xl px-6 pt-14 pb-8">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <img src="/assets/jpma-logo-blue.png" alt="JPMA" className="h-10 w-auto" />
            <p className="mt-4 max-w-xs text-[12.5px] leading-relaxed text-soft">
              {(siteSettings as any).footerAbout || "India's first end-to-end sugar industry consultancy, concept to commissioning across 30+ countries since 1972."}
            </p>
          </div>
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-ink/60">Navigation</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-[13px] text-ink/75">
              {[['/about', 'About'], ['/expertise', 'Services'], ['/projects', 'Projects'], ['/innovation', 'Innovation'], ['/insights', 'Insights'], ['/careers', 'Careers'], ['/contact', 'Contact'], ['/admin', 'Admin']].map(([to, l]) => (
                <li key={to}><Link to={to} className="link-line hover:text-brand">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-ink/60">Contact info</p>
            <ul className="mt-4 space-y-1.5 text-[13px] text-ink/75">
              <li>{siteSettings.address}</li>
              <li><a className="hover:text-brand" href={`mailto:${siteSettings.email1}`}>{siteSettings.email1}</a></li>
              <li><a className="hover:text-brand" href={`tel:${siteSettings.phone1}`}>{siteSettings.phone1}</a> · <a className="hover:text-brand" href={`tel:${siteSettings.phone2}`}>{siteSettings.phone2}</a></li>
            </ul>
            <Link to="/contact" className="mt-5 inline-flex rounded-full bg-brand px-6 py-2.5 text-[10.5px] font-bold uppercase tracking-[0.18em] text-white hover:bg-brand-deep transition-colors">
              Schedule a call
            </Link>
          </div>
        </div>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-ink/10 pt-5 text-[11.5px] text-soft">
          <p>© {new Date().getFullYear()} {siteSettings.company} All rights reserved.</p>
          <p>ISO 9001 · 14001 · 45001 · 50001 · SA 8000</p>
        </div>
      </div>
    </footer>
  )
}
