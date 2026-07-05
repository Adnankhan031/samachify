'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'
import { useCart } from '@/context/CartContext'

/**
 * Small non-intrusive toast that appears when an item is added to the cart,
 * instead of the whole drawer sliding open. Auto-dismisses after ~2.4s.
 */
export default function CartToast() {
  const { flash, openCart } = useCart()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!flash) return
    setShow(true)
    const t = setTimeout(() => setShow(false), 2400)
    return () => clearTimeout(t)
  }, [flash])

  return (
    <AnimatePresence>
      {show && flash && (
        <motion.div
          key={flash.key}
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ type: 'spring', damping: 22, stiffness: 320 }}
          className="fixed z-[120] left-1/2 -translate-x-1/2 bottom-5 sm:bottom-6 sm:left-auto sm:right-6 sm:translate-x-0 w-[calc(100%-2rem)] sm:w-auto max-w-sm"
        >
          <div className="flex items-center gap-3 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2.5 pr-3">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50">
              <img src={flash.image} alt="" className="w-full h-full object-cover" />
              <span className="absolute inset-0 flex items-center justify-center bg-green-600/85">
                <Check size={18} className="text-white" strokeWidth={3} />
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-700 text-green-600 uppercase tracking-wide leading-none">Added to cart</p>
              <p className="text-sm font-800 text-gray-900 truncate mt-0.5">{flash.name}</p>
            </div>
            <button
              onClick={() => { setShow(false); openCart() }}
              className="flex items-center gap-1 px-3.5 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-800 rounded-xl transition-colors whitespace-nowrap"
            >
              View cart <ArrowRight size={13} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
