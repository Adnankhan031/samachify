import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, type Variants } from 'framer-motion'
import {
  ArrowRight, CheckCircle, TrendingUp, Leaf, Users, Award,
  Shield, Sprout, Flame, Target, Heart, Timer, Zap, MapPin,
  User, Camera,
} from 'lucide-react'
import Footer from '../components/Footer'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function About() {
  const storyRef   = useRef<HTMLElement>(null)
  const missionRef = useRef<HTMLElement>(null)
  const audienceRef= useRef<HTMLElement>(null)
  const teamRef    = useRef<HTMLElement>(null)
  const roadmapRef = useRef<HTMLElement>(null)

  const storyInView    = useInView(storyRef,    { once: true, margin: '-60px' })
  const missionInView  = useInView(missionRef,  { once: true, margin: '-60px' })
  const audienceInView = useInView(audienceRef, { once: true, margin: '-60px' })
  const teamInView     = useInView(teamRef,     { once: true, margin: '-60px' })
  const roadmapInView  = useInView(roadmapRef,  { once: true, margin: '-60px' })

  return (
    <>
      <main className="pt-20 overflow-x-hidden min-h-screen" style={{ background: '#030A04' }}>

        {/* ── Hero ── */}
        <section className="relative overflow-hidden py-0"
          style={{ background: 'linear-gradient(160deg, #040C06, #071408 55%, #0A1E0D)', minHeight: '72vh' }}>

          {/* Dot-grid background */}
          <div className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(74,222,128,0.14) 1px, transparent 0)',
              backgroundSize: '36px 36px',
              opacity: 0.55,
            }} />
          {/* Radial glows */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 70% 40%, rgba(34,197,94,0.1), transparent 55%)' }} />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 20% 80%, rgba(16,185,129,0.07), transparent 45%)' }} />

          {/* Floating leaves */}
          <motion.div className="absolute right-[12%] top-[18%] pointer-events-none hidden lg:block z-10"
            animate={{ y: [0, -14, 0], rotate: [20, 38, 20] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
            <Leaf size={32} style={{ color: 'rgba(74,222,128,0.4)', filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.2))' }} />
          </motion.div>
          <motion.div className="absolute left-[8%] top-[35%] pointer-events-none hidden lg:block z-10"
            animate={{ y: [0, 12, 0], rotate: [-15, -30, -15] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}>
            <Leaf size={22} style={{ color: 'rgba(34,197,94,0.3)' }} />
          </motion.div>
          <motion.div className="absolute right-[28%] bottom-[22%] pointer-events-none hidden lg:block z-10"
            animate={{ y: [0, 10, 0], rotate: [32, 18, 32] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}>
            <Leaf size={18} style={{ color: 'rgba(74,222,128,0.25)' }} />
          </motion.div>

          <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6"
            style={{ minHeight: '72vh', paddingTop: '5rem', paddingBottom: '4rem' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full mb-7">
                <Heart size={13} className="text-green-400" />
                <span className="text-green-400 text-xs font-600 tracking-wide uppercase">About Us</span>
              </div>
            </motion.div>

            <motion.h1
              className="font-display font-black text-white tracking-tighter leading-[1.04] mb-6"
              style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)' }}
              initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              Born from a{' '}
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg, #4ade80, #22c55e)' }}>
                Kitchen
              </span>
              <br />Frustration
            </motion.h1>

            <motion.p
              className="text-green-100/50 text-xl max-w-2xl mx-auto leading-relaxed mb-10"
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              Why does cooking a traditional South Indian meal take so much more time than the actual eating?
            </motion.p>

            {/* Hero stat bar */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-5 sm:gap-8"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.38 }}
            >
              {[
                { val: '70%', label: 'Prep Time Saved' },
                { val: '0',   label: 'Preservatives' },
                { val: '5+',  label: 'Authentic Recipes' },
                { val: '100%', label: 'Farm Fresh' },
              ].map((s, i) => (
                <motion.div key={i} className="text-center"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.44 + i * 0.08, duration: 0.5 }}
                >
                  <div className="font-display font-black text-green-400 leading-none"
                    style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', textShadow: '0 0 30px rgba(74,222,128,0.4)' }}>
                    {s.val}
                  </div>
                  <div className="text-green-300/40 text-xs font-600 tracking-widest uppercase mt-1">{s.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

        </section>

        {/* ── Story ── */}
        <section ref={storyRef} className="py-14 sm:py-24" style={{ background: '#FAFAF8' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 sm:gap-14 items-center">

              <motion.div
                initial={{ opacity: 0, x: -36 }} animate={storyInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-green-50 border border-green-200 rounded-full mb-6">
                  <Sprout size={13} className="text-green-600" />
                  <span className="text-green-700 text-xs font-700 tracking-wide uppercase">Where It Began</span>
                </div>
                <h2 className="font-display font-black text-gray-900 tracking-tighter mb-6 leading-[1.06]"
                  style={{ fontSize: 'clamp(1.9rem, 4vw, 3rem)' }}>
                  45 minutes of prep<br />for a dish eaten in 10?
                </h2>
                <div className="space-y-5 text-gray-600 leading-relaxed text-[0.95rem]">
                  <p>The founders of Samachify grew up in Tamil Nadu, surrounded by the aromas of sambar, kuzhambu, and fresh chutneys. But when they moved to the city for work, that connection to home cooking faded — not because they did not want to cook, but because there simply was not enough time.</p>
                  <p>Washing vegetables, peeling, cutting, measuring, and managing the inevitable waste added up to 45–60 minutes before a single pot was on the stove. Takeout became the default. Authentic South Indian flavour became a weekend luxury.</p>
                  <p className="font-600 text-gray-800">Samachify was created to close that gap. Fresh, pre-cut, dish-specific ingredient packs — so you spend your time cooking, not prepping.</p>
                </div>
              </motion.div>

              {/* Colorful stat cards */}
              <motion.div
                initial={{ opacity: 0, x: 36 }} animate={storyInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-2 gap-4"
              >
                {[
                  { val: '70%', label: 'Prep Time Saved',    icon: Timer,  color: '#f59e0b', bg: 'rgba(245,158,11,0.07)',  border: 'rgba(245,158,11,0.22)' },
                  { val: '100%', label: 'Farm Fresh',         icon: Sprout, color: '#22c55e', bg: 'rgba(34,197,94,0.07)',   border: 'rgba(34,197,94,0.22)'  },
                  { val: '0',    label: 'Preservatives Used', icon: Shield, color: '#3b82f6', bg: 'rgba(59,130,246,0.07)',  border: 'rgba(59,130,246,0.22)' },
                  { val: '5+',   label: 'Authentic Recipes',  icon: Flame,  color: '#ef4444', bg: 'rgba(239,68,68,0.07)',   border: 'rgba(239,68,68,0.22)'  },
                ].map((stat, i) => {
                  const Icon = stat.icon
                  return (
                    <motion.div
                      key={i} custom={i} initial="hidden" animate={storyInView ? 'show' : 'hidden'} variants={fadeUp}
                      className="p-6 bg-white rounded-3xl text-center relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5"
                      style={{ border: `1.5px solid ${stat.border}`, boxShadow: `0 4px 20px ${stat.bg}` }}
                      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 16px 40px ${stat.border}` }}
                      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `0 4px 20px ${stat.bg}` }}
                    >
                      {/* Soft tinted corner */}
                      <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-full pointer-events-none"
                        style={{ background: stat.bg, opacity: 0.5 }} />
                      <div className="relative z-10">
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center mx-auto mb-4"
                          style={{ background: stat.bg, border: `1.5px solid ${stat.border}` }}>
                          <Icon size={18} style={{ color: stat.color }} />
                        </div>
                        <div className="font-display font-black leading-none mb-1.5"
                          style={{ fontSize: '2.4rem', color: stat.color }}>
                          {stat.val}
                        </div>
                        <div className="text-gray-500 text-xs font-600 tracking-wide">{stat.label}</div>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Vision & Mission ── */}
        <section ref={missionRef} className="py-14 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={missionInView ? { opacity: 1, y: 0 } : {}}
              className="text-center mb-14"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-green-50 border border-green-200 rounded-full mb-5">
                <Target size={13} className="text-green-600" />
                <span className="text-green-700 text-xs font-700 tracking-wide uppercase">Our Purpose</span>
              </div>
              <h2 className="font-display font-black text-gray-900 tracking-tighter"
                style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}>
                Vision &amp;{' '}
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #16a34a, #4ade80)' }}>
                  Mission
                </span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-5 mb-10">
              {/* Vision — dark */}
              <motion.div custom={0} initial="hidden" animate={missionInView ? 'show' : 'hidden'} variants={fadeUp}
                className="p-6 sm:p-8 lg:p-10 rounded-3xl relative overflow-hidden group transition-all duration-300 hover:-translate-y-1"
                style={{ background: 'linear-gradient(145deg, #071408, #0d2416)' }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 30px 70px rgba(0,0,0,0.35)' }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '' }}
              >
                <div className="absolute top-0 right-0 w-56 h-56 pointer-events-none rounded-bl-full"
                  style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.12), transparent 70%)' }} />
                <div className="absolute bottom-0 left-0 w-32 h-32 pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.05), transparent 70%)' }} />
                <div className="relative z-10">
                  <div className="w-13 h-13 rounded-2xl bg-green-500/15 border border-green-400/20 flex items-center justify-center mb-5 w-12 h-12">
                    <TrendingUp size={22} className="text-green-400" />
                  </div>
                  <div className="text-xs font-700 text-green-400/60 tracking-widest uppercase mb-3">Vision</div>
                  <h3 className="font-display font-700 text-white text-2xl mb-4 leading-snug">
                    Traditional South Indian cooking — accessible to every household in India
                  </h3>
                  <p className="text-green-100/45 text-sm leading-relaxed">
                    A future where busy families never choose between convenience and authentic taste. Where tradition is a daily experience, not a weekend indulgence.
                  </p>
                </div>
              </motion.div>

              {/* Mission — vibrant green */}
              <motion.div custom={1} initial="hidden" animate={missionInView ? 'show' : 'hidden'} variants={fadeUp}
                className="p-6 sm:p-8 lg:p-10 rounded-3xl relative overflow-hidden group transition-all duration-300 hover:-translate-y-1"
                style={{ background: 'linear-gradient(145deg, #f0fdf4, #dcfce7)' }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 24px 60px rgba(34,197,94,0.2)' }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '' }}
              >
                <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.15), transparent 70%)' }} />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-green-200 border border-green-300 flex items-center justify-center mb-5">
                    <Leaf size={22} className="text-green-700" />
                  </div>
                  <div className="text-xs font-700 text-green-600 tracking-widest uppercase mb-3">Mission</div>
                  <h3 className="font-display font-700 text-gray-900 text-2xl mb-4 leading-snug">
                    Deliver farm-fresh meal kits that reduce cooking time by 70%, without compromise
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Using HACCP-compliant processing, MAP technology, and direct farm partnerships to ensure every pack is safe, fresh, and authentic.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Values — 4 cards with icons */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Shield, title: 'Food Safety First',    desc: 'HACCP protocols at every production stage. No shortcuts.',                   color: '#3b82f6' },
                { icon: Sprout, title: 'Farm Direct',          desc: 'Direct partnerships with Kanchipuram farmers. No middlemen.',               color: '#22c55e' },
                { icon: Zap,    title: 'Radically Convenient', desc: 'Every product decision is made with your time in mind.',                    color: '#f59e0b' },
                { icon: Heart,  title: 'Preserve Tradition',   desc: 'We honour authentic recipes — no dumbed-down shortcuts.',                   color: '#ef4444' },
              ].map((v, i) => {
                const Icon = v.icon
                return (
                  <motion.div key={i} custom={i + 2} initial="hidden" animate={missionInView ? 'show' : 'hidden'} variants={fadeUp}
                    className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:-translate-y-1.5 hover:shadow-md transition-all duration-300 group"
                    style={{ borderTop: `3px solid ${v.color}` }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: `${v.color}12`, border: `1.5px solid ${v.color}28` }}>
                      <Icon size={18} style={{ color: v.color }} />
                    </div>
                    <h4 className="font-700 text-gray-900 mb-2">{v.title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Target Audience ── */}
        <section ref={audienceRef} className="py-14 sm:py-24 relative overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #040C06 0%, #071408 55%, #0A1E0D 100%)' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 40% 50%, rgba(34,197,94,0.06), transparent 65%)' }} />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={audienceInView ? { opacity: 1, y: 0 } : {}}
              className="text-center mb-14"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full mb-5">
                <Users size={13} className="text-green-400" />
                <span className="text-green-400 text-xs font-700 tracking-wide uppercase">Who We Serve</span>
              </div>
              <h2 className="font-display font-black text-white tracking-tighter"
                style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}>
                Built for Every{' '}
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #4ade80, #22c55e)' }}>
                  South Indian Home
                </span>
              </h2>
              <p className="text-green-100/40 text-lg mt-4 max-w-xl mx-auto">
                One product, four types of people who need it every single day.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: Users,  title: 'Working Professionals', desc: 'Get home at 8 PM and still cook a proper South Indian meal in 30 minutes.', accent: '#3b82f6', tag: 'Save Time' },
                { icon: Leaf,   title: 'Students',              desc: 'No culinary skills needed. Follow the guide and eat like home.',            accent: '#8b5cf6', tag: 'No Skill Needed' },
                { icon: Heart,  title: 'Young Families',        desc: 'Cook together. No complex prep. Healthy authentic meals every day.',         accent: '#22c55e', tag: 'Cook Together' },
                { icon: Award,  title: 'South Indian Diaspora', desc: 'Authentic Tamil Nadu flavours, accessible wherever you are in India.',       accent: '#f59e0b', tag: 'Taste of Home' },
              ].map((a, i) => {
                const Icon = a.icon
                return (
                  <motion.div
                    key={i} custom={i} initial="hidden" animate={audienceInView ? 'show' : 'hidden'} variants={fadeUp}
                    className="rounded-3xl relative overflow-hidden transition-all duration-350 hover:-translate-y-2 group"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `${a.accent}09`
                      e.currentTarget.style.border = `1px solid ${a.accent}30`
                      e.currentTarget.style.boxShadow = `0 20px 50px rgba(0,0,0,0.3)`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                      e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)'
                      e.currentTarget.style.boxShadow = ''
                    }}
                  >
                    {/* Top accent stripe */}
                    <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${a.accent}, transparent)` }} />
                    <div className="p-7">
                      <div className="flex items-start justify-between mb-5">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                          style={{ background: `${a.accent}15`, border: `1.5px solid ${a.accent}30` }}>
                          <Icon size={22} style={{ color: a.accent }} />
                        </div>
                        <span className="text-[10px] font-700 px-2.5 py-1 rounded-full tracking-wide"
                          style={{ background: `${a.accent}15`, color: a.accent, border: `1px solid ${a.accent}25` }}>
                          {a.tag}
                        </span>
                      </div>
                      <h3 className="font-700 text-white mb-2.5 text-base">{a.title}</h3>
                      <p className="text-green-100/45 text-sm leading-relaxed">{a.desc}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Market + Competitive Edge ── */}
        <section className="py-14 sm:py-24" style={{ background: '#FAFAF8' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="text-center mb-14"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-green-50 border border-green-200 rounded-full mb-5">
                <TrendingUp size={13} className="text-green-600" />
                <span className="text-green-700 text-xs font-700 tracking-wide uppercase">The Opportunity</span>
              </div>
              <h2 className="font-display font-black text-gray-900 tracking-tighter"
                style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}>
                Why Now. Why Us.
              </h2>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Market opportunity */}
              <motion.div
                initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-3xl p-8 lg:p-10 relative overflow-hidden"
                style={{ background: 'linear-gradient(145deg, #f0fdf4, #dcfce7)', border: '1.5px solid #bbf7d0' }}
              >
                <div className="absolute top-0 right-0 w-40 h-40"
                  style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.12), transparent 70%)' }} />
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 border border-green-200 rounded-full mb-6">
                  <TrendingUp size={13} className="text-green-700" />
                  <span className="text-green-700 text-xs font-700 tracking-wide uppercase">Market Opportunity</span>
                </div>
                <h3 className="font-display font-700 text-gray-900 text-2xl mb-7 leading-snug">
                  A massive market ready to be served
                </h3>
                <div className="space-y-4">
                  {[
                    "India's meal kit market growing at 18% CAGR",
                    'South Indian cuisine is the most-searched regional food category',
                    'Chennai metro alone: 1.2 million working households',
                    'No organised fresh-ingredient kit player for South Indian food',
                  ].map((point, i) => (
                    <motion.div key={i} className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                      transition={{ delay: 0.1 + i * 0.08 }}>
                      <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm font-500">{point}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Competitive edge */}
              <motion.div
                initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-3xl p-8 lg:p-10 relative overflow-hidden"
                style={{ background: 'linear-gradient(145deg, #071408, #0d2416)' }}
              >
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'radial-gradient(circle at 80% 20%, rgba(34,197,94,0.1), transparent 60%)' }} />
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
                    <Award size={13} className="text-green-400" />
                    <span className="text-green-400 text-xs font-700 tracking-wide uppercase">Competitive Edge</span>
                  </div>
                  <h3 className="font-display font-700 text-white text-2xl mb-7 leading-snug">Why Samachify wins</h3>
                  <div className="space-y-4">
                    {[
                      'Only brand focused exclusively on South Indian recipes',
                      'Semi-cooked essentials included (dal, tamarind extract)',
                      'HACCP + MAP technology — no competitor matches this',
                      'Direct farm sourcing from Kanchipuram ensures freshness',
                      'Beginner-friendly packs — no cooking experience required',
                    ].map((point, i) => (
                      <motion.div key={i} className="flex items-start gap-3"
                        initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                        transition={{ delay: 0.1 + i * 0.08 }}>
                        <div className="w-5 h-5 rounded-full bg-green-500/15 border border-green-400/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        </div>
                        <span className="text-green-100/65 text-sm font-500">{point}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Team ── */}
        <section ref={teamRef} className="py-14 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={teamInView ? { opacity: 1, y: 0 } : {}}
              className="text-center mb-14"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-green-50 border border-green-200 rounded-full mb-5">
                <Users size={13} className="text-green-600" />
                <span className="text-green-700 text-xs font-700 tracking-wide uppercase">Leadership</span>
              </div>
              <h2 className="font-display font-black text-gray-900 tracking-tighter"
                style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}>
                Meet Our{' '}
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #16a34a, #4ade80)' }}>
                  Team
                </span>
              </h2>
              <p className="text-gray-500 text-lg mt-4 max-w-xl mx-auto">
                The people behind Samachify — passionate about food, technology, and South Indian culture.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { role: 'Chief Executive Officer',  focus: 'Vision, Strategy & Brand',    quote: 'Bringing the soul of South Indian kitchens to modern households.',           accentColor: '#22c55e', badgeText: 'CEO' },
                { role: 'Chief Operations Officer', focus: 'Supply Chain & Production',   quote: 'Ensuring farm-fresh quality reaches every customer, every time.',             accentColor: '#3b82f6', badgeText: 'COO' },
                { role: 'Chief Finance Officer',    focus: 'Finance & Growth',            quote: 'Building a financially resilient path to scale across Tamil Nadu.',           accentColor: '#f59e0b', badgeText: 'CFO' },
              ].map((member, i) => (
                <motion.div
                  key={i} custom={i} initial="hidden" animate={teamInView ? 'show' : 'hidden'} variants={fadeUp}
                  className="bg-white rounded-3xl border border-gray-100 overflow-hidden group transition-all duration-300 hover:-translate-y-2"
                  style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.06)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 24px 60px rgba(0,0,0,0.12)` }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 20px rgba(0,0,0,0.06)' }}
                >
                  {/* Card top accent */}
                  <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${member.accentColor}, transparent)` }} />

                  <div className="p-8 text-center">
                    {/* Photo placeholder */}
                    <div className="relative mx-auto mb-6" style={{ width: '6.5rem', height: '6.5rem' }}>
                      <div className="w-full h-full rounded-full flex items-center justify-center relative"
                        style={{
                          background: 'linear-gradient(145deg, #f8fffe, #f0fdf4)',
                          border: '2.5px dashed #86efac',
                        }}>
                        <User size={36} className="text-green-300" />
                      </div>
                      {/* Photo-coming badge */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2.5 py-1 rounded-full whitespace-nowrap"
                        style={{ background: '#dcfce7', border: '1px solid #86efac' }}>
                        <Camera size={8} className="text-green-600 flex-shrink-0" />
                        <span className="text-[8px] font-700 text-green-700">Photo coming soon</span>
                      </div>
                      {/* Role badge */}
                      <div className="absolute -top-1.5 -right-1.5 w-9 h-9 rounded-2xl flex items-center justify-center text-white font-display font-black text-xs shadow-md"
                        style={{ background: `linear-gradient(135deg, ${member.accentColor}, ${member.accentColor}bb)` }}>
                        {member.badgeText}
                      </div>
                    </div>

                    <div className="text-xs font-700 tracking-widest uppercase mb-1.5"
                      style={{ color: member.accentColor }}>
                      {member.role}
                    </div>
                    <div className="font-700 text-gray-900 text-base mb-1">{member.focus}</div>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-4">
                      <div className="flex-1 h-px bg-gray-100" />
                      <Leaf size={11} className="text-green-400" />
                      <div className="flex-1 h-px bg-gray-100" />
                    </div>

                    <p className="text-gray-400 text-sm italic leading-relaxed">
                      &ldquo;{member.quote}&rdquo;
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom note */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-10 text-center"
            >
              <p className="text-gray-400 text-sm">
                Founded by food technologists and supply chain professionals passionate about South Indian cuisine.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Roadmap ── */}
        <section ref={roadmapRef} className="py-14 sm:py-24 relative overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #030A04 0%, #071408 55%, #0A1E0D 100%)' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(34,197,94,0.06), transparent 65%)' }} />
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 28 }} animate={roadmapInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-20"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
                <TrendingUp size={13} className="text-green-400" />
                <span className="text-green-400 text-xs font-700 tracking-widest uppercase">Our Journey</span>
              </div>
              <h2 className="font-display font-black text-white tracking-tighter mb-5 leading-[1.05]"
                style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
                From Idea{' '}
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #4ade80, #22c55e)' }}>
                  To Reality
                </span>
              </h2>
              <p className="text-green-100/45 text-lg max-w-xl mx-auto">
                Six milestones that built Samachify from a kitchen frustration into a certified food brand.
              </p>
            </motion.div>

            {/* Timeline */}
            <div className="relative">
              {/* Mobile-only left-side timeline line */}
              <div className="absolute left-5 top-0 bottom-0 w-0.5 md:hidden overflow-hidden rounded-full">
                <motion.div
                  className="absolute inset-0 origin-top"
                  style={{ background: 'linear-gradient(to bottom, #4ade80 0%, #16a34a 60%, rgba(22,163,74,0.15) 100%)' }}
                  initial={{ scaleY: 0 }}
                  animate={roadmapInView ? { scaleY: 1 } : { scaleY: 0 }}
                  transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                />
              </div>
              {/* Desktop center timeline line */}
              <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-0.5 hidden md:block overflow-hidden rounded-full">
                <motion.div
                  className="absolute inset-0 origin-top"
                  style={{ background: 'linear-gradient(to bottom, #4ade80 0%, #16a34a 60%, rgba(22,163,74,0.15) 100%)' }}
                  initial={{ scaleY: 0 }}
                  animate={roadmapInView ? { scaleY: 1 } : { scaleY: 0 }}
                  transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                />
              </div>

              <div className="space-y-6 sm:space-y-10">
                {[
                  { date: '2023',    title: 'The Idea Sparks',      desc: 'Frustrated by 45-minute prep times, the founders began researching the South Indian meal kit gap. The question was simple: why is home cooking so hard?', done: true,  icon: Zap      },
                  { date: '2024 Q1', title: 'Farm Partnerships',    desc: 'Direct partnerships with local farmers in Kanchipuram established. Cold-chain processing infrastructure built. Farm-to-pack traceability achieved.',     done: true,  icon: Sprout   },
                  { date: '2024 Q2', title: 'FSSAI Certification',  desc: 'Received License 22426421000333. No preservatives, no compromise — now officially certified. Quality became our foundation.',                           done: true,  icon: Shield   },
                  { date: '2024 Q3', title: 'First Packs Ship',     desc: 'Sambar Pack launched across Chennai. First customers cooked authentic meals in under 30 minutes. Zero compromise on taste.',                              done: true,  icon: Flame    },
                  { date: '2025',    title: 'Product Range Expands',desc: 'Five dish-specific packs live. Online ordering and wider Chennai delivery launched. Growing family of home chefs.',                                       done: false, icon: TrendingUp },
                  { date: '2026+',   title: 'Tamil Nadu Scale',     desc: 'Expanding to Coimbatore, Madurai, and beyond. Weekly family subscription packs. Samachify in every South Indian home.',                                  done: false, icon: MapPin   },
                ].map((m, i) => {
                  const Icon = m.icon
                  const isLeft = i % 2 === 0
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: isLeft ? -44 : 44 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                      className={`relative flex items-center gap-4 sm:gap-8 pl-12 md:pl-0 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                    >
                      {/* Mobile timeline node */}
                      <div className="md:hidden absolute left-0 flex-shrink-0 z-10">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{
                            background: m.done ? 'linear-gradient(135deg, #16a34a, #14532d)' : 'rgba(245,158,11,0.1)',
                            border: m.done ? '2px solid #4ade80' : '2px solid rgba(245,158,11,0.4)',
                            boxShadow: m.done ? '0 0 16px rgba(74,222,128,0.3)' : 'none',
                          }}
                        >
                          <Icon size={14} className={m.done ? 'text-white' : 'text-amber-400'} />
                        </div>
                      </div>

                      {/* Card */}
                      <div className="md:w-[calc(50%-2.5rem)] w-full">
                        <div
                          className="rounded-3xl p-6 sm:p-7 transition-all duration-300"
                          style={{
                            background: m.done ? 'rgba(255,255,255,0.05)' : 'rgba(245,158,11,0.04)',
                            border: m.done ? '1px solid rgba(74,222,128,0.15)' : '1px solid rgba(245,158,11,0.2)',
                          }}
                          onMouseEnter={(e) => {
                            const el = e.currentTarget as HTMLElement
                            el.style.background = m.done ? 'rgba(74,222,128,0.07)' : 'rgba(245,158,11,0.07)'
                            el.style.transform = 'translateY(-2px)'
                            el.style.boxShadow = '0 20px 50px rgba(0,0,0,0.3)'
                          }}
                          onMouseLeave={(e) => {
                            const el = e.currentTarget as HTMLElement
                            el.style.background = m.done ? 'rgba(255,255,255,0.05)' : 'rgba(245,158,11,0.04)'
                            el.style.transform = ''
                            el.style.boxShadow = ''
                          }}
                        >
                          <div className={`inline-flex items-center gap-1.5 text-xs font-700 tracking-widest px-3 py-1.5 rounded-full border mb-4 ${
                            m.done ? 'text-green-400 border-green-500/30' : 'text-amber-400 border-amber-500/30'
                          }`} style={{ background: m.done ? 'rgba(74,222,128,0.1)' : 'rgba(245,158,11,0.1)' }}>
                            {m.done ? <CheckCircle size={10} /> : <Timer size={10} />}
                            {m.date}
                          </div>
                          <h3 className="font-display font-700 text-white text-lg mb-2.5 leading-snug">{m.title}</h3>
                          <p className="text-green-100/45 text-sm leading-relaxed">{m.desc}</p>
                        </div>
                      </div>

                      {/* Center node */}
                      <div className="hidden md:flex flex-shrink-0 flex-col items-center relative z-10">
                        <motion.div
                          className="w-14 h-14 rounded-full flex items-center justify-center"
                          style={{
                            background: m.done ? 'linear-gradient(135deg, #16a34a, #14532d)' : 'rgba(245,158,11,0.1)',
                            border: m.done ? '3px solid #4ade80' : '2px solid rgba(245,158,11,0.4)',
                            boxShadow: m.done ? '0 0 24px rgba(74,222,128,0.35)' : '0 0 12px rgba(245,158,11,0.15)',
                          }}
                          whileInView={{ scale: [0.5, 1.15, 1] }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                        >
                          <Icon size={20} className={m.done ? 'text-white' : 'text-amber-400'} />
                        </motion.div>
                      </div>

                      <div className="md:w-[calc(50%-2.5rem)] hidden md:block" />
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section
          className="py-14 sm:py-24 relative overflow-hidden"
          style={{ background: 'linear-gradient(145deg, #040C06, #071408 60%, #0A1E0D)' }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(74,222,128,0.12) 1px, transparent 0)',
              backgroundSize: '32px 32px',
              opacity: 0.4,
            }} />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 50% 50%, rgba(34,197,94,0.08), transparent 70%)' }} />
          <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
                <Sprout size={13} className="text-green-400" />
                <span className="text-green-400 text-xs font-700 tracking-widest uppercase">Explore Our Packs</span>
              </div>
              <h2 className="font-display font-black text-white tracking-tighter mb-4"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                Ready to experience it?
              </h2>
              <p className="text-green-100/45 mb-10 leading-relaxed text-lg">
                Explore our full product range and see how we are making authentic South Indian cooking effortless.
              </p>
              <Link to="/products"
                className="inline-flex items-center gap-2.5 px-9 py-4 bg-green-500 hover:bg-green-400 text-black font-700 rounded-2xl transition-all duration-250 hover:-translate-y-1 hover:scale-[1.02]"
                style={{ boxShadow: '0 6px 28px rgba(34,197,94,0.4)' }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 16px 48px rgba(34,197,94,0.55)' }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 6px 28px rgba(34,197,94,0.4)' }}
              >
                Explore Products <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
