import { useEffect, useState } from 'react'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Splash from './components/Splash'
import BrochureModal, { COMPANY_BROCHURE, type BrochureFile, type OpenBrochure } from './components/BrochureModal'
import Home from './pages/Home'
import About from './pages/About'
import Expertise from './pages/Expertise'
import Services from './pages/Services'
import Projects from './pages/Projects'
import Innovation from './pages/Innovation'
import Insights from './pages/Insights'
import Careers from './pages/Careers'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import { useContent } from './hooks/useContent'

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function Shell() {
  const [brochureOpen, setBrochureOpen] = useState(false)
  const [brochureFile, setBrochureFile] = useState<BrochureFile>(COMPANY_BROCHURE)
  const [splash, setSplash] = useState(true)
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')
  const c = useContent()
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    let raf = 0
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); lenis.destroy() }
  }, [])
  const openBrochure: OpenBrochure = (file?, meta?) => {
    if (!file) setBrochureFile({ ...COMPANY_BROCHURE, path: c.settings.brochurePath })
    else {
      const name = file.split('/').pop() || 'document.pdf'
      setBrochureFile({
        path: file,
        downloadName: name,
        heading: meta?.title ?? 'Enter your number to download',
        kicker: meta?.kicker ?? 'Free resource · JPMA',
        source: meta?.source ?? 'brochure-gate',
      })
    }
    setBrochureOpen(true)
  }
  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      <ScrollTop />
      {!isAdmin && splash && <Splash done={() => setSplash(false)} />}
      {!isAdmin && <Navbar onBrochure={openBrochure} />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home onBrochure={openBrochure} />} />
          <Route path="/about" element={<About />} />
          <Route path="/expertise" element={<Expertise onBrochure={openBrochure} />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/innovation" element={<Innovation onBrochure={openBrochure} />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Home onBrochure={openBrochure} />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && (
        <BrochureModal open={brochureOpen} onClose={() => setBrochureOpen(false)} file={brochureFile} />
      )}
      {!isAdmin && (
        <Link to="/contact" className="cut-sm fixed z-40 right-4 md:right-5 bg-brand px-5 py-2.5 font-mono text-[10px] md:px-6 md:py-3 md:text-[10.5px] font-bold uppercase tracking-[0.18em] text-white shadow-xl hover:bg-brand-deep transition-colors max-w-[calc(100vw-2rem)]" style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
          Enquire now →
        </Link>
      )}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  )
}
