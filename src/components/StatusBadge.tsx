import { STATUS_META, isValidStatus } from '@/lib/orderStatus'

/** Small coloured pill for an order's fulfilment status. */
export default function StatusBadge({ status, size = 'sm' }: { status: string; size?: 'sm' | 'md' }) {
  const meta = isValidStatus(status) ? STATUS_META[status] : { label: status, color: '#6b7280', bg: '#f3f4f6' }
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-800 rounded-full whitespace-nowrap ${size === 'md' ? 'text-xs px-3 py-1' : 'text-[10px] px-2.5 py-1 uppercase tracking-wide'}`}
      style={{ color: meta.color, background: meta.bg }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.color }} />
      {meta.label}
    </span>
  )
}
