'use client'

import { Link } from '@/lib/nav'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, ArrowLeft } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'

const FREE_DELIVERY_THRESHOLD = 380

export default function CartView() {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart()
  const { user } = useAuth()

  const freeByOrderValue = totalPrice >= FREE_DELIVERY_THRESHOLD

  if (items.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center px-5 py-24" style={{ background: 'var(--cream)' }}>
        <div className="text-center">
          <div className="w-24 h-24 rounded-3xl bg-white border border-gray-100 flex items-center justify-center mx-auto mb-6 shadow-sm">
            <ShoppingBag size={38} className="text-gray-300" />
          </div>
          <h1 className="font-display font-900 text-gray-900 text-2xl mb-2">Your cart is empty</h1>
          <p className="text-gray-500 mb-7 max-w-sm mx-auto">Looks like you haven&apos;t added any fresh packs yet. Let&apos;s fix that.</p>
          <Link to="/products" className="inline-flex items-center gap-2 px-7 py-3.5 bg-green-600 hover:bg-green-700 text-white font-800 rounded-2xl transition-colors">
            Browse products <ArrowRight size={16} />
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
          Your Cart <span className="text-gray-300 font-700 text-2xl">({totalItems})</span>
        </h1>

        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8 items-start">
          {/* Items */}
          <div className="space-y-3">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.productId}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  className="flex gap-4 p-4 bg-white rounded-3xl border border-gray-100 shadow-sm"
                >
                  <Link to={`/products/${item.productId}`} className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-50">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </Link>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link to={`/products/${item.productId}`} className="font-display font-800 text-gray-900 hover:text-green-700 transition-colors">
                          {item.name}
                        </Link>
                        <p className="text-sm text-gray-400 font-600 mt-0.5">₹{item.price} each</p>
                      </div>
                      <button onClick={() => removeItem(item.productId)} aria-label={`Remove ${item.name}`}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1">
                        <Trash2 size={17} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-3">
                      <div className="flex items-center gap-1 border border-gray-200 rounded-xl">
                        <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} aria-label="Decrease"
                          className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-green-600 transition-colors">
                          <Minus size={15} />
                        </button>
                        <span className="w-8 text-center font-800 text-gray-900">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} aria-label="Increase"
                          className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-green-600 transition-colors">
                          <Plus size={15} />
                        </button>
                      </div>
                      <span className="font-display font-900 text-gray-900 text-lg">₹{item.price * item.quantity}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <aside className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-7 lg:sticky lg:top-24">
            <h2 className="font-display font-800 text-gray-900 text-lg mb-5">Order summary</h2>
            <div className="space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-700 text-gray-900">₹{totalPrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Delivery</span>
                <span className={freeByOrderValue ? 'font-800 text-green-600' : 'font-700 text-gray-900'}>
                  {freeByOrderValue ? 'FREE' : 'Calculated at checkout'}
                </span>
              </div>
              {!freeByOrderValue && (
                <p className="text-xs text-gray-400">Add ₹{FREE_DELIVERY_THRESHOLD - totalPrice} more for free delivery.</p>
              )}
              <div className="flex justify-between items-baseline pt-3 border-t border-gray-100">
                <span className="font-800 text-gray-900">Total</span>
                <span className="font-display font-900 text-gray-900 text-2xl">₹{totalPrice}{freeByOrderValue ? '' : '+'}</span>
              </div>
              {!freeByOrderValue && <p className="text-xs text-gray-400">Road-distance delivery is added after you choose your map pin.</p>}
            </div>
            <Link to={user ? '/checkout' : '/login?redirect=/checkout'}
              className="flex items-center justify-center gap-2 w-full mt-6 py-4 bg-green-600 hover:bg-green-700 text-white font-800 rounded-2xl transition-colors"
              style={{ boxShadow: '0 10px 26px rgba(73,138,12,0.32)' }}>
              Proceed to checkout <ArrowRight size={16} />
            </Link>
          </aside>
        </div>
      </div>
    </main>
  )
}
