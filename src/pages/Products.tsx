import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Clock, ChefHat, Leaf, Flame, Zap, Package, Star, Filter } from 'lucide-react'
import { products } from '../data/products'
import Footer from '../components/Footer'

const DARK_BG = 'linear-gradient(160deg, #050902 0%, #0b1606 55%, #142405 100%)'
const DOT_GRID = {
  backgroundImage: 'radial-gradient(circle, rgba(193,255,114,0.1) 1px, transparent 1px)',
  backgroundSize: '28px 28px',
}

const filterConfig = [
  { id: 'All', label: 'All Packs', icon: Package },
  { id: 'Main Course', label: 'Main Course', icon: Flame },
  { id: 'Chutney', label: 'Chutneys', icon: Leaf },
  { id: 'Quick (under 15 min)', label: 'Quick ≤15 min', icon: Zap },
]

const spiceBadge: Record<string, string> = {
  Mild: 'bg-green-50 text-green-700 border-green-200',
  Medium: 'bg-amber-50 text-amber-700 border-amber-200',
  Hot: 'bg-red-50 text-red-600 border-red-200',
}

export default function Products() {
  const [active, setActive] = useState('All')

  const getFiltered = (tab: string) => {
    if (tab === 'All') return products
    if (tab === 'Chutney') return products.filter(p => p.category === 'chutney')
    if (tab === 'Main Course') return products.filter(p => p.category !== 'chutney')
    if (tab === 'Quick (under 15 min)') return products.filter(p => parseInt(p.cookTime) <= 15)
    return products
  }

  const filtered = getFiltered(active)
  const getCount = (tab: string) => getFiltered(tab).length

  return (
    <>
      <main className="pt-20 overflow-x-hidden min-h-screen" style={{ background: '#f7fbef' }}>

        {/* ── Hero ── */}
        <section className="relative overflow-hidden py-16 sm:py-24" style={{ background: DARK_BG }}>
          <div className="absolute inset-0 pointer-events-none" style={DOT_GRID} />

          <motion.div className="absolute pointer-events-none rounded-full"
            style={{ width: 520, height: 520, top: '-20%', right: '-5%', background: 'radial-gradient(circle, rgba(154,187,80,0.12), transparent 70%)' }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div className="absolute pointer-events-none rounded-full"
            style={{ width: 360, height: 360, bottom: '-15%', left: '-5%', background: 'radial-gradient(circle, rgba(193,255,114,0.07), transparent 70%)' }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          />

          {[
            { w: 5, h: 5, top: '20%', left: '12%', delay: 0 },
            { w: 4, h: 4, top: '60%', left: '85%', delay: 1.5 },
            { w: 6, h: 6, top: '75%', left: '25%', delay: 0.8 },
            { w: 3, h: 3, top: '35%', left: '72%', delay: 2.1 },
          ].map((p, i) => (
            <motion.div key={i} className="absolute rounded-full bg-green-400/25 pointer-events-none"
              style={{ width: p.w, height: p.h, top: p.top, left: p.left }}
              animate={{ y: [0, -18, 0], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 4 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
            />
          ))}

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
                <Leaf size={13} className="text-green-400" />
                <span className="text-green-400 text-xs font-600 tracking-wide uppercase">Our Products</span>
              </div>
            </motion.div>

            <motion.h1
              className="font-display font-black text-white tracking-tighter mb-5 leading-[1.05]"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 4.2rem)' }}
              initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            >
              Authentic South Indian{' '}
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #c1ff72, #9abb50)' }}>
                Meal Kits
              </span>
            </motion.h1>

            <motion.p
              className="text-green-100/50 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-12"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            >
              Four dish-specific packs, each containing exactly what you need. No prep, no waste — authentic flavour ready in minutes.
            </motion.p>

            {/* Stats row */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-6 sm:gap-12"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {[
                { val: '4', label: 'Authentic Recipes' },
                { val: '0', label: 'Preservatives' },
                { val: '10–15', label: 'Min Cook Time' },
                { val: '100%', label: 'Farm Fresh' },
              ].map((s, i) => (
                <motion.div key={i} className="text-center"
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.36 + i * 0.06 }}
                >
                  <div className="font-display font-black text-green-400 leading-none mb-1"
                    style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>{s.val}</div>
                  <div className="text-green-200/40 text-[10px] font-600 tracking-widest uppercase">{s.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Sticky filter bar ── */}
        <div className="sticky top-[4.4rem] z-30 bg-white/96 backdrop-blur-md border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 py-3.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              <span className="flex-shrink-0 flex items-center gap-1.5 text-gray-400 text-xs font-600 uppercase tracking-wide mr-1">
                <Filter size={11} /> Filter
              </span>
              {filterConfig.map((tab) => {
                const count = getCount(tab.id)
                const isActive = active === tab.id
                const TabIcon = tab.icon
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActive(tab.id)}
                    whileTap={{ scale: 0.97 }}
                    className={`relative flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-600 border transition-all duration-250 ${
                      isActive
                        ? 'bg-green-600 text-white border-green-600 shadow-md shadow-green-500/25'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-700 hover:bg-green-50/50'
                    }`}
                  >
                    <TabIcon size={12} className={isActive ? 'text-green-200' : 'text-gray-400'} />
                    {tab.label}
                    <span className={`text-[9px] font-800 px-1.5 py-0.5 rounded-full leading-none ${
                      isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>{count}</span>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Product grid ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

          {/* Result header */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.22 }}
                className="flex items-center gap-3"
              >
                <span className="font-700 text-gray-900 text-sm sm:text-base">
                  {filtered.length} pack{filtered.length !== 1 ? 's' : ''} found
                </span>
                {active !== 'All' && (
                  <span className="text-xs px-2.5 py-1 bg-green-50 border border-green-100 text-green-700 font-600 rounded-full">
                    {filterConfig.find(f => f.id === active)?.label}
                  </span>
                )}
              </motion.div>
            </AnimatePresence>
            <span className="text-gray-400 text-xs font-500 hidden sm:block">Showing all available packs</span>
          </div>

          {/* Cards */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                  className="group flex flex-col rounded-3xl overflow-hidden bg-white transition-all duration-400 hover:-translate-y-2 cursor-default"
                  style={{ border: '1px solid #eef2ee', boxShadow: '0 2px 14px rgba(0,0,0,0.06)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 24px 60px rgba(0,0,0,0.12)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 14px rgba(0,0,0,0.06)' }}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden flex-shrink-0" style={{ height: 'clamp(230px, 22vw, 290px)' }}>
                    <img
                      src={product.image} alt={product.name}
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 pointer-events-none"
                      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.0) 55%)' }} />

                    {/* Hover overlay with quick action */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                      style={{ background: 'rgba(7,13,3,0.5)', backdropFilter: 'blur(3px)' }}>
                      <Link
                        to={`/products/${product.id}`}
                        className="flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-400 text-white font-700 rounded-xl text-sm transition-all shadow-lg shadow-green-900/40"
                      >
                        View Recipe <ArrowRight size={14} />
                      </Link>
                    </div>

                    {/* Top badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                      {product.isOnePort ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-xs font-700 text-green-700 shadow-sm"
                          style={{ border: '1px solid rgba(154,187,80,0.35)' }}>
                          <ChefHat size={10} /> One-Pot
                        </div>
                      ) : <div />}
                      {product.spiceLevel && (
                        <div className={`text-xs font-700 px-2.5 py-1.5 rounded-full border shadow-sm backdrop-blur-sm ${spiceBadge[product.spiceLevel]}`}>
                          {product.spiceLevel}
                        </div>
                      )}
                    </div>

                    {/* Bottom row on image */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-sm"
                        style={{ border: '1px solid rgba(255,255,255,0.9)' }}>
                        <Clock size={11} className="text-green-600 flex-shrink-0" />
                        <span className="text-xs font-700 text-gray-800">{product.cookTime}</span>
                      </div>
                      {product.dietType && (
                        <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full backdrop-blur-sm"
                          style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.18)' }}>
                          <Leaf size={9} className="text-green-400" />
                          <span className="text-[10px] font-700 text-white/90">{product.dietType}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-700 text-green-600 tracking-widest uppercase px-2.5 py-1 bg-green-50 border border-green-100 rounded-full">
                        {product.category === 'chutney' ? 'Chutney' : 'Main Course'}
                      </span>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} size={9} className="text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                    </div>

                    <h2 className="font-display font-800 text-gray-900 text-xl tracking-tight mb-1.5 leading-tight">
                      {product.name}
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {product.ingredients.slice(0, 3).map((ing) => (
                        <span key={ing} className="text-[11px] font-600 px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-full text-gray-500">
                          {ing}
                        </span>
                      ))}
                      {product.ingredients.length > 3 && (
                        <span className="text-[11px] font-700 px-2.5 py-1 bg-green-50 border border-green-100 rounded-full text-green-600">
                          +{product.ingredients.length - 3} more
                        </span>
                      )}
                    </div>

                    <Link
                      to={`/products/${product.id}`}
                      className="group/btn flex items-center justify-between w-full px-5 py-3.5 bg-green-600 hover:bg-green-700 text-white font-700 rounded-2xl text-sm transition-all duration-250 hover:shadow-lg"
                      style={{ boxShadow: '0 4px 14px rgba(73,138,12,0.25)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(73,138,12,0.38)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 14px rgba(73,138,12,0.25)' }}
                    >
                      <span>View Recipe</span>
                      <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Package size={28} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-600">No products match this filter.</p>
              <button onClick={() => setActive('All')} className="mt-4 text-green-600 font-700 text-sm hover:text-green-700 transition-colors">
                View all products →
              </button>
            </motion.div>
          )}
        </div>

        {/* ── Bottom CTA ── */}
        <section className="py-16 sm:py-20 relative overflow-hidden" style={{ background: DARK_BG }}>
          <div className="absolute inset-0 pointer-events-none" style={DOT_GRID} />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div className="w-96 h-96 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(154,187,80,0.09), transparent 70%)' }}
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
                <Star size={13} className="text-green-400 fill-green-400" />
                <span className="text-green-400 text-xs font-700 tracking-widest uppercase">Most Popular</span>
              </div>
              <h2 className="font-display font-black text-white tracking-tighter mb-4 leading-[1.05]"
                style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
                Start with our{' '}
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #c1ff72, #9abb50)' }}>
                  Sambar Pack
                </span>
              </h2>
              <p className="text-green-100/45 leading-relaxed mb-8 text-base sm:text-lg">
                Our best-seller and the perfect introduction to Samachify. Farm-fresh vegetables, semi-cooked dal, and authentic sambar powder — ready in 10–15 minutes.
              </p>
              <Link
                to="/products/sambar-pack"
                className="inline-flex items-center gap-2.5 px-7 sm:px-9 py-3.5 sm:py-4 text-white font-700 rounded-2xl text-sm transition-all duration-250 hover:-translate-y-1 w-full sm:w-auto justify-center"
                style={{ background: 'linear-gradient(135deg, #498a0c, #3a6c09)', boxShadow: '0 0 35px rgba(154,187,80,0.28), 0 4px 16px rgba(0,0,0,0.35)' }}
              >
                Try Sambar Pack <ArrowRight size={15} />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
