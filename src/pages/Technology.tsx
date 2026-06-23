import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, type Variants } from 'framer-motion'
import {
  ArrowRight, CheckCircle, Shield, Thermometer, Package,
  Microscope, Sprout, Scissors, FlaskConical, BarChart3,
  Leaf, Recycle, Zap,
} from 'lucide-react'
import Footer from '../components/Footer'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
}

const processSteps = [
  { icon: Sprout,       title: 'Raw Material Intake',           desc: 'Fresh vegetables received from partner farms in Kanchipuram. Each batch logged with source, quantity, and arrival time.',                   detail: 'Temperature logging and visual inspection before entering the facility.' },
  { icon: Shield,       title: 'HACCP Process Control',         desc: 'Our facility follows Hazard Analysis and Critical Control Points (HACCP) — the gold standard in food safety management.',                  detail: 'Critical control points monitored at each production stage.' },
  { icon: FlaskConical, title: 'Sanitization Process',          desc: 'All vegetables undergo a multi-stage wash and sanitization using food-grade solutions to eliminate surface contaminants.',                    detail: 'Water quality tested and maintained. Equipment sanitized between batches.' },
  { icon: Scissors,     title: 'Cutting & Portioning',          desc: 'Cleaned vegetables are precision-cut and portioned according to dish-specific recipes. Every pack contains exactly what you need.',         detail: 'All cutting surfaces sanitized before each use. Staff wear full PPE.' },
  { icon: Package,      title: 'Modified Atmosphere Packaging', desc: 'Portioned ingredients are packed using MAP technology, replacing air with a safe gas mixture to extend freshness naturally.',               detail: 'Preserves colour, texture, and nutrients without any preservatives.' },
  { icon: CheckCircle,  title: 'Quality Checks',                desc: 'Every pack undergoes visual inspection, weight verification, leak testing, and seal integrity checks before dispatch.',                      detail: 'Packs not meeting standards are rejected and never reach the customer.' },
  { icon: Thermometer,  title: 'Cold Storage',                  desc: 'Cleared packs stored in temperature-controlled cold rooms (2–8°C) until dispatch. Cold chain maintained throughout delivery.',              detail: 'Temperature monitored continuously. Breach triggers immediate quality review.' },
  { icon: BarChart3,    title: 'Data Tracking',                 desc: 'Every pack carries a unique batch ID linking to source farm, processing date, quality check records, and cold chain logs.',                  detail: 'Full traceability allows rapid response to any quality concern.' },
]

const techHighlights = [
  { icon: Shield,      title: 'HACCP Certified',         desc: 'International food safety standard applied at every production stage', color: '#f59e0b', iconBg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.25)',  glow: 'rgba(245,158,11,0.09)'  },
  { icon: Thermometer, title: 'Cold Chain 2–8°C',        desc: 'Maintained from processing through last-mile delivery',                color: '#3b82f6', iconBg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.25)',  glow: 'rgba(59,130,246,0.09)'  },
  { icon: Package,     title: 'MAP Technology',          desc: 'Modified atmosphere preserves freshness without preservatives',         color: '#9abb50', iconBg: 'rgba(154,187,80,0.12)',   border: 'rgba(154,187,80,0.25)',   glow: 'rgba(154,187,80,0.09)'   },
  { icon: CheckCircle, title: 'Zero Compromise Quality', desc: 'Multi-point inspection before every single pack ships',                color: '#a855f7', iconBg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.25)', glow: 'rgba(168,85,247,0.09)' },
]

const mapBenefits = [
  { icon: FlaskConical, title: 'Food-Safe Gas Mix',     desc: 'N₂, CO₂ and O₂ in calibrated ratios specific to each ingredient type' },
  { icon: Thermometer,  title: 'Temperature Monitored', desc: 'Stored and transported at 2–8°C to maximise freshness window'           },
  { icon: Shield,       title: 'Leak-Tested Seals',     desc: 'Every pack tested for seal integrity before dispatch'                    },
  { icon: Recycle,      title: 'Recyclable Material',   desc: 'Packaging certified for responsible disposal'                            },
]

const sustainability = [
  { text: 'Packaging designed to minimise plastic waste',              icon: Recycle, color: '#14b8a6' },
  { text: 'Perfectly portioned packs reduce food waste by up to 90%', icon: Leaf,    color: '#9abb50' },
  { text: 'Direct farm sourcing eliminates long supply chains',        icon: Sprout,  color: '#f59e0b' },
  { text: 'Short-distance delivery reduces carbon footprint',          icon: Zap,     color: '#3b82f6' },
  { text: 'Vegetable offcuts composted, not discarded',               icon: Leaf,    color: '#c1ff72' },
  { text: 'FSSAI approved packaging materials only',                  icon: Shield,  color: '#a855f7' },
]

