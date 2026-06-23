import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, type Variants } from 'framer-motion'
import {
  ArrowRight, CheckCircle, TrendingUp, Leaf, Users, Award,
  Shield, Sprout, Flame, Target, Heart, Timer, Zap, MapPin,
  User, Briefcase, GraduationCap, PersonStanding, Salad, Building2,
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
      <main className="pt-20 overflow-x-hidden min-h-screen" style={{ background: '#050902' }}>

        {/* ── Hero ── */}
        <section className="relative overflow-hidden py-0"
          style={{ background: 'linear-gradient(160deg, #070d03, #0b1606 55%, #142405)', minHeight: '72vh' }}>

          {/* Dot-grid background */}
          <div className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(193,255,114,0.14) 1px, transparent 0)',
              backgroundSize: '36px 36px',
              opacity: 0.55,
            }} />
          {/* Radial glows */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 70% 40%, rgba(154,187,80,0.1), transparent 55%)' }} />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 20% 80%, rgba(154,187,80,0.07), transparent 45%)' }} />

          {/* Floating leaves */}
          <motion.div className="absolute right-[12%] top-[18%] pointer-events-none hidden lg:block z-10"
            animate={{ y: [0, -14, 0], rotate: [20, 38, 20] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
            <Leaf size={32} style={{ color: 'rgba(193,255,114,0.4)', filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.2))' }} />
          </motion.div>
          <motion.div className="absolute left-[8%] top-[35%] pointer-events-none hidden lg:block z-10"
            animate={{ y: [0, 12, 0], rotate: [-15, -30, -15] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}>
            <Leaf size={22} style={{ color: 'rgba(154,187,80,0.3)' }} />
          </motion.div>
          <motion.div className="absolute right-[28%] bottom-[22%] pointer-events-none hidden lg:block z-10"
            animate={{ y: [0, 10, 0], rotate: [32, 18, 32] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}>
            <Leaf size={18} style={{ color: 'rgba(193,255,114,0.25)' }} />
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
                style={{ backgroundImage: 'linear-gradient(135deg, #c1ff72, #9abb50)' }}>
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
                { val: '4',  label: 'Authentic Recipes' },
                { val: '100%', label: 'Farm Fresh' },
              ].map((s, i) => (
                <motion.div key={i} className="text-center"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.44 + i * 0.08, duration: 0.5 }}
                >
                  <div className="font-display font-black text-green-400 leading-none"
                    style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', textShadow: '0 0 30px rgba(193,255,114,0.4)' }}>
                    {s.val}
                  </div>
                  <div className="text-green-300/40 text-xs font-600 tracking-widest uppercase mt-1">{s.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

        </section>

        {/* ── Story ── */}
        <section ref={storyRef} className="py-14 sm:py-24" style={{ background: '#f7fbef' }}>
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
                  We didn&apos;t study the market.<br />We lived the problem.
                </h2>
                <div className="space-y-5 text-gray-600 leading-relaxed text-[0.95rem]">
                  <p>We didn&apos;t start Samachify by studying a market; we started it by living the problem. As busy individuals who valued healthy food, we constantly struggled with meal preparation. Samachify is our solution to make home cooking effortless, without compromising on freshness or nutrition.</p>
                  <p>Samachify was founded to bridge the gap between fresh farm produce and busy modern kitchens. We wanted to make home cooking simple without compromising on health, freshness, or taste.</p>
                  <p className="font-600 text-gray-800">Millions of households struggle with time-consuming meal preparation despite wanting healthier food options. Samachify was created to close that gap — fresh, pre-cut, dish-specific ingredient packs, so you spend your time cooking, not prepping.</p>
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
                  { val: '100%', label: 'Farm Fresh',         icon: Sprout, color: '#9abb50', bg: 'rgba(154,187,80,0.07)',   border: 'rgba(154,187,80,0.22)'  },
                  { val: '0',    label: 'Preservatives Used', icon: Shield, color: '#3b82f6', bg: 'rgba(59,130,246,0.07)',  border: 'rgba(59,130,246,0.22)' },
                  { val: '4',   label: 'Authentic Recipes',  icon: Flame,  color: '#ef4444', bg: 'rgba(239,68,68,0.07)',   border: 'rgba(239,68,68,0.22)'  },
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
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #498a0c, #c1ff72)' }}>
                  Mission
                </span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-5 mb-10">
              {/* Vision — dark */}
              <motion.div custom={0} initial="hidden" animate={missionInView ? 'show' : 'hidden'} variants={fadeUp}
                className="p-6 sm:p-8 lg:p-10 rounded-3xl relative overflow-hidden group transition-all duration-300 hover:-translate-y-1"
                style={{ background: 'linear-gradient(145deg, #0b1606, #152708)' }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 30px 70px rgba(0,0,0,0.35)' }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '' }}
              >
                <div className="absolute top-0 right-0 w-56 h-56 pointer-events-none rounded-bl-full"
                  style={{ background: 'radial-gradient(circle, rgba(154,187,80,0.12), transparent 70%)' }} />
                <div className="absolute bottom-0 left-0 w-32 h-32 pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(193,255,114,0.05), transparent 70%)' }} />
                <div className="relative z-10">
                  <div className="w-13 h-13 rounded-2xl bg-green-500/15 border border-green-400/20 flex items-center justify-center mb-5 w-12 h-12">
                    <TrendingUp size={22} className="text-green-400" />
                  </div>
                  <div className="text-xs font-700 text-green-400/60 tracking-widest uppercase mb-3">Vision</div>
                  <h3 className="font-display font-700 text-white text-2xl mb-4 leading-snug">
                    Redefining the future of home cooking
                  </h3>
                  <p className="text-green-100/45 text-sm leading-relaxed">
                    To redefine the future of home cooking by transforming every kitchen into a place where fresh, nutritious meals are created effortlessly, while empowering farmers, reducing food waste, and building a healthier India.
                  </p>
                </div>
              </motion.div>

              {/* Mission — vibrant green */}
              <motion.div custom={1} initial="hidden" animate={missionInView ? 'show' : 'hidden'} variants={fadeUp}
                className="p-6 sm:p-8 lg:p-10 rounded-3xl relative overflow-hidden group transition-all duration-300 hover:-translate-y-1"
                style={{ background: 'linear-gradient(145deg, #f6ffe9, #daffaa)' }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 24px 60px rgba(154,187,80,0.2)' }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '' }}
              >
                <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(154,187,80,0.15), transparent 70%)' }} />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-green-200 border border-green-300 flex items-center justify-center mb-5">
                    <Leaf size={22} className="text-green-700" />
                  </div>
                  <div className="text-xs font-700 text-green-600 tracking-widest uppercase mb-3">Mission</div>
                  <h3 className="font-display font-700 text-gray-900 text-2xl mb-4 leading-snug">
                    Deliver farm-fresh meal kits, without compromise
                  </h3>
                  <ul className="space-y-2">
                    {[
                      'Reduce cooking preparation time',
                      'Support local farmers through direct sourcing',
                      'Minimise food wastage through portion-controlled packs',
                      'Deliver fresh, hygienic ingredients to modern consumers',
                      'Encourage healthy home-cooked meals over processed food',
                    ].map((m) => (
                      <li key={m} className="flex items-start gap-2 text-gray-600 text-sm leading-relaxed">
                        <CheckCircle size={15} className="text-green-700 mt-0.5 flex-shrink-0" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>

            {/* Values — 4 cards with icons */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Shield, title: 'Food Safety First',    desc: 'HACCP protocols at every production stage. No shortcuts.',                   color: '#3b82f6' },
                { icon: Sprout, title: 'Farm Direct',          desc: 'Direct partnerships with Kanchipuram farmers. No middlemen.',               color: '#9abb50' },
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
          style={{ background: 'linear-gradient(160deg, #070d03 0%, #0b1606 55%, #142405 100%)' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 40% 50%, rgba(154,187,80,0.06), transparent 65%)' }} />
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
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #c1ff72, #9abb50)' }}>
                  South Indian Home
                </span>
              </h2>
              <p className="text-green-100/40 text-lg mt-4 max-w-xl mx-auto">
                One product, six types of people who need it every single day.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: Briefcase,      title: 'Working Professionals',    desc: 'Get home late and still cook a proper South Indian meal in 10–15 minutes.',  accent: '#3b82f6', tag: 'Save Time' },
                { icon: Heart,          title: 'Nuclear Families',         desc: 'Cook together. No complex prep. Healthy authentic meals every day.',       accent: '#9abb50', tag: 'Cook Together' },
                { icon: GraduationCap,  title: 'Students',                 desc: 'No culinary skills needed. Follow the guide and eat like home.',          accent: '#8b5cf6', tag: 'No Skill Needed' },
                { icon: PersonStanding, title: 'Senior Citizens',          desc: 'No chopping or heavy lifting — just open, add, and cook.',                 accent: '#f59e0b', tag: 'Easy to Cook' },
                { icon: Salad,          title: 'Health-Conscious Consumers', desc: 'Fresh ingredients, zero preservatives, full control over what goes in.', accent: '#c1ff72', tag: 'No Preservatives' },
                { icon: Building2,      title: 'Busy Urban Households',    desc: 'Skip the grocery run. Everything pre-measured, delivered to your door.',   accent: '#14b8a6', tag: 'Zero Hassle' },
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
        <section className="py-14 sm:py-24" style={{ background: '#f7fbef' }}>
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
                style={{ background: 'linear-gradient(145deg, #f6ffe9, #daffaa)', border: '1.5px solid #c1ff72' }}
              >
                <div className="absolute top-0 right-0 w-40 h-40"
                  style={{ background: 'radial-gradient(circle, rgba(154,187,80,0.12), transparent 70%)' }} />
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 border border-green-200 rounded-full mb-6">
                  <TrendingUp size={13} className="text-green-700" />
                  <span className="text-green-700 text-xs font-700 tracking-wide uppercase">Market Opportunity</span>
                </div>
                <h3 className="font-display font-700 text-gray-900 text-2xl mb-4 leading-snug">
                  A massive market ready to be served
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  India&apos;s ready-to-cook food market is growing rapidly, driven by urban lifestyles, working professionals, and increasing demand for healthy convenience. The market is projected to exceed USD 12 billion by 2034.
                </p>
                <div className="space-y-4">
                  {[
                    "Projected to exceed USD 12 billion by 2034",
                    'South Indian cuisine is one of the most-searched regional food categories',
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
                style={{ background: 'linear-gradient(145deg, #0b1606, #152708)' }}
              >
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'radial-gradient(circle at 80% 20%, rgba(154,187,80,0.1), transparent 60%)' }} />
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
                    <Award size={13} className="text-green-400" />
                    <span className="text-green-400 text-xs font-700 tracking-wide uppercase">Competitive Edge</span>
                  </div>
                  <h3 className="font-display font-700 text-white text-2xl mb-4 leading-snug">Why Samachify wins</h3>
                  <p className="text-green-100/55 text-sm leading-relaxed mb-6">
                    Most convenience foods encourage consumption — Samachify encourages creation. Traditional cooking demands significant preparation, while food delivery removes cooking altogether. We occupy the missing middle ground, preserving the satisfaction of homemade cooking while eliminating the most tedious parts of meal preparation.
                  </p>
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
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #498a0c, #c1ff72)' }}>
                  Team
                </span>
              </h2>
              <p className="text-gray-500 text-lg mt-4 max-w-xl mx-auto">
                The people behind Samachify — passionate about food, technology, and South Indian culture.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 max-w-2xl mx-auto gap-6">
              {[
                { role: 'Founder & CEO', name: 'Vikram T', photo: '/assets/CEO.JPG', quote: 'Leading the vision to transform everyday cooking through innovative, farm-to-kitchen solutions — building a future where healthy home-cooked meals are convenient, accessible, and sustainable.', accentColor: '#9abb50', badgeText: 'CEO' },
                { role: 'Chief Operations Officer', name: 'AsifAli I', photo: '/assets/COO.jpg', quote: 'Transforming vision into execution by managing operations, optimising processes, and building a reliable farm-to-kitchen ecosystem — dedicated to operational excellence and continuous improvement.', accentColor: '#3b82f6', badgeText: 'COO' },
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
                    {/* Photo */}
                    <div className="relative mx-auto mb-6" style={{ width: '6.5rem', height: '6.5rem' }}>
                      {member.photo ? (
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="w-full h-full rounded-full object-cover"
                          style={{ border: `2.5px solid ${member.accentColor}` }}
                        />
                      ) : (
                        <div className="w-full h-full rounded-full flex items-center justify-center relative"
                          style={{
                            background: 'linear-gradient(145deg, #f9fff0, #f6ffe9)',
                            border: '2.5px dashed #aee75d',
                          }}>
                          <User size={36} className="text-green-300" />
                        </div>
                      )}
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
                    <div className="font-700 text-gray-900 text-base mb-1">{member.name}</div>

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
          style={{ background: 'linear-gradient(160deg, #050902 0%, #0b1606 55%, #142405 100%)' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(154,187,80,0.06), transparent 65%)' }} />
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
                Startup{' '}
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #c1ff72, #9abb50)' }}>
                  Roadmap
                </span>
              </h2>
              <p className="text-green-100/45 text-lg max-w-xl mx-auto">
                Four phases that take Samachify from validated idea to India&apos;s most trusted farm-to-kitchen brand.
              </p>
            </motion.div>

            {/* Timeline */}
            <div className="relative">
              {/* Mobile-only left-side timeline line */}
              <div className="absolute left-5 top-0 bottom-0 w-0.5 md:hidden overflow-hidden rounded-full">
                <motion.div
                  className="absolute inset-0 origin-top"
                  style={{ background: 'linear-gradient(to bottom, #c1ff72 0%, #498a0c 60%, rgba(73,138,12,0.15) 100%)' }}
                  initial={{ scaleY: 0 }}
                  animate={roadmapInView ? { scaleY: 1 } : { scaleY: 0 }}
                  transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                />
              </div>
              {/* Desktop center timeline line */}
              <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-0.5 hidden md:block overflow-hidden rounded-full">
                <motion.div
                  className="absolute inset-0 origin-top"
                  style={{ background: 'linear-gradient(to bottom, #c1ff72 0%, #498a0c 60%, rgba(73,138,12,0.15) 100%)' }}
                  initial={{ scaleY: 0 }}
                  animate={roadmapInView ? { scaleY: 1 } : { scaleY: 0 }}
                  transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                />
              </div>

              <div className="space-y-6 sm:space-y-10">
                {[
                  { date: 'Phase 1', title: 'Market Validation & Product Development', desc: 'Comprehensive market research into customer pain points, surveys, interviews, and pilot studies — validating the Samachify business model, designing and testing ready-to-cook prototypes, and establishing sourcing feasibility with local farmer networks.', done: true,  icon: Zap      },
                  { date: 'Phase 2', title: 'Pilot Launch & Customer Acquisition',      desc: 'Launching flagship ready-to-cook packs in target markets, gathering customer feedback to evaluate acceptance and experience, optimising packaging, shelf life, and logistics, and building brand awareness through digital marketing and community engagement.', done: false, icon: Sprout   },
                  { date: 'Phase 3', title: 'Regional Expansion & Strategic Partnerships', desc: 'Expanding the product portfolio with regional, traditional dish-specific packs, strengthening supply chains through farmer partnerships, partnering with retail and food distribution channels, and scaling across Chennai and key Tamil Nadu markets.', done: false, icon: TrendingUp },
                  { date: 'Phase 4', title: 'National Scale-Up & Ecosystem Development', desc: 'Expanding into major Indian cities, introducing subscription-based recurring delivery models, building a technology-enabled ordering platform, and establishing Samachify as the category leader in the ready-to-cook fresh food segment.', done: false, icon: MapPin   },
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
                            background: m.done ? 'linear-gradient(135deg, #498a0c, #2a4f07)' : 'rgba(245,158,11,0.1)',
                            border: m.done ? '2px solid #c1ff72' : '2px solid rgba(245,158,11,0.4)',
                            boxShadow: m.done ? '0 0 16px rgba(193,255,114,0.3)' : 'none',
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
                            border: m.done ? '1px solid rgba(193,255,114,0.15)' : '1px solid rgba(245,158,11,0.2)',
                          }}
                          onMouseEnter={(e) => {
                            const el = e.currentTarget as HTMLElement
                            el.style.background = m.done ? 'rgba(193,255,114,0.07)' : 'rgba(245,158,11,0.07)'
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
                          }`} style={{ background: m.done ? 'rgba(193,255,114,0.1)' : 'rgba(245,158,11,0.1)' }}>
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
                            background: m.done ? 'linear-gradient(135deg, #498a0c, #2a4f07)' : 'rgba(245,158,11,0.1)',
                            border: m.done ? '3px solid #c1ff72' : '2px solid rgba(245,158,11,0.4)',
                            boxShadow: m.done ? '0 0 24px rgba(193,255,114,0.35)' : '0 0 12px rgba(245,158,11,0.15)',
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

            {/* Long-Term Vision */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6 }}
              className="mt-16 rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden"
              style={{ background: 'rgba(193,255,114,0.06)', border: '1px solid rgba(193,255,114,0.2)' }}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full mb-5">
                <Sprout size={13} className="text-green-400" />
                <span className="text-green-400 text-xs font-700 tracking-widest uppercase">Long-Term Vision</span>
              </div>
              <p className="text-green-100/70 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
                To create India&apos;s most trusted farm-to-kitchen food ecosystem and become the preferred household brand for fresh, dish-ready cooking solutions — empowering healthier lifestyles, reducing food waste, and strengthening the connection between farmers and families.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section
          className="py-14 sm:py-24 relative overflow-hidden"
          style={{ background: 'linear-gradient(145deg, #070d03, #0b1606 60%, #142405)' }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(193,255,114,0.12) 1px, transparent 0)',
              backgroundSize: '32px 32px',
              opacity: 0.4,
            }} />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 50% 50%, rgba(154,187,80,0.08), transparent 70%)' }} />
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
                style={{ boxShadow: '0 6px 28px rgba(154,187,80,0.4)' }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 16px 48px rgba(154,187,80,0.55)' }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 6px 28px rgba(154,187,80,0.4)' }}
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
