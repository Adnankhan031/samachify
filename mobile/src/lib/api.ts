/**
 * Calls into the Samachify storefront's API routes (the same ones the website uses).
 *
 * Order creation lives on the server on purpose: it re-prices the cart from the
 * trusted catalogue and writes with the service-role key. The app never inserts an
 * order and never decides what something costs.
 */
import { API_BASE_URL } from './config';
import { getAccessToken } from './supabase';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/** Thrown when the request never reached the server — offline, DNS, timeout. */
export class NetworkError extends Error {
  constructor(message = 'No internet connection. Check your network and try again.') {
    super(message);
    this.name = 'NetworkError';
  }
}

export interface CustomerPayload {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

export interface OrderItemPayload {
  productId: string;
  quantity: number;
}

export interface PlacedOrder {
  orderId: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
}

const TIMEOUT_MS = 20_000;

/**
 * A fetch that fails usefully: distinguishes "server said no" from "never got
 * there", and never hangs forever on a flaky mobile connection.
 */
async function request<T>(path: string, body: unknown): Promise<T> {
  const token = await getAccessToken();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // The website authenticates with cookies; we have none, so the access
        // token rides along as a bearer header instead.
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch {
    throw new NetworkError();
  } finally {
    clearTimeout(timer);
  }

  const payload = (await response.json().catch(() => null)) as { error?: string } | null;

  if (!response.ok) {
    throw new ApiError(payload?.error ?? 'Something went wrong. Please try again.', response.status);
  }

  return payload as T;
}

/** Cash on delivery. The server prices the cart and writes the order. */
export function placeCodOrder(
  customer: CustomerPayload,
  items: OrderItemPayload[]
): Promise<PlacedOrder> {
  return request<PlacedOrder>('/api/orders', { customer, items, paymentMethod: 'cod' });
}

export interface RazorpayIntent {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
  total: number;
}

/**
 * Step 1 of online payment: the server re-prices the cart and opens a Razorpay
 * order for exactly that amount. Returns the public key id — never the secret.
 */
export function createRazorpayOrder(
  customer: CustomerPayload,
  items: OrderItemPayload[]
): Promise<RazorpayIntent> {
  return request<RazorpayIntent>('/api/razorpay/order', { customer, items });
}

/**
 * Step 3 of online payment: the server recomputes the HMAC signature and only then
 * records the order. A client claiming success proves nothing.
 */
export function verifyRazorpayPayment(params: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  customer: CustomerPayload;
  items: OrderItemPayload[];
}): Promise<{ orderId: string; total: number }> {
  return request('/api/razorpay/verify', params);
}