const heroStats = [
  { value: '8',    label: 'Process Steps'   },
  { value: '2–8°C', label: 'Cold Chain'     },
  { value: '0',    label: 'Preservatives'   },
  { value: '100%', label: 'HACCP Compliant' },
]

const DARK_BG = 'linear-gradient(160deg, #050902 0%, #0b1606 55%, #142405 100%)'
const DOT_GRID = {
  backgroundImage: 'radial-gradient(circle, rgba(193,255,114,0.1) 1px, transparent 1px)',
  backgroundSize: '28px 28px',
}

export default function Technology() {
  const processRef    = useRef<HTMLElement>(null)
  const mapRef        = useRef<HTMLElement>(null)
  const sustainRef    = useRef<HTMLElement>(null)
  const highlightsRef = useRef<HTMLElement>(null)

  const processInView    = useInView(processRef,    { once: true, margin: '-60px' })
  const mapInView        = useInView(mapRef,        { once: true, margin: '-60px' })
  const sustainInView    = useInView(sustainRef,    { once: true, margin: '-60px' })
  const highlightsInView = useInView(highlightsRef, { once: true, margin: '-60px' })

  return (
    <>
      {/* Dark bg on main fills the ~10px gap between navbar bottom and first section */}
      <main className="pt-20 overflow-x-hidden min-h-screen" style={{ background: '#050902' }}>

        {/* ── Hero ── */}
        <section
          className="relative overflow-hidden flex items-center"
          style={{ background: DARK_BG, minHeight: '78vh' }}
        >
          <div className="absolute inset-0 pointer-events-none" style={DOT_GRID} />

          <motion.div
            className="absolute pointer-events-none rounded-full"
            style={{ width: 520, height: 520, top: '10%', left: '5%', background: 'radial-gradient(circle, rgba(154,187,80,0.1), transparent 70%)' }}
            animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute pointer-events-none rounded-full"
            style={{ width: 400, height: 400, bottom: '5%', right: '10%', background: 'radial-gradient(circle, rgba(59,130,246,0.07), transparent 70%)' }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          />

          {[
            { w: 6, h: 6, top: '18%', left: '10%', delay: 0   },
            { w: 4, h: 4, top: '65%', left: '82%', delay: 1.5 },
            { w: 8, h: 8, top: '78%', left: '22%', delay: 0.7 },
            { w: 5, h: 5, top: '30%', left: '75%', delay: 2.3 },
            { w: 3, h: 3, top: '50%', left: '45%', delay: 1.1 },
          ].map((p, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-green-400/20 pointer-events-none"
              style={{ width: p.w, height: p.h, top: p.top, left: p.left }}
              animate={{ y: [0, -20, 0], opacity: [0.25, 0.75, 0.25] }}
              transition={{ duration: 4 + i * 0.8, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
            />
          ))}

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full mb-7">
                <Microscope size={13} className="text-green-400" />
                <span className="text-green-400 text-xs font-600 tracking-widest uppercase">Our Technology</span>
              </div>
            </motion.div>

            <motion.h1
              className="font-display font-black text-white tracking-tighter leading-tight mb-5"
              style={{ fontSize: 'clamp(2.6rem, 7vw, 4.8rem)' }}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            >
              Science-Backed<br />
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg, #c1ff72 0%, #9abb50 50%, #aee75d 100%)' }}
              >
                Freshness Technology
              </span>
            </motion.h1>

            <motion.p
              className="text-green-100/50 text-lg max-w-2xl mx-auto leading-relaxed mb-14"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            >
              Advanced food processing technology ensures every Samachify pack is safe, fresh, and as close to farm-sourced as possible.
            </motion.p>

            <motion.div
              className="flex flex-wrap justify-center gap-5 sm:gap-14"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.36, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            >
              {heroStats.map((s, i) => (
                <div key={i} className="text-center">
                  <div
                    className="font-display font-black text-green-400 leading-none mb-1.5"
                    style={{ fontSize: 'clamp(1.7rem, 3.5vw, 2.3rem)' }}
                  >
                    {s.value}
                  </div>
                  <div className="text-green-200/40 text-xs tracking-widest uppercase font-600">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Tech Highlights ── */}
        <section
          ref={highlightsRef}
          className="py-14 sm:py-16"
          style={{ background: '#f7fbef' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {techHighlights.map((t, i) => {
                const Icon = t.icon
                return (
                  <motion.div
                    key={i} custom={i}
                    initial="hidden" animate={highlightsInView ? 'show' : 'hidden'} variants={fadeUp}
                    className="relative bg-white rounded-3xl p-7 border border-gray-100 shadow-sm overflow-hidden group cursor-default"
                    whileHover={{ y: -6, transition: { duration: 0.22 } }}
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 20px 48px rgba(0,0,0,0.10)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '' }}
                  >
                    {/* Colored top accent bar */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
                      style={{ background: t.color }}
                    />
                    {/* Subtle hover glow */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-3xl pointer-events-none"
                      style={{ background: `radial-gradient(circle at 50% 0%, ${t.glow}, transparent 65%)` }}
                    />
                    <div className="relative z-10 mt-1">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                        style={{ background: t.iconBg, border: `1px solid ${t.border}` }}
                      >
                        <Icon size={22} style={{ color: t.color }} />
                      </div>
                      <h3 className="font-700 text-gray-900 mb-2">{t.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{t.desc}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Process Flow ── */}
        <section ref={processRef} className="py-14 sm:py-28" style={{ background: '#f7fbef' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={processInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-green-50 border border-green-200 rounded-full mb-6">
                <Zap size={13} className="text-green-600" />
                <span className="text-green-700 text-xs font-700 tracking-widest uppercase">Our Process</span>
              </div>
              <h2
                className="font-display font-black text-gray-900 tracking-tighter mb-3"
                style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)' }}
              >
                From Farm to Ready-to-Cook
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Every step is designed to preserve freshness, ensure safety, and deliver authentic quality.
              </p>
            </motion.div>

            <div className="relative">
              <motion.div
                className="absolute top-7 bottom-7 w-0.5 origin-top hidden sm:block"
                style={{ left: 27, background: 'linear-gradient(to bottom, #c1ff72, #9abb50 40%, #aee75d)' }}
                initial={{ scaleY: 0 }}
                animate={processInView ? { scaleY: 1 } : { scaleY: 0 }}
                transition={{ duration: 1.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              />

              <div className="space-y-5">
                {processSteps.map((step, i) => {
                  const Icon = step.icon
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 52 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-70px' }}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                      className="flex gap-5 sm:gap-7 items-start group"
                    >
                      <div className="relative flex-shrink-0 z-10">
                        <motion.div
                          className="w-14 h-14 rounded-full bg-white border-2 border-green-200 flex items-center justify-center shadow-md group-hover:border-green-400 group-hover:shadow-lg transition-colors duration-300"
                          initial={{ scale: 0, rotate: -120 }}
                          whileInView={{ scale: 1, rotate: 0 }}
                          viewport={{ once: true, margin: '-70px' }}
                          transition={{ type: 'spring', stiffness: 280, damping: 22, delay: 0.12 }}
                          whileHover={{ scale: 1.12, transition: { duration: 0.2 } }}
                        >
                          <Icon size={20} className="text-green-600" />
                        </motion.div>
                        {/* Sonar-ping ring */}
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-green-400/40 pointer-events-none"
                          initial={{ scale: 1, opacity: 0 }}
                          whileInView={{ scale: [1, 1.65, 1.65], opacity: [0, 0.65, 0] }}
                          viewport={{ once: true, margin: '-70px' }}
                          transition={{ duration: 0.75, delay: 0.32, ease: 'easeOut' }}
                        />
                      </div>

                      <motion.div
                        className="flex-1 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-sm group-hover:border-green-200 group-hover:shadow-md transition-all duration-300"
                        initial={{ opacity: 0, x: 28 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-70px' }}
                        transition={{ duration: 0.5, delay: 0.07, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                      >
                        <div className="flex items-center gap-3 mb-2.5 flex-wrap">
                          <span className="text-[10px] font-800 text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full tracking-widest uppercase">
                            Step {i + 1}
                          </span>
                          <h3 className="font-700 text-gray-900">{step.title}</h3>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-2">{step.desc}</p>
                        <p className="text-xs text-green-600 font-600 italic">{step.detail}</p>
                      </motion.div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── MAP Deep Dive ── */}
        <section
          ref={mapRef}
          className="py-14 sm:py-28 relative overflow-hidden"
          style={{ background: DARK_BG }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 18% 55%, rgba(42,79,7,0.22), transparent 58%)' }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 82% 20%, rgba(59,130,246,0.05), transparent 50%)' }}
          />
          <div className="absolute inset-0 pointer-events-none" style={DOT_GRID} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -40 }} animate={mapInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/6 border border-white/10 rounded-full mb-7">
                  <Package size={13} className="text-green-400" />
                  <span className="text-green-300 text-xs font-600 tracking-widest uppercase">Smart Packaging</span>
                </div>
                <h2
                  className="font-display font-black text-white tracking-tighter mb-5 leading-tight"
                  style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
                >
                  Modified Atmosphere<br />
                  <span
                    className="text-transparent bg-clip-text"
                    style={{ backgroundImage: 'linear-gradient(135deg, #c1ff72, #9abb50)' }}
                  >
                    Packaging
                  </span>
                </h2>
                <p className="text-green-100/50 leading-relaxed mb-8">
                  MAP replaces the air inside each pack with a carefully calibrated mixture of food-safe gases. This slows microbial growth and oxidation — keeping vegetables fresher for longer, with zero preservatives.
                </p>
                <div className="space-y-3.5">
                  {[
                    'Extends shelf life naturally — no chemicals',
                    'Preserves colour, texture, and nutrients',
                    'Maintains the crunch of fresh-cut vegetables',
                    'Safe gas mixture — same gases present in the atmosphere',
                    'FSSAI approved packaging material',
                  ].map((point, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }} animate={mapInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                      className="flex items-center gap-3 text-sm text-green-100/70"
                    >
                      <div className="w-5 h-5 rounded-full bg-green-500/15 border border-green-500/25 flex items-center justify-center flex-shrink-0">
                        <CheckCircle size={11} className="text-green-400" />
                      </div>
                      {point}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }} animate={mapInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                className="grid grid-cols-2 gap-4"
              >
                {mapBenefits.map((item, i) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 24 }} animate={mapInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.55, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                      whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2 } }}
                      className="relative p-5 rounded-2xl border overflow-hidden group cursor-default"
                      style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(193,255,114,0.15)' }}
                    >
                      <div
                        className="absolute top-0 left-4 right-4 h-px pointer-events-none"
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(193,255,114,0.45), transparent)' }}
                      />
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-2xl pointer-events-none"
                        style={{ background: 'radial-gradient(circle at 50% 0%, rgba(154,187,80,0.08), transparent 70%)' }}
                      />
                      <div className="relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-400/20 flex items-center justify-center mb-4">
                          <Icon size={18} className="text-green-400" />
                        </div>
                        <h4 className="font-700 text-white text-sm mb-1.5">{item.title}</h4>
                        <p className="text-green-200/50 text-xs leading-relaxed">{item.desc}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Sustainability ── */}
        <section ref={sustainRef} className="py-14 sm:py-28 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={sustainInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="text-center mb-14"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-green-50 border border-green-200 rounded-full mb-6">
                <Leaf size={13} className="text-green-600" />
                <span className="text-green-700 text-xs font-700 tracking-widest uppercase">Sustainability</span>
              </div>
              <h2
                className="font-display font-black text-gray-900 tracking-tighter mb-3"
                style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)' }}
              >
                Sustainability Practices
              </h2>
              <p className="text-gray-500 text-lg max-w-xl mx-auto">
                Our technology doesn&apos;t just serve freshness — it serves the planet.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {sustainability.map((item, i) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={i} custom={i}
                    initial="hidden" animate={sustainInView ? 'show' : 'hidden'} variants={fadeUp}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="relative p-6 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group cursor-default"
                  >
                    <div
                      className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
                      style={{ background: item.color }}
                    />
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-3xl pointer-events-none"
                      style={{ background: `radial-gradient(circle at 50% 0%, ${item.color}0d, transparent 70%)` }}
                    />
                    <div className="relative z-10 flex items-start gap-4 mt-1">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${item.color}18`, border: `1px solid ${item.color}35` }}
                      >
                        <Icon size={17} style={{ color: item.color }} />
                      </div>
                      <span className="font-600 text-gray-700 text-sm leading-relaxed pt-1.5">{item.text}</span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section
          className="py-14 sm:py-24 relative overflow-hidden"
          style={{ background: DARK_BG }}
        >
          <div className="absolute inset-0 pointer-events-none" style={DOT_GRID} />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              className="w-[500px] h-[500px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(154,187,80,0.1), transparent 70%)' }}
              animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            viewport={{ once: true, margin: '-60px' }}
            className="relative z-10 max-w-2xl mx-auto px-4 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full mb-7">
              <Zap size={13} className="text-green-400" />
              <span className="text-green-400 text-xs font-600 tracking-widest uppercase">Ready to Experience</span>
            </div>
            <h2
              className="font-display font-black text-white tracking-tighter mb-5 leading-tight"
              style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3rem)' }}
            >
              Taste the difference<br />
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg, #c1ff72, #9abb50)' }}
              >
                technology makes
              </span>
            </h2>
            <p className="text-green-100/45 mb-10 leading-relaxed text-base max-w-lg mx-auto">
              Every Samachify pack is a product of this entire process — freshness you can see, taste, and trust.
            </p>

            <motion.div
              className="inline-block"
              whileHover={{ scale: 1.06, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                to="/products"
                onClick={() => window.scrollTo(0, 0)}
                className="inline-flex items-center gap-2.5 px-9 py-4 text-white font-700 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, #498a0c, #3a6c09)',
                  boxShadow: '0 0 35px rgba(154,187,80,0.28), 0 4px 16px rgba(0,0,0,0.35)',
                }}
              >
                Explore Our Products <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>
        </section>

      </main>
      <Footer />
    </>
  )
}
