import { createClient } from '@/lib/supabase/client'

export type SupportStatus = 'active' | 'on_hold' | 'resolved'
export type SupportPriority = 'normal' | 'high' | 'urgent'

export const SUPPORT_CATEGORIES = [
  { key: 'delivery', label: 'Delivery issue', icon: 'truck', issues: ['Order is delayed', 'Delivery partner issue', 'Wrong delivery location', 'Order shows delivered but was not received'] },
  { key: 'items', label: 'Items in my order', icon: 'package', issues: ['Item is missing', 'Wrong item received', 'Pack was damaged', 'Quantity is incorrect'] },
  { key: 'quality', label: 'Quality or freshness', icon: 'leaf', issues: ['Ingredients are not fresh', 'Packaging or seal issue', 'Taste or preparation concern', 'Product safety concern'] },
  { key: 'payment', label: 'Payment or refund', icon: 'wallet', issues: ['Payment was charged twice', 'Payment succeeded but order failed', 'Refund status', 'Cash on delivery question'] },
  { key: 'other', label: 'Something else', icon: 'message', issues: ['Change or cancel my order', 'Need cooking help', 'Invoice or billing question', 'Other order question'] },
] as const

export interface SupportOrder {
  id: string
  created_at: string
  total: number
  order_status: string
  customer_name: string
  phone: string
  address: string
  city: string
  pincode: string
  order_items: { id: string; product_name: string; quantity: number; price: number }[]
}

export interface SupportCase {
  id: string
  order_id: string
  user_id: string
  category: string
  issue: string
  summary: string
  customer_note: string
  status: SupportStatus
  priority: SupportPriority
  assigned_admin_id: string | null
  customer_unread: number
  admin_unread: number
  created_at: string
  updated_at: string
  last_message_at: string
  resolved_at: string | null
  orders?: SupportOrder | null
}

export interface SupportMessage {
  id: string
  case_id: string
  sender_id: string
  sender_role: 'customer' | 'admin'
  body: string
  created_at: string
}

const CASE_SELECT = '*, orders(id,created_at,total,order_status,customer_name,phone,address,city,pincode,order_items(id,product_name,quantity,price))'

export async function listSupportCases(): Promise<SupportCase[]> {
  const { data, error } = await createClient().from('support_cases').select(CASE_SELECT).order('last_message_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as unknown as SupportCase[]
}

export async function createSupportCase(input: { orderId: string; userId: string; category: string; issue: string; note: string; priority?: SupportPriority }) {
  const category = SUPPORT_CATEGORIES.find((item) => item.key === input.category)
  if (!category || !category.issues.includes(input.issue as never)) throw new Error('Choose a valid support topic.')
  const summary = `${category.label}: ${input.issue}`
  const client = createClient()
  const { data: supportCase, error } = await client.from('support_cases').insert({
    order_id: input.orderId,
    user_id: input.userId,
    category: input.category,
    issue: input.issue,
    summary,
    customer_note: input.note.trim(),
    priority: input.priority ?? (input.issue === 'Product safety concern' ? 'urgent' : 'normal'),
  }).select(CASE_SELECT).single()
  if (error) throw error
  const opening = input.note.trim() || `I need help with this order. ${input.issue}.`
  const { error: messageError } = await client.from('support_messages').insert({ case_id: supportCase.id, sender_id: input.userId, sender_role: 'customer', body: opening })
  if (messageError) throw messageError
  return supportCase as unknown as SupportCase
}

export async function listSupportMessages(caseId: string): Promise<SupportMessage[]> {
  const { data, error } = await createClient().from('support_messages').select('*').eq('case_id', caseId).order('created_at')
  if (error) throw error
  return (data ?? []) as SupportMessage[]
}

export async function sendSupportMessage(caseId: string, senderId: string, senderRole: 'customer' | 'admin', body: string) {
  const clean = body.trim()
  if (!clean) return
  const { error } = await createClient().from('support_messages').insert({ case_id: caseId, sender_id: senderId, sender_role: senderRole, body: clean })
  if (error) throw error
}

export async function markSupportCaseRead(caseId: string) {
  await createClient().rpc('mark_support_case_read', { p_case_id: caseId })
}

export function subscribeToSupport(userId: string, reload: () => void) {
  const client = createClient()
  const channel = client.channel(`support-${userId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'support_cases' }, reload)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'support_messages' }, reload)
    .subscribe()
  return () => { client.removeChannel(channel) }
}
