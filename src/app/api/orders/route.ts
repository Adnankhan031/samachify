import { NextResponse } from 'next/server'
import {
  OrderError,
  priceCart,
  validateCustomer,
  getCurrentUserId,
  insertOrder,
} from '@/lib/orders'
import { sendOrderConfirmation } from '@/lib/email'

/**
 * POST /api/orders — Cash-on-Delivery orders.
 * Online payments go through /api/razorpay/* instead.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { customer, items, paymentMethod = 'cod' } = body

    if (paymentMethod !== 'cod') {
      return NextResponse.json(
        { error: 'Use the online payment flow for card/UPI.' },
        { status: 400 }
      )
    }

    const validCustomer = validateCustomer(customer)
    const cart = await priceCart(items, validCustomer)
    const userId = await getCurrentUserId(request)

    const orderId = await insertOrder({
      customer: validCustomer,
      cart,
      paymentMethod: 'cod',
      status: 'pending',
      userId,
    })

    // Confirmation email — non-blocking, no-op until Resend is configured.
    await sendOrderConfirmation({ orderId, customer: validCustomer, cart, paymentMethod: 'cod' })

    return NextResponse.json({
      orderId,
      subtotal: cart.subtotal,
      deliveryFee: cart.deliveryFee,
      total: cart.total,
    })
  } catch (err) {
    if (err instanceof OrderError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error('Unexpected order error:', err)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
