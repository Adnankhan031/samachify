import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { OrderError, priceCart, validateCustomer } from '@/lib/orders'
import { paymentQuoteHash } from '@/lib/paymentQuote'

/**
 * POST /api/razorpay/order
 * Re-prices the cart server-side and creates a Razorpay order for that exact amount.
 * Returns the Razorpay order id + amount so the client can open Razorpay checkout.
 */
export async function POST(request: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keyId || !keySecret) {
    return NextResponse.json({ error: 'Online payments are not configured.' }, { status: 503 })
  }

  try {
    const body = await request.json()
    const validCustomer = validateCustomer(body.customer) // fail fast on bad address before creating a payment
    const cart = await priceCart(body.items, validCustomer)

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret })
    const rpOrder = await razorpay.orders.create({
      amount: cart.total * 100, // paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      notes: { quote_hash: paymentQuoteHash(keySecret, validCustomer, cart) },
    })

    return NextResponse.json({
      razorpayOrderId: rpOrder.id,
      amount: rpOrder.amount,
      currency: rpOrder.currency,
      keyId,
      total: cart.total,
    })
  } catch (err) {
    if (err instanceof OrderError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error('Razorpay order error:', err)
    return NextResponse.json({ error: 'Could not start payment.' }, { status: 500 })
  }
}
