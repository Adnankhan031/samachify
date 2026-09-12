import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { quoteDelivery } from './delivery'
import { products } from '@/data/products'

export interface IncomingItem {
  productId: string
  quantity: number
}

export interface Customer {
  name: string
  email: string
  phone: string
  address: string
  city: string
  pincode: string
  /** Exact delivery pin selected by the customer. Older stored addresses may omit it. */
  latitude?: number | null
  longitude?: number | null
}

/**
 * A coordinate is only accepted if it is a real number in range.
 *
 * Never trust what the client sends here: a malformed pin doesn't produce a
 * slightly-wrong delivery, it sends a rider to the wrong hemisphere. Anything
 * suspect is dropped rather than rejected, because a bad pin should not cost
 * the customer their order — the written address still works.
 */
function sanitiseCoord(value: unknown, limit: number): number | null {
  if (value == null || value === '' || typeof value === 'boolean') return null
  const n = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(n) || Math.abs(n) > limit) return null
  return n
}

export interface PricedCart {
  lineItems: { product_id: string; product_name: string; price: number; quantity: number }[]
  subtotal: number
  deliveryFee: number
  total: number
}

/** Thrown for any client-supplied data we reject. Carries an HTTP-ish status. */
export class OrderError extends Error {
  status: number
  constructor(message: string, status = 400) {
    super(message)
    this.status = status
  }
}

export function validateCustomer(customer: Customer | undefined): Customer {
  // Only the text fields are required. The coordinates are optional and
  // numeric, so they are validated separately rather than trimmed.
  const required = ['name', 'email', 'phone', 'address', 'city', 'pincode'] as const
  for (const f of required) {
    if (!customer?.[f]?.trim()) throw new OrderError(`Missing field: ${f}`)
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer!.email)) throw new OrderError('Invalid email.')
  if (!/^[0-9]{10}$/.test(customer!.phone.replace(/\D/g, ''))) throw new OrderError('Invalid phone number.')
  if (!/^[0-9]{6}$/.test(customer!.pincode)) throw new OrderError('Invalid pincode.')

  return {
    ...customer!,
    latitude: sanitiseCoord(customer!.latitude, 90),
    longitude: sanitiseCoord(customer!.longitude, 180),
  }
}

/** Re-prices the cart from the trusted catalogue — never trusts client prices. */
export async function priceCart(items: IncomingItem[] | undefined, customer: Customer): Promise<PricedCart> {
  if (!Array.isArray(items) || items.length === 0) throw new OrderError('Cart is empty.')
  const lineItems: PricedCart['lineItems'] = []
  let subtotal = 0
  for (const it of items) {
    const product = products.find((p) => p.id === it.productId)
    const qty = Number(it.quantity)
    if (!product || !Number.isInteger(qty) || qty < 1 || qty > 50) {
      throw new OrderError('Invalid cart item.')
    }
    subtotal += product.price * qty
    lineItems.push({ product_id: product.id, product_name: product.name, price: product.price, quantity: qty })
  }
  const { deliveryFee } = await quoteDelivery(customer, subtotal)
  return { lineItems, subtotal, deliveryFee, total: subtotal + deliveryFee }
}

/**
 * The current user id if the request is authenticated, else null (guest checkout).
 *
 * The website authenticates with cookies. The Android app has no cookie jar, so it
 * sends its Supabase access token as `Authorization: Bearer <token>` instead — pass
 * the request in and that path is tried first. Purely additive: calling this with
 * no argument behaves exactly as before.
 */
export async function getCurrentUserId(request?: Request): Promise<string | null> {
  const bearer = request?.headers.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1]

  if (bearer) {
    try {
      // getUser() verifies the JWT signature against Supabase, so a forged or
      // expired token resolves to no user rather than being trusted.
      const { data } = await createAdminClient().auth.getUser(bearer)
      return data.user?.id ?? null
    } catch {
      return null
    }
  }

  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    return data.user?.id ?? null
  } catch {
    return null
  }
}

/** Inserts an order + its items with the service-role client (bypasses RLS). */
export async function insertOrder(params: {
  customer: Customer
  cart: PricedCart
  paymentMethod: 'cod' | 'razorpay'
  status: string
  userId: string | null
  razorpayPaymentId?: string
  razorpayOrderId?: string
}): Promise<string> {
  const { customer, cart, paymentMethod, status, userId, razorpayPaymentId, razorpayOrderId } = params
  const admin = createAdminClient()

  const row: Record<string, unknown> = {
    user_id: userId,
    customer_name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    city: customer.city,
    pincode: customer.pincode,
    payment_method: paymentMethod,
    subtotal: cart.subtotal,
    delivery_fee: cart.deliveryFee,
    total: cart.total,
    status,
  }

  // Snapshotted onto the order, not looked up from the address book at delivery
  // time. An address can be edited or deleted afterwards; the pin for an order
  // already on its way must not move under the rider.
  if (customer.latitude != null && customer.longitude != null) {
    row.latitude = customer.latitude
    row.longitude = customer.longitude
  }
  // Only set the Razorpay columns for online payments (keeps COD working even
  // before the razorpay migration is applied).
  if (razorpayPaymentId) row.razorpay_payment_id = razorpayPaymentId
  if (razorpayOrderId) row.razorpay_order_id = razorpayOrderId

  const { data: order, error: orderErr } = await admin
    .from('orders')
    .insert(row)
    .select('id')
    .single()

  if (orderErr || !order) {
    console.error('Order insert failed:', orderErr)
    throw new OrderError('Could not create order.', 500)
  }

  const { error: itemsErr } = await admin
    .from('order_items')
    .insert(cart.lineItems.map((li) => ({ ...li, order_id: order.id })))

  if (itemsErr) {
    console.error('Order items insert failed:', itemsErr)
    await admin.from('orders').delete().eq('id', order.id)
    throw new OrderError('Could not save order items.', 500)
  }

  return order.id
}
