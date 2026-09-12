import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

/*
 * 2-second JPMA splash, white background, logo assembles by dropping in.
 * All four part-images are preloaded BEFORE the timeline starts, so nothing
 * ever animates half-loaded. If any part is missing, falls back to full logo.
 */

const PARTS = ['/assets/logo-jp.jpg', '/assets/jp-mukherji.jpg', '/assets/associates.jpg', '/assets/pvt-ltd.jpg']
const OFF = typeof window !== 'undefined' ? -(window.innerHeight + 240) : -1400

function drop(delay: number, dur: number, dist: number, go: boolean) {
  if (!go) return { initial: { y: dist, scale: 0.9, opacity: 0 } as const, animate: { y: dist, scale: 0.9, opacity: 0 } as const, transition: { duration: 0 } }
  return {
    initial: { y: dist, scale: 0.9, opacity: 1 },
    animate: { y: [dist, 18, -7, 0], scale: [0.9, 1.03, 0.985, 1] },
    transition: { duration: dur, delay, times: [0, 0.62, 0.84, 1], ease: 'easeOut' as const },
  }
}

function Shine({ delay }: { delay: number }) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-y-[-20%] left-0 w-1/3"
      style={{ background: 'linear-gradient(100deg, transparent, rgba(47,74,94,0.22), transparent)', transform: 'skewX(-12deg)' }}
      initial={{ x: '-180%' }}
      animate={{ x: '480%' }}
      transition={{ duration: 0.32, delay, ease: 'easeIn' }}
    />
  )
}

const DIMS = { logo: { w: 1171, h: 1039 }, mu: { w: 2101, h: 234 }, as: { w: 2048, h: 239 }, pv: { w: 2011, h: 343 } }

function useFit(ref: React.RefObject<HTMLDivElement | null>, maxAvail: number, fallbackNat: number) {
  // Measures the natural row width once media is laid out, then locks it in.
  // Never re-scales mid-animation, so nothing jumps or flashes.
  const [scale, setScale] = useState(0.4)
  const [nat, setNat] = useState(fallbackNat)
  const locked = useRef(false)
  useLayoutEffect(() => {
    const measure = () => {
      if (locked.current) return
      const natural = ref.current?.scrollWidth || 0
      if (natural < 50) return
      locked.current = true
      setNat(natural)
      const avail = Math.min(window.innerWidth * maxAvail, 1200)
      setScale(Math.min(1, avail / natural))
      window.removeEventListener('resize', measure)
    }
    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('load', measure)
    return () => { window.removeEventListener('resize', measure); window.removeEventListener('load', measure) }
  }, [ref, maxAvail])
  return { scale, nat }
}

function Lockup({ go, onMissing }: { go: boolean; onMissing: () => void }) {
  return (
    <>
      {/* desktop: one straight horizontal line */}
      <RowLockup go={go} onMissing={onMissing} />
      {/* mobile: big stacked assembly (a single line would shrink to a flicker) */}
      <StackLockup go={go} onMissing={onMissing} />
    </>
  )
}

function RowLockup({ go, onMissing }: { go: boolean; onMissing: () => void }) {
  const innerRef = useRef<HTMLDivElement>(null)
  const { scale, nat } = useFit(innerRef, 0.72, 2009)
  const H = 'h-[76px]'
  const HM = 'h-[160px]'
  return (
    <motion.div
      className="relative hidden md:flex justify-center"
      initial={{ scale: 1 }}
      animate={go ? { scale: [1, 1.02, 1] } : { scale: 1 }}
      transition={{ duration: 0.2, delay: 1.7, times: [0, 0.5, 1], ease: 'easeInOut' }}
    >
      <div className="relative overflow-hidden" style={{ width: nat * scale, height: 185 * scale }}>
        <div ref={innerRef} className="flex flex-nowrap items-center gap-4 origin-left" style={{ transform: `scale(${scale})`, width: 'max-content' }}>
          <motion.img src={PARTS[0]} alt="JP" width={DIMS.logo.w} height={DIMS.logo.h} onError={onMissing} draggable={false}
            className={`${HM} w-auto shrink-0 mr-3`} {...drop(0, 0.55, OFF, go)} />
          <motion.img src={PARTS[1]} alt="J.P. Mukherji" width={DIMS.mu.w} height={DIMS.mu.h} onError={onMissing} draggable={false}
            className={`${H} w-auto shrink-0`} {...drop(0.5, 0.55, OFF * 0.7, go)} />
          <motion.img src={PARTS[2]} alt="& Associates" width={DIMS.as.w} height={DIMS.as.h} onError={onMissing} draggable={false}
            className={`${H} w-auto shrink-0`} {...drop(0.5, 0.55, OFF * 0.7, go)} />
          <motion.img src={PARTS[3]} alt="Pvt. Ltd." width={DIMS.pv.w} height={DIMS.pv.h} onError={onMissing} draggable={false}
            className={`${H} w-auto shrink-0`} {...drop(0.5, 0.55, OFF * 0.7, go)} />
        </div>
        {go && <Shine delay={1.9} />}
      </div>
    </motion.div>
  )
}

