/**
 * Shared order-fulfilment status model. Ported verbatim from the storefront's
 * `src/lib/orderStatus.ts` so the app, the website and the admin portal all
 * describe an order the same way.
 */

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'packed'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

/** The happy-path stages, in order, that make up the tracking stepper. */
export const STATUS_FLOW: OrderStatus[] = [
  'placed',
  'confirmed',
  'packed',
  'out_for_delivery',
  'delivered',
];

export const STATUS_META: Record<
  OrderStatus,
  { label: string; customer: string; color: string; bg: string; icon: string }
> = {
  placed: { label: 'Placed', customer: 'Order placed', color: '#6b7280', bg: '#f3f4f6', icon: 'receipt-outline' },
  confirmed: { label: 'Confirmed', customer: 'Order confirmed', color: '#2563eb', bg: '#eff6ff', icon: 'checkmark-circle-outline' },
  packed: { label: 'Packed', customer: 'Packed & ready', color: '#7c3aed', bg: '#f5f3ff', icon: 'cube-outline' },
  out_for_delivery: { label: 'Out for delivery', customer: 'Out for delivery', color: '#ea580c', bg: '#fff7ed', icon: 'bicycle-outline' },
  delivered: { label: 'Delivered', customer: 'Delivered', color: '#15803d', bg: '#f0fdf4', icon: 'home-outline' },
  cancelled: { label: 'Cancelled', customer: 'Cancelled', color: '#dc2626', bg: '#fef2f2', icon: 'close-circle-outline' },
};

/** Index of a status within the happy path (-1 for cancelled/unknown). */
export function statusIndex(s: OrderStatus): number {
  return STATUS_FLOW.indexOf(s);
}

export function isValidStatus(s: string): s is OrderStatus {
  return s in STATUS_META;
}

/**
 * Orders created by `/api/orders` start life as `pending`, which predates the
 * status flow above. Treat it as the first stage rather than rendering an
 * unknown badge.
 */
export function normalizeStatus(s: string | null | undefined): OrderStatus {
  if (!s) return 'placed';
  if (s === 'pending' || s === 'paid') return 'placed';
  return isValidStatus(s) ? s : 'placed';
}
