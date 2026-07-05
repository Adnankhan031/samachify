'use client'

import { useState } from 'react'
import { Link, useNavigate } from '@/lib/nav'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function ResetPasswordView() {
  const { updatePassword } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password !== confirm) { setError('The two passwords don’t match.'); return }
    setLoading(true)
    const res = await updatePassword(password)
    setLoading(false)
    if (res.error) {
      setError(res.error.includes('session') || res.error.includes('Auth')
        ? 'This reset link has expired. Please request a new one.'
        : res.error)
      return
    }
    setDone(true)
    setTimeout(() => navigate('/'), 1600)
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

        {done ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 size={34} className="text-green-600" />
            </div>
            <h1 className="font-display font-900 text-gray-900 text-xl mb-2">Password updated</h1>
            <p className="text-gray-500">Taking you home…</p>
          </div>
        ) : (
          <>
            <h1 className="font-display font-900 text-gray-900 tracking-tight mb-2" style={{ fontSize: '2rem' }}>
              Set a new password
            </h1>
            <p className="text-gray-500 mb-8">Choose a strong password you don&apos;t use elsewhere.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <PwField label="New password" value={password} onChange={setPassword} show={showPw} onToggle={() => setShowPw((v) => !v)} placeholder="At least 8 characters" />
              <PwField label="Confirm new password" value={confirm} onChange={setConfirm} show={showPw} onToggle={() => setShowPw((v) => !v)} placeholder="Re-enter password" />

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
                {loading ? <Loader2 size={18} className="animate-spin" /> : <>Update password <ArrowRight size={17} /></>}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </main>
  )
}

function PwField({ label, value, onChange, show, onToggle, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; show: boolean; onToggle: () => void; placeholder: string
}) {
  return (
    <label className="block">
      <span className="block text-xs font-700 text-gray-600 mb-1.5">{label}</span>
      <div className="flex items-center gap-2.5 px-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-100 transition-all">
        <Lock size={17} className="text-gray-400 flex-shrink-0" />
        <input
          type={show ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} autoComplete="new-password"
          className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
        />
        <button type="button" onClick={onToggle} className="text-gray-400 hover:text-gray-600" aria-label="Toggle password visibility">
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </label>
  )
}
