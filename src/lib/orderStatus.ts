/**
 * Shared order-fulfilment status model — used by the admin portal and the
 * customer-facing tracker so both sides stay perfectly in sync.
 */

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'packed'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'

/** The happy-path stages, in order, that make up the tracking stepper. */
export const STATUS_FLOW: OrderStatus[] = [
  'placed', 'confirmed', 'packed', 'out_for_delivery', 'delivered',
]

export const STATUS_META: Record<OrderStatus, { label: string; customer: string; color: string; bg: string }> = {
  placed:           { label: 'Placed',           customer: 'Order placed',        color: '#6b7280', bg: '#f3f4f6' },
  confirmed:        { label: 'Confirmed',         customer: 'Order confirmed',     color: '#2563eb', bg: '#eff6ff' },
  packed:           { label: 'Packed',            customer: 'Packed & ready',      color: '#7c3aed', bg: '#f5f3ff' },
  out_for_delivery: { label: 'Out for delivery',  customer: 'Out for delivery',    color: '#ea580c', bg: '#fff7ed' },
  delivered:        { label: 'Delivered',         customer: 'Delivered',           color: '#15803d', bg: '#f0fdf4' },
  cancelled:        { label: 'Cancelled',         customer: 'Cancelled',           color: '#dc2626', bg: '#fef2f2' },
}

/** Index of a status within the happy path (-1 for cancelled/unknown). */
export function statusIndex(s: OrderStatus): number {
  return STATUS_FLOW.indexOf(s)
}

/** The next status an admin can advance an active order to, if any. */
export function nextStatus(s: OrderStatus): OrderStatus | null {
  const i = statusIndex(s)
  if (i < 0 || i >= STATUS_FLOW.length - 1) return null
  return STATUS_FLOW[i + 1]
}

export function isValidStatus(s: string): s is OrderStatus {
  return s in STATUS_META
}
