import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Mail, Phone, MapPin, MessageCircle, Send, Instagram, Linkedin, Youtube,
  Leaf, ArrowRight, Clock, Shield, Zap, CheckCircle,
} from 'lucide-react'
import Footer from '../components/Footer'

const quickQueries = [
  'When will you launch?',
  'Do you deliver to my area?',
  'Are there any preservatives?',
  'What pack sizes are available?',
  'How fresh are the vegetables?',
  'Can I get a bulk order?',
]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const msg = encodeURIComponent(
      `Hi Samachify! I am ${form.name}.\n\nQuery: ${form.subject}\n\n${form.message}\n\nPhone: ${form.phone}`
    )
    window.open(`https://wa.me/919025115657?text=${msg}`, '_blank')
    setSubmitted(true)
  }

  const handleQuickQuery = (query: string) => {
    const msg = encodeURIComponent(`Hi Samachify! ${query}`)
    window.open(`https://wa.me/919025115657?text=${msg}`, '_blank')
  }

  return (
    <>
      <main className="pt-20 overflow-x-hidden min-h-screen" style={{ background: '#050902' }}>

        {/* ── Hero ── */}
        <section
          className="py-14 sm:py-20 relative overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #070d03, #0b1606 60%, #142405)' }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(193,255,114,0.08) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
          <motion.div className="absolute pointer-events-none rounded-full"
            style={{ width: 420, height: 420, top: '-15%', right: '5%', background: 'radial-gradient(circle, rgba(154,187,80,0.09), transparent 70%)' }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />
          {[
            { w: 5, h: 5, top: '25%', left: '8%', delay: 0 },
            { w: 4, h: 4, top: '65%', left: '88%', delay: 1.3 },
            { w: 6, h: 6, top: '70%', left: '22%', delay: 0.8 },
          ].map((p, i) => (
            <motion.div key={i} className="absolute rounded-full bg-green-400/20 pointer-events-none"
              style={{ width: p.w, height: p.h, top: p.top, left: p.left }}
              animate={{ y: [0, -18, 0], opacity: [0.25, 0.7, 0.25] }}
              transition={{ duration: 4 + i * 0.8, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
            />
          ))}

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
                <MessageCircle size={13} className="text-green-400" />
                <span className="text-green-400 text-xs font-600 tracking-wide uppercase">Get In Touch</span>
              </div>
            </motion.div>

            <motion.h1
              className="font-display font-black text-white tracking-tighter mb-4"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}
              initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            >
              Contact{' '}
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #c1ff72, #9abb50)' }}>
                Samachify
              </span>
            </motion.h1>
            <motion.p
              className="text-green-100/50 text-lg max-w-xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            >
              Have a question, feedback, or want to know when we launch in your area? We would love to hear from you.
            </motion.p>
          </div>
        </section>

        {/* ── Contact cards ── */}
        <section className="py-10 sm:py-14 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-3 gap-4 sm:gap-5">
              {[
                { icon: Mail,   title: 'Email Us',           value: 'samachifydotin@gmail.com', sub: 'Reply within 24 hours',     href: 'mailto:samachifydotin@gmail.com', accent: '#9abb50' },
                { icon: Phone,  title: 'Call or WhatsApp',   value: '+91 90251 15657',          sub: 'Mon–Sat, 9 AM – 7 PM',       href: 'tel:+919025115657',              accent: '#498a0c' },
                { icon: MapPin, title: 'Our Location',       value: 'Sathya Nagar, Kanchipuram', sub: 'Orikkai, Kanchipuram – 631502', href: '#map',                        accent: '#c1ff72' },
              ].map((c, i) => {
                const Icon = c.icon
                return (
                  <motion.a
                    key={i} href={c.href}
                    custom={i} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} variants={fadeUp}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="flex items-start gap-4 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-100 group-hover:bg-green-100 flex items-center justify-center flex-shrink-0 transition-colors duration-200">
                      <Icon size={20} style={{ color: c.accent }} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-700 text-gray-400 tracking-widest uppercase mb-1">{c.title}</div>
                      <div className="font-700 text-gray-900 text-sm break-all mb-0.5">{c.value}</div>
                      <div className="text-gray-400 text-xs">{c.sub}</div>
                    </div>
                  </motion.a>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Main content grid ── */}
        <section className="py-12 sm:py-16" style={{ background: '#f7fbef' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6 sm:gap-10">

              {/* Left */}
              <div className="space-y-5">

                {/* Quick queries */}
                <motion.div
                  initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center">
                      <Zap size={15} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-display font-700 text-gray-900 text-base">Quick Questions?</h3>
                      <p className="text-gray-400 text-xs">Tap to send a pre-filled WhatsApp message</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {quickQueries.map((q, qi) => (
                      <motion.button
                        key={q}
                        initial={{ opacity: 0, scale: 0.92 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: qi * 0.07, duration: 0.3 }}
                        whileHover={{ y: -2, transition: { duration: 0.15 } }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleQuickQuery(q)}
                        className="flex items-center gap-1.5 text-xs font-600 px-3 py-2 bg-green-50 border border-green-100 hover:bg-green-100 hover:border-green-200 text-green-700 rounded-xl transition-all"
                      >
                        {q} <ArrowRight size={9} />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Social */}
                <motion.div
                  initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center">
                      <MessageCircle size={15} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-display font-700 text-gray-900 text-base">Follow Samachify</h3>
                      <p className="text-gray-400 text-xs">Stay connected for updates & recipes</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: Instagram,    label: 'Instagram',  sub: '@samachify.in',           href: 'https://www.instagram.com/samachify.in/',                       color: 'from-pink-500 to-orange-400' },
                      { icon: Linkedin,     label: 'LinkedIn',   sub: 'Samachify Foods Pvt Ltd', href: 'https://www.linkedin.com/company/samachify-foods-pvt-ltd/',     color: 'from-blue-600 to-blue-500' },
                      { icon: Youtube,      label: 'YouTube',    sub: 'Recipe Videos',           href: 'https://www.youtube.com/@samachifydotin',                       color: 'from-red-600 to-red-500' },
                      { icon: MessageCircle, label: 'WhatsApp', sub: '+91 90251 15657',          href: 'https://wa.me/919025115657',                                    color: 'from-green-500 to-green-600' },
                    ].map((s, si) => {
                      const Icon = s.icon
                      return (
                        <motion.a
                          key={si} href={s.href} target="_blank" rel="noopener noreferrer"
                          initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }} transition={{ delay: 0.1 + si * 0.08, duration: 0.4 }}
                          whileHover={{ y: -3, transition: { duration: 0.15 } }}
                          className="flex items-center gap-3 p-4 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all group"
                        >
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                            <Icon size={16} className="text-white" />
                          </div>
                          <div>
                            <div className="font-700 text-gray-900 text-sm">{s.label}</div>
                            <div className="text-gray-400 text-xs">{s.sub}</div>
                          </div>
                        </motion.a>
                      )
                    })}
                  </div>
                </motion.div>

                {/* Map */}
                <motion.div
                  id="map"
                  initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                  className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm"
                >
                  <div className="h-52">
                    <iframe
                      title="Samachify Location"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62505.45095395046!2d79.66892!3d12.8342!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52c0c8a55de4cf%3A0x4a0c05bc22e76921!2sKanchipuram%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1234567890"
                      className="w-full h-full border-0"
                      loading="lazy"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-5 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0">
                      <MapPin size={15} className="text-green-600" />
                    </div>
                    <div>
                      <div className="font-700 text-gray-900 text-sm">73, Karmari Amman Kovil Street, Sathya Nagar</div>
                      <div className="text-gray-400 text-xs">Orikkai, Kanchipuram – 631502, Tamil Nadu</div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right: Form */}
              <motion.div
                initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center">
                    <MessageCircle size={18} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-display font-700 text-gray-900 text-xl">Send a Message</h3>
                    <p className="text-gray-400 text-sm">Submits via WhatsApp for fastest response</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-100 rounded-xl mb-6 mt-4">
                  <Leaf size={13} className="text-green-600 flex-shrink-0" />
                  <p className="text-green-700 text-xs font-600">Your message will open in WhatsApp — no login required.</p>
                </div>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-14"
                  >
                    <motion.div
                      className="w-16 h-16 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-5"
                      animate={{ scale: [1, 1.06, 1] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Send size={28} className="text-green-600" />
                    </motion.div>
                    <h4 className="font-display font-700 text-gray-900 text-xl mb-2">Message Sent!</h4>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                      WhatsApp has opened with your message. We typically reply within a few hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-6 text-green-600 hover:text-green-700 text-sm font-700 transition-colors"
                    >
                      Send another message →
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <motion.div
                        initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ delay: 0.22 }}
                      >
                        <label className="block text-sm font-700 text-gray-700 mb-1.5">Your Name</label>
                        <input
                          name="name" type="text" value={form.name} onChange={handleChange}
                          placeholder="Priya Sundaram" required
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-green-400 focus:bg-white transition-all"
                        />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ delay: 0.28 }}
                      >
                        <label className="block text-sm font-700 text-gray-700 mb-1.5">Phone (optional)</label>
                        <input
                          name="phone" type="tel" value={form.phone} onChange={handleChange}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-green-400 focus:bg-white transition-all"
                        />
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: 0.34 }}
                    >
                      <label className="block text-sm font-700 text-gray-700 mb-1.5">Subject</label>
                      <select
                        name="subject" value={form.subject} onChange={handleChange} required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-green-400 focus:bg-white transition-all"
                      >
                        <option value="">Select a topic</option>
                        <option>Delivery & Availability</option>
                        <option>Product Information</option>
                        <option>Quality or Freshness</option>
                        <option>Business / Bulk Orders</option>
                        <option>Press or Partnership</option>
                        <option>General Feedback</option>
                        <option>Other</option>
                      </select>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: 0.40 }}
                    >
                      <label className="block text-sm font-700 text-gray-700 mb-1.5">Message</label>
                      <textarea
                        name="message" value={form.message} onChange={handleChange}
                        placeholder="Tell us how we can help..." rows={5} required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-green-400 focus:bg-white transition-all resize-none"
                      />
                    </motion.div>

                    <motion.button
                      type="submit"
                      initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: 0.46 }}
                      whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 py-4 bg-green-600 hover:bg-green-500 text-white font-700 rounded-xl transition-all text-sm"
                      style={{ boxShadow: '0 4px 18px rgba(73,138,12,0.28)' }}
                    >
                      <MessageCircle size={16} /> Send via WhatsApp
                    </motion.button>

                    {/* Trust row below button */}
                    <div className="flex flex-wrap items-center justify-center gap-4 pt-2 border-t border-gray-100">
                      {[
                        { icon: Shield,      text: 'FSSAI Certified' },
                        { icon: CheckCircle, text: 'No spam, ever' },
                        { icon: Clock,       text: 'Reply in 24 hrs' },
                      ].map((t, ti) => {
                        const Icon = t.icon
                        return (
                          <div key={ti} className="flex items-center gap-1.5 text-gray-400 text-xs">
                            <Icon size={12} className="text-green-500" />
                            <span>{t.text}</span>
                          </div>
                        )
                      })}
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
