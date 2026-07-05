'use client'

import { useState } from 'react'
import { Link } from '@/lib/nav'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function ForgotPasswordView() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const res = await resetPassword(email)
    setLoading(false)
    if (res.error) { setError(res.error); return }
    setSent(res.message ?? 'Check your email for a reset link.')
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-5 py-24" style={{ background: 'var(--cream)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[420px]"
      >
        <Link to="/" className="inline-flex items-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-green-600/70">
            <img src="/assets/logo.png" alt="Samachify" className="w-full h-full object-cover" />
          </div>
          <span className="font-display font-800 text-gray-900 tracking-tight">SAMACHIFY</span>
        </Link>

        {sent ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 size={34} className="text-green-600" />
            </div>
            <h1 className="font-display font-900 text-gray-900 text-xl mb-2">Check your inbox</h1>
            <p className="text-gray-500 mb-6">{sent}</p>
            <Link to="/login" className="inline-flex items-center gap-2 text-green-700 font-800 hover:text-green-800">
              <ArrowLeft size={16} /> Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <h1 className="font-display font-900 text-gray-900 tracking-tight mb-2" style={{ fontSize: '2rem' }}>
              Forgot password?
            </h1>
            <p className="text-gray-500 mb-8">Enter your email and we&apos;ll send you a link to reset it.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="block text-xs font-700 text-gray-600 mb-1.5">Email</span>
                <div className="flex items-center gap-2.5 px-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-100 transition-all">
                  <Mail size={17} className="text-gray-400 flex-shrink-0" />
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" autoComplete="email"
                    className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </label>

              {error && (
                <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
                  {error}
                </motion.p>
              )}

              <button
                type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-green-600 hover:bg-green-700 disabled:opacity-70 text-white font-800 rounded-2xl transition-all"
                style={{ boxShadow: '0 8px 22px rgba(73,138,12,0.3)' }}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <>Send reset link <ArrowRight size={17} /></>}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              <Link to="/login" className="font-800 text-green-700 hover:text-green-800">Back to sign in</Link>
            </p>
          </>
        )}
      </motion.div>
    </main>
  )
}
