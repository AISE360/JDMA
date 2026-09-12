import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { COUNTRIES } from '../data/countries'
import { saveLead } from '../hooks/useContent'

const inputCls = 'w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm outline-none placeholder:text-ink/35 focus:border-brand'

export interface BrochureFile {
  path: string
  downloadName: string
  heading: string
  kicker: string
  source: string
}

export const COMPANY_BROCHURE: BrochureFile = {  path: '/assets/JPMA_Brochure_2025.pdf',
  downloadName: 'JPMA_Brochure_2025.pdf',
  heading: 'Enter your number to download',
  kicker: 'Free resource · JPMA brochure 2025',
  source: 'brochure-gate',
}

export type OpenBrochure = (file?: string, meta?: { title?: string; kicker?: string; source?: string }) => void

export default function BrochureModal({ open, onClose, file }: { open: boolean; onClose: () => void; file: BrochureFile }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [org, setOrg] = useState('')
  const [iso, setIso] = useState('IN')
  const [phone, setPhone] = useState('')
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [saving, setSaving] = useState(false)

  const country = useMemo(() => COUNTRIES.find((c) => c.iso === iso) ?? COUNTRIES[0], [iso])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const digits = phone.replace(/\D/g, '')
    if (name.trim().length < 2) return setError('Please enter your full name.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Please enter a valid email address.')
    if (digits.length < 6 || digits.length > 15) return setError('Please enter a valid phone number (6–15 digits).')
    if (org.trim().length < 2) return setError('Please enter your organisation name.')
    if (!agree) return setError('Please accept the terms to continue.')
    setSaving(true)
    const fullPhone = `+${country.dial}${digits}`
    await saveLead('brochure_leads', {
      name: name.trim(), email: email.trim(), organisation: org.trim(),
      country: country.name, country_iso: country.iso, country_code: `+${country.dial}`,
      phone: digits, full_phone: fullPhone, source: file.source,
    })
    setSaving(false)
    setDone(true)
    const a = document.createElement('a')
    a.href = file.path
    a.download = file.downloadName
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  function close() {
    onClose()
    setTimeout(() => { setDone(false); setError('') }, 400)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[100] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-brand-deep/60 backdrop-blur-sm" onClick={close} />
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.99 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg overflow-hidden rounded-[1.75rem] bg-paper shadow-2xl"
          >
            <div className="bg-brand-deep px-8 py-7 text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/60">{file.kicker}</p>
              <h3 className="font-display mt-2 text-[1.7rem] leading-snug font-medium">{file.heading}</h3>
              <p className="mt-1 text-[13px] text-white/65">Every country supported, choose your code, enter your number.</p>
              <button onClick={close} aria-label="Close" className="absolute right-5 top-5 text-xl leading-none text-white/60 hover:text-white">×</button>
            </div>
            {!done ? (
              <form onSubmit={submit} className="px-8 py-7 space-y-3">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className={inputCls} />
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Work email" type="email" className={inputCls} />
                <div className="flex gap-2">
                  <select value={iso} onChange={(e) => setIso(e.target.value)} className="w-[42%] shrink-0 rounded-xl border border-ink/15 bg-white px-2 py-3 text-[12.5px] outline-none focus:border-brand" aria-label="Country">
                    {COUNTRIES.map((c) => (
                      <option key={c.iso} value={c.iso}>{c.name} (+{c.dial})</option>
                    ))}
                  </select>
                  <div className="flex min-w-0 flex-1 items-center rounded-xl border border-ink/15 bg-white px-3 focus-within:border-brand">
                    <span className="shrink-0 text-sm font-semibold text-ink/50">+{country.dial}</span>
                    <input value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^\d\s-]/g, ''))} placeholder="98765 43210" inputMode="tel" className="w-full min-w-0 px-2 py-3 text-sm outline-none bg-transparent" />
                  </div>
                </div>
                <input value={org} onChange={(e) => setOrg(e.target.value)} placeholder="Organisation / sugar factory" className={inputCls} />
                <label className="flex items-start gap-2.5 text-[12.5px] text-soft">
                  <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 accent-[#2f4a5e]" />
                  I agree to be contacted by JPMA about this download and related services.
                </label>
                {error && <p className="rounded-xl bg-red-50 px-4 py-2.5 text-[13px] font-medium text-red-700">{error}</p>}
                <button disabled={saving} className="w-full rounded-full bg-brand py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:bg-brand-deep transition-colors disabled:opacity-60">
                  {saving ? 'Saving…' : 'Get download'}
                </button>
                <p className="text-center text-[11.5px] text-soft">Your number is stored securely and visible to the JPMA team in the admin panel.</p>
              </form>
            ) : (
              <div className="px-8 py-9 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-xl text-brand">✓</div>
                <h4 className="font-display mt-4 text-3xl">Your download has started</h4>
                <p className="mt-2 text-sm text-soft">Saved as <strong className="text-ink">{`+${country.dial} ${phone}`}</strong> ({country.name}).</p>
                <div className="mt-6 flex gap-3 justify-center">
                  <a href={file.path} download={file.downloadName} className="rounded-full bg-brand px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white">Download again</a>
                  <button onClick={close} className="rounded-full border border-ink/20 px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em]">Done</button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
