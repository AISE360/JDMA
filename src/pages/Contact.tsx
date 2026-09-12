import { useState } from 'react'
import { COUNTRIES } from '../data/countries'
import { saveLead } from '../hooks/useContent'
import { Kicker, Reveal } from '../components/ui'
import { PageHero } from './About'

const inp = 'w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm outline-none placeholder:text-ink/35 focus:border-brand'

export default function Contact() {
  const [f, setF] = useState({ name: '', email: '', org: '', msg: '', iso: 'IN', phone: '' })
  const [status, setStatus] = useState('')
  const dial = COUNTRIES.find((c) => c.iso === f.iso)?.dial ?? '91'
  const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value })

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const digits = f.phone.replace(/\D/g, '')
    if (f.name.trim().length < 2) return setStatus('Please enter your name.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) return setStatus('Please enter a valid email.')
    if (digits.length < 6) return setStatus('Please enter a valid phone number.')
    const cc = COUNTRIES.find((c) => c.iso === f.iso)!
    await saveLead('enquiries', { name: f.name, email: f.email, organisation: f.org, message: f.msg, country: cc.name, country_code: `+${cc.dial}`, phone: digits, full_phone: `+${cc.dial}${digits}`, source: 'contact-page' })
    setStatus('Thank you, your enquiry is saved. The JPMA team will reach out shortly. (Admin → Enquiries)')
    setF({ name: '', email: '', org: '', msg: '', iso: 'IN', phone: '' })
  }

  return (
    <div>
      <PageHero eyebrow="Contact" title="Tell us about your plant." copy="Jyoti House, Kothrud, Pune, serving India and 30+ countries. Greenfield, expansion, audit or troubleshooting." />
      <section className="mx-auto max-w-6xl px-6 py-12 grid md:grid-cols-2 gap-10">
        <Reveal>
          <Kicker>Head office</Kicker>
          <h2 className="font-display mt-3 text-3xl">Jyoti House, Pune.</h2>
          <ul className="mt-5 space-y-2 text-[14px] text-soft">
            <li>'Jyoti House', 172, Dahanukar Colony, Kothrud, Pune – 411 038, INDIA</li>
            <li>+91 20 25397303 · +91 7756891500</li>
            <li>info@jpma.org.in · marketing@jpma.org.in</li>
            <li>Fax (020) 25399287</li>
          </ul>
          <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-ink/10">
            <iframe title="JPMA map" src="https://www.google.com/maps?q=Dahanukar+Colony+Kothrud+Pune&output=embed" className="h-64 w-full border-0" loading="lazy" />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <form onSubmit={submit} className="rounded-[1.75rem] bg-mist p-7 space-y-3">
            <Kicker>Enquire now</Kicker>
            <div className="grid sm:grid-cols-2 gap-3">
              <input value={f.name} onChange={set('name')} placeholder="Your name" className={inp} />
              <input value={f.email} onChange={set('email')} placeholder="Email" type="email" className={inp} />
            </div>
            <div className="flex gap-2">
              <select value={f.iso} onChange={(e) => setF({ ...f, iso: e.target.value })} className="w-[42%] shrink-0 rounded-xl border border-ink/15 bg-white px-2 py-3 text-[12.5px] outline-none" aria-label="Country">
                {COUNTRIES.map((c) => (<option key={c.iso} value={c.iso}>{c.name} (+{c.dial})</option>))}
              </select>
              <div className="flex min-w-0 flex-1 items-center rounded-xl border border-ink/15 bg-white px-3">
                <span className="shrink-0 text-sm font-semibold text-ink/50">+{dial}</span>
                <input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value.replace(/[^\d\s-]/g, '') })} placeholder="Phone number" inputMode="tel" className="w-full min-w-0 bg-transparent px-2 py-3 text-sm outline-none" />
              </div>
            </div>
            <input value={f.org} onChange={set('org')} placeholder="Organisation / factory" className={inp} />
            <textarea value={f.msg} onChange={set('msg')} placeholder="Capacity, feedstock, location, timeline…" rows={4} className={inp} />
            {status && <p className="rounded-xl bg-white px-4 py-2.5 text-[13px]">{status}</p>}
            <button className="rounded-full bg-brand px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:bg-brand-deep transition-colors">Submit enquiry</button>
          </form>
        </Reveal>
      </section>
    </div>
  )
}
