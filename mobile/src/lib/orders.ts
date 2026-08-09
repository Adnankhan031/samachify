/**
 * Reading a customer's own orders. These go straight to Supabase under the
 * "read own orders" RLS policy — no API route needed, because nothing here is a
 * write. Order *creation* lives in `api.ts` and stays on the server.
 */
import { supabase } from './supabase';
import { normalizeStatus, type OrderStatus } from './orderStatus';

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  payment_method: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  /** Payment state: 'pending' (COD) or 'paid' (Razorpay). Not the tracking stage. */
  status: string;
  /** Fulfilment stage — this is what the tracker renders. */
  orderStatus: OrderStatus;
  status_updated_at: string | null;
  items: OrderItem[];
}

const ORDER_COLUMNS =
  'id, created_at, customer_name, phone, address, city, pincode, payment_method, subtotal, delivery_fee, total, status, order_status, status_updated_at';

interface RawOrder {
  order_status: string | null;
  order_items?: OrderItem[] | null;
  [key: string]: unknown;
}

function toOrder(row: RawOrder): Order {
  const { order_status, order_items, ...rest } = row;
  return {
    ...(rest as Omit<Order, 'orderStatus' | 'items'>),
    orderStatus: normalizeStatus(order_status),
    items: order_items ?? [],
  };
}

/** Newest first. RLS already scopes this to the signed-in user. */
export async function listMyOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(`${ORDER_COLUMNS}, order_items (id, product_id, product_name, price, quantity)`)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return ((data ?? []) as RawOrder[]).map(toOrder);
}

export async function getOrder(id: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select(`${ORDER_COLUMNS}, order_items (id, product_id, product_name, price, quantity)`)
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? toOrder(data as RawOrder) : null;
}

/**
 * Every call needs its own realtime topic.
 *
 * `supabase.channel(topic)` returns the *same* instance for a topic that already
 * exists. When the Orders tab and an order-detail screen were both mounted they
 * derived the same name from the user id, so the second one tried to attach a
 * `postgres_changes` listener to an already-subscribed channel — which throws
 * "cannot add postgres_changes callbacks ... after subscribe()".
 */
let channelSeq = 0;

/**
 * Subscribe to fulfilment updates for the signed-in user's orders. The admin
 * portal writes `order_status`, so tracking moves without the customer pulling
 * to refresh. Returns an unsubscribe function.
 */
export function subscribeToOrders(userId: string, onChange: () => void): () => void {
  channelSeq += 1;
  const channel = supabase
    .channel(`orders-${userId}-${channelSeq}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders', filter: `user_id=eq.${userId}` },
      onChange
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}