function dropM(delay: number, dur: number, dist: number, go: boolean) {
  // mobile variant: tighter overshoot so the dip never clips the line
  if (!go) return { initial: { y: dist, scale: 0.9, opacity: 0 } as const, animate: { y: dist, scale: 0.9, opacity: 0 } as const, transition: { duration: 0 } }
  return {
    initial: { y: dist, scale: 0.9, opacity: 1 },
    animate: { y: [dist, 6, -2, 0], scale: [0.9, 1.03, 0.985, 1] },
    transition: { duration: dur, delay, times: [0, 0.62, 0.84, 1], ease: 'easeOut' as const },
  }
}

function StackLockup({ go, onMissing }: { go: boolean; onMissing: () => void }) {
  // Mobile: big JP mark only, centered. The drop runs on a wrapper so the
  // image itself carries no transforms and can never be clipped or distorted.
  const dropWrap = !go
    ? { initial: { y: OFF, opacity: 0 } as const, animate: { y: OFF, opacity: 0 } as const, transition: { duration: 0 } }
    : {
        initial: { y: OFF, opacity: 1 },
        animate: { y: [OFF, 10, -4, 0] },
        transition: { duration: 0.6, delay: 0, times: [0, 0.62, 0.84, 1], ease: 'easeOut' as const },
      }
  return (
    <motion.div
      className="relative flex md:hidden justify-center"
      initial={{ scale: 1 }}
      animate={go ? { scale: [1, 1.02, 1] } : { scale: 1 }}
      transition={{ duration: 0.2, delay: 1.7, times: [0, 0.5, 1], ease: 'easeInOut' }}
    >
      <div style={{ display: 'inline-block', overflow: 'visible', lineHeight: 0 }}>
        <motion.div {...dropWrap} style={{ display: 'inline-block', overflow: 'visible', lineHeight: 0 }}>
          <span style={{ position: 'relative', display: 'inline-block', overflow: 'hidden', lineHeight: 0 }}>
            <img
              src={PARTS[0]}
              alt="JP"
              width={DIMS.logo.w}
              height={DIMS.logo.h}
              onError={onMissing}
              draggable={false}
              style={{ display: 'block', width: 'min(52vw, 200px)', height: 'auto', maxWidth: '52vw' }}
            />
            {go && <Shine delay={1.9} />}
          </span>
        </motion.div>
      </div>
    </motion.div>
  )
}

function FallbackLockup({ go }: { go: boolean }) {
  return (
    <motion.div
      className="relative"
      initial={{ scale: 1 }}
      animate={go ? { scale: [1, 1.02, 1] } : { scale: 1 }}
      transition={{ duration: 0.2, delay: 1.7, times: [0, 0.5, 1], ease: 'easeInOut' }}
    >
      <div className="relative overflow-hidden rounded-xl px-6 py-4">
        <motion.img src="/assets/jpma-logo-blue.png" alt="J. P. Mukherji & Associates" draggable={false}
          className="h-16 md:h-20 w-auto" {...drop(0, 0.7, OFF, go)} />
        {go && <Shine delay={1.9} />}
      </div>
    </motion.div>
  )
}

function preload(srcs: string[], timeoutMs: number): Promise<'ok' | 'missing'> {
  return new Promise((resolve) => {
    let pending = srcs.length
    let failed = false
    const timer = setTimeout(() => resolve(failed ? 'missing' : 'ok'), timeoutMs)
    srcs.forEach((src) => {
      const img = new Image()
      img.onload = () => { if (--pending === 0) { clearTimeout(timer); resolve(failed ? 'missing' : 'ok') } }
      img.onerror = () => { failed = true; if (--pending === 0) { clearTimeout(timer); resolve('missing') } }
      img.src = src
    })
  })
}

export default function Splash({ done }: { done: () => void }) {
  const [gone, setGone] = useState(false)
  const [fallback, setFallback] = useState(false)
  const [ready, setReady] = useState(false)

  // 1. preload every part (max ~1.2s wait), then 2. run the 2s timeline
  useEffect(() => {
    let live = true
    window.scrollTo(0, 0)
    document.body.style.overflow = 'hidden'
    preload(PARTS, 1500).then((r) => {
      if (!live) return
      if (r === 'missing') setFallback(true)
      setReady(true)
    })
    return () => { live = false; document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    if (!ready) return
    const t1 = setTimeout(() => setGone(true), 2080)
    const t2 = setTimeout(done, 2480)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [ready, done])

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-white h-[100svh] px-4 box-border overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: gone ? 0 : 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{ pointerEvents: gone ? 'none' : 'auto' }}
      onClick={() => { setGone(true); setTimeout(done, 380) }}
      aria-label="JPMA intro"
    >
      {fallback
        ? <FallbackLockup go={ready} />
        : <Lockup go={ready} onMissing={() => setFallback(true)} />}
    </motion.div>
  )
}
