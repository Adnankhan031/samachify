'use client'

import { Check, PackageCheck, Package, Truck, Home, XCircle } from 'lucide-react'
import { STATUS_FLOW, STATUS_META, statusIndex, type OrderStatus } from '@/lib/orderStatus'

const ICONS: Record<OrderStatus, React.ElementType> = {
  placed: PackageCheck, confirmed: Check, packed: Package,
  out_for_delivery: Truck, delivered: Home, cancelled: XCircle,
}

/** Amazon-style horizontal progress tracker for a customer's order. */
export default function OrderTracker({ status }: { status: OrderStatus }) {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-700">
        <XCircle size={16} /> This order was cancelled.
      </div>
    )
  }

  const cur = statusIndex(status)

  return (
    <div className="flex items-start">
      {STATUS_FLOW.map((s, i) => {
        const meta = STATUS_META[s]
        const Icon = ICONS[s]
        const done = i <= cur
        const active = i === cur
        return (
          <div key={s} className="flex-1 flex flex-col items-center relative">
            {/* connector to previous */}
            {i > 0 && (
              <span className="absolute top-4 right-1/2 w-full h-0.5 -z-0"
                style={{ background: i <= cur ? meta.color : '#e5e7eb' }} />
            )}
            <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${active ? 'ring-4' : ''}`}
              style={{ background: done ? meta.color : '#f3f4f6', color: done ? '#fff' : '#9ca3af', boxShadow: active ? `0 0 0 4px ${meta.bg}` : 'none' }}>
              {done && !active ? <Check size={15} /> : <Icon size={15} />}
            </div>
            <span className={`mt-1.5 text-[10px] sm:text-[11px] font-700 text-center leading-tight ${done ? 'text-gray-800' : 'text-gray-400'}`}>
              {meta.customer}
            </span>
          </div>
        )
      })}
    </div>
  )
}
