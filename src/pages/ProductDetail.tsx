import { useParams, Link } from 'react-router-dom'
import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  ArrowLeft, Clock, Users, Flame, ChefHat, Share2, CheckCircle,
  ArrowRight, Leaf, Timer, Sprout, Camera,
} from 'lucide-react'
import { products, recipes } from '../data/products'
import Footer from '../components/Footer'

const spiceBadge: Record<string, string> = {
  Mild: 'bg-green-50 text-green-700 border-green-200',
  Medium: 'bg-amber-50 text-amber-700 border-amber-200',
  Hot: 'bg-red-50 text-red-600 border-red-200',
}

function parseNum(s: string) {
  return parseFloat(s.replace(/[^0-9.]/g, '')) || 0
}

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    const t0 = Date.now()
    const id = setInterval(() => {
      const p = Math.min((Date.now() - t0) / duration, 1)
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * target))
      if (p >= 1) clearInterval(id)
    }, 16)
    return () => clearInterval(id)
  }, [active, target, duration])
  return val
}

const ingredientContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}
const ingredientItem = {
  hidden: { opacity: 0, scale: 0.84, y: 14 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}
const stepContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const stepItem = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const product = products.find((p) => p.id === id)
  const recipe = recipes.find((r) => r.productId === id)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  const nutriRef = useRef<HTMLDivElement>(null)
  const nutriInView = useInView(nutriRef, { once: true, margin: '-60px' })
  const calories = useCountUp(parseNum(recipe?.nutrition.calories ?? '0'), nutriInView, 1600)

  if (!product || !recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f7fbef' }}>
        <div className="text-center">
          <div className="font-display font-black text-4xl text-gray-900 mb-4">Product not found</div>
          <Link to="/products" className="inline-flex items-center gap-2 text-green-600 font-700 hover:text-green-700">
            <ArrowLeft size={16} /> Back to Products
          </Link>
        </div>
      </div>
    )
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: `${product.name} — Samachify`, url: window.location.href })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        alert('Link copied to clipboard!')
      }
    } catch { /* ignore */ }
  }

  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 3)

  return (
    <>
      <main className="pt-20 overflow-x-hidden min-h-screen" style={{ background: '#f7fbef' }}>

        {/* ── Hero ── */}
        <section className="relative overflow-hidden" style={{ minHeight: '78vh', background: '#070d03' }}>
          <div className="absolute inset-0">
            <img
              src={product.image}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(100deg, rgba(7,13,3,1) 0%, rgba(7,13,3,1) 30%, rgba(7,13,3,0.92) 48%, rgba(7,13,3,0.55) 65%, rgba(7,13,3,0.15) 85%, rgba(7,13,3,0.05) 100%)',
            }} />
            <div className="absolute inset-x-0 bottom-0 h-48 pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(7,13,3,0.85), transparent)' }} />
          </div>

          <div className="relative z-10 flex items-end min-h-[78vh] w-full">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
              <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
                <Link to="/products"
                  className="inline-flex items-center gap-2 text-sm font-600 mb-8 transition-all hover:gap-3 group/back"
                  style={{ color: 'rgba(255,255,255,0.75)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.75)' }}
                >
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                    <ArrowLeft size={13} />
                  </span>
                  All Products
                </Link>
                <div className="flex flex-wrap gap-2 mb-5">
                  {product.spiceLevel && (
                    <span className={`text-xs font-700 px-3 py-1.5 rounded-full border ${spiceBadge[product.spiceLevel]}`}>
                      {product.spiceLevel}
                    </span>
                  )}
                  {product.isOnePort && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/15 border border-green-400/25 rounded-full text-xs font-700 text-green-300">
                      <ChefHat size={10} /> One-Pot Recipe
                    </span>
                  )}
                  {product.dietType && (
                    <span className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-xs font-700 text-white/70">
                      {product.dietType}
                    </span>
                  )}
                </div>
                <h1 className="font-display font-black text-white tracking-tighter mb-3"
                  style={{ fontSize: 'clamp(2rem, 4.5vw, 4.2rem)', lineHeight: 1.04 }}>
                  {product.name}
                </h1>
                <p className="text-green-100/50 leading-relaxed mb-8 sm:mb-10 max-w-[400px]"
                  style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.15rem)' }}>
                  {product.subtitle}
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {[
                    { icon: Clock,  label: 'Cook Time',  val: recipe.cookTime },
                    { icon: Timer,  label: 'Prep Time',  val: recipe.prepTime },
                    { icon: Users,  label: 'Serves',     val: `${recipe.servings} people` },
                    { icon: Flame,  label: 'Difficulty', val: recipe.difficulty },
                  ].map((s, i) => {
                    const Icon = s.icon
                    return (
                      <div key={i} className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl backdrop-blur-sm"
                        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: 'rgba(154,187,80,0.15)', border: '1px solid rgba(154,187,80,0.25)' }}>
                          <Icon size={14} className="text-green-400" />
                        </div>
                        <div>
                          <div className="text-white/40 text-[10px] font-600 uppercase tracking-wide leading-none mb-0.5">{s.label}</div>
                          <div className="text-white text-sm font-700 leading-none">{s.val}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Main content ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-[2fr_1fr] gap-10">

            {/* ── Left column ── */}
            <div className="space-y-8">

              {/* About */}
              <motion.div
                initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.55 }}
                className="bg-white rounded-3xl p-8 border border-gray-100/80 shadow-sm"
              >
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-display font-700 text-gray-900 text-xl">About This Recipe</h2>
                  <button onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-gray-600 text-sm font-600 transition-colors">
                    <Share2 size={14} /> Share
                  </button>
                </div>
                <p className="text-gray-600 leading-relaxed text-[0.95rem]">{recipe.description}</p>
                <div className="flex flex-wrap gap-2 mt-5">
                  {recipe.tags.map((tag) => (
                    <span key={tag} className="text-xs font-600 px-3 py-1.5 bg-green-50 border border-green-100 rounded-xl text-green-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* ── Ingredients — HelloFresh individual cards ── */}
              <motion.div
                initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.05 }}
                className="overflow-hidden rounded-3xl border border-gray-100/80 shadow-sm bg-white"
              >
                {/* Banner */}
                <div className="relative overflow-hidden" style={{ height: '175px' }}>
                  <img src={product.image} alt={product.name}
                    className="w-full h-full object-cover object-center" />
                  <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(7,13,3,0.93) 0%, rgba(7,13,3,0.4) 60%, transparent 100%)' }} />
                  <div className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between">
                    <div>
                      <div className="text-green-400/70 text-[10px] font-700 tracking-widest uppercase mb-1">Ingredients</div>
                      <div className="text-white font-display font-800 text-xl tracking-tight">
                        {recipe.includedIngredients.length} Items Included
                      </div>
                    </div>
                    <span className="text-xs font-700 px-3 py-1.5 rounded-full text-green-300 border border-green-400/30"
                      style={{ background: 'rgba(154,187,80,0.12)' }}>
                      Pre-Measured
                    </span>
                  </div>
                </div>

                {/* Individual ingredient cards — 3-col grid */}
                <div className="p-6">
                  <motion.div
                    className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                    variants={ingredientContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-40px' }}
                  >
                    {recipe.includedIngredients.map((ing, i) => (
                      <motion.div key={i} variants={ingredientItem}
                        className="flex flex-col items-center text-center p-4 rounded-2xl border cursor-default transition-all duration-300"
                        style={{ background: '#fafff9', borderColor: '#e8f5e9' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#f6ffe9'
                          e.currentTarget.style.borderColor = '#aee75d'
                          e.currentTarget.style.boxShadow = '0 6px 20px rgba(73,138,12,0.1)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#fafff9'
                          e.currentTarget.style.borderColor = '#e8f5e9'
                          e.currentTarget.style.boxShadow = 'none'
                        }}
                      >
                        {/* Ingredient image (falls back to placeholder if no image) */}
                        <div
                          className={ing.image
                            ? 'relative w-[4.5rem] h-[4.5rem] rounded-full mb-3 flex-shrink-0 overflow-hidden'
                            : 'relative w-[4.5rem] h-[4.5rem] rounded-full flex items-center justify-center mb-3 flex-shrink-0'}
                          style={ing.image
                            ? { border: '2.5px solid #aee75d', boxShadow: '0 0 0 3px rgba(174,231,93,0.15)' }
                            : { background: 'linear-gradient(145deg, #f9fff0, #f6ffe9)', border: '2.5px dashed #aee75d' }}
                        >
                          {ing.image ? (
                            <img
                              src={ing.image}
                              alt={ing.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <>
                              <span className="text-[1.75rem] leading-none">{ing.icon}</span>
                              <div className="absolute -bottom-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full"
                                style={{ background: '#daffaa', border: '1px solid #aee75d' }}>
                                <Camera size={7} className="text-green-600" />
                                <span className="text-[8px] font-700 text-green-700">soon</span>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="font-700 text-gray-900 text-[0.8rem] leading-tight mt-1.5">{ing.name}</div>
                        {ing.note && (
                          <div className="text-gray-400 text-[9.5px] mt-1 font-500 leading-snug">{ing.note}</div>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* "From your kitchen" tip */}
                  <motion.div
                    className="mt-5 flex items-center gap-2.5 px-4 py-3 rounded-2xl"
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    style={{ background: '#f6ffe9', border: '1.5px dashed #aee75d' }}
                  >
                    <Sprout size={14} className="text-green-600 flex-shrink-0" />
                    <p className="text-green-700 text-xs font-600 leading-snug">
                      From your kitchen: cooking oil, water, and salt — that's all you'll need.
                    </p>
                  </motion.div>
                </div>
              </motion.div>

              {/* ── Cooking Steps — HelloFresh style ── */}
              <motion.div
                initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.08 }}
                className="bg-white rounded-3xl border border-gray-100/80 shadow-sm overflow-hidden"
              >
                {/* Section header */}
                <div className="px-8 pt-7 pb-6 border-b border-gray-100 flex items-center gap-4">
                  <div className="flex-1">
                    <h2 className="font-display font-700 text-gray-900 text-xl">Step-by-Step Guide</h2>
                    <p className="text-gray-400 text-sm mt-0.5">{recipe.steps.length} steps · {recipe.cookTime} total</p>
                  </div>
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #498a0c, #9abb50)', boxShadow: '0 4px 14px rgba(73,138,12,0.35)' }}>
                    <ChefHat size={18} className="text-white" />
                  </div>
                </div>

                {/* Steps */}
                <motion.div
                  className="divide-y divide-gray-100"
                  variants={stepContainer}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-40px' }}
                >
                  {recipe.steps.map((step, i) => (
                    <motion.div
                      key={i}
                      className="flex"
                      variants={stepItem}
                    >
                      {/* Left: image placeholder — hidden on mobile */}
                      <div className="hidden sm:flex flex-shrink-0 flex-col items-center justify-center text-center"
                        style={{
                          width: 'clamp(120px, 18vw, 200px)',
                          minHeight: '155px',
                          background: '#f9fafb',
                          borderRight: '1px solid #f3f4f6',
                        }}>
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-2"
                          style={{ background: '#e5e7eb', border: '2px dashed #d1d5db' }}>
                          <Camera size={18} className="text-gray-400" />
                        </div>
                        <span className="text-[9px] font-700 text-gray-400 tracking-widest uppercase">Step Photo</span>
                        <span className="text-[8px] font-500 text-gray-300 mt-0.5">Coming soon</span>
                      </div>

                      {/* Right: step content */}
                      <div className="flex-1 px-4 sm:px-7 py-5 sm:py-6 flex flex-col justify-center">
                        <div className="flex items-center gap-2.5 mb-3">
                          <div className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-800 text-white flex-shrink-0"
                            style={{
                              background: 'linear-gradient(135deg, #498a0c, #9abb50)',
                              boxShadow: '0 3px 10px rgba(73,138,12,0.3)',
                            }}>
                            {i + 1}
                          </div>
                          <span className="text-[10px] font-700 text-green-600 tracking-widest uppercase">
                            Step {String(i + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <p className="text-gray-700 text-[0.92rem] leading-relaxed">{step}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* ── Video Tutorial — cinematic ── */}
              <motion.div
                initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
                className="rounded-3xl overflow-hidden shadow-lg relative"
                style={{ background: 'linear-gradient(145deg, #070d03, #0b1606, #0f1c07)' }}
              >
                {/* Film-strip perforations — top */}
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5">
                  <div className="flex gap-1.5">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="w-3.5 h-2.5 rounded-sm" style={{ background: 'rgba(255,255,255,0.07)' }} />
                    ))}
                  </div>
                  <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
                    <motion.div className="w-1.5 h-1.5 rounded-full bg-red-500"
                      animate={{ opacity: [1, 0.2, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    />
                    <span className="text-[9px] font-800 text-red-400 tracking-widest">UPCOMING</span>
                  </div>
                </div>

                {/* Main content */}
                <div className="relative px-8 py-12 flex flex-col items-center text-center">
                  {/* Single pulse ring + play button */}
                  <div className="relative mb-8">
                    {/* Single outer ring */}
                    <motion.div className="absolute rounded-full border border-green-400/20"
                      style={{ inset: '-20px' }}
                      animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeOut' }}
                    />

                    {/* Play button — no backdropFilter to avoid repaint jank */}
                    <motion.button
                      className="relative w-20 h-20 rounded-full flex items-center justify-center cursor-default"
                      style={{
                        background: 'linear-gradient(135deg, rgba(154,187,80,0.25), rgba(154,187,80,0.18))',
                        border: '2px solid rgba(193,255,114,0.4)',
                        boxShadow: '0 0 32px rgba(193,255,114,0.2)',
                      }}
                      animate={{ scale: [1, 1.04, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <div className="w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-l-[22px] border-l-green-400 ml-1.5" />
                    </motion.button>
                  </div>

                  {/* Radial glow behind */}
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(154,187,80,0.1) 0%, transparent 65%)' }} />

                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
                      style={{ background: 'rgba(193,255,114,0.1)', border: '1px solid rgba(193,255,114,0.2)' }}>
                      <ChefHat size={11} className="text-green-400" />
                      <span className="text-green-400 text-[10px] font-700 tracking-widest uppercase">Video Tutorial</span>
                    </div>
                    <h3 className="font-display font-700 text-white text-xl mb-2">
                      {product.name} — Step by Step
                    </h3>
                    <p className="text-green-100/35 text-sm max-w-xs mx-auto leading-relaxed">
                      A full guided video tutorial is being filmed. Check back soon!
                    </p>
                  </div>
                </div>

                {/* Film-strip perforations — bottom */}
                <div className="flex items-center gap-2 px-4 py-2.5 border-t border-white/5">
                  <div className="flex items-center gap-1.5">
                    <Clock size={10} className="text-green-500/50" />
                    <span className="text-[10px] font-600 text-green-300/30 tracking-wide">{recipe.cookTime} · {recipe.steps.length} steps</span>
                  </div>
                  <div className="flex gap-1.5 ml-auto">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="w-3.5 h-2.5 rounded-sm" style={{ background: 'rgba(255,255,255,0.07)' }} />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Tradition Corner */}
              <motion.div
                initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.55 }}
                className="rounded-3xl p-8 border border-green-100"
                style={{ background: 'linear-gradient(135deg, #f6ffe9 0%, #daffaa 100%)' }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 border border-green-200 rounded-full mb-5">
                  <Sprout size={12} className="text-green-700" />
                  <span className="text-green-700 text-xs font-700 tracking-wide uppercase">Tradition Corner</span>
                </div>
                <p className="text-gray-700 leading-relaxed italic text-lg font-500">
                  &ldquo;{recipe.traditionNote}&rdquo;
                </p>
              </motion.div>
            </div>

            {/* ── Right column — sticky ── */}
            <div className="space-y-5">
              <div ref={nutriRef} className="bg-white rounded-3xl border border-gray-100/80 shadow-sm overflow-hidden sm:sticky sm:top-24">

                {/* Calorie hero */}
                <div className="relative overflow-hidden text-center px-6 pt-7 pb-6"
                  style={{ background: 'linear-gradient(145deg, #0b1606 0%, #152708 100%)' }}>
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(circle at 50% 80%, rgba(154,187,80,0.14), transparent 68%)' }} />
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4"
                      style={{ background: 'rgba(154,187,80,0.12)', border: '1px solid rgba(154,187,80,0.25)' }}>
                      <Flame size={11} className="text-green-400" />
                      <span className="text-green-400 text-[10px] font-700 tracking-widest uppercase">Per Serving</span>
                    </div>
                    <div className="font-display font-black leading-none mb-2"
                      style={{ fontSize: '4.2rem', color: '#c1ff72', textShadow: '0 0 40px rgba(193,255,114,0.3)' }}>
                      {calories}
                    </div>
                    <div className="text-green-200/35 text-sm font-600 tracking-widest uppercase">Calories · kcal</div>
                    <div className="flex items-center gap-3 mt-5">
                      <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(193,255,114,0.2))' }} />
                      <Leaf size={12} className="text-green-500/40" />
                      <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(193,255,114,0.2))' }} />
                    </div>
                  </div>
                </div>

                {/* Nutrition tiles — 2×2 grid */}
                <div className="px-6 py-5 border-b border-gray-100">
                  <div className="text-xs font-700 text-gray-400 tracking-widest uppercase mb-3">Nutrition per Serving</div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Carbs',   val: recipe.nutrition.carbs,   color: '#f59e0b', bg: 'rgba(245,158,11,0.07)',  border: 'rgba(245,158,11,0.22)'  },
                      { label: 'Protein', val: recipe.nutrition.protein, color: '#3b82f6', bg: 'rgba(59,130,246,0.07)',  border: 'rgba(59,130,246,0.22)'  },
                      { label: 'Fat',     val: recipe.nutrition.fat,     color: '#f97316', bg: 'rgba(249,115,22,0.07)',  border: 'rgba(249,115,22,0.22)'  },
                      { label: 'Fiber',   val: recipe.nutrition.fiber,   color: '#9abb50', bg: 'rgba(154,187,80,0.07)',   border: 'rgba(154,187,80,0.22)'   },
                    ].map((n, i) => (
                      <motion.div
                        key={n.label}
                        initial={{ opacity: 0, scale: 0.85, y: 8 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-col p-3.5 rounded-2xl"
                        style={{ background: n.bg, border: `1.5px solid ${n.border}` }}
                      >
                        <div className="font-black text-gray-900 leading-none" style={{ fontSize: '1.25rem' }}>
                          {n.val}
                        </div>
                        <div className="text-[10px] font-700 tracking-widest uppercase mt-1.5" style={{ color: n.color }}>
                          {n.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Health benefits */}
                <div className="px-6 py-5">
                  <div className="text-xs font-700 text-gray-400 tracking-widest uppercase mb-3">Health Benefits</div>
                  <div className="space-y-2">
                    {recipe.benefits.map((b, i) => (
                      <motion.div key={i} className="flex items-start gap-2 text-sm text-gray-600"
                        initial={{ opacity: 0, x: 10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.07, duration: 0.35 }}>
                        <CheckCircle size={14} className="text-green-500 flex-shrink-0 mt-0.5" />
                        {b}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── More Recipes ── */}
        <section className="py-16 border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-display font-black text-gray-900 text-2xl tracking-tight">More Recipes</h2>
              <Link to="/products" className="inline-flex items-center gap-1.5 text-green-600 hover:text-green-700 font-700 text-sm transition-colors">
                View All <ArrowRight size={13} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              {relatedProducts.map((p, i) => (
                <motion.div key={p.id}
                  initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="group flex flex-col rounded-3xl overflow-hidden bg-white transition-all duration-350 hover:-translate-y-2"
                  style={{ border: '1px solid #eef2ee', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.11)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)' }}
                >
                  <div className="relative overflow-hidden flex-shrink-0" style={{ height: '200px' }}>
                    <img src={p.image} alt={p.name}
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.06]" />
                    <div className="absolute inset-0 pointer-events-none"
                      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 55%)' }} />
                    <div className="absolute bottom-3 left-3">
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-sm">
                        <Clock size={10} className="text-green-600" />
                        <span className="text-[11px] font-700 text-gray-800">{p.cookTime}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-display font-800 text-gray-900 text-base tracking-tight mb-1">{p.name}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed mb-4 flex-1 line-clamp-2">{p.description}</p>
                    <Link
                      to={`/products/${p.id}`}
                      onClick={() => window.scrollTo(0, 0)}
                      className="group/btn flex items-center justify-between w-full px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-700 rounded-xl text-xs transition-all"
                      style={{ boxShadow: '0 3px 10px rgba(73,138,12,0.22)' }}
                    >
                      <span>View Recipe</span>
                      <ArrowRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
