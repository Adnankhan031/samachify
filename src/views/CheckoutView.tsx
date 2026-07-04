'use client'

import { useState } from 'react'
import { Link, useNavigate } from '@/lib/nav'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingBag, MapPin, Phone, Mail, User, Truck, Wallet, CreditCard,
  CheckCircle2, ArrowRight, Loader2, ShieldCheck, ArrowLeft,
} from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'

const FREE_DELIVERY_THRESHOLD = 299
const DELIVERY_FEE = 39

type PayMethod = 'cod' | 'razorpay'

export default function CheckoutView() {
  const { items, totalPrice, totalItems, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  })
  const [pay, setPay] = useState<PayMethod>('cod')
  const [placing, setPlacing] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const deliveryFee = totalPrice >= FREE_DELIVERY_THRESHOLD || totalPrice === 0 ? 0 : DELIVERY_FEE
  const grandTotal = totalPrice + deliveryFee

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!/^[0-9]{10}$/.test(form.phone.replace(/\D/g, ''))) e.phone = 'Enter a 10-digit phone number'
    if (!form.address.trim()) e.address = 'Required'
    if (!form.city.trim()) e.city = 'Required'
    if (!/^[0-9]{6}$/.test(form.pincode)) e.pincode = 'Enter a 6-digit pincode'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setPlacing(true)
    // Phase 3/4: persist order to Supabase; for Razorpay, open checkout + verify signature server-side.
    await new Promise((r) => setTimeout(r, 900))
    const id = 'SM' + Date.now().toString().slice(-8)
    setOrderId(id)
    clearCart()
    setPlacing(false)
  }

  // ── Success screen ──
  if (orderId) {
    return (
      <main className="min-h-screen flex items-center justify-center px-5 py-24" style={{ background: 'var(--cream)' }}>
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-lg bg-white rounded-3xl border border-gray-100 shadow-xl p-8 sm:p-10 text-center"
        >
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.15 }}
            className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 size={44} className="text-green-600" />
          </motion.div>
          <h1 className="font-display font-900 text-gray-900 text-2xl mb-2">Order confirmed!</h1>
          <p className="text-gray-500 mb-6">
            Thank you, {form.name.split(' ')[0]}. Your fresh packs are on their way.
          </p>
          <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left">
            <div className="flex justify-between py-1.5 text-sm">
              <span className="text-gray-500">Order ID</span>
              <span className="font-800 text-gray-900">{orderId}</span>
            </div>
            <div className="flex justify-between py-1.5 text-sm">
              <span className="text-gray-500">Payment</span>
              <span className="font-700 text-gray-900">{pay === 'cod' ? 'Cash on Delivery' : 'Razorpay'}</span>
            </div>
            <div className="flex justify-between py-1.5 text-sm">
              <span className="text-gray-500">Total</span>
              <span className="font-800 text-green-700">₹{grandTotal}</span>
            </div>
          </div>
          <Link to="/products" className="inline-flex items-center gap-2 px-7 py-3.5 bg-green-600 hover:bg-green-700 text-white font-800 rounded-2xl transition-colors">
            Continue shopping <ArrowRight size={16} />
          </Link>
        </motion.div>
      </main>
    )
  }

  // ── Empty cart ──
  if (items.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center px-5 py-24" style={{ background: 'var(--cream)' }}>
        <div className="text-center">
          <div className="w-20 h-20 rounded-3xl bg-white border border-gray-100 flex items-center justify-center mx-auto mb-5 shadow-sm">
            <ShoppingBag size={32} className="text-gray-300" />
          </div>
          <h1 className="font-display font-800 text-gray-900 text-xl mb-2">Your cart is empty</h1>
          <p className="text-gray-500 mb-6">Add a few packs before checking out.</p>
          <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3.5 bg-green-600 hover:bg-green-700 text-white font-700 rounded-2xl transition-colors">
            Browse products <ArrowRight size={15} />
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--cream)' }}>
      <div className="max-w-6xl mx-auto">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm font-600 text-gray-500 hover:text-gray-800 mb-6 transition-colors">
          <ArrowLeft size={15} /> Continue shopping
        </Link>
        <h1 className="font-display font-900 text-gray-900 tracking-tight mb-8" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}>
          Checkout
        </h1>

        <form onSubmit={placeOrder} className="grid lg:grid-cols-[1.4fr_1fr] gap-8 items-start">
          {/* ── Left: details ── */}
          <div className="space-y-6">
            {/* Delivery */}
            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-7">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
                  <MapPin size={17} className="text-green-600" />
                </div>
                <h2 className="font-display font-800 text-gray-900 text-lg">Delivery details</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <TextField icon={User} label="Full name" value={form.name} onChange={set('name')} error={errors.name} placeholder="Your name" />
                <TextField icon={Phone} label="Phone" value={form.phone} onChange={set('phone')} error={errors.phone} placeholder="10-digit mobile" />
                <div className="sm:col-span-2">
                  <TextField icon={Mail} label="Email" value={form.email} onChange={set('email')} error={errors.email} placeholder="you@example.com" />
                </div>
                <div className="sm:col-span-2">
                  <TextField icon={MapPin} label="Address" value={form.address} onChange={set('address')} error={errors.address} placeholder="House no, street, area" />
                </div>
                <TextField label="City" value={form.city} onChange={set('city')} error={errors.city} placeholder="City" />
                <TextField label="Pincode" value={form.pincode} onChange={set('pincode')} error={errors.pincode} placeholder="6-digit pincode" />
              </div>
            </section>

            {/* Payment */}
            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-7">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
                  <Wallet size={17} className="text-green-600" />
                </div>
                <h2 className="font-display font-800 text-gray-900 text-lg">Payment method</h2>
              </div>
              <div className="space-y-3">
                <PayOption
                  active={pay === 'cod'} onClick={() => setPay('cod')}
                  icon={Truck} title="Cash on Delivery" desc="Pay with cash or UPI when your order arrives."
                />
                <PayOption
                  active={pay === 'razorpay'} onClick={() => setPay('razorpay')}
                  icon={CreditCard} title="Pay online (Razorpay)" desc="UPI, cards & netbanking — enabling soon."
                  badge="Coming soon" disabled
                />
              </div>
              <div className="flex items-center gap-2 mt-5 text-xs text-gray-400">
                <ShieldCheck size={14} className="text-green-500" /> Your details are kept private and secure.
              </div>
            </section>
          </div>

          {/* ── Right: order summary ── */}
          <aside className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-7 lg:sticky lg:top-24">
            <h2 className="font-display font-800 text-gray-900 text-lg mb-5">Order summary</h2>
            <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3 items-center">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-green-600 text-white text-[10px] font-800 flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-700 text-gray-900 text-sm truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">₹{item.price} each</p>
                  </div>
                  <span className="font-800 text-gray-900 text-sm">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4 space-y-2.5">
              <Row label={`Subtotal (${totalItems} item${totalItems !== 1 ? 's' : ''})`} value={`₹${totalPrice}`} />
              <Row
                label="Delivery"
                value={deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                accent={deliveryFee === 0}
              />
              <div className="flex justify-between items-baseline pt-2.5 border-t border-gray-100">
                <span className="font-800 text-gray-900">Total</span>
                <span className="font-display font-900 text-gray-900 text-2xl">₹{grandTotal}</span>
              </div>
            </div>

            <button
              type="submit" disabled={placing}
              className="w-full flex items-center justify-center gap-2 mt-6 py-4 bg-green-600 hover:bg-green-700 disabled:opacity-70 text-white font-800 rounded-2xl transition-all"
              style={{ boxShadow: '0 10px 26px rgba(73,138,12,0.32)' }}
            >
              <AnimatePresence mode="wait">
                {placing ? (
                  <motion.span key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <Loader2 size={18} className="animate-spin" /> Placing order…
                  </motion.span>
                ) : (
                  <motion.span key="p" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    Place order · ₹{grandTotal} <ArrowRight size={17} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">
              By placing this order you agree to our terms.
            </p>
          </aside>
        </form>
      </div>
    </main>
  )
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className={accent ? 'font-800 text-green-600' : 'font-700 text-gray-900'}>{value}</span>
    </div>
  )
}

