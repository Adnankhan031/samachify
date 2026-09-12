import crypto from 'node:crypto'
import type { Customer, PricedCart } from './orders'

/** Binds a Razorpay order to the exact server-validated address, pin and cart. */
export function paymentQuoteHash(secret: string, customer: Customer, cart: PricedCart): string {
  const canonical = JSON.stringify({
    customer: [customer.name, customer.email, customer.phone, customer.address, customer.city, customer.pincode, customer.latitude, customer.longitude],
    items: cart.lineItems.map((item) => [item.product_id, item.price, item.quantity]),
    totals: [cart.subtotal, cart.deliveryFee, cart.total],
  })
  return crypto.createHmac('sha256', secret).update(canonical).digest('hex')
}
