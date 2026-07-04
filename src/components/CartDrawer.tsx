'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import { Link } from '@/lib/nav'
import { useCart } from '@/context/CartContext'

const FREE_DELIVERY_THRESHOLD = 299

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, totalPrice, totalItems } = useCart()

  const remainingForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - totalPrice)
  const progress = Math.min(100, (totalPrice / FREE_DELIVERY_THRESHOLD) * 100)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="fixed inset-0 z-[100]"
            style={{ background: 'rgba(7,13,3,0.5)', backdropFilter: 'blur(4px)' }}
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            className="fixed top-0 right-0 bottom-0 z-[101] w-full sm:w-[420px] bg-white flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
                  <ShoppingBag size={17} className="text-green-600" />
                </div>
                <div>
                  <h2 className="font-display font-800 text-gray-900 leading-none">Your Cart</h2>
                  <p className="text-xs text-gray-400 font-600 mt-0.5">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <button
                onClick={closeCart}
                aria-label="Close cart"
                className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {items.length === 0 ? (
              /* Empty state */
              <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
                <div className="w-20 h-20 rounded-3xl bg-gray-50 flex items-center justify-center mb-5">
                  <ShoppingBag size={32} className="text-gray-300" />
                </div>
                <h3 className="font-display font-800 text-gray-900 text-lg mb-1.5">Your cart is empty</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-[240px]">
                  Add some fresh ready-to-cook packs to get started.
                </p>
                <Link
                  to="/products"
                  onClick={closeCart}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-700 rounded-2xl text-sm transition-colors"
                >
                  Browse Products <ArrowRight size={15} />
                </Link>
              </div>
            ) : (
              <>
                {/* Free-delivery progress */}
                <div className="px-5 pt-4 pb-3 bg-green-50/50 border-b border-green-100/60">
                  <p className="text-xs font-600 text-gray-600 mb-2">
                    {remainingForFreeDelivery > 0 ? (
                      <>Add <span className="font-800 text-green-700">₹{remainingForFreeDelivery}</span> more for <span className="font-800 text-green-700">FREE delivery</span></>
                    ) : (
                      <span className="font-800 text-green-700">🎉 You&apos;ve unlocked FREE delivery!</span>
                    )}
                  </p>
                  <div className="h-1.5 rounded-full bg-green-100 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-green-500"
                      initial={false}
                      animate={{ width: `${progress}%` }}
                      transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                    />
                  </div>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                  {items.map((item) => (
                    <motion.div
                      key={item.productId}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      className="flex gap-3 p-3 rounded-2xl border border-gray-100 bg-white"
                    >
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-700 text-gray-900 text-sm leading-snug">{item.name}</h4>
                          <button
                            onClick={() => removeItem(item.productId)}
                            aria-label={`Remove ${item.name}`}
                            className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <p className="text-xs text-gray-400 font-600 mb-auto">₹{item.price} each</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1 border border-gray-200 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              aria-label="Decrease quantity"
                              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-green-600 transition-colors"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="w-6 text-center text-sm font-800 text-gray-900">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              aria-label="Increase quantity"
                              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-green-600 transition-colors"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                          <span className="font-800 text-gray-900 text-sm">₹{item.price * item.quantity}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 px-5 py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-600 text-sm">Subtotal</span>
                    <span className="font-display font-800 text-gray-900 text-xl">₹{totalPrice}</span>
                  </div>
                  <p className="text-xs text-gray-400">Taxes &amp; delivery calculated at checkout.</p>
                  <Link
                    to="/checkout"
                    onClick={closeCart}
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-800 rounded-2xl transition-colors"
                    style={{ boxShadow: '0 8px 22px rgba(73,138,12,0.32)' }}
                  >
                    Checkout · ₹{totalPrice} <ArrowRight size={16} />
                  </Link>
                  <button
                    onClick={closeCart}
                    className="w-full text-center text-sm font-700 text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    Continue shopping
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