function TextField({
  icon: Icon, label, value, onChange, error, placeholder,
}: {
  icon?: React.ElementType
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="block text-xs font-700 text-gray-600 mb-1.5">{label}</span>
      <div className={`flex items-center gap-2.5 px-4 py-3 bg-white border rounded-2xl transition-all focus-within:ring-2 focus-within:ring-green-100 ${error ? 'border-red-300' : 'border-gray-200 focus-within:border-green-400'}`}>
        {Icon && <Icon size={16} className="text-gray-400 flex-shrink-0" />}
        <input
          value={value} onChange={onChange} placeholder={placeholder}
          className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400 text-sm"
        />
      </div>
      {error && <span className="text-xs text-red-500 mt-1 block">{error}</span>}
    </label>
  )
}

function PayOption({
  active, onClick, icon: Icon, title, desc, badge, disabled,
}: {
  active: boolean
  onClick: () => void
  icon: React.ElementType
  title: string
  desc: string
  badge?: string
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-3.5 p-4 rounded-2xl border text-left transition-all ${
        active ? 'border-green-400 bg-green-50/60 ring-2 ring-green-100' : 'border-gray-200 hover:border-gray-300'
      } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${active ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-800 text-gray-900 text-sm">{title}</span>
          {badge && <span className="text-[10px] font-700 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">{badge}</span>}
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </div>
      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${active ? 'border-green-600' : 'border-gray-300'}`}>
        {active && <span className="w-2.5 h-2.5 rounded-full bg-green-600" />}
      </span>
    </button>
  )
}
