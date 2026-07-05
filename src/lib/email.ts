import type { Customer, PricedCart } from '@/lib/orders'

/**
 * Sends the customer an order-confirmation email via Resend.
 *
 * Fully optional: if RESEND_API_KEY isn't configured yet, this is a no-op so
 * orders keep working. Never throws — email failure must not fail an order.
 */
export async function sendOrderConfirmation(params: {
  orderId: string
  customer: Customer
  cart: PricedCart
  paymentMethod: 'cod' | 'razorpay'
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return // not configured — skip silently

  const from = process.env.ORDER_FROM_EMAIL || 'Samachify <orders@samachify.in>'
  const { orderId, customer, cart, paymentMethod } = params
  const shortId = orderId.slice(0, 8).toUpperCase()

  const rows = cart.lineItems
    .map(
      (li) =>
        `<tr><td style="padding:6px 0;color:#374151">${li.quantity} × ${li.product_name}</td>` +
        `<td style="padding:6px 0;text-align:right;color:#111827;font-weight:700">₹${li.price * li.quantity}</td></tr>`
    )
    .join('')

  const html = `
  <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#111827">
    <h1 style="font-size:20px;margin:0 0 4px">Order confirmed 🎉</h1>
    <p style="color:#6b7280;margin:0 0 20px">Thank you, ${escapeHtml(customer.name.split(' ')[0])}! Your fresh packs are on their way.</p>
    <div style="background:#f9fafb;border-radius:12px;padding:16px;margin-bottom:16px">
      <p style="margin:0 0 8px"><strong>Order</strong> #${shortId}</p>
      <p style="margin:0 0 8px"><strong>Payment</strong> ${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid online'}</p>
      <p style="margin:0"><strong>Deliver to</strong> ${escapeHtml(customer.address)}, ${escapeHtml(customer.city)} — ${escapeHtml(customer.pincode)}</p>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      ${rows}
      <tr><td style="padding:8px 0;border-top:1px solid #e5e7eb;color:#6b7280">Delivery</td>
          <td style="padding:8px 0;border-top:1px solid #e5e7eb;text-align:right">${cart.deliveryFee === 0 ? 'FREE' : `₹${cart.deliveryFee}`}</td></tr>
      <tr><td style="padding:8px 0;font-weight:800;font-size:16px">Total</td>
          <td style="padding:8px 0;text-align:right;font-weight:800;font-size:16px;color:#15803d">₹${cart.total}</td></tr>
    </table>
    <p style="color:#9ca3af;font-size:12px;margin-top:24px">We'll call you on ${escapeHtml(customer.phone)} to confirm delivery. — Team Samachify</p>
  </div>`

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [customer.email],
        subject: `Your Samachify order #${shortId} is confirmed`,
        html,
      }),
    })
    if (!res.ok) console.error('Order email failed:', await res.text())
  } catch (err) {
    console.error('Order email error:', err)
  }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string
  ))
}
