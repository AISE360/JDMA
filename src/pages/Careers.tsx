import { useState } from 'react'
import { saveLead, useContent } from '../hooks/useContent'
import { Kicker, Reveal } from '../components/ui'
import { PageHero } from './About'

const inp = 'w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm outline-none placeholder:text-ink/35 focus:border-brand'

export default function Careers() {
  const c = useContent()
  const roles = c.jobs.length ? c.jobs : []
  const [f, setF] = useState({ name: '', email: '', role: '', note: '' })
  const [status, setStatus] = useState('')
  const activeRole = f.role || roles[0]?.title || 'General application'
  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (f.name.trim().length < 2) return setStatus('Please enter your name.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) return setStatus('Please enter a valid email.')
    await saveLead('job_applications', { name: f.name, email: f.email, role: activeRole, note: f.note, source: 'careers-page' })
    setStatus('Application saved, visible in Admin → Job applications. We will contact shortlisted candidates.')
    setF({ name: '', email: '', role: '', note: '' })
  }
  return (
    <div>
      <PageHero eyebrow="Careers" title="Do the sweetest engineering of your career." copy="60+ professionals · BEE auditors · site leaders · design engineers. Pune home-office with India & international site exposure." />
      <section className="mx-auto max-w-6xl px-6 py-12 grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 space-y-8">
          {roles.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.06}>
              <div className="border-b border-ink/10 pb-8">
                <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-brand">{r.type} · {r.loc}</p>
                <h3 className="font-display mt-2 text-2xl">{r.title}</h3>
                <p className="mt-2 max-w-xl text-[13.5px] text-soft">{r.desc}</p>
                <button onClick={() => setF({ ...f, role: r.title })} className="link-line mt-3 text-[12px] font-bold uppercase tracking-[0.16em] text-brand">Apply for this role</button>
              </div>
            </Reveal>
          ))}
          <p className="text-[13px] text-soft">General applications welcome, mention your discipline (process / mechanical / electrical / civil) in the note.</p>
        </div>
        <Reveal delay={0.1} className="lg:col-span-2">
          <form onSubmit={submit} className="rounded-[1.75rem] bg-mist p-7 space-y-3 lg:sticky lg:top-24">
            <Kicker>Apply here</Kicker>
            <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Full name" className={inp} />
            <input value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="Email" type="email" className={inp} />
            <select value={activeRole} onChange={(e) => setF({ ...f, role: e.target.value })} className={inp}>
              {roles.map((r) => (<option key={r.title} value={r.title}>{r.title}</option>))}
              <option value="General application">General application</option>
            </select>
            <textarea value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} placeholder="Experience, discipline, notice period…" rows={4} className={inp} />
            {status && <p className="rounded-xl bg-white px-4 py-2.5 text-[13px]">{status}</p>}
            <button className="w-full rounded-full bg-brand py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:bg-brand-deep transition-colors">Submit application</button>
          </form>
        </Reveal>
      </section>
    </div>
  )
}
