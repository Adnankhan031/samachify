'use client'

import { useEffect, useState } from 'react'
import { Link, useNavigate } from '@/lib/nav'
import { motion } from 'framer-motion'
import {
  Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, Loader2, Leaf,
  Truck, Heart, Zap, Star,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const PERKS = [
  { icon: Truck, text: 'Track every order live, door to door' },
  { icon: Heart, text: 'Save your favourite packs for one-tap reorder' },
  { icon: Zap, text: 'Checkout in seconds with saved addresses' },
]

export default function AuthView({ mode }: { mode: 'login' | 'signup' }) {
  const isSignup = mode === 'signup'
  const navigate = useNavigate()
  const { signIn, signUp, signInWithGoogle } = useAuth()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Where to send the user after a successful sign-in. Defaults to home so a
  // shopper can carry on browsing; the checkout flow sends ?redirect=/checkout.
  const [redirectTo, setRedirectTo] = useState('/')
  useEffect(() => {
    const target = new URLSearchParams(window.location.search).get('redirect')
    if (target && target.startsWith('/')) setRedirectTo(target)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setNotice(null)
    setLoading(true)
    const res = isSignup ? await signUp(name, email, password, phone) : await signIn(email, password)
    setLoading(false)
    if (res.error) { setError(res.error); return }
    if (res.message) { setNotice(res.message); return }
    navigate(redirectTo)
  }

  const handleGoogle = async () => {
    setError(null)
    const res = await signInWithGoogle(redirectTo)
    if (res.error) setError(res.error)
  }

  return (
    <main className="min-h-screen flex" style={{ background: 'var(--cream)' }}>
      {/* ── Left: brand panel (desktop only) ── */}
      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden">
        <img src="/assets/hero-all-products.webp" alt="" className="absolute inset-0 w-full h-full object-cover scale-105" />
        {/* Layered gradient for depth + text contrast */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(155deg, rgba(11,22,6,0.9) 0%, rgba(42,79,7,0.78) 55%, rgba(11,22,6,0.92) 100%)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 25% 15%, rgba(154,187,80,0.25), transparent 55%)' }} />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-14 text-white w-full">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2.5 w-fit">
            <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-white/30">
              <img src="/assets/logo.png" alt="Samachify" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-display font-800 tracking-tight leading-none">SAMACHIFY</div>
              <div className="text-[0.58rem] font-600 tracking-widest text-white/70 mt-0.5">FROM FARM TO PAN</div>
            </div>
          </Link>

          {/* Headline + perks */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6 backdrop-blur-sm">
              <Leaf size={13} className="text-green-300" />
              <span className="text-xs font-700 tracking-wide">FRESH FROM THE FARM</span>
            </div>
            <h2 className="font-display font-black tracking-tight leading-[1.08] mb-8" style={{ fontSize: '2.6rem' }}>
              Authentic South Indian<br />meals, <span className="text-green-300">ready in minutes.</span>
            </h2>

            <div className="space-y-3.5">
              {PERKS.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3.5">
                  <span className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                    <Icon size={16} className="text-green-300" />
                  </span>
                  <span className="text-white/85 text-[0.95rem] font-500">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trust + copyright */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className="text-green-300 fill-green-300" />
                ))}
              </div>
              <span className="text-white/70 text-sm font-600">Loved by home cooks across South India</span>
            </div>
            <div className="text-white/45 text-xs">© {new Date().getFullYear()} Samachify. All rights reserved.</div>
          </div>
        </div>
      </div>

      {/* ── Right: form ── */}
      <div className="flex-1 flex items-center justify-center px-5 py-10 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[430px]"
        >
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center justify-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-green-600/70">
              <img src="/assets/logo.png" alt="Samachify" className="w-full h-full object-cover" />
            </div>
            <span className="font-display font-800 text-gray-900 tracking-tight">SAMACHIFY</span>
          </Link>

          {/* Card */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-green-900/5 p-7 sm:p-9">
            <h1 className="font-display font-900 text-gray-900 tracking-tight mb-1.5" style={{ fontSize: '1.9rem' }}>
              {isSignup ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="text-gray-500 mb-7 text-[0.95rem]">
              {isSignup ? 'Join Samachify and start cooking fresh.' : 'Sign in to continue to Samachify.'}
            </p>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-3 py-3.5 border border-gray-200 rounded-2xl font-700 text-gray-700 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.99] transition-all mb-5"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
                <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" />
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs font-600 text-gray-400">or continue with email</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <Field icon={User} label="Full name">
                  <input
                    type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Your name" autoComplete="name"
                    className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
                  />
                </Field>
              )}
              {isSignup && (
                <Field icon={Phone} label="Mobile number (optional)">
                  <input
                    type="tel" value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10-digit mobile" autoComplete="tel" inputMode="numeric" maxLength={10}
                    className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
                  />
                </Field>
              )}
              <Field icon={Mail} label="Email">
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" autoComplete="email"
                  className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
                />
              </Field>
              <Field icon={Lock} label="Password">
                <input
                  type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSignup ? 'At least 8 characters' : 'Your password'}
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                  className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
                />
                <button type="button" onClick={() => setShowPw((v) => !v)} className="text-gray-400 hover:text-gray-600" aria-label="Toggle password visibility">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </Field>

              {!isSignup && (
                <div className="flex justify-end -mt-1">
                  <Link to="/forgot-password" className="text-sm font-700 text-green-700 hover:text-green-800">
                    Forgot password?
                  </Link>
                </div>
              )}

              {error && (
                <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
                  {error}
                </motion.p>
              )}
              {notice && (
                <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-2.5">
                  {notice}
                </motion.p>
              )}

              <button
                type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-green-600 hover:bg-green-700 disabled:opacity-70 text-white font-800 rounded-2xl transition-all hover:-translate-y-0.5"
                style={{ boxShadow: '0 8px 22px rgba(73,138,12,0.3)' }}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : (
                  <>{isSignup ? 'Create account' : 'Sign in'} <ArrowRight size={17} /></>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              {isSignup ? 'Already have an account? ' : "Don't have an account? "}
              <Link to={`${isSignup ? '/login' : '/signup'}${redirectTo !== '/' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`} className="font-800 text-green-700 hover:text-green-800">
                {isSignup ? 'Sign in' : 'Sign up'}
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-gray-400 mt-5 px-4">
            By continuing you agree to our{' '}
            <Link to="/legal/terms" className="underline hover:text-gray-600">Terms</Link> and{' '}
            <Link to="/legal/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>.
          </p>
        </motion.div>
      </div>
    </main>
  )
}

function Field({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-700 text-gray-600 mb-1.5">{label}</span>
      <div className="flex items-center gap-2.5 px-4 py-3.5 bg-gray-50/60 border border-gray-200 rounded-2xl focus-within:bg-white focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-100 transition-all">
        <Icon size={17} className="text-gray-400 flex-shrink-0" />
        {children}
      </div>
    </label>
  )
}
