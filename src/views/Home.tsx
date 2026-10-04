'use client'

import { useEffect, useState, useRef } from 'react'
import { Link } from '@/lib/nav'
import { motion, useInView, type Variants } from 'framer-motion'
import {
  ArrowRight, CheckCircle, ChevronDown, ChevronUp, Play,
  Clock, Shield, Sprout, Zap, Star, Package, ChefHat,
  Flame, GraduationCap, Video, AlertTriangle,
  Scissors, Microscope, Thermometer,
  TrendingUp, Mail, MessageCircle,
  Quote, Leaf, FlaskConical, Droplets, Smartphone, Download, X, PackageCheck,
} from 'lucide-react'
import ReviewMarquee from '@/components/ReviewMarquee'
import { products } from '../data/products'
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
  const [showAppPrompt, setShowAppPrompt] = useState(true)

  useEffect(() => {
    setShowAppPrompt(sessionStorage.getItem('samachify-app-prompt') !== 'dismissed')
  }, [])

  return (
    <section className="relative overflow-hidden bg-[#f7fbee]" style={{ minHeight: '100svh' }}>

      {/* ── One clear Sambar hero — no carousel ─────────────────── */}
      <motion.div
        className="absolute inset-y-0 right-0 h-full w-full sm:w-[72%] lg:w-[70%] xl:w-[68%]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <img
          src="/assets/hero-sambar-meal.webp"
          alt="Samachify Sambar Pack with freshly cooked sambar"
          className="h-full w-full object-cover"
          style={{ objectPosition: '62% center', filter: 'saturate(1.04) contrast(1.03)' }}
        />
      </motion.div>

      {/* ── Cream overlay — mobile: soft full-screen; desktop: directional fade ── */}
      <div className="absolute inset-0 z-10 sm:hidden"
        style={{ background: 'linear-gradient(to bottom, #f7fbee 0%, rgba(247,251,238,0.98) 48%, rgba(247,251,238,0.82) 63%, rgba(247,251,238,0.34) 78%, rgba(247,251,238,0.08) 90%, transparent 100%)' }} />
      <div className="absolute inset-0 z-10 hidden sm:block"
        style={{
          background: 'linear-gradient(to right, #f7fbee 0%, #f7fbee 30%, rgba(247,251,238,0.96) 38%, rgba(247,251,238,0.68) 46%, rgba(247,251,238,0.16) 56%, transparent 64%)',
        }}
      />
      {/* Bottom softener */}
      <div
        className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
        style={{ height: '64px', background: 'linear-gradient(to top, rgba(247,251,238,0.18), transparent)' }}
      />

      {/* ── Text content ─────────────────────────────────────────── */}
      <div
        className="relative z-20 flex flex-col justify-center w-full sm:max-w-[52%] lg:max-w-[50%] 2xl:max-w-[46%]"
        style={{
          minHeight: '100svh',
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
            Fresh South Indian
          </div>
          <div className="text-green-600/70 font-700 tracking-[0.2em] uppercase mt-1" style={{ fontSize: '0.68rem' }}>
            Ingredient Meal Kits
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
            className="text-gray-900 block sm:whitespace-nowrap"
            initial={{ opacity: 0, y: 52 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            Real South Indian Food.
          </motion.span>
          <motion.span
            className="text-gray-900 block"
            initial={{ opacity: 0, y: 52 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            Without the Prep.
          </motion.span>
          <motion.span
            className="block mt-1.5"
            initial={{ opacity: 0, y: 52 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: 'linear-gradient(130deg, #2a4f07 0%, #498a0c 48%, #9abb50 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Open. Cook. Eat.
          </motion.span>
        </h1>

        {/* Subtext + No Washing row */}
        <motion.div
          initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-7"
        >
          <p className="text-gray-600 mb-4" style={{ fontSize: 'clamp(0.9rem, 1.35vw, 1.05rem)', lineHeight: 1.74, maxWidth: '420px' }}>
            Everything you need to cook your favourite South Indian dishes, already cleaned, cut and measured.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {([
              { icon: Droplets, label: 'Pre-cleaned.' },
              { icon: Scissors, label: 'Pre-cut.' },
              { icon: Package,  label: 'Pre-measured.' },
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
          className="flex flex-wrap gap-3"
        >
          <Link
            to="/products"
            className="group inline-flex items-center gap-2.5 bg-green-600 text-white font-700 rounded-2xl transition-all duration-250 hover:-translate-y-1 hover:bg-green-700"
            style={{ fontSize: '1rem', padding: '1.05rem 2.3rem', boxShadow: '0 4px 22px rgba(73,138,12,0.34)' }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 14px 36px rgba(73,138,12,0.44)')}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 4px 22px rgba(73,138,12,0.34)')}
          >
            Explore Products
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2.5 bg-white/90 border border-gray-200 text-gray-800 font-700 rounded-2xl transition-all duration-250 hover:-translate-y-1 hover:border-green-300 hover:bg-white"
            style={{ fontSize: '1rem', padding: '1.05rem 2.3rem', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,0,0,0.12)')}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.07)')}
          >
            <span className="w-6 h-6 rounded-full bg-green-50 border border-green-200 flex items-center justify-center flex-shrink-0">
              <span className="w-0 h-0 border-t-[4.5px] border-t-transparent border-b-[4.5px] border-b-transparent border-l-[8px] border-l-green-600 ml-0.5" />
            </span>
            How It Works
          </a>
        </motion.div>

        {/* Samachify app prompt — inline on phones so mobile browser controls never cover it. */}
        {showAppPrompt && (
          <motion.aside
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.5, delay: 0.78, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-30 mt-6 flex w-full items-center gap-3 overflow-hidden rounded-2xl border border-green-200 bg-white/95 p-3 pr-9 shadow-[0_14px_40px_rgba(18,45,4,0.18)] backdrop-blur-md sm:fixed sm:bottom-6 sm:left-auto sm:right-6 sm:mt-0 sm:max-w-[430px] sm:shadow-[0_18px_60px_rgba(18,45,4,0.24)]"
            aria-label="Samachify Android app download"
          >
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-green-900 p-1 shadow-sm sm:h-12 sm:w-12 sm:p-1.5">
              <img src="/assets/logo.png" alt="" className="h-full w-full rounded-full object-cover" />
              <span className="absolute -bottom-0.5 -right-0.5 grid h-5 w-5 place-items-center rounded-full border-2 border-white bg-green-600 text-white">
                <Smartphone size={10} strokeWidth={2.5} />
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-800 uppercase tracking-[0.16em] text-green-600">Samachify for Android</p>
              <p className="mt-0.5 text-sm font-800 leading-tight text-gray-900">Order faster with the Samachify app</p>
              <p className="mt-1 text-[11px] leading-tight text-gray-500">Download the Android app</p>
            </div>
            <a
              href="/app"
              className="group inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-green-600 px-3 py-2.5 text-xs font-800 text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-green-700"
              aria-label="Download the Samachify app for Android"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Download</span>
            </a>
            <button
              type="button"
              onClick={() => {
                sessionStorage.setItem('samachify-app-prompt', 'dismissed')
                setShowAppPrompt(false)
              }}
              className="absolute right-2 top-2 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              aria-label="Dismiss app download prompt"
            >
              <X size={13} />
            </button>
          </motion.aside>
        )}

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
        <Leaf size={28} style={{ color: 'rgba(193,255,114,0.55)', filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.12))' }} />
      </motion.div>
      <motion.div className="absolute right-[22%] bottom-[22%] pointer-events-none z-20 hidden lg:block"
        animate={{ y: [0, 10, 0], rotate: [-36, -22, -36] }}
        transition={{ duration: 4.0, repeat: Infinity, ease: 'easeInOut', delay: 1.3 }}>
        <Leaf size={20} style={{ color: 'rgba(154,187,80,0.45)' }} />
      </motion.div>

    </section>
  )
}

// ─── 2. PROOF CARDS ──────────────────────────────────────────────────────────
function ProofCardsSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  const proofPoints = [
    { icon: Clock, value: '10–15 Min', label: 'Cooking Time', detail: 'From pack to plate' },
    { icon: Sprout, value: '100%', label: 'Farm Fresh', detail: 'Ingredients prepared fresh' },
    { icon: Shield, value: '0%', label: 'Preservatives', detail: 'Freshness without shortcuts' },
    { icon: ChefHat, value: '4', label: 'Authentic Recipes', detail: 'South Indian favourites' },
  ]

  return (
    <section ref={ref} className="relative overflow-visible pb-12 pt-8 sm:pb-20 sm:pt-12" style={{ background: '#f7fbef' }}>
      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-3xl border border-green-100 bg-white shadow-[0_18px_60px_rgba(31,72,10,0.10)]"
        >
          <div className="flex flex-col gap-2 border-b border-green-100 px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-8 sm:py-6">
            <div>
              <p className="text-[11px] font-800 uppercase tracking-[0.18em] text-green-600">Why Samachify</p>
              <h2 className="mt-1 font-display text-xl font-800 tracking-tight text-gray-900 sm:text-2xl">Fresh food, with the prep already done.</h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-gray-500">Everything is prepared around one goal: helping you cook a proper meal with less time and effort.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4">
            {proofPoints.map(({ icon: Icon, value, label, detail }, index) => (
              <motion.div
                key={label}
                custom={index}
                initial="hidden"
                animate={inView ? 'show' : 'hidden'}
                variants={fadeUp}
                className={`group relative min-h-[168px] p-5 sm:min-h-[182px] sm:p-7 ${
                  index % 2 === 0 ? 'border-r border-green-100' : ''
                } ${index < 2 ? 'border-b border-green-100 lg:border-b-0' : ''} ${
                  index === 1 ? 'lg:border-r' : ''
                } ${index === 2 ? 'lg:border-r' : ''}`}
              >
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-2xl border border-green-200 bg-green-50 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-green-100 sm:h-11 sm:w-11">
                  <Icon size={19} className="text-green-700" />
                </div>
                <div className="font-display text-2xl font-800 leading-none tracking-tight text-gray-900 sm:text-[1.75rem]">{value}</div>
                <div className="mt-2 text-sm font-700 text-gray-800">{label}</div>
                <div className="mt-1 text-xs leading-relaxed text-gray-400">{detail}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── 3. PREPARATION PROMISE BANNER ───────────────────────────────────────────
function ValueBannerSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="overflow-hidden pb-14 sm:pb-28" style={{ background: '#f7fbef' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative min-h-[430px] overflow-hidden rounded-3xl sm:min-h-[390px]"
          style={{ boxShadow: '0 24px 70px rgba(11,22,6,0.18)' }}
        >
          <img
            src="/assets/product-kitchen-1.jpg"
            alt="Samachify Sambar Pack with fresh prepared ingredients"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: '62% center' }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(90deg, rgba(5,13,3,0.98) 0%, rgba(8,22,4,0.94) 38%, rgba(8,22,4,0.62) 57%, rgba(8,22,4,0.10) 100%)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent lg:hidden" />

          <div className="relative z-10 flex min-h-[430px] max-w-2xl flex-col justify-center px-6 py-10 sm:min-h-[390px] sm:px-10 lg:px-14">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-green-300/25 bg-green-200/10 px-3.5 py-1.5 backdrop-blur-sm">
              <PackageCheck size={13} className="text-green-300" />
              <span className="text-[11px] font-700 uppercase tracking-[0.16em] text-green-200">The Samachify Promise</span>
            </div>
            <h2 className="max-w-xl font-display text-3xl font-black leading-[1.08] tracking-tighter text-white sm:text-4xl lg:text-5xl">
              You handle the cooking.<br />
              <span className="text-green-300">We handle the preparation.</span>
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-green-50/70 sm:text-lg">
              Pre-cleaned. Pre-cut. Pre-measured. Ready for the pan.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/products/sambar-pack"
                className="group inline-flex items-center gap-2.5 rounded-xl bg-green-300 px-5 py-3 text-sm font-800 text-green-950 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-200"
              >
                Explore Sambar Pack
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <span className="inline-flex items-center gap-2 text-xs font-600 text-green-100/65">
                <Clock size={14} className="text-green-300" /> Ready in about 10–15 minutes
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── 10. PREPARATION PROBLEM ─────────────────────────────────────────────────
function ProblemSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const beforeSteps = ['Buy Vegetables from market', 'Wash under running water (10 min)', 'Peel and cut everything (20 min)', 'Sort & measure ingredients', 'Deal with excess and waste', 'Finally start cooking']
  const afterSteps = ['Open your Samachify kit', 'Follow the step-by-step recipe card', 'Enjoy an authentic South Indian meal']
  const prepFlow = ['Shopping', 'Washing', 'Cutting', 'Measuring', 'Cooking']

  return (
    <section ref={ref} className="py-14 sm:py-28 overflow-hidden" style={{ background: '#f7fbef' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <SectionLabel icon={AlertTriangle} text="The Preparation Problem" />
          <h2 className="font-display font-black text-gray-900 tracking-tighter mb-5 leading-[1.05]"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
            Love Home-Cooked Food.<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #dc2626, #f97316)' }}>
              Hate the Preparation?
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Shopping, washing, cutting and measuring ingredients can take longer than cooking itself.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            {prepFlow.map((step, index) => (
              <span key={step} className="flex items-center gap-2">
                <span className="rounded-full border border-orange-100 bg-white px-3.5 py-1.5 text-xs font-700 uppercase tracking-wide text-gray-600 shadow-sm">
                  {step}
                </span>
                {index < prepFlow.length - 1 && <ArrowRight size={12} className="text-orange-300" />}
              </span>
            ))}
          </div>
        </motion.div>

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
            style={{ background: 'linear-gradient(145deg, #070d03 0%, #0b1606 40%, #152708 100%)' }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(circle at 70% 30%, rgba(193,255,114,0.07), transparent 60%)' }} />
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
                style={{ background: 'rgba(193,255,114,0.15)', border: '1px solid rgba(193,255,114,0.35)', color: '#c1ff72' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(193,255,114,0.25)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(193,255,114,0.15)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(193,255,114,0.15)'; e.currentTarget.style.boxShadow = '' }}
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
    { icon: Sprout, num: '01', title: 'Fresh Ingredients', desc: 'Vegetables are selected from trusted local sourcing partners for every preparation cycle.' },
    { icon: Droplets, num: '02', title: 'Clean & Ready', desc: 'Ingredients are washed, inspected, cut, and prepared before they reach your kitchen.' },
    { icon: Shield, num: '03', title: 'Safe & Fresh', desc: 'Controlled handling and cold-chain practices protect quality from preparation to delivery.' },
    { icon: Package, num: '04', title: 'You Know What You Get', desc: 'See the ingredients, portions, pack information, and cooking steps before you begin.' },
  ]

  return (
    <section className="py-14 sm:py-28 overflow-hidden relative"
      style={{ background: 'linear-gradient(160deg, #050902 0%, #0b1606 55%, #142405 100%)' }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(154,187,80,0.06), transparent 65%)' }} />
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
            <span className="text-green-400 text-xs font-700 tracking-widest uppercase">Why Trust Samachify</span>
          </div>
          <h2 className="font-display font-black text-white tracking-tighter mb-5 leading-[1.05]"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
            Fresh Ingredients.{' '}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #c1ff72, #9abb50)' }}>
              Carefully Prepared.
            </span>
          </h2>
          <p className="text-green-100/45 text-lg max-w-2xl mx-auto leading-relaxed">
            We take care of the preparation so you can cook fresh South Indian food with confidence.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
                  e.currentTarget.style.background = 'rgba(193,255,114,0.06)'
                  e.currentTarget.style.border = '1px solid rgba(193,255,114,0.16)'
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
                    style={{ background: 'rgba(193,255,114,0.1)', border: '1px solid rgba(193,255,114,0.2)' }}>
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
    { icon: Package, title: 'Choose', desc: 'Pick the South Indian dish and serving size that suits your table.' },
    { icon: PackageCheck, title: 'Open', desc: 'Open a pack filled with cleaned, cut, and measured ingredients.' },
    { icon: Sprout, title: 'Add', desc: 'Add each prepared ingredient to the pan in the guided order.' },
    { icon: Flame, title: 'Cook', desc: 'Follow the simple instructions and cook for around 10–15 minutes.' },
    { icon: ChefHat, title: 'Serve', desc: 'Finish, serve hot, and enjoy fresh home-cooked South Indian food.' },
  ]

  const miniFlow = ['Choose Pack', 'Open Pack', 'Add Ingredients', 'Cook', 'Serve']

  const uniqueFeatures = [
    { icon: Flame, text: 'Semi-Cooked Essentials Included' },
    { icon: ChefHat, text: 'One-Pot Recipes' },
    { icon: Video, text: 'Guided Recipe Videos' },
    { icon: GraduationCap, text: 'No Experience Needed' },
    { icon: Package, text: 'Single, Dual & Family Packs' },
  ]

  return (
    <section ref={ref} id="how-it-works" className="py-14 sm:py-28 overflow-hidden" style={{ background: '#f7fbef' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-20"
        >
          <SectionLabel icon={Zap} text="How It Works" />
          <h2 className="font-display font-black text-gray-900 tracking-tighter mb-5 leading-[1.05]"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
            From Pack{' '}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #498a0c, #c1ff72)' }}>
              To Plate
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">Five simple steps between choosing dinner and serving it.</p>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {miniFlow.map((label, i) => (
              <span key={label} className="flex items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-700 uppercase tracking-wide">
                  {label}
                </span>
                {i < miniFlow.length - 1 && <ArrowRight size={12} className="text-green-400" />}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Animated timeline */}
        <div className="relative" ref={lineRef}>
          {/* Animated vertical line */}
          <div className="absolute left-6 sm:left-8 top-8 bottom-8 w-0.5 hidden sm:block overflow-hidden rounded-full">
            <motion.div
              className="absolute inset-0 origin-top"
              style={{ background: 'linear-gradient(to bottom, #c1ff72, #498a0c, rgba(73,138,12,0.1))' }}
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
                      style={{ boxShadow: '0 4px 14px rgba(154,187,80,0.1)' }}>
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
          style={{ background: 'linear-gradient(135deg, #0b1606, #152708)', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
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
                    style={{ background: 'rgba(193,255,114,0.08)', border: '1px solid rgba(193,255,114,0.15)' }}
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

const homepageFaqs = [
  { id: 'home-faq-1', question: 'What comes inside a Samachify pack?', answer: 'You receive the fresh ingredients for the selected dish, already cleaned, cut, measured, and packed with the essential spice components and guided cooking steps.' },
  { id: 'home-faq-2', question: 'What do I need at home?', answer: 'Keep basic cooking oil, water, and salt ready where the recipe calls for them. The main ingredients and recipe-specific preparation are included.' },
  { id: 'home-faq-3', question: 'How long does cooking take?', answer: 'Most Samachify dishes are designed to be cooked in approximately 10–15 minutes.' },
  { id: 'home-faq-4', question: 'Do I need cooking experience?', answer: 'No. The ingredients arrive prepared and the step-by-step instructions are designed for beginners as well as experienced home cooks.' },
  { id: 'home-faq-5', question: 'Are the ingredients fresh and preservative-free?', answer: 'We use fresh ingredients, controlled preparation, and cold-chain handling. Our current meal kits are made without added preservatives.' },
  { id: 'home-faq-6', question: 'How should I store the pack?', answer: 'Keep the pack refrigerated and use it before the date printed on its label.' },
  { id: 'home-faq-7', question: 'Which serving sizes are available?', answer: 'Serving options vary by dish and may include single, two-person, and family packs. The available size is shown before you add a product to your cart.' },
  { id: 'home-faq-8', question: 'Where does Samachify deliver?', answer: 'Delivery is available in selected Chennai service areas. Your exact delivery pin and pincode are checked during checkout.' },
]

// ─── 5. COOKING DEMONSTRATION ───────────────────────────────────────────────
function DemoSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const demoSteps = ['Open the pack', 'Take out the prepared ingredients', 'Add them to the pan', 'Cook with the guided steps', 'Serve fresh and hot']

  return (
    <section ref={ref} id="cooking-demo" className="py-14 sm:py-28 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -34 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl group"
          style={{ minHeight: 'clamp(360px, 48vw, 560px)', boxShadow: '0 28px 70px rgba(11,22,6,0.16)' }}
        >
          <img
            src="/assets/product-kitchen-2.jpg"
            alt="Samachify Sambar Pack ready to be cooked"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,9,2,0.88), rgba(5,9,2,0.05) 65%)' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <Link
              to="/products/sambar-pack"
              className="w-14 h-14 rounded-2xl bg-green-200 text-green-950 flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105 hover:bg-green-100"
              aria-label="See the Sambar Pack cooking guide"
            >
              <Play size={20} fill="currentColor" className="ml-0.5" />
            </Link>
          </div>
          <div className="absolute left-5 right-5 bottom-5 sm:left-7 sm:right-7 sm:bottom-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-700 uppercase tracking-wider text-green-200 backdrop-blur-md">
              <Video size={12} /> Sambar preparation
            </div>
            <h3 className="font-display font-800 text-white text-xl sm:text-2xl mt-3">See the process before you cook.</h3>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionLabel icon={Video} text="Cooking Demo" />
          <h2 className="font-display font-black text-gray-900 tracking-tighter mb-5 leading-[1.05]" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
            See How{' '}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #498a0c, #c1ff72)' }}>
              Easy It Is
            </span>
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed max-w-xl">
            The preparation is completed before the pack reaches you. Your part is simply opening, adding, cooking, and serving.
          </p>

          <div className="grid sm:grid-cols-2 gap-3 mt-8">
            {demoSteps.map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.24 + index * 0.07 }}
                className="flex items-center gap-3 rounded-2xl border border-green-100 bg-green-50/60 p-3.5"
              >
                <span className="w-7 h-7 rounded-xl bg-green-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-800">{index + 1}</span>
                <span className="text-sm font-600 text-gray-700">{step}</span>
              </motion.div>
            ))}
          </div>

          <Link
            to="/products/sambar-pack"
            className="group inline-flex items-center gap-2.5 bg-green-600 text-white font-700 rounded-2xl transition-all duration-250 hover:-translate-y-1 hover:bg-green-700 mt-8"
            style={{ fontSize: '0.95rem', padding: '0.95rem 1.5rem', boxShadow: '0 4px 22px rgba(73,138,12,0.28)' }}
          >
            View Sambar Pack <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// ─── 6. FEATURED PRODUCTS ─────────────────────────────────────────────────────
function FeaturedProductsSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} id="products" className="py-14 sm:py-28 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #050902 0%, #0b1606 55%, #142405 100%)' }}>
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
              What Are You{' '}
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg, #c1ff72, #9abb50)' }}>
                Cooking Today?
              </span>
            </h2>
            <p className="text-green-100/35 mt-2 text-sm">Choose a dish. The ingredients are ready for you.</p>
          </div>
          <Link to="/products"
            style={{ color: '#fff' }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-400 font-800 rounded-xl text-sm transition-all duration-200 whitespace-nowrap shadow-lg shadow-green-500/30 hover:-translate-y-0.5">
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
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,9,2,0.95) 0%, rgba(5,9,2,0.4) 50%, transparent 85%)' }} />
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
              style={{ background: 'linear-gradient(to top, rgba(5,9,2,0.95) 0%, rgba(5,9,2,0.55) 38%, rgba(5,9,2,0.08) 75%, transparent 100%)' }} />
            {/* Top badges */}
            <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
              {products[0].isOnePort && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-xs font-700 text-green-700"
                  style={{ border: '1px solid rgba(154,187,80,0.35)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
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
                style={{ boxShadow: '0 4px 18px rgba(154,187,80,0.35)' }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(154,187,80,0.5)' }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 18px rgba(154,187,80,0.35)' }}
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
                style={{ background: 'linear-gradient(to top, rgba(5,9,2,0.92) 0%, rgba(5,9,2,0.35) 45%, transparent 80%)' }} />

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
            { icon: ChefHat, text: '4 Authentic Recipes' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-xs font-600" style={{ color: 'rgba(193,255,114,0.3)' }}>
              <Icon size={13} style={{ color: 'rgba(193,255,114,0.45)' }} />
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
    <section ref={ref} className="py-14 sm:py-28 overflow-hidden" style={{ background: '#f7fbef' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10 sm:mb-14"
        >
          <SectionLabel icon={Star} text="Why Samachify" />
          <h2 className="font-display font-black text-gray-900 tracking-tighter mb-4"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}>
            Everything You Need. No Prep Needed.
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            The preparation is already done, while the cooking stays fresh and yours.
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
            style={{ background: 'linear-gradient(145deg, #0b1606 0%, #152708 100%)' }}
          >
            <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(154,187,80,0.12), transparent 70%)' }} />
            <div>
              <div className="w-14 h-14 rounded-2xl bg-green-500/15 border border-green-400/20 flex items-center justify-center mb-6">
                <TrendingUp size={26} className="text-green-400" />
              </div>
              <div className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-green-400 leading-none mb-2">Ready</div>
              <div className="font-display font-700 text-white text-lg sm:text-2xl mb-3 sm:mb-4">Pre-Cleaned & Pre-Cut</div>
              <p className="text-green-100/50 text-sm leading-relaxed max-w-xs">
                Vegetables arrive washed, inspected, cut, and portioned for the dish you selected.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-6">
              <CheckCircle size={15} className="text-green-400" />
              <span className="text-green-300/70 text-sm font-600">Prepared for the pan</span>
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
            <div className="font-700 text-gray-900 mb-1.5">Pre-Measured Portions</div>
            <p className="text-gray-500 text-sm">The right quantity for your selected serving size, with less guesswork and waste.</p>
          </motion.div>

          {/* Cell 5 */}
          <motion.div custom={4} initial="hidden" animate={inView ? 'show' : 'hidden'} variants={fadeUp}
            className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm card-hover">
            <Video size={24} className="text-blue-500 mb-4" />
            <div className="font-700 text-gray-900 mb-1.5">Guided Cooking</div>
            <p className="text-gray-500 text-sm">Clear, beginner-friendly steps keep the cooking process simple and confident.</p>
          </motion.div>

          {/* Cell 6 — full width strip */}
          <motion.div custom={5} initial="hidden" animate={inView ? 'show' : 'hidden'} variants={fadeUp}
            className="col-span-2 lg:col-span-4 p-5 sm:p-6 lg:p-8 rounded-3xl relative overflow-hidden"
            style={{ background: 'linear-gradient(110deg, #0b1606 0%, #152708 50%, #071a0b 100%)' }}
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 60% 50%, rgba(193,255,114,0.07), transparent 65%)' }} />
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <div className="text-[10px] font-700 text-green-400/60 tracking-widest uppercase mb-2">Exclusively South Indian</div>
                <div className="font-display font-800 text-white text-xl mb-1">Authentic South Indian — Only</div>
                <div className="text-green-100/45 text-sm max-w-md">We specialise exclusively in traditional South Indian recipes. No generic meal kits. No compromises. Only what your grandmother would recognise.</div>
              </div>
              <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
                {[
                  { num: '4', label: 'Authentic Dishes' },
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
      style={{ background: 'linear-gradient(160deg, #070d03 0%, #0b1606 60%, #142405 100%)' }}
    >
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(154,187,80,0.05), transparent 70%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10 sm:mb-16"
        >
          <SectionLabelDark icon={Microscope} text="Our Technology" />
          <h2 className="font-display font-black text-white tracking-tighter mb-5 leading-[1.05]"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
            Freshness.{' '}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #c1ff72, #9abb50)' }}>
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
                  e.currentTarget.style.background = 'rgba(193,255,114,0.07)'
                  e.currentTarget.style.border = '1px solid rgba(193,255,114,0.18)'
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
            style={{ background: 'linear-gradient(135deg, #498a0c, #3a6c09)', boxShadow: '0 0 24px rgba(154,187,80,0.3)' }}>
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
    <section ref={ref} className="py-14 sm:py-28 overflow-hidden" style={{ background: '#f7fbef' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10 sm:mb-16"
        >
          <SectionLabel icon={Quote} text="Testimonials" />
          <h2 className="font-display font-black text-gray-900 tracking-tighter mb-5 leading-[1.05]"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
            What Our{' '}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #498a0c, #c1ff72)' }}>
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

        <ReviewMarquee />

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
    <section ref={ref} id="faq" className="py-14 sm:py-28 bg-white overflow-hidden">
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
          {homepageFaqs.map((faq, i) => (
            <motion.div
              key={faq.id} custom={i}
              initial="hidden" animate={inView ? 'show' : 'hidden'} variants={fadeUp}
              className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm"
            >
              <button
                onClick={() => setOpen(open === faq.id ? null : faq.id)}
                aria-expanded={open === faq.id}
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
      style={{ background: 'linear-gradient(145deg, #070d03 0%, #0b1606 60%, #142405 100%)' }}
    >
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(154,187,80,0.08), transparent 70%)' }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}>
          <SectionLabelDark icon={Sprout} text="Start Cooking" />
          <h2 className="font-display font-black text-white tracking-tighter mb-5"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
            Ready to cook<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #c1ff72, #9abb50)' }}>
              without the prep?
            </span>
          </h2>
          <p className="text-green-100/45 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Pick your favourite South Indian dish. We&apos;ll prepare the ingredients so you can enjoy the cooking.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link to="/products"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-green-500 hover:bg-green-400 text-black font-700 rounded-xl transition-all hover:scale-105 text-sm w-full sm:w-auto justify-center">
              Explore Products <ArrowRight size={15} />
            </Link>
            <a
              href="https://wa.me/919025115657"
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
        <ProofCardsSection />
        <ValueBannerSection />
        <SolutionSection />
        <FeaturedProductsSection />
        <HowItWorksSection />
        <DemoSection />
        <TechHighlightsSection />
        <WhyChooseSection />
        <ProblemSection />
        <TestimonialsSection />
        <FAQSection />
        <ContactCTASection />
      </main>
      <Footer />
    </>
  )
}
