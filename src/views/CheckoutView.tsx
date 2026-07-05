'use client'

import { useEffect, useState } from 'react'
import { Link, useNavigate } from '@/lib/nav'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingBag, MapPin, Phone, Mail, User, Truck, Wallet, CreditCard,
  CheckCircle2, ArrowRight, Loader2, ShieldCheck, ArrowLeft,
  Home, Briefcase, ChevronDown, Plus,
} from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { listAddresses, createAddress, type Address } from '@/lib/addresses'

const FREE_DELIVERY_THRESHOLD = 299
const DELIVERY_FEE = 39

// Online payments show up only when the Razorpay public key is configured.
const RAZORPAY_ENABLED = !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID

type PayMethod = 'cod' | 'razorpay'

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    Razorpay?: any
  }
}

/** Loads the Razorpay checkout script once. */
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) return resolve(true)
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = () => resolve(true)
    s.onerror = () => resolve(false)
    document.body.appendChild(s)
  })
}

export default function CheckoutView() {
  const { items, totalPrice, totalItems, clearCart } = useCart()
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  // Checkout requires an account (for order history & tracking). Guests are
  // sent to sign in, then bounced straight back here.
  useEffect(() => {
    if (!authLoading && !user) navigate('/login?redirect=/checkout')
  }, [authLoading, user, navigate])

  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: '',
    pincode: '',
    houseNo: '',
    area: '',
    landmark: '',
    city: '',
    state: '',
    addressType: 'Home',
  })
  const [pay, setPay] = useState<PayMethod>('cod')
  const [placing, setPlacing] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Saved addresses: load once the user is known, prefill from the default.
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [saveAddress, setSaveAddress] = useState(true)

  // Prefill contact name/phone from the account (email comes from the account too).
  useEffect(() => {
    if (!user) return
    setForm((f) => ({
      ...f,
      name: f.name || user.name,
      email: f.email || user.email,
      phone: f.phone || user.phone,
    }))
  }, [user])

  useEffect(() => {
    if (!user) return
    listAddresses().then((rows) => {
      setSavedAddresses(rows)
      const def = rows.find((r) => r.is_default) ?? rows[0]
      if (def) { applyAddress(def); setSaveAddress(false) }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const applyAddress = (a: Address) => {
    setSelectedAddressId(a.id)
    setForm((f) => ({
      ...f,
      name: a.name || f.name,
      phone: a.phone || f.phone,
      pincode: a.pincode,
      houseNo: a.house_no,
      area: a.area,
      landmark: a.landmark,
      city: a.city,
      state: a.state,
      addressType: a.label || 'Home',
    }))
  }

  // Switch to entering a brand-new address.
  const useNewAddress = () => {
    setSelectedAddressId(null)
    setSaveAddress(true)
    setForm((f) => ({ ...f, pincode: '', houseNo: '', area: '', landmark: '', city: '', state: '', addressType: 'Home' }))
  }

  const deliveryFee = totalPrice >= FREE_DELIVERY_THRESHOLD || totalPrice === 0 ? 0 : DELIVERY_FEE
  const grandTotal = totalPrice + deliveryFee

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!/^[0-9]{10}$/.test(form.phone.replace(/\D/g, ''))) e.phone = 'Enter a 10-digit mobile number'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!/^[0-9]{6}$/.test(form.pincode)) e.pincode = 'Enter a 6-digit pincode'
    if (!form.houseNo.trim()) e.houseNo = 'Required'
    if (!form.area.trim()) e.area = 'Required'
    if (!form.city.trim()) e.city = 'Required'
    if (!form.state.trim()) e.state = 'Select a state'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const cartPayload = () => items.map((i) => ({ productId: i.productId, quantity: i.quantity }))

  // Map the detailed Amazon-style fields to the API's customer shape.
  const customerPayload = () => ({
    name: form.name,
    email: form.email,
    phone: form.phone,
    address: `[${form.addressType}] ${form.houseNo}, ${form.area}` +
      `${form.landmark ? `, Landmark: ${form.landmark}` : ''}, ${form.state}`,
    city: form.city,
    pincode: form.pincode,
  })

  // Save the just-used address to the account, if it's new and the user opted in.
  const persistAddressIfNeeded = async () => {
    if (!user || !saveAddress || selectedAddressId) return
    try {
      await createAddress({
        label: form.addressType,
        name: form.name,
        phone: form.phone,
        pincode: form.pincode,
        house_no: form.houseNo,
        area: form.area,
        landmark: form.landmark,
        city: form.city,
        state: form.state,
        is_default: savedAddresses.length === 0, // first address becomes default
      })
    } catch { /* non-blocking: never fail an order over address saving */ }
  }

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    if (!validate()) return
    setPlacing(true)
    if (pay === 'razorpay') {
      await payWithRazorpay()
    } else {
      await payWithCOD()
    }
  }

  const payWithCOD = async () => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer: customerPayload(), items: cartPayload(), paymentMethod: 'cod' }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSubmitError(data.error || 'Something went wrong. Please try again.')
        return
      }
      await persistAddressIfNeeded()
      setOrderId(data.orderId)
      clearCart()
    } catch {
      setSubmitError('Network error. Please check your connection and try again.')
    } finally {
      setPlacing(false)
    }
  }

  const payWithRazorpay = async () => {
    try {
      const ok = await loadRazorpayScript()
      if (!ok) {
        setSubmitError('Could not load the payment window. Please try again.')
        setPlacing(false)
        return
      }
      // 1. Create a Razorpay order on the server (amount priced server-side)
      const res = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer: customerPayload(), items: cartPayload() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSubmitError(data.error || 'Could not start payment.')
        setPlacing(false)
        return
      }
      // 2. Open Razorpay checkout
      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        order_id: data.razorpayOrderId,
        name: 'Samachify',
        description: 'Fresh ready-to-cook packs',
        image: '/assets/logo.png',
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: '#4d8b14' },
        handler: async (response: {
          razorpay_order_id: string
          razorpay_payment_id: string
          razorpay_signature: string
        }) => {
          // 3. Verify signature + record the paid order
          const vres = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...response, customer: customerPayload(), items: cartPayload() }),
          })
          const vdata = await vres.json()
          if (!vres.ok) {
            setSubmitError(vdata.error || 'Payment could not be confirmed.')
            setPlacing(false)
            return
          }
          await persistAddressIfNeeded()
          setOrderId(vdata.orderId)
          clearCart()
          setPlacing(false)
        },
        modal: { ondismiss: () => setPlacing(false) },
      })
      rzp.on('payment.failed', () => {
        setSubmitError('Payment failed. Please try again.')
        setPlacing(false)
      })
      rzp.open()
    } catch {
      setSubmitError('Something went wrong starting the payment.')
      setPlacing(false)
    }
  }

  // ── Auth gate: block checkout until we know the user is signed in ──
  if (authLoading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center px-5 py-24" style={{ background: 'var(--cream)' }}>
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <Loader2 size={28} className="animate-spin text-green-600" />
          <p className="text-sm font-600">Taking you to sign in…</p>
        </div>
      </main>
    )
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
              <span className="font-800 text-gray-900">#{orderId.slice(0, 8).toUpperCase()}</span>
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
        <h1 className="font-display font-900 text-gray-900 tracking-tight mb-6" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}>
          Checkout
        </h1>

        {/* Signed-in confirmation — checkout always requires an account. */}
        <div className="flex items-center gap-2.5 mb-6 px-4 py-3 rounded-2xl bg-green-50/70 border border-green-100 text-sm">
          <span className="w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-800 flex-shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </span>
          <span className="text-green-800 font-600">Signed in as <span className="font-800">{user.email}</span> — your order will be saved to your account.</span>
        </div>

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
              {/* Contact */}
              <p className="text-[11px] font-700 uppercase tracking-wider text-gray-400 mb-3">Contact</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <TextField icon={User} label="Full name" value={form.name} onChange={set('name')} error={errors.name} placeholder="Your name" />
                <TextField icon={Phone} label="Mobile number" value={form.phone} onChange={set('phone')} error={errors.phone} placeholder="10-digit mobile" inputMode="numeric" maxLength={10} />
                <div className="sm:col-span-2">
                  <TextField icon={Mail} label="Email address" value={form.email} onChange={set('email')} error={errors.email} placeholder="you@example.com" />
                </div>
              </div>

              <div className="h-px bg-gray-100 my-6" />

              {/* Address */}
              <p className="text-[11px] font-700 uppercase tracking-wider text-gray-400 mb-3">Delivery address</p>

              {/* Saved-address picker */}
              {savedAddresses.length > 0 && (
                <div className="grid sm:grid-cols-2 gap-2.5 mb-4">
                  {savedAddresses.map((a) => {
                    const active = selectedAddressId === a.id
                    return (
                      <button
                        type="button" key={a.id} onClick={() => applyAddress(a)}
                        className={`text-left p-3.5 rounded-2xl border transition-all ${active ? 'border-green-500 bg-green-50/60 ring-2 ring-green-100' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[11px] font-800 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{a.label}</span>
                          {a.is_default && <span className="text-[10px] font-700 text-green-700">Default</span>}
                          {active && <CheckCircle2 size={14} className="text-green-600 ml-auto" />}
                        </div>
                        <p className="text-sm font-700 text-gray-900 truncate">{a.name} · {a.phone}</p>
                        <p className="text-xs text-gray-500 truncate">{a.house_no}, {a.area}, {a.city} — {a.pincode}</p>
                      </button>
                    )
                  })}
                  <button
                    type="button" onClick={useNewAddress}
                    className={`flex items-center justify-center gap-2 p-3.5 rounded-2xl border border-dashed text-sm font-700 transition-all ${selectedAddressId === null ? 'border-green-500 bg-green-50/60 text-green-700' : 'border-gray-300 text-gray-500 hover:border-gray-400'}`}
                  >
                    <Plus size={16} /> Deliver to a new address
                  </button>
                </div>
              )}

              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <TextField label="Pincode" value={form.pincode} onChange={set('pincode')} error={errors.pincode} placeholder="6-digit pincode" inputMode="numeric" maxLength={6} />
                </div>
                <TextField icon={MapPin} label="Flat, House no., Building, Company" value={form.houseNo} onChange={set('houseNo')} error={errors.houseNo} placeholder="e.g. 12A, Green Residency" />
                <TextField label="Area, Street, Sector, Village" value={form.area} onChange={set('area')} error={errors.area} placeholder="e.g. Anna Nagar, 2nd Main Road" />
                <TextField label="Landmark (optional)" value={form.landmark} onChange={set('landmark')} placeholder="e.g. Near Apollo Hospital" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <TextField label="Town / City" value={form.city} onChange={set('city')} error={errors.city} placeholder="City" />
                  <SelectField label="State" value={form.state} onChange={set('state')} error={errors.state} options={INDIAN_STATES} />
                </div>

                {/* Address type */}
                <div>
                  <span className="block text-xs font-700 text-gray-600 mb-2">Address type</span>
                  <div className="flex gap-2">
                    {(['Home', 'Work'] as const).map((t) => {
                      const Icon = t === 'Home' ? Home : Briefcase
                      const activeType = form.addressType === t
                      return (
                        <button
                          type="button" key={t}
                          onClick={() => setForm((f) => ({ ...f, addressType: t }))}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-700 border transition-all ${
                            activeType ? 'border-green-500 bg-green-50 text-green-700 ring-2 ring-green-100' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                          }`}
                        >
                          <Icon size={15} /> {t}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Offer to save a newly-entered address */}
                {selectedAddressId === null && (
                  <label className="flex items-center gap-2.5 pt-1 cursor-pointer select-none">
                    <input
                      type="checkbox" checked={saveAddress}
                      onChange={(e) => setSaveAddress(e.target.checked)}
                      className="w-4 h-4 accent-green-600"
                    />
                    <span className="text-sm text-gray-600 font-600">Save this address to my account for next time</span>
                  </label>
                )}
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
                  icon={CreditCard} title="Pay online (Razorpay)"
                  desc={RAZORPAY_ENABLED ? 'UPI, cards & netbanking — pay securely.' : 'UPI, cards & netbanking — enabling soon.'}
                  badge={RAZORPAY_ENABLED ? undefined : 'Coming soon'} disabled={!RAZORPAY_ENABLED}
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

            {submitError && (
              <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
                {submitError}
              </motion.p>
            )}

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
                    {pay === 'razorpay' ? 'Pay' : 'Place order'} · ₹{grandTotal} <ArrowRight size={17} />
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
  icon: Icon, label, value, onChange, error, placeholder, inputMode, maxLength,
}: {
  icon?: React.ElementType
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  placeholder?: string
  inputMode?: 'text' | 'numeric' | 'tel' | 'email'
  maxLength?: number
}) {
  return (
    <label className="block">
      <span className="block text-xs font-700 text-gray-600 mb-1.5">{label}</span>
      <div className={`flex items-center gap-2.5 px-4 py-3 bg-white border rounded-2xl transition-all focus-within:ring-2 focus-within:ring-green-100 ${error ? 'border-red-300' : 'border-gray-200 focus-within:border-green-400'}`}>
        {Icon && <Icon size={16} className="text-gray-400 flex-shrink-0" />}
        <input
          value={value} onChange={onChange} placeholder={placeholder}
          inputMode={inputMode} maxLength={maxLength}
          className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400 text-sm"
        />
      </div>
      {error && <span className="text-xs text-red-500 mt-1 block">{error}</span>}
    </label>
  )
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry',
  'Chandigarh', 'Andaman & Nicobar', 'Dadra & Nagar Haveli and Daman & Diu', 'Lakshadweep',
]

function SelectField({
  label, value, onChange, error, options,
}: {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  error?: string
  options: string[]
}) {
  return (
    <label className="block">
      <span className="block text-xs font-700 text-gray-600 mb-1.5">{label}</span>
      <div className={`relative flex items-center px-4 py-3 bg-white border rounded-2xl transition-all focus-within:ring-2 focus-within:ring-green-100 ${error ? 'border-red-300' : 'border-gray-200 focus-within:border-green-400'}`}>
        <select
          value={value} onChange={onChange}
          className={`w-full bg-transparent outline-none text-sm appearance-none pr-6 ${value ? 'text-gray-900' : 'text-gray-400'}`}
        >
          <option value="" disabled>Select state</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={16} className="text-gray-400 absolute right-4 pointer-events-none" />
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
