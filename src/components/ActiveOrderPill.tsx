'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { Link } from '@/lib/nav'
import { Truck, X, ArrowRight } from 'lucide-react'
import { useActiveOrder } from '@/context/ActiveOrderContext'
import { STATUS_META } from '@/lib/orderStatus'

/**
 * Subtle floating pill that follows the shopper around the store while they
 * have an order in progress, with a one-tap link to the live tracker.
 * Hidden on the account page (the full tracker lives there) and dismissible.
 */
export default function ActiveOrderPill() {
  const { activeOrder } = useActiveOrder()
  const pathname = usePathname() ?? '/'
  const [dismissed, setDismissed] = useState<string | null>(null)

  // Reset the dismissal when the status advances, so the shopper sees updates.
  useEffect(() => {
    if (activeOrder) setDismissed((d) => (d && d.startsWith(activeOrder.id) ? d : null))
  }, [activeOrder])

  if (!activeOrder) return null
  if (pathname.startsWith('/account')) return null
  const dismissKey = `${activeOrder.id}:${activeOrder.order_status}`
  if (dismissed === dismissKey) return null

  const meta = STATUS_META[activeOrder.order_status]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ type: 'spring', damping: 24, stiffness: 300 }}
        className="fixed z-[90] left-4 right-4 bottom-4 sm:left-5 sm:right-auto sm:bottom-5 sm:w-[340px]"
      >
        <div className="flex items-center gap-3 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2.5 pr-2">
          <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: meta.bg }}>
            <Truck size={18} style={{ color: meta.color }} />
          </span>
          <Link to="/account" className="flex-1 min-w-0">
            <p className="text-[11px] font-700 uppercase tracking-wide leading-none" style={{ color: meta.color }}>
              Order #{activeOrder.id.slice(0, 8).toUpperCase()}
            </p>
            <p className="text-sm font-800 text-gray-900 truncate mt-0.5 flex items-center gap-1">
              {meta.customer} <ArrowRight size={13} className="text-gray-400" />
            </p>
          </Link>
          <button
            onClick={() => setDismissed(dismissKey)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
