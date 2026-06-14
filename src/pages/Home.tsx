import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useScroll, useTransform, type Variants } from 'framer-motion'
import {
  ArrowRight, CheckCircle, ChevronDown, ChevronUp,
  Clock, Shield, Sprout, Zap, Star, Package, ChefHat,
  Flame, GraduationCap, Video, Trash2, AlertTriangle,
  Briefcase, Scissors, Recycle, Microscope, Thermometer,
  TrendingUp, Users, Mail, MessageCircle,
  Quote, Leaf, FlaskConical, Droplets,
} from 'lucide-react'
import { products, testimonials, faqs } from '../data/products'
import Footer from '../components/Footer'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 36 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}


function SectionLabel({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-green-50 border border-green-200 rounded-full mb-6">
      <Icon size={13} className="text-green-600" />
      <span className="text-green-700 text-xs font-700 tracking-wide uppercase">{text}</span>
    </div>
  )
}

function SectionLabelDark({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/8 border border-white/15 rounded-full mb-6">
      <Icon size={13} className="text-green-400" />
      <span className="text-green-300 text-xs font-700 tracking-wide uppercase">{text}</span>
    </div>
  )
}

// ─── 1. HERO ──────────────────────────────────────────────────────────────────
function HeroSection() {
  const { scrollY } = useScroll()
  const imgY = useTransform(scrollY, [0, 700], ['0%', '6%'])

  return (
    <section className="relative overflow-hidden grain" style={{ minHeight: '100vh' }}>

      {/* ── Full-bleed background image ─────────────────────────── */}
      <motion.img
        src="/assets/hero_1.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full"
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ objectFit: 'cover', objectPosition: '65% center', y: imgY }}
      />

      {/* ── Dark tint beneath the cream overlay ── */}
      <div className="absolute inset-0 z-[5] pointer-events-none"
        style={{ background: 'rgba(0,0,0,0.10)' }} />

      {/* ── Cream overlay — mobile: soft full-screen; desktop: directional fade ── */}
      <div className="absolute inset-0 z-10 sm:hidden"
        style={{ background: 'rgba(247,245,240,0.87)' }} />
      <div className="absolute inset-0 z-10 hidden sm:block"
        style={{
          background: 'linear-gradient(to right, #F7F5F0 0%, #F7F5F0 18%, rgba(247,245,240,0.97) 28%, rgba(247,245,240,0.88) 38%, rgba(247,245,240,0.55) 50%, rgba(247,245,240,0.18) 64%, transparent 80%)',
        }}
      />
      {/* Bottom softener */}
      <div
        className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
        style={{ height: '120px', background: 'linear-gradient(to top, rgba(247,245,240,0.55), transparent)' }}
      />

      {/* ── Text content ─────────────────────────────────────────── */}
      <div
        className="relative z-20 flex flex-col justify-center w-full sm:max-w-[52%]"
        style={{
          minHeight: '100vh',
          paddingTop: '7rem',
          paddingBottom: '3.5rem',
          paddingLeft: 'max(1.25rem, 5vw)',
          paddingRight: 'max(1.25rem, 2rem)',
        }}
      >
        {/* Micro-label */}
        <motion.div
          initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.62, ease: [0.34, 1.56, 0.64, 1] }}
          className="mb-5"
        >
          <div className="text-green-700 font-800 tracking-[0.2em] uppercase leading-none" style={{ fontSize: '0.68rem' }}>
            South India's First
          </div>
          <div className="text-green-600/70 font-700 tracking-[0.2em] uppercase mt-1" style={{ fontSize: '0.68rem' }}>
            Fresh Ingredient Meal Kit
          </div>
        </motion.div>

        {/* Headline — each line animates in separately */}
        <h1
          className="mb-5"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)',
            fontWeight: 900,
            letterSpacing: '-0.026em',
            lineHeight: 1.08,
          }}
        >
          <motion.span
            className="text-gray-900 block"
            initial={{ opacity: 0, y: 52 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            From Farm To Pan.
          </motion.span>
          <motion.span
            className="text-gray-900 block"
            initial={{ opacity: 0, y: 52 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            Traditional South Indian
          </motion.span>
          <motion.span
            className="text-gray-900 block"
            initial={{ opacity: 0, y: 52 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            Cooking.
          </motion.span>
          <motion.span
            className="block mt-1.5"
            initial={{ opacity: 0, y: 52 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.46, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: 'linear-gradient(130deg, #14532d 0%, #16a34a 48%, #22c55e 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Ready In 10 Minutes.
          </motion.span>
        </h1>

        {/* Subtext + No Washing row */}
        <motion.div
          initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-7"
        >
          <p className="text-gray-600 mb-4" style={{ fontSize: 'clamp(0.9rem, 1.35vw, 1.05rem)', lineHeight: 1.74, maxWidth: '420px' }}>
            Freshly sourced ingredients, pre-cut and pre-measured, delivered as ready-to-cook meal kits inspired by traditional South Indian recipes.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {([
              { icon: Droplets, label: 'No Washing.' },
              { icon: Scissors, label: 'No Cutting.' },
              { icon: Zap,      label: 'No Guesswork.' },
            ] as { icon: React.ElementType; label: string }[]).map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-1.5 text-gray-700 font-600" style={{ fontSize: '0.85rem' }}>
                <Icon size={13} className="text-green-600 flex-shrink-0" />
                {label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.64, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-wrap gap-3 mb-8"
        >
          <Link
            to="/products"
            className="group inline-flex items-center gap-2.5 bg-green-600 text-white font-700 rounded-2xl transition-all duration-250 hover:-translate-y-1 hover:bg-green-700"
            style={{ fontSize: '1rem', padding: '1.05rem 2.3rem', boxShadow: '0 4px 22px rgba(22,163,74,0.34)' }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 14px 36px rgba(22,163,74,0.44)')}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 4px 22px rgba(22,163,74,0.34)')}
          >
            Explore Products
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
          <Link
            to="/technology"
            className="inline-flex items-center gap-2.5 bg-white/90 border border-gray-200 text-gray-800 font-700 rounded-2xl transition-all duration-250 hover:-translate-y-1 hover:border-green-300 hover:bg-white"
            style={{ fontSize: '1rem', padding: '1.05rem 2.3rem', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,0,0,0.12)')}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.07)')}
          >
            <span className="w-6 h-6 rounded-full bg-green-50 border border-green-200 flex items-center justify-center flex-shrink-0">
              <span className="w-0 h-0 border-t-[4.5px] border-t-transparent border-b-[4.5px] border-b-transparent border-l-[8px] border-l-green-600 ml-0.5" />
            </span>
            How It Works
          </Link>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.82, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-3 pt-5 border-t border-gray-300/50"
        >
          {[
            { metric: '10 Min',    label: 'Cooking Time'       },
            { metric: '100%',      label: 'Farm Fresh'         },
            { metric: '0%',        label: 'Preservatives'      },
            { metric: '5',         label: 'Authentic Recipes'  },
          ].map(({ metric, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.88 + i * 0.08, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="text-gray-900 font-800 leading-none" style={{ fontSize: '1.05rem' }}>{metric}</div>
              <div className="text-gray-400 font-500 mt-0.5" style={{ fontSize: '0.7rem' }}>{label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── Steam wisps ──────────────────────────────────────────── */}
      {([
        { r: '8%',  t: '32%', delay: 0,   w: 16, h: 30 },
        { r: '4%',  t: '40%', delay: 1.2, w: 12, h: 24 },
        { r: '12%', t: '27%', delay: 0.7, w: 11, h: 20 },
      ] as { r: string; t: string; delay: number; w: number; h: number }[]).map((s, i) => (
        <motion.div key={i} className="absolute pointer-events-none z-20 hidden lg:block"
          style={{ right: s.r, top: s.t, width: s.w, height: s.h, borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(255,255,255,0.88), transparent)', filter: 'blur(8px)' }}
          animate={{ y: [0, -32, 0], opacity: [0, 0.38, 0] }}
          transition={{ duration: 3.0 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: s.delay }}
        />
      ))}

      {/* ── Floating curry leaves ────────────────────────────────── */}
      <motion.div className="absolute right-[7%] top-[14%] pointer-events-none z-20 hidden lg:block"
        animate={{ y: [0, -12, 0], rotate: [28, 44, 28] }}
        transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}>
        <Leaf size={28} style={{ color: 'rgba(74,222,128,0.55)', filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.12))' }} />
      </motion.div>
      <motion.div className="absolute right-[22%] bottom-[22%] pointer-events-none z-20 hidden lg:block"
        animate={{ y: [0, 10, 0], rotate: [-36, -22, -36] }}
        transition={{ duration: 4.0, repeat: Infinity, ease: 'easeInOut', delay: 1.3 }}>
        <Leaf size={20} style={{ color: 'rgba(34,197,94,0.45)' }} />
      </motion.div>

    </section>
  )
}

// ─── 2. PROBLEM ───────────────────────────────────────────────────────────────
function ProblemSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const problems = [
    { icon: Clock, num: '01', title: 'Time-Consuming Prep', desc: 'Buy → Wash → Peel → Cut → Measure → Cook. 45–60 minutes spent before cooking even starts.', accent: 'from-red-500 to-orange-500' },
    { icon: Trash2, num: '02', title: 'Food Wastage', desc: 'Unused vegetables spoil quickly. Extra ingredients end up in the bin — money literally thrown away.', accent: 'from-orange-500 to-amber-500' },
    { icon: AlertTriangle, num: '03', title: 'Hygiene Concerns', desc: 'Vegetables carry surface contaminants. Multiple wash cycles required. Uncertain about safety.', accent: 'from-amber-500 to-yellow-500' },
    { icon: Briefcase, num: '04', title: 'Busy Modern Life', desc: 'Long working hours leave little time for home cooking. Takeout becomes the default — unhealthy and expensive.', accent: 'from-red-600 to-red-400' },
  ]

  const beforeSteps = ['Buy Vegetables from market', 'Wash under running water (10 min)', 'Peel and cut everything (20 min)', 'Sort & measure ingredients', 'Deal with excess and waste', 'Finally start cooking']
  const afterSteps = ['Open your Samachify kit', 'Follow the step-by-step recipe card', 'Enjoy an authentic South Indian meal']

  return (
    <section ref={ref} className="py-14 sm:py-28 overflow-hidden" style={{ background: '#FAFAF8' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-20"
        >
          <SectionLabel icon={AlertTriangle} text="The Problem" />
          <h2 className="font-display font-black text-gray-900 tracking-tighter mb-5 leading-[1.05]"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
            Why Is Cooking<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #dc2626, #f97316)' }}>
              Becoming Difficult?
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Traditional South Indian cooking is rich in flavour — but the preparation effort makes it feel impossible for busy modern households.
          </p>
        </motion.div>

        {/* Problem cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {problems.map((p, i) => {
            const Icon = p.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group relative bg-white rounded-3xl overflow-hidden hover:-translate-y-2 transition-all duration-400"
                style={{ border: '1px solid #f0f0ef', boxShadow: '0 2px 20px rgba(0,0,0,0.06)' }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.13)' }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 20px rgba(0,0,0,0.06)' }}
              >
                <div className={`h-0.5 w-full bg-gradient-to-r ${p.accent}`} />
                <div className="absolute top-3 right-4 font-display font-black text-gray-100 select-none pointer-events-none"
                  style={{ fontSize: '5rem', lineHeight: 1 }}>
                  {p.num}
                </div>
                <div className="p-7 relative z-10">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.13)' }}>
                    <Icon size={20} className="text-red-400" />
                  </div>
                  <h3 className="font-700 text-gray-900 text-base mb-2.5 leading-snug">{p.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Before / After */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid md:grid-cols-2 gap-0 rounded-2xl sm:rounded-3xl overflow-hidden"
          style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.12)', border: '1px solid #eef0ee' }}
        >
          {/* Without */}
          <div className="bg-white p-5 sm:p-8 lg:p-10">
            <div className="flex items-center gap-2 mb-7">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-xs font-700 tracking-widest text-gray-400 uppercase">Without Samachify</span>
            </div>
            <ul className="space-y-3">
              {beforeSteps.map((step, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.07 }}
                  className="flex items-center gap-3 text-gray-500 text-sm"
                >
                  <div className="w-5 h-5 rounded-full border-2 border-red-200 flex items-center justify-center flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-300" />
                  </div>
                  {step}
                </motion.li>
              ))}
            </ul>
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-400 font-600">Total prep time</span>
              <span className="text-red-500 font-800 text-lg">45–60 minutes</span>
            </div>
          </div>

          {/* With */}
          <div className="p-5 sm:p-8 lg:p-10 relative overflow-hidden"
            style={{ background: 'linear-gradient(145deg, #050f07 0%, #071208 40%, #0d2416 100%)' }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(circle at 70% 30%, rgba(74,222,128,0.07), transparent 60%)' }} />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-7">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-xs font-700 tracking-widest text-green-400/70 uppercase">With Samachify</span>
              </div>
              <ul className="space-y-3">
                {afterSteps.map((step, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 16 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.55 + i * 0.1 }}
                    className="flex items-center gap-3 text-green-100 text-sm"
                  >
                    <CheckCircle size={18} className="text-green-400 flex-shrink-0" />
                    {step}
                  </motion.li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                <span className="text-sm text-green-100/50 font-600">Time saved</span>
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  className="text-green-400 font-black text-3xl"
                >
                  70–80%
                </motion.span>
              </div>
              <Link to="/products"
                className="inline-flex items-center gap-2 mt-7 px-5 py-3 rounded-xl font-700 text-sm transition-all duration-250 hover:-translate-y-0.5"
                style={{ background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.35)', color: '#4ade80' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(74,222,128,0.25)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(74,222,128,0.15)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(74,222,128,0.15)'; e.currentTarget.style.boxShadow = '' }}
              >
                Discover Our Solution <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── 3. SOLUTION ──────────────────────────────────────────────────────────────
function SolutionSection() {
  const solutions = [
    { icon: Sprout, num: '01', title: 'Farm-Sourced Ingredients', desc: 'Fresh vegetables sourced directly from trusted local farmers in Kanchipuram. Same-day processing.' },
    { icon: Microscope, num: '02', title: 'Hygienic Processing', desc: 'Ingredients are cleaned, inspected, and prepared under HACCP-compliant controlled conditions.' },
    { icon: Scissors, num: '03', title: 'Pre-Cut Preparation', desc: 'No washing. No peeling. No chopping. Everything arrives ready for the pan, precisely portioned.' },
    { icon: Package, num: '04', title: 'Smart Portioning', desc: 'Perfect ingredient quantities for the exact dish. No guessing, no excess, no last-minute store runs.' },
    { icon: Recycle, num: '05', title: 'Less Waste', desc: 'Use exactly what you need. Save food. Save money. Our packs reduce food waste by up to 90%.' },
    { icon: ChefHat, num: '06', title: 'Ready To Cook', desc: 'Authentic South Indian dishes — sambar, kuzhambu, chutneys — made easier than ever before.' },
  ]

  return (
    <section className="py-14 sm:py-28 overflow-hidden relative"
      style={{ background: 'linear-gradient(160deg, #030A04 0%, #071408 55%, #0A1E0D 100%)' }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(34,197,94,0.06), transparent 65%)' }} />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
            <Leaf size={13} className="text-green-400" />
            <span className="text-green-400 text-xs font-700 tracking-widest uppercase">Our Solution</span>
          </div>
          <h2 className="font-display font-black text-white tracking-tighter mb-5 leading-[1.05]"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
            From Farm{' '}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #4ade80, #22c55e)' }}>
              To Pan
            </span>
          </h2>
          <p className="text-green-100/45 text-lg max-w-2xl mx-auto leading-relaxed">
            Making traditional South Indian cooking simple, fresh, and convenient for every household.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {solutions.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                className="group relative overflow-hidden rounded-3xl transition-all duration-400 hover:-translate-y-1.5"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(74,222,128,0.06)'
                  e.currentTarget.style.border = '1px solid rgba(74,222,128,0.16)'
                  e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.25)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.06)'
                  e.currentTarget.style.boxShadow = ''
                }}
              >
                <div className="absolute top-2 right-4 font-display font-black select-none pointer-events-none"
                  style={{ fontSize: '5.5rem', lineHeight: 1, color: 'rgba(255,255,255,0.03)' }}>
                  {s.num}
                </div>
                <div className="p-5 sm:p-7 relative z-10">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 sm:mb-5"
                    style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>
                    <Icon size={20} className="text-green-400" />
                  </div>
                  <h3 className="font-700 text-white text-base mb-2.5 leading-snug">{s.title}</h3>
                  <p className="text-green-100/45 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── 4. HOW IT WORKS ──────────────────────────────────────────────────────────
function HowItWorksSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const lineRef = useRef<HTMLDivElement>(null)
  const lineInView = useInView(lineRef, { once: true, margin: '-40px' })

  const steps = [
    { icon: Sprout, title: 'Fresh Ingredients Sourced', desc: 'We carefully select and source vegetables from trusted local farmers in Kanchipuram, Tamil Nadu. Harvested fresh, every day.' },
    { icon: Microscope, title: 'HACCP-Compliant Processing', desc: 'Ingredients are cleaned, sanitised, and inspected under strict food safety protocols. Every batch is logged for full traceability.' },
    { icon: Package, title: 'Packed for Convenience', desc: 'Pre-cut vegetables and dish-specific ingredients are packed together using Modified Atmosphere Packaging technology.' },
    { icon: ChefHat, title: 'Cook & Enjoy', desc: 'Open the kit, follow the simple step-by-step recipe guide, and enjoy authentic South Indian food — no experience needed.' },
    { icon: Users, title: 'Share the Experience', desc: 'Cook for family, friends, and yourself. Tag us on Instagram and join a growing community of home chefs rediscovering tradition.' },
  ]

  const uniqueFeatures = [
    { icon: Flame, text: 'Semi-Cooked Essentials Included' },
    { icon: ChefHat, text: 'One-Pot Recipes' },
    { icon: Video, text: 'Guided Recipe Videos' },
    { icon: GraduationCap, text: 'No Experience Needed' },
    { icon: Package, text: 'Single, Dual & Family Packs' },
  ]

  return (
    <section ref={ref} className="py-14 sm:py-28 overflow-hidden" style={{ background: '#FAFAF8' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-20"
        >
          <SectionLabel icon={Zap} text="How It Works" />
          <h2 className="font-display font-black text-gray-900 tracking-tighter mb-5 leading-[1.05]"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
            How Samachify{' '}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #16a34a, #4ade80)' }}>
              Works
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">From sourcing to your table — in 5 simple steps</p>
        </motion.div>

        {/* Animated timeline */}
        <div className="relative" ref={lineRef}>
          {/* Animated vertical line */}
          <div className="absolute left-6 sm:left-8 top-8 bottom-8 w-0.5 hidden sm:block overflow-hidden rounded-full">
            <motion.div
              className="absolute inset-0 origin-top"
              style={{ background: 'linear-gradient(to bottom, #4ade80, #16a34a, rgba(22,163,74,0.1))' }}
              initial={{ scaleY: 0 }}
              animate={lineInView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            />
          </div>

          <div className="space-y-5">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="flex gap-5 sm:gap-8 items-start group"
                >
                  {/* Step node */}
                  <div className="relative flex-shrink-0 z-10">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-white border-2 border-green-200 flex items-center justify-center shadow-sm group-hover:border-green-400 transition-all duration-300"
                      style={{ boxShadow: '0 4px 14px rgba(34,197,94,0.1)' }}>
                      <Icon size={20} className="text-green-600" />
                    </div>
                  </div>

                  {/* Card */}
                  <div
                    className="flex-1 bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 group-hover:border-green-100 group-hover:-translate-y-0.5 transition-all duration-300"
                    style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.05)' }}
                  >
                    <h3 className="font-700 text-gray-900 text-base sm:text-lg mb-2 leading-snug">{step.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* What makes it easy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.55 }}
          className="mt-14 rounded-3xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #071208, #0d2416)', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
        >
          <div className="p-5 sm:p-8">
            <div className="text-xs font-700 tracking-widest text-green-400/60 uppercase text-center mb-6">What Makes It Easy?</div>
            <div className="flex flex-wrap justify-center gap-3">
              {uniqueFeatures.map((f, i) => {
                const Icon = f.icon
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.6 + i * 0.07, duration: 0.4 }}
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl"
                    style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.15)' }}
                  >
                    <Icon size={14} className="text-green-400" />
                    <span className="text-green-100/80 text-sm font-600">{f.text}</span>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── 5. FEATURED PRODUCTS ─────────────────────────────────────────────────────
function FeaturedProductsSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="py-14 sm:py-28 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #030A04 0%, #071408 55%, #0A1E0D 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full mb-4">
              <Package size={12} className="text-green-400" />
              <span className="text-green-400 text-xs font-700 tracking-wide uppercase">Our Products</span>
            </div>
            <h2 className="font-display font-black text-white tracking-tighter"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)' }}>
              Authentic South Indian{' '}
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg, #4ade80, #22c55e)' }}>
                Meal Kits
              </span>
            </h2>
            <p className="text-green-100/35 mt-2 text-sm">Five dish-specific packs. No prep, no waste — ready in minutes.</p>
          </div>
          <Link to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-green-500/30 hover:border-green-400/60 text-green-300/80 hover:text-green-200 font-700 rounded-xl text-sm transition-all whitespace-nowrap hover:bg-green-500/10">
            View All Products <ArrowRight size={14} />
          </Link>
        </motion.div>

        {/* Mobile product list — 2-col grid, hidden on sm+ */}
        <div className="sm:hidden grid grid-cols-2 gap-3 mb-6">
          {products.slice(0, 4).map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative rounded-2xl overflow-hidden"
              style={{ height: '190px' }}
            >
              <img src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(2,8,4,0.95) 0%, rgba(2,8,4,0.4) 50%, transparent 85%)' }} />
              {p.spiceLevel && (
                <div className="absolute top-2.5 right-2.5">
                  <span className={`text-[9px] font-700 px-2 py-0.5 rounded-full border backdrop-blur-sm ${
                    p.spiceLevel === 'Hot' ? 'bg-red-50/90 text-red-600 border-red-200' :
                    p.spiceLevel === 'Medium' ? 'bg-amber-50/90 text-amber-700 border-amber-200' :
                    'bg-green-50/90 text-green-700 border-green-200'
                  }`}>{p.spiceLevel}</span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="flex items-center gap-1 mb-1.5">
                  <Clock size={8} className="text-green-400" />
                  <span className="text-[9px] font-700 text-white/70">{p.cookTime}</span>
                </div>
                <h3 className="font-display font-800 text-white text-[0.78rem] tracking-tight leading-tight mb-2 line-clamp-1">{p.name}</h3>
                <Link to={`/products/${p.id}`} className="inline-flex items-center gap-1 text-green-400 font-700 text-[10px]">
                  View <ArrowRight size={9} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bento grid — hidden on mobile, shown on sm+ */}
        <div
          className="hidden sm:grid gap-3"
          style={{ gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, 270px)' }}
        >
          {/* Card 1 — large hero (spans 2 rows, 1st col) */}
          <motion.div
            className="row-span-2 group relative rounded-3xl overflow-hidden cursor-pointer"
            initial={{ opacity: 0, x: -36 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            style={{ gridColumn: '1', gridRow: '1 / span 2' }}
          >
            <img src={products[0].image} alt={products[0].name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(2,8,4,0.95) 0%, rgba(2,8,4,0.55) 38%, rgba(2,8,4,0.08) 75%, transparent 100%)' }} />
            {/* Top badges */}
            <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
              {products[0].isOnePort && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-xs font-700 text-green-700"
                  style={{ border: '1px solid rgba(134,197,94,0.35)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                  <ChefHat size={10} /> One-Pot
                </span>
              )}
              {products[0].spiceLevel && (
                <span className="px-3 py-1.5 bg-amber-50/95 text-amber-700 border border-amber-200/80 rounded-full text-xs font-700 backdrop-blur-sm"
                  style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                  {products[0].spiceLevel}
                </span>
              )}
            </div>
            {/* Bottom content */}
            <div className="absolute bottom-0 left-0 right-0 p-7">
              <div className="flex items-center gap-2 mb-3.5">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full backdrop-blur-sm"
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)' }}>
                  <Clock size={10} className="text-green-400" />
                  <span className="text-xs font-700 text-white">{products[0].cookTime}</span>
                </div>
                {products[0].dietType && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full backdrop-blur-sm"
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)' }}>
                    <Leaf size={9} className="text-green-400" />
                    <span className="text-xs font-700 text-white">{products[0].dietType}</span>
                  </div>
                )}
              </div>
              <h3 className="font-display font-black text-white tracking-tight mb-1.5"
                style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2rem)' }}>
                {products[0].name}
              </h3>
              <p className="text-white/45 text-xs leading-relaxed mb-5 line-clamp-2 max-w-xs">{products[0].description}</p>
              <Link to={`/products/${products[0].id}`}
                className="group/btn inline-flex items-center gap-2.5 px-5 py-2.5 bg-green-500 hover:bg-green-400 text-white font-700 rounded-xl text-sm transition-all duration-250"
                style={{ boxShadow: '0 4px 18px rgba(34,197,94,0.35)' }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(34,197,94,0.5)' }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 18px rgba(34,197,94,0.35)' }}
              >
                View Recipe
                <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Cards 2–5 — regular sized, fill the 2×2 right area */}
          {products.slice(1, 5).map((p, i) => (
            <motion.div key={p.id}
              className="group relative rounded-3xl overflow-hidden cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.12 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <img src={p.image} alt={p.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.07]" />
              <div className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(2,8,4,0.92) 0%, rgba(2,8,4,0.35) 45%, transparent 80%)' }} />

              {/* Spice badge */}
              {p.spiceLevel && (
                <div className="absolute top-3.5 right-3.5">
                  <span className={`text-[10px] font-700 px-2.5 py-1 rounded-full border backdrop-blur-sm shadow-sm ${
                    p.spiceLevel === 'Hot' ? 'bg-red-50/95 text-red-600 border-red-200' :
                    p.spiceLevel === 'Medium' ? 'bg-amber-50/95 text-amber-700 border-amber-200' :
                    'bg-green-50/95 text-green-700 border-green-200'
                  }`}>{p.spiceLevel}</span>
                </div>
              )}

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full backdrop-blur-sm"
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.16)' }}>
                    <Clock size={9} className="text-green-400" />
                    <span className="text-[10px] font-700 text-white">{p.cookTime}</span>
                  </div>
                </div>
                <h3 className="font-display font-800 text-white tracking-tight text-sm leading-tight mb-2">{p.name}</h3>
                <Link to={`/products/${p.id}`}
                  className="group/btn inline-flex items-center gap-1.5 text-green-400 hover:text-green-300 font-700 text-xs transition-all duration-200">
                  View Recipe <ArrowRight size={11} className="group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom trust strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-8 mt-10 pt-10 border-t border-white/[0.07]"
        >
          {[
            { icon: Shield, text: 'FSSAI Certified' },
            { icon: Leaf, text: 'No Preservatives' },
            { icon: Flame, text: 'No Artificial Colours' },
            { icon: ChefHat, text: '5 Authentic Recipes' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-xs font-600" style={{ color: 'rgba(187,247,208,0.3)' }}>
              <Icon size={13} style={{ color: 'rgba(74,222,128,0.45)' }} />
              {text}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── 6. WHY CHOOSE (BENTO GRID) ───────────────────────────────────────────────
function WhyChooseSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="py-14 sm:py-28 overflow-hidden" style={{ background: '#FAFAF8' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10 sm:mb-14"
        >
          <SectionLabel icon={Star} text="Why Samachify" />
          <h2 className="font-display font-black text-gray-900 tracking-tighter mb-4"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}>
            What Makes Samachify Different?
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            We don&apos;t just cut vegetables. We preserve tradition and make it accessible for everyone.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          style={{ gridAutoRows: 'minmax(160px, auto)' }}
        >
          {/* Hero cell — 2 cols × 2 rows */}
          <div
            className="col-span-2 row-span-2 p-6 sm:p-8 lg:p-10 rounded-3xl text-white flex flex-col justify-between relative overflow-hidden"
            style={{ background: 'linear-gradient(145deg, #071408 0%, #0d2416 100%)' }}
          >
            <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.12), transparent 70%)' }} />
            <div>
              <div className="w-14 h-14 rounded-2xl bg-green-500/15 border border-green-400/20 flex items-center justify-center mb-6">
                <TrendingUp size={26} className="text-green-400" />
              </div>
              <div className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-green-400 leading-none mb-2">70%</div>
              <div className="font-display font-700 text-white text-lg sm:text-2xl mb-3 sm:mb-4">Time Saved</div>
              <p className="text-green-100/50 text-sm leading-relaxed max-w-xs">
                From 45 minutes of chopping and prep to just 15–30 minutes. Every Samachify pack eliminates the prep entirely.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-6">
              <CheckCircle size={15} className="text-green-400" />
              <span className="text-green-300/70 text-sm font-600">Verified by our early customers</span>
            </div>
          </div>

          {/* Cell 2 */}
          <motion.div custom={1} initial="hidden" animate={inView ? 'show' : 'hidden'} variants={fadeUp}
            className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm card-hover">
            <Flame size={24} className="text-orange-500 mb-4" />
            <div className="font-700 text-gray-900 mb-1.5">Semi-Cooked Essentials</div>
            <p className="text-gray-500 text-sm">Dal and tamarind extract already prepared. Saves 20 minutes of cooking.</p>
          </motion.div>

          {/* Cell 3 */}
          <motion.div custom={2} initial="hidden" animate={inView ? 'show' : 'hidden'} variants={fadeUp}
            className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm card-hover">
            <ChefHat size={24} className="text-green-600 mb-4" />
            <div className="font-700 text-gray-900 mb-1.5">One-Pot Recipes</div>
            <p className="text-gray-500 text-sm">Less cooking effort. Less cleaning. Most dishes need just one pot.</p>
          </motion.div>

          {/* Cell 4 */}
          <motion.div custom={3} initial="hidden" animate={inView ? 'show' : 'hidden'} variants={fadeUp}
            className="p-6 rounded-3xl bg-green-50 border border-green-100 shadow-sm card-hover">
            <GraduationCap size={24} className="text-green-700 mb-4" />
            <div className="font-700 text-gray-900 mb-1.5">No Experience Needed</div>
            <p className="text-gray-500 text-sm">Beginner-friendly instructions. Anyone can cook authentic South Indian food.</p>
          </motion.div>

          {/* Cell 5 */}
          <motion.div custom={4} initial="hidden" animate={inView ? 'show' : 'hidden'} variants={fadeUp}
            className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm card-hover">
            <Video size={24} className="text-blue-500 mb-4" />
            <div className="font-700 text-gray-900 mb-1.5">Guided Recipe Videos</div>
            <p className="text-gray-500 text-sm">Step-by-step video guidance. Cook with confidence every single time.</p>
          </motion.div>

          {/* Cell 6 — full width strip */}
          <motion.div custom={5} initial="hidden" animate={inView ? 'show' : 'hidden'} variants={fadeUp}
            className="col-span-2 lg:col-span-4 p-5 sm:p-6 lg:p-8 rounded-3xl relative overflow-hidden"
            style={{ background: 'linear-gradient(110deg, #071408 0%, #0d2416 50%, #071a0b 100%)' }}
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 60% 50%, rgba(74,222,128,0.07), transparent 65%)' }} />
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <div className="text-[10px] font-700 text-green-400/60 tracking-widest uppercase mb-2">Exclusively South Indian</div>
                <div className="font-display font-800 text-white text-xl mb-1">Authentic South Indian — Only</div>
                <div className="text-green-100/45 text-sm max-w-md">We specialise exclusively in traditional South Indian recipes. No generic meal kits. No compromises. Only what your grandmother would recognise.</div>
              </div>
              <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
                {[
                  { num: '5+', label: 'Authentic Dishes' },
                  { num: '0', label: 'Preservatives' },
                  { num: '100%', label: 'Farm Fresh' },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="font-display font-black text-2xl sm:text-3xl text-green-400 leading-none">{s.num}</div>
                    <div className="text-green-300/50 text-[10px] font-600 mt-1 uppercase tracking-wide">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── 7. TECH HIGHLIGHTS ───────────────────────────────────────────────────────
function TechHighlightsSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const techs = [
    { icon: Shield, title: 'HACCP Certified', desc: 'International food safety standard applied at every stage of our production process.' },
    { icon: Thermometer, title: 'Cold Chain 2–8°C', desc: 'Unbroken refrigeration from processing facility to your doorstep.' },
    { icon: Package, title: 'MAP Technology', desc: 'Modified atmosphere preserves freshness without chemicals or preservatives.' },
    { icon: FlaskConical, title: 'Quality Control', desc: 'Multi-point inspection — visual, weight, seal integrity — before every pack ships.' },
  ]

  return (
    <section
      ref={ref}
      className="py-14 sm:py-28 relative overflow-hidden grain"
      style={{ background: 'linear-gradient(160deg, #040C06 0%, #071408 60%, #0A1E0D 100%)' }}
    >
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(34,197,94,0.05), transparent 70%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10 sm:mb-16"
        >
          <SectionLabelDark icon={Microscope} text="Our Technology" />
          <h2 className="font-display font-black text-white tracking-tighter mb-5 leading-[1.05]"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
            Freshness.{' '}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #4ade80, #22c55e)' }}>
              Safety.
            </span>{' '}
            Quality.
          </h2>
          <p className="text-green-100/45 text-lg max-w-2xl mx-auto leading-relaxed">
            Advanced food processing technology ensures every pack is safe, fresh, and as close to farm-sourced as possible.
          </p>
        </motion.div>

        {/* Stat strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-px mb-12 rounded-2xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          {[
            { num: '4', label: 'Quality Checkpoints', suffix: '' },
            { num: '2–8', label: 'Cold Chain °C', suffix: '' },
            { num: '0', label: 'Preservatives Used', suffix: '' },
            { num: '100', label: 'Farm Traceability', suffix: '%' },
          ].map((s, i) => (
            <div key={i} className="py-5 px-6 text-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="font-display font-black text-green-400 leading-none mb-1.5" style={{ fontSize: '2rem' }}>
                {s.num}<span className="text-lg">{s.suffix}</span>
              </div>
              <div className="text-green-100/35 text-xs font-600 uppercase tracking-wide">{s.label}</div>
            </div>
          ))}
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {techs.map((t, i) => {
            const Icon = t.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group p-7 rounded-3xl transition-all duration-300 hover:-translate-y-1.5"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(74,222,128,0.07)'
                  e.currentTarget.style.border = '1px solid rgba(74,222,128,0.18)'
                  e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)'
                  e.currentTarget.style.boxShadow = ''
                }}
              >
                <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 group-hover:bg-green-500/20 flex items-center justify-center mb-5 transition-colors">
                  <Icon size={22} className="text-green-400" />
                </div>
                <h3 className="font-700 text-white mb-2.5">{t.title}</h3>
                <p className="text-green-100/45 text-sm leading-relaxed">{t.desc}</p>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-10 text-center"
        >
          <Link to="/technology"
            className="inline-flex items-center gap-2 px-7 py-3.5 text-white font-700 rounded-xl text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', boxShadow: '0 0 24px rgba(34,197,94,0.3)' }}>
            Explore Our Technology <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// ─── 8. TESTIMONIALS ──────────────────────────────────────────────────────────
function TestimonialsSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="py-14 sm:py-28 overflow-hidden" style={{ background: '#FAFAF8' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10 sm:mb-16"
        >
          <SectionLabel icon={Quote} text="Testimonials" />
          <h2 className="font-display font-black text-gray-900 tracking-tighter mb-5 leading-[1.05]"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
            What Our{' '}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #16a34a, #4ade80)' }}>
              Customers Say
            </span>
          </h2>
          {/* Aggregate rating */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-amber-50 border border-amber-200/60 rounded-full">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="text-amber-700 font-700 text-sm">5.0</span>
            <span className="text-amber-600/60 text-sm">· Verified early customers</span>
          </div>
        </motion.div>

        {/* Featured testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="rounded-2xl sm:rounded-3xl overflow-hidden mb-5 relative"
          style={{ background: 'linear-gradient(140deg, #050f07 0%, #071208 45%, #0d2416 100%)' }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 80% 50%, rgba(74,222,128,0.07), transparent 60%)' }} />
          <div className="relative z-10 p-6 sm:p-8 lg:p-12 grid lg:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div>
              <div className="flex items-center gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <Quote size={32} className="text-green-400/30 mb-4" />
              <p className="text-white/85 text-lg leading-relaxed italic font-500 mb-7">
                {testimonials[0].text}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-700 flex-shrink-0">
                  {testimonials[0].initials}
                </div>
                <div>
                  <div className="font-700 text-white">{testimonials[0].name}</div>
                  <div className="text-green-300/50 text-sm">{testimonials[0].location}</div>
                </div>
              </div>
            </div>
            {/* Right side stat */}
            <div className="hidden lg:flex flex-col items-center justify-center text-center">
              <div className="font-display font-black text-green-400 leading-none mb-2" style={{ fontSize: '6rem' }}>30</div>
              <div className="text-white/50 text-lg font-600">minutes to a</div>
              <div className="text-white font-700 text-xl">proper South Indian meal</div>
              <div className="mt-6 text-green-300/40 text-sm">down from 45–60 min of prep</div>
            </div>
          </div>
        </motion.div>

        {/* Remaining testimonials grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.slice(1, 6).map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-3xl p-6 border border-gray-100 flex flex-col hover:-translate-y-1 transition-all duration-300"
              style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.1)' }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.05)' }}
            >
              <div className="flex items-center gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={13} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-5 italic">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-xs font-700 flex-shrink-0">
                  {t.initials}
                </div>
                <div>
                  <div className="font-700 text-gray-900 text-sm">{t.name}</div>
                  <div className="text-gray-400 text-xs">{t.location}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── 9. FAQ ───────────────────────────────────────────────────────────────────
function FAQSection() {
  const [open, setOpen] = useState<string | null>(null)
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="py-14 sm:py-28 bg-white overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <SectionLabel icon={MessageCircle} text="FAQ" />
          <h2 className="font-display font-black text-gray-900 tracking-tighter"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}>
            Frequently Asked Questions
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.id} custom={i}
              initial="hidden" animate={inView ? 'show' : 'hidden'} variants={fadeUp}
              className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm"
            >
              <button
                onClick={() => setOpen(open === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-gray-50/70 transition-colors"
              >
                <span className="font-600 text-gray-900 text-sm leading-snug">{faq.question}</span>
                <span className="flex-shrink-0">
                  {open === faq.id
                    ? <ChevronUp size={18} className="text-green-600" />
                    : <ChevronDown size={18} className="text-gray-400" />}
                </span>
              </button>
              <AnimateContent open={open === faq.id}>
                <div className="px-6 pb-5">
                  <p className="text-gray-500 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              </AnimateContent>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AnimateContent({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <motion.div
      initial={false}
      animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{ overflow: 'hidden' }}
    >
      {children}
    </motion.div>
  )
}

// ─── 12. CONTACT CTA ──────────────────────────────────────────────────────────
function ContactCTASection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section
      ref={ref}
      className="py-14 sm:py-28 relative overflow-hidden grain"
      style={{ background: 'linear-gradient(145deg, #040C06 0%, #071408 60%, #0A1E0D 100%)' }}
    >
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(34,197,94,0.08), transparent 70%)' }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}>
          <SectionLabelDark icon={Sprout} text="Get In Touch" />
          <h2 className="font-display font-black text-white tracking-tighter mb-5"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
            Ready to cook tradition<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #4ade80, #22c55e)' }}>
              in minutes?
            </span>
          </h2>
          <p className="text-green-100/45 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            We&apos;re launching soon in Chennai. Get early access, ask a question, or just say hello.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link to="/products"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-green-500 hover:bg-green-400 text-black font-700 rounded-xl transition-all hover:scale-105 text-sm w-full sm:w-auto justify-center">
              Explore Products <ArrowRight size={15} />
            </Link>
            <a
              href="https://wa.me/917305264055?text=Hi%2C%20I%27m%20interested%20in%20Samachify!"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 font-700 rounded-xl transition-all duration-250 text-sm hover:-translate-y-0.5 w-full sm:w-auto justify-center"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.28)', color: '#fff' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.25)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.boxShadow = '' }}
            >
              <MessageCircle size={15} /> Chat on WhatsApp
            </a>
            <Link to="/contact"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 font-700 rounded-xl transition-all duration-250 text-sm hover:-translate-y-0.5 w-full sm:w-auto justify-center"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.85)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)' }}
            >
              <Mail size={15} /> Contact Us
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <main className="overflow-x-hidden">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <HowItWorksSection />
        <FeaturedProductsSection />
        <WhyChooseSection />
        <TechHighlightsSection />
        <TestimonialsSection />
        <FAQSection />
        <ContactCTASection />
      </main>
      <Footer />
    </>
  )
}
