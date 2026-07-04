import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { products } from '@/data/products'

export const FREE_DELIVERY_THRESHOLD = 299
export const DELIVERY_FEE = 39

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
  const required: (keyof Customer)[] = ['name', 'email', 'phone', 'address', 'city', 'pincode']
  for (const f of required) {
    if (!customer?.[f]?.trim()) throw new OrderError(`Missing field: ${f}`)
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer!.email)) throw new OrderError('Invalid email.')
  if (!/^[0-9]{10}$/.test(customer!.phone.replace(/\D/g, ''))) throw new OrderError('Invalid phone number.')
  if (!/^[0-9]{6}$/.test(customer!.pincode)) throw new OrderError('Invalid pincode.')
  return customer!
}

/** Re-prices the cart from the trusted catalogue — never trusts client prices. */
export function priceCart(items: IncomingItem[] | undefined): PricedCart {
  if (!Array.isArray(items) || items.length === 0) throw new OrderError('Cart is empty.')
  const lineItems: PricedCart['lineItems'] = []
  let subtotal = 0
  for (const it of items) {
    const product = products.find((p) => p.id === it.productId)
    const qty = Math.floor(Number(it.quantity))
    if (!product || !Number.isFinite(qty) || qty < 1 || qty > 50) {
      throw new OrderError('Invalid cart item.')
    }
    subtotal += product.price * qty
    lineItems.push({ product_id: product.id, product_name: product.name, price: product.price, quantity: qty })
  }
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
  return { lineItems, subtotal, deliveryFee, total: subtotal + deliveryFee }
}

/** The current user id if the request is authenticated, else null (guest checkout). */
export async function getCurrentUserId(): Promise<string | null> {
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
