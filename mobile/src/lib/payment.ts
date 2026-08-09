/**
 * The in-flight online payment.
 *
 * Checkout hands the intent over, the payment screen picks it up. Kept in module
 * state rather than route params because it carries the customer's address and
 * the cart — none of which belongs in a URL, where it would end up in logs and
 * navigation history.
 *
 * Single-flight by design: a customer can only be paying for one order at a
 * time, and starting a second attempt should replace the first.
 */
import type { CustomerPayload, OrderItemPayload, RazorpayIntent } from './api';

export interface PendingPayment {
  intent: RazorpayIntent;
  customer: CustomerPayload;
  items: OrderItemPayload[];
}

let pending: PendingPayment | null = null;

export function setPendingPayment(next: PendingPayment): void {
  pending = next;
}

export function takePendingPayment(): PendingPayment | null {
  return pending;
}

export function clearPendingPayment(): void {
  pending = null;
}

/**
 * The Razorpay checkout page, rendered inside a WebView.
 *
 * This is the same `checkout.razorpay.com/v1/checkout.js` flow the website runs,
 * so the server side is untouched. The handler posts the signature back to the
 * app, which forwards it to `/api/razorpay/verify` — the app never decides that
 * a payment succeeded, it only relays what Razorpay returned for the server to
 * verify against its secret.
 *
 * Values are JSON-encoded into the script rather than string-concatenated so a
 * quote in a customer's name cannot break out of the literal.
 */
export function buildCheckoutHtml(payment: PendingPayment): string {
  const { intent, customer } = payment;

  const options = {
    key: intent.keyId,
    order_id: intent.razorpayOrderId,
    amount: intent.amount,
    currency: intent.currency,
    name: 'Samachify',
    description: 'Fresh ingredient meal kits',
    prefill: {
      name: customer.name,
      email: customer.email,
      contact: customer.phone,
    },
    theme: { color: '#498a0c' },
  };

  return `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <style>
      html, body {
        margin: 0;
        height: 100%;
        background: #fdfff5;
        font-family: -apple-system, Roboto, sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #667085;
      }
    </style>
    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  </head>
  <body>
    <p>Opening secure payment…</p>
    <script>
      var post = function (payload) {
        window.ReactNativeWebView.postMessage(JSON.stringify(payload));
      };

      var options = ${JSON.stringify(options)};

      options.handler = function (response) {
        post({ type: 'success', response: response });
      };

      // Fires when the customer dismisses the sheet without paying. Distinct
      // from a failure: nothing was charged and retrying is the right offer.
      options.modal = {
        ondismiss: function () { post({ type: 'dismissed' }); },
        escape: false,
      };

      try {
        var rzp = new Razorpay(options);
        rzp.on('payment.failed', function (event) {
          post({
            type: 'failed',
            message: (event && event.error && event.error.description) || 'Payment failed.',
          });
        });
        rzp.open();
      } catch (err) {
        post({ type: 'failed', message: 'Could not open the payment sheet.' });
      }
    </script>
  </body>
</html>`;
}

/** What the WebView can send back. Anything else is ignored. */
export type CheckoutMessage =
  | {
      type: 'success';
      response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      };
    }
  | { type: 'dismissed' }
  | { type: 'failed'; message: string };

export function parseCheckoutMessage(raw: string): CheckoutMessage | null {
  try {
    const parsed = JSON.parse(raw) as CheckoutMessage;
    if (parsed?.type === 'success' && parsed.response?.razorpay_signature) return parsed;
    if (parsed?.type === 'dismissed' || parsed?.type === 'failed') return parsed;
    return null;
  } catch {
    return null;
  }
}
