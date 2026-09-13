'use client'

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, Check, CheckCircle2, ChevronRight, CircleDollarSign, Clock3,
  Headphones, Leaf, Loader2, MessageCircle, Package, PauseCircle,
  Send, ShieldCheck, ShoppingBag, Truck,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'
import {
  SUPPORT_CATEGORIES, createSupportCase, listSupportCases, listSupportMessages,
  markSupportCaseRead, sendSupportMessage, subscribeToSupport,
  type SupportCase, type SupportMessage, type SupportOrder,
} from '@/lib/support'

const STATUS = {
  active: { label: 'Open', icon: MessageCircle, classes: 'border-green-200 bg-green-50 text-green-800' },
  on_hold: { label: 'Waiting', icon: PauseCircle, classes: 'border-amber-200 bg-amber-50 text-amber-800' },
  resolved: { label: 'Resolved', icon: CheckCircle2, classes: 'border-gray-200 bg-gray-100 text-gray-600' },
} as const

const CATEGORY_ICONS = {
  delivery: Truck,
  items: Package,
  quality: Leaf,
  payment: CircleDollarSign,
  other: MessageCircle,
} as const

export default function SupportView() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [cases, setCases] = useState<SupportCase[]>([])
  const [orders, setOrders] = useState<SupportOrder[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [messages, setMessages] = useState<SupportMessage[]>([])
  const [creating, setCreating] = useState(false)
  const [filter, setFilter] = useState<'open' | 'resolved'>('open')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [draft, setDraft] = useState('')
  const [form, setForm] = useState({ orderId: '', category: '', issue: '', note: '' })
  const endRef = useRef<HTMLDivElement>(null)

  const loadCases = useCallback(async () => {
    if (!user) return
    try {
      const next = await listSupportCases()
      setCases(next)
      setSelectedId((current) => current && next.some((item) => item.id === current) ? current : next[0]?.id ?? null)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Support conversations could not be loaded.')
    }
  }, [user])

  const loadMessages = useCallback(async () => {
    if (!selectedId) { setMessages([]); return }
    try {
      setMessages(await listSupportMessages(selectedId))
      await markSupportCaseRead(selectedId)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'This conversation could not be loaded.')
    }
  }, [selectedId])

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login?next=/support')
  }, [authLoading, user, router])

  useEffect(() => {
    if (!user) return
    const client = createClient()
    Promise.all([
      loadCases(),
      client.from('orders').select('id,created_at,total,order_status,customer_name,phone,address,city,pincode,order_items(id,product_name,quantity,price)').order('created_at', { ascending: false }),
    ]).then(([, orderResult]) => {
      setOrders((orderResult.data ?? []) as unknown as SupportOrder[])
      const requested = new URLSearchParams(window.location.search).get('order')
      if (requested) {
        setForm((current) => ({ ...current, orderId: requested }))
        setCreating(true)
      }
    }).finally(() => setLoading(false))
    return subscribeToSupport(user.id, () => { void loadCases(); void loadMessages() })
  }, [user, loadCases, loadMessages])

  useEffect(() => { void loadMessages() }, [loadMessages])
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const selected = cases.find((item) => item.id === selectedId) ?? null
  const category = SUPPORT_CATEGORIES.find((item) => item.key === form.category)
  const visibleCases = useMemo(() => cases.filter((item) => filter === 'resolved' ? item.status === 'resolved' : item.status !== 'resolved'), [cases, filter])
  const activeCount = cases.filter((item) => item.status !== 'resolved').length

  const openNew = () => {
    const requested = new URLSearchParams(window.location.search).get('order') ?? ''
    setForm({ orderId: requested, category: '', issue: '', note: '' })
    setCreating(true)
    setError('')
  }

  const submitCase = async () => {
    if (!user || !form.orderId || !form.category || !form.issue) {
      setError('Choose an order and the issue that best matches what happened.')
      return
    }
    setBusy(true); setError('')
    try {
      const created = await createSupportCase({ ...form, userId: user.id })
      await loadCases()
      setSelectedId(created.id)
      setCreating(false)
      setFilter('open')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'The conversation could not be started.')
    } finally { setBusy(false) }
  }

  const send = async (event: FormEvent) => {
    event.preventDefault()
    if (!user || !selected || !draft.trim() || busy) return
    const message = draft.trim()
    setDraft(''); setBusy(true); setError('')
    try {
      await sendSupportMessage(selected.id, user.id, 'customer', message)
      await Promise.all([loadMessages(), loadCases()])
    } catch (cause) {
      setDraft(message)
      setError(cause instanceof Error ? cause.message : 'Your message was not sent.')
    } finally { setBusy(false) }
  }

  if (authLoading || !user || loading) return <main className="grid min-h-screen place-items-center bg-[#f5f8f0]"><Loader2 className="animate-spin text-green-700" size={28} /></main>

  return (
    <main className="min-h-screen bg-[#f5f8f0] px-3 pb-10 pt-24 sm:px-6 sm:pb-16 sm:pt-28">
      <div className="mx-auto max-w-7xl">
        <header className="mb-5 rounded-[28px] bg-[#0b260a] px-5 py-6 text-white sm:px-8 sm:py-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <div className="mb-3 flex items-center gap-2 text-sm font-700 text-[#b7ef78]"><Headphones size={17} /> Samachify support</div>
              <h1 className="font-display text-3xl font-900 tracking-tight sm:text-4xl">Help that stays with your order.</h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">Tell us what happened once. Your order, delivery details, and conversation stay together until the issue is resolved.</p>
            </div>
            <button onClick={openNew} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#a8e95d] px-5 py-3 font-800 text-[#0b260a] transition hover:bg-[#baf276] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><MessageCircle size={17} /> Get help with an order</button>
          </div>
        </header>

        {error && <div role="alert" className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}

        <div className="grid min-h-[680px] overflow-hidden rounded-[28px] border border-[#dfe8d5] bg-white shadow-[0_18px_55px_rgba(28,55,12,.10)] lg:grid-cols-[310px_minmax(0,1fr)]">
          <aside className="border-b border-[#e6ebdf] bg-[#fbfcf8] lg:border-b-0 lg:border-r">
            <div className="border-b border-[#e6ebdf] p-4 sm:p-5">
              <div className="flex items-center justify-between"><p className="font-800 text-gray-900">Conversations</p><span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-800 text-green-800">{activeCount} open</span></div>
              <div className="mt-4 grid grid-cols-2 rounded-xl bg-[#edf2e8] p-1">{(['open', 'resolved'] as const).map((item) => <button key={item} onClick={() => setFilter(item)} className={`min-h-10 rounded-lg text-sm font-800 capitalize transition ${filter === item ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>{item}</button>)}</div>
            </div>
            <div className="max-h-[310px] overflow-y-auto p-2.5 lg:max-h-[600px]">
              {visibleCases.length === 0 ? <div className="px-5 py-12 text-center"><MessageCircle className="mx-auto text-green-200" size={32} /><p className="mt-3 text-sm font-800 text-gray-700">No {filter} conversations</p><p className="mt-1 text-xs leading-relaxed text-gray-500">{filter === 'open' ? 'Choose an order to start a request.' : 'Completed requests will appear here.'}</p></div> : visibleCases.map((item) => <CaseButton key={item.id} item={item} active={selectedId === item.id && !creating} onClick={() => { setCreating(false); setSelectedId(item.id) }} />)}
            </div>
          </aside>

          {creating ? <NewRequest orders={orders} form={form} setForm={setForm} category={category} busy={busy} onBack={() => setCreating(false)} onSubmit={() => void submitCase()} /> : selected ? <Chat caseItem={selected} messages={messages} draft={draft} busy={busy} setDraft={setDraft} onSend={send} endRef={endRef} /> : <section className="grid min-h-[480px] place-items-center p-8 text-center"><div className="max-w-sm"><span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-green-50 text-green-700"><Headphones size={28} /></span><h2 className="mt-5 font-display text-2xl font-900 text-gray-900">Select a conversation</h2><p className="mt-2 text-sm leading-relaxed text-gray-500">Open an existing request or start with one of your orders.</p><button onClick={openNew} className="mt-5 rounded-xl bg-green-700 px-5 py-3 text-sm font-800 text-white">Start a request</button></div></section>}
        </div>
      </div>
    </main>
  )
}

function CaseButton({ item, active, onClick }: { item: SupportCase; active: boolean; onClick: () => void }) {
  const meta = STATUS[item.status]
  const Icon = meta.icon
  return <button onClick={onClick} className={`mb-1.5 w-full rounded-2xl border p-4 text-left transition ${active ? 'border-green-300 bg-white shadow-[0_6px_20px_rgba(28,55,12,.08)]' : 'border-transparent hover:bg-white'}`}><div className="flex items-center justify-between gap-2"><span className="text-xs font-700 text-gray-500">Order #{item.order_id.slice(0, 8).toUpperCase()}</span>{item.customer_unread > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-green-700 px-1 text-[10px] font-900 text-white">{item.customer_unread}</span>}</div><p className="mt-2 line-clamp-2 text-sm font-800 leading-snug text-gray-900">{item.issue}</p><div className="mt-3 flex items-center justify-between gap-2"><span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-800 ${meta.classes}`}><Icon size={11} /> {meta.label}</span><span className="text-[10px] text-gray-400">{new Date(item.last_message_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span></div></button>
}

function NewRequest({ orders, form, setForm, category, busy, onBack, onSubmit }: { orders: SupportOrder[]; form: { orderId: string; category: string; issue: string; note: string }; setForm: React.Dispatch<React.SetStateAction<{ orderId: string; category: string; issue: string; note: string }>>; category: (typeof SUPPORT_CATEGORIES)[number] | undefined; busy: boolean; onBack: () => void; onSubmit: () => void }) {
  const stage = !form.orderId ? 1 : !form.category ? 2 : !form.issue ? 3 : 4
  return <section className="min-w-0 overflow-y-auto p-4 sm:p-7 lg:p-9"><button onClick={onBack} className="mb-5 inline-flex min-h-11 items-center gap-2 rounded-xl px-2 text-sm font-700 text-gray-500 hover:bg-gray-50 hover:text-gray-900"><ArrowLeft size={16} /> Back to conversations</button><div className="mx-auto max-w-3xl"><div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-end"><div><h2 className="font-display text-2xl font-900 text-gray-900">Get help with an order</h2><p className="mt-2 text-sm text-gray-500">Four quick steps give the team everything they need.</p></div><p className="text-sm font-800 text-green-800">Step {stage} of 4</p></div><div className="mt-5 grid grid-cols-4 gap-2" aria-label={`Step ${stage} of 4`}>{[1,2,3,4].map((item) => <span key={item} className={`h-1.5 rounded-full ${item <= stage ? 'bg-green-600' : 'bg-gray-200'}`} />)}</div>
    <SupportStep complete={Boolean(form.orderId)} title="Choose the order" description="We attach its items, payment and delivery details.">{orders.length ? <div className="grid gap-2 sm:grid-cols-2">{orders.map((order) => <button key={order.id} onClick={() => setForm((current) => ({ ...current, orderId: order.id }))} className={`rounded-2xl border p-4 text-left transition ${form.orderId === order.id ? 'border-green-500 bg-green-50 ring-2 ring-green-100' : 'border-gray-200 hover:border-green-300'}`}><div className="flex items-center justify-between gap-2"><p className="text-sm font-800 text-gray-900">#{order.id.slice(0, 8).toUpperCase()}</p><p className="font-900 text-gray-900">₹{order.total}</p></div><p className="mt-1 text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p><p className="mt-3 line-clamp-1 text-xs text-gray-500">{order.order_items.map((item) => `${item.quantity}× ${item.product_name}`).join(', ')}</p></button>)}</div> : <p className="rounded-2xl bg-gray-50 p-5 text-sm text-gray-600">You need a placed order before starting order support.</p>}</SupportStep>
    {form.orderId && <SupportStep complete={Boolean(form.category)} title="What needs attention?" description="Choose the closest topic."><div className="grid gap-2 sm:grid-cols-2">{SUPPORT_CATEGORIES.map((item) => { const Icon = CATEGORY_ICONS[item.key]; const selected = form.category === item.key; return <button key={item.key} onClick={() => setForm((current) => ({ ...current, category: item.key, issue: '' }))} className={`flex min-h-16 items-center gap-3 rounded-2xl border p-4 text-left transition ${selected ? 'border-green-500 bg-green-50 ring-2 ring-green-100' : 'border-gray-200 hover:border-green-300'}`}><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${selected ? 'bg-green-700 text-white' : 'bg-[#edf6e4] text-green-800'}`}><Icon size={18} /></span><span className="flex-1 text-sm font-800 text-gray-900">{item.label}</span><ChevronRight size={16} className="text-gray-400" /></button> })}</div></SupportStep>}
    {category && <SupportStep complete={Boolean(form.issue)} title="Tell us what happened" description="Pick the option that best describes the problem."><div className="grid gap-2">{category.issues.map((issue) => <button key={issue} onClick={() => setForm((current) => ({ ...current, issue }))} className={`flex min-h-12 items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-700 transition ${form.issue === issue ? 'border-green-600 bg-green-700 text-white' : 'border-gray-200 text-gray-700 hover:border-green-300'}`}><span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${form.issue === issue ? 'border-white bg-white text-green-700' : 'border-gray-300'}`}>{form.issue === issue && <Check size={13} strokeWidth={3} />}</span>{issue}</button>)}</div></SupportStep>}
    {form.issue && <SupportStep complete={Boolean(form.note.trim())} title="Add useful details" description="Optional, but it helps us solve this faster."><textarea value={form.note} onChange={(event) => setForm((current) => ({ ...current, note: event.target.value.slice(0, 2000) }))} rows={5} placeholder="What happened? Include any detail the support team should know." className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 text-sm leading-relaxed outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100" /><p className="mt-2 text-right text-xs text-gray-400">{form.note.length}/2000</p></SupportStep>}
    <button onClick={onSubmit} disabled={busy || !form.orderId || !form.category || !form.issue} className="mt-7 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-green-700 px-6 py-4 text-sm font-900 text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-40">{busy ? <Loader2 size={17} className="animate-spin" /> : <MessageCircle size={17} />} Start conversation</button><p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-500"><ShieldCheck size={13} /> Only you and Samachify support can see this request.</p></div></section>
}

function SupportStep({ complete, title, description, children }: { complete: boolean; title: string; description: string; children: React.ReactNode }) {
  return <section className="mt-7"><div className="mb-3 flex items-start gap-3"><span className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full ${complete ? 'bg-green-700 text-white' : 'bg-green-100 text-green-800'}`}>{complete ? <Check size={14} strokeWidth={3} /> : <span className="h-2 w-2 rounded-full bg-current" />}</span><div><h3 className="font-800 text-gray-900">{title}</h3><p className="mt-0.5 text-xs leading-relaxed text-gray-500">{description}</p></div></div>{children}</section>
}

function Chat({ caseItem, messages, draft, busy, setDraft, onSend, endRef }: { caseItem: SupportCase; messages: SupportMessage[]; draft: string; busy: boolean; setDraft: (value: string) => void; onSend: (event: FormEvent) => void; endRef: React.RefObject<HTMLDivElement | null> }) {
  const meta = STATUS[caseItem.status]
  const StatusIcon = meta.icon
  return <section className="flex min-h-[640px] min-w-0 flex-col"><header className="border-b border-gray-100 px-4 py-5 sm:px-7"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><div className="flex flex-wrap items-center gap-2"><p className="text-xs font-800 text-green-800">Order #{caseItem.order_id.slice(0, 8).toUpperCase()}</p><span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-800 ${meta.classes}`}><StatusIcon size={11} /> {meta.label}</span></div><h2 className="mt-2 font-display text-xl font-900 text-gray-900">{caseItem.issue}</h2></div><div className="text-left sm:text-right"><p className="text-xs text-gray-400">Case #{caseItem.id.slice(0, 8).toUpperCase()}</p><p className="mt-1 inline-flex items-center gap-1 text-xs text-gray-500"><Clock3 size={12} /> Started {new Date(caseItem.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p></div></div>{caseItem.orders && <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl bg-[#f3f6ef] px-4 py-3 text-xs text-gray-600"><span className="inline-flex items-center gap-1.5 font-800 text-gray-800"><ShoppingBag size={14} /> {caseItem.orders.order_items.map((item) => `${item.quantity}× ${item.product_name}`).join(', ')}</span><span className="font-800">₹{caseItem.orders.total}</span><span className="capitalize">{caseItem.orders.order_status.replaceAll('_', ' ')}</span></div>}</header>
    <div className="flex-1 overflow-y-auto bg-[#f8faf5] px-4 py-5 sm:px-7">{messages.map((message) => <div key={message.id} className={`mb-4 flex ${message.sender_role === 'customer' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[72%] ${message.sender_role === 'customer' ? 'rounded-br-md bg-green-700 text-white' : 'rounded-bl-md border border-[#e2e9dc] bg-white text-gray-800 shadow-sm'}`}><p className="whitespace-pre-wrap break-words">{message.body}</p><p className={`mt-1.5 text-[10px] ${message.sender_role === 'customer' ? 'text-green-100' : 'text-gray-400'}`}>{message.sender_role === 'admin' ? 'Samachify support · ' : ''}{new Date(message.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}</p></div></div>)}<div ref={endRef} /></div>
    <form onSubmit={onSend} className="border-t border-gray-100 bg-white p-3 sm:p-5"><p className="mb-2 text-xs text-gray-500">{caseItem.status === 'on_hold' ? 'This request is waiting, but you can still add a message.' : caseItem.status === 'resolved' ? 'A new message will reopen this request.' : 'Replies appear here as soon as the team responds.'}</p><div className="flex items-end gap-2"><textarea value={draft} onChange={(event) => setDraft(event.target.value.slice(0, 4000))} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit() } }} rows={1} placeholder="Write a message" className="max-h-32 min-h-12 flex-1 resize-none rounded-2xl border border-gray-200 bg-[#fafbf8] px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100" /><button disabled={busy || !draft.trim()} className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-green-700 text-white transition hover:bg-green-800 disabled:opacity-40" aria-label="Send message">{busy ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}</button></div></form></section>
}
