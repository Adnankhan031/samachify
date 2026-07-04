import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { products } from '@/data/products'

const FREE_DELIVERY_THRESHOLD = 299
const DELIVERY_FEE = 39

interface IncomingItem {
  productId: string
  quantity: number
}

/**
 * POST /api/orders
 * Creates an order. Prices are re-derived server-side from the product catalogue
 * (never trusted from the client). Attaches user_id if the request is authenticated.
 */
export async function POST(request: Request) {
  let body: {
    customer?: Record<string, string>
    items?: IncomingItem[]
    paymentMethod?: string
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { customer, items, paymentMethod = 'cod' } = body

  // ── Validate customer ──
  const required = ['name', 'email', 'phone', 'address', 'city', 'pincode'] as const
  for (const f of required) {
    if (!customer?.[f]?.trim()) {
      return NextResponse.json({ error: `Missing field: ${f}` }, { status: 400 })
    }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer!.email)) {
    return NextResponse.json({ error: 'Invalid email.' }, { status: 400 })
  }
  if (!/^[0-9]{10}$/.test(customer!.phone.replace(/\D/g, ''))) {
    return NextResponse.json({ error: 'Invalid phone number.' }, { status: 400 })
  }
  if (!/^[0-9]{6}$/.test(customer!.pincode)) {
    return NextResponse.json({ error: 'Invalid pincode.' }, { status: 400 })
  }

  // ── Validate + price items from the trusted catalogue ──
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 })
  }
  const lineItems = []
  let subtotal = 0
  for (const it of items) {
    const product = products.find((p) => p.id === it.productId)
    const qty = Math.floor(Number(it.quantity))
    if (!product || !Number.isFinite(qty) || qty < 1 || qty > 50) {
      return NextResponse.json({ error: 'Invalid cart item.' }, { status: 400 })
    }
    subtotal += product.price * qty
    lineItems.push({
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      quantity: qty,
    })
  }

  if (paymentMethod !== 'cod') {
    return NextResponse.json(
      { error: 'Only Cash on Delivery is available right now.' },
      { status: 400 }
    )
  }

  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
  const total = subtotal + deliveryFee

  // ── Who's ordering? (optional — guest checkout allowed) ──
  let userId: string | null = null
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    userId = user?.id ?? null
  } catch {
    userId = null
  }

  // ── Insert with the privileged client (bypasses RLS) ──
  const admin = createAdminClient()
  const { data: order, error: orderErr } = await admin
    .from('orders')
    .insert({
      user_id: userId,
      customer_name: customer!.name,
      email: customer!.email,
      phone: customer!.phone,
      address: customer!.address,
      city: customer!.city,
      pincode: customer!.pincode,
      payment_method: paymentMethod,
      subtotal,
      delivery_fee: deliveryFee,
      total,
      status: 'pending',
    })
    .select('id')
    .single()

  if (orderErr || !order) {
    console.error('Order insert failed:', orderErr)
    return NextResponse.json({ error: 'Could not create order.' }, { status: 500 })
  }

  const { error: itemsErr } = await admin
    .from('order_items')
    .insert(lineItems.map((li) => ({ ...li, order_id: order.id })))

  if (itemsErr) {
    console.error('Order items insert failed:', itemsErr)
    // Roll back the order so we don't leave an empty shell.
    await admin.from('orders').delete().eq('id', order.id)
    return NextResponse.json({ error: 'Could not save order items.' }, { status: 500 })
  }

  return NextResponse.json({ orderId: order.id, total, deliveryFee, subtotal })
}
