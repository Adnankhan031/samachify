import { NextResponse } from 'next/server'
import crypto from 'node:crypto'
import Razorpay from 'razorpay'
import {
  OrderError,
  priceCart,
  validateCustomer,
  getCurrentUserId,
  insertOrder,
} from '@/lib/orders'
import { sendOrderConfirmation } from '@/lib/email'
import { createAdminClient } from '@/lib/supabase/admin'
import { paymentQuoteHash } from '@/lib/paymentQuote'

/**
 * POST /api/razorpay/verify
 * Verifies the Razorpay payment signature, then records the paid order.
 * Signature = HMAC_SHA256(razorpay_order_id + "|" + razorpay_payment_id, key_secret).
 */
export async function POST(request: Request) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  const keyId = process.env.RAZORPAY_KEY_ID
  if (!keySecret || !keyId) {
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

    // Safe retry after a slow network response: return the order that this
    // verified payment already created instead of inserting it twice.
    const admin = createAdminClient()
    const { data: existing } = await admin
      .from('orders')
      .select('id, total, razorpay_order_id')
      .eq('razorpay_payment_id', razorpay_payment_id)
      .maybeSingle()
    if (existing) {
      if (existing.razorpay_order_id !== razorpay_order_id) {
        return NextResponse.json({ error: 'Payment reference mismatch.' }, { status: 400 })
      }
      return NextResponse.json({ orderId: existing.id, total: existing.total })
    }

    // Signature proves Razorpay issued the response. Fetching both records also
    // proves the amount, currency and captured state match this exact checkout.
    const validCustomer = validateCustomer(customer)
    const cart = await priceCart(items, validCustomer)
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret })
    const [payment, paymentOrder] = await Promise.all([
      razorpay.payments.fetch(razorpay_payment_id),
      razorpay.orders.fetch(razorpay_order_id),
    ])
    const quoteHash = paymentQuoteHash(keySecret, validCustomer, cart)
    if (
      payment.order_id !== razorpay_order_id || payment.status !== 'captured' ||
      payment.currency !== 'INR' || Number(payment.amount) !== cart.total * 100 ||
      paymentOrder.currency !== 'INR' || Number(paymentOrder.amount) !== cart.total * 100 ||
      paymentOrder.notes?.quote_hash !== quoteHash
    ) {
      return NextResponse.json({ error: 'Payment does not match this checkout. Please contact Samachify support.' }, { status: 400 })
    }
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
