import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useContent } from '../hooks/useContent'
import { Kicker, Pill, Reveal } from '../components/ui'
import { PageHero } from './About'

function Lightbox({ images, index, onClose, onNav }: { images: { src: string; title: string }[]; index: number; onClose: () => void; onNav: (i: number) => void }) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNav((index + 1) % images.length)
      if (e.key === 'ArrowLeft') onNav((index - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', fn)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', fn); document.body.style.overflow = '' }
  }, [index, images.length, onClose, onNav])
  const cur = images[index]
  return (
    <motion.div className="fixed inset-0 z-[100] flex flex-col bg-brand-deep/95 backdrop-blur" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between px-5 py-4 text-white">
        <p className="text-[12px] font-semibold tracking-wide">{cur.title} <span className="text-white/50">· {index + 1}/{images.length}</span></p>
        <button onClick={onClose} aria-label="Close" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-xl hover:bg-white/10">×</button>
      </div>
      <div className="relative flex flex-1 items-center justify-center px-4 pb-4 min-h-0" onClick={onClose}>
        <AnimatePresence mode="wait">
          <motion.img
            key={cur.src}
            src={cur.src} alt={cur.title}
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
          />
        </AnimatePresence>
        {images.length > 1 && (
          <>
            <button aria-label="Previous" onClick={(e) => { e.stopPropagation(); onNav((index - 1 + images.length) % images.length) }} className="absolute left-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white text-xl hover:bg-white/20">‹</button>
            <button aria-label="Next" onClick={(e) => { e.stopPropagation(); onNav((index + 1) % images.length) }} className="absolute right-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white text-xl hover:bg-white/20">›</button>
          </>
        )}
      </div>
      <p className="pb-5 text-center text-[11.5px] text-white/50">Click anywhere to close · ← → to browse</p>
    </motion.div>
  )
}

export default function Insights() {
  const c = useContent()
  const [box, setBox] = useState<number | null>(null)

  const patentIdx = c.news.findIndex((n) => n.image.includes('mcu-patent'))
  const patent = patentIdx >= 0 ? c.news[patentIdx] : null
  const rest = useMemo(() => c.news.filter((_, i) => i !== patentIdx), [c.news, patentIdx])
  const all = useMemo(() => [
    ...c.news.map((n) => ({ src: n.image, title: n.title })),
    ...c.gallery.map((g, i) => ({ src: g, title: `JPMA gallery ${i + 1}` })),
  ], [c.news, c.gallery])
  const boxIndex = (itemIdx: number) => setBox(itemIdx)

  return (
    <div>
      <PageHero eyebrow="Insights · News & gallery" title="Seminars, milestones & site life." copy="Kenya & Indonesia technical seminars, JPMA Day, presidential audience, MCU patent, plus the gallery." />

      {/* patent spotlight: full certificate, uncropped, readable */}
      {patent && (
        <section className="mx-auto max-w-6xl px-6 pt-12">
          <Reveal>
            <div className="overflow-hidden rounded-[2rem] border border-ink/10 bg-parchment grid md:grid-cols-2">
              <button onClick={() => boxIndex(patentIdx)} className="group relative block bg-white p-4 md:p-6 cursor-zoom-in" aria-label="View patent certificate fullscreen">
                <img src={patent.image} alt="MCU patent certificate, granted 2023" className="mx-auto max-h-[420px] md:max-h-[520px] w-auto rounded-lg object-contain shadow-lg" />
                <span className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-brand-deep/85 px-5 py-2 text-[10.5px] font-bold uppercase tracking-[0.18em] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Click to read fullscreen
                </span>
              </button>
              <div className="p-7 md:p-10 flex flex-col justify-center">
                <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-brand">Patent spotlight · {patent.tag} · {patent.date}</p>
                <h2 className="font-display mt-3 text-3xl md:text-4xl leading-tight">{patent.title}</h2>
                <p className="mt-3 text-[14.5px] leading-relaxed text-soft">{patent.excerpt} The Moisture Control Unit was developed in-house, patented in 2023, and honoured with the CEAI national award for innovation in engineering. It is installed across India and Indonesia with mill improvement systems.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button onClick={() => boxIndex(patentIdx)} className="rounded-full bg-brand px-7 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:bg-brand-deep transition-colors">
                    View certificate
                  </button>
                  <Pill to="/innovation" tone="outline">About the MCU</Pill>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {rest.map((n, i) => {
            const gi = i >= patentIdx && patentIdx >= 0 ? i + 1 : i
            return (
              <Reveal key={`${n.title}-${i}`} delay={Math.min(i * 0.05, 0.25)}>
                <article className="group">
                  <button onClick={() => boxIndex(gi)} className="block w-full overflow-hidden rounded-[1.5rem] cursor-zoom-in" aria-label={`Enlarge: ${n.title}`}>
                    <img src={n.image} alt={n.title} className="h-56 w-full object-cover img-soft transition-transform duration-700 group-hover:scale-105" />
                  </button>
                  <p className="mt-4 text-[10.5px] font-bold uppercase tracking-[0.2em] text-brand">{n.tag} · <span className="text-soft font-medium normal-case tracking-normal">{n.date}</span></p>
                  <h3 className="font-display mt-1.5 text-[1.35rem] leading-snug">{n.title}</h3>
                  <p className="mt-1.5 text-[13px] text-soft">{n.excerpt}</p>
                </article>
              </Reveal>
            )
          })}
        </div>
      </section>

      <section className="bg-parchment rounded-t-[2.5rem] md:rounded-t-[3.5rem]">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <Kicker>Gallery</Kicker>
          <h2 className="font-display mt-3 text-3xl md:text-4xl">From the field.</h2>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            {c.gallery.map((g, i) => (
              <Reveal key={g} delay={Math.min(i * 0.03, 0.25)}>
                <button onClick={() => setBox(c.news.length + i)} className="block w-full cursor-zoom-in" aria-label={`Enlarge gallery photo ${i + 1}`}>
                  <img src={g} alt={`JPMA gallery ${i + 1}`} loading="lazy" className="aspect-square w-full rounded-2xl object-cover img-soft lift" />
                </button>
              </Reveal>
            ))}
          </div>
          <p className="mt-4 text-[12.5px] text-soft">Tip: click any photo to view it fullscreen.</p>
        </div>
      </section>

      <AnimatePresence>
        {box !== null && box >= 0 && (
          <Lightbox images={all} index={box} onClose={() => setBox(null)} onNav={setBox} />
        )}
      </AnimatePresence>
    </div>
  )
}
