import { NextResponse } from 'next/server'
import crypto from 'node:crypto'
import {
  OrderError,
  priceCart,
  validateCustomer,
  getCurrentUserId,
  insertOrder,
} from '@/lib/orders'
import { sendOrderConfirmation } from '@/lib/email'

/**
 * POST /api/razorpay/verify
 * Verifies the Razorpay payment signature, then records the paid order.
 * Signature = HMAC_SHA256(razorpay_order_id + "|" + razorpay_payment_id, key_secret).
 */
export async function POST(request: Request) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keySecret) {
    return NextResponse.json({ error: 'Online payments are not configured.' }, { status: 503 })
  }

  try {
    const body = await request.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customer,
      items,
    } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment details.' }, { status: 400 })
    }

    // ── Verify signature (constant-time) ──
    const expected = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    const valid =
      expected.length === razorpay_signature.length &&
      crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(razorpay_signature))

    if (!valid) {
      return NextResponse.json({ error: 'Payment verification failed.' }, { status: 400 })
    }

    // ── Signature ok → record the order ──
    const validCustomer = validateCustomer(customer)
    const cart = priceCart(items)
    const userId = await getCurrentUserId(request)

    const orderId = await insertOrder({
      customer: validCustomer,
      cart,
      paymentMethod: 'razorpay',
      status: 'paid',
      userId,
      razorpayPaymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
    })

    // Confirmation email — non-blocking, no-op until Resend is configured.
    await sendOrderConfirmation({ orderId, customer: validCustomer, cart, paymentMethod: 'razorpay' })

    return NextResponse.json({ orderId, total: cart.total })
  } catch (err) {
    if (err instanceof OrderError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error('Razorpay verify error:', err)
    return NextResponse.json({ error: 'Could not confirm payment.' }, { status: 500 })
  }
}
