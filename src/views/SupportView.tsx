'use client'

import { FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, ChevronRight, Clock3, Headphones, Loader2, MessageCircle, Package, PauseCircle, Send, ShieldCheck, Sparkles } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'
import {
  SUPPORT_CATEGORIES,
  createSupportCase,
  listSupportCases,
  listSupportMessages,
  markSupportCaseRead,
  sendSupportMessage,
  subscribeToSupport,
  type SupportCase,
  type SupportMessage,
  type SupportOrder,
} from '@/lib/support'

const STATUS = {
  active: { label: 'Active', icon: MessageCircle, classes: 'bg-green-50 text-green-700 border-green-200' },
  on_hold: { label: 'On hold', icon: PauseCircle, classes: 'bg-amber-50 text-amber-700 border-amber-200' },
  resolved: { label: 'Resolved', icon: CheckCircle2, classes: 'bg-gray-100 text-gray-600 border-gray-200' },
} as const

export default function SupportView() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [cases, setCases] = useState<SupportCase[]>([])
  const [orders, setOrders] = useState<SupportOrder[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [messages, setMessages] = useState<SupportMessage[]>([])
  const [creating, setCreating] = useState(false)
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
      setSelectedId((current) => current ?? next[0]?.id ?? null)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not load support conversations.')
    }
  }, [user])

  const loadMessages = useCallback(async () => {
    if (!selectedId) { setMessages([]); return }
    try {
      setMessages(await listSupportMessages(selectedId))
      await markSupportCaseRead(selectedId)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not load this conversation.')
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

  const openNew = () => {
    const requested = new URLSearchParams(window.location.search).get('order') ?? ''
    setForm({ orderId: requested, category: '', issue: '', note: '' })
    setCreating(true)
    setError('')
  }

  const submitCase = async () => {
    if (!user || !form.orderId || !form.category || !form.issue) {
      setError('Choose an order, a topic, and the option that best matches the problem.')
      return
    }
    setBusy(true); setError('')
    try {
      const created = await createSupportCase({ ...form, userId: user.id })
      await loadCases()
      setSelectedId(created.id)
      setCreating(false)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not start the conversation.')
    } finally { setBusy(false) }
  }

  const send = async (event: FormEvent) => {
    event.preventDefault()
    if (!user || !selected || !draft.trim() || busy) return
    const message = draft
    setDraft(''); setBusy(true); setError('')
    try {
      await sendSupportMessage(selected.id, user.id, 'customer', message)
      await Promise.all([loadMessages(), loadCases()])
    } catch (cause) {
      setDraft(message)
      setError(cause instanceof Error ? cause.message : 'Message was not sent.')
    } finally { setBusy(false) }
  }

  if (authLoading || !user || loading) return <main className="min-h-screen grid place-items-center bg-[#f7fbef]"><Loader2 className="animate-spin text-green-600" size={30} /></main>

  return (
    <main className="min-h-screen bg-[#f7fbef] px-4 pb-16 pt-28 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-3 py-1 text-xs font-800 uppercase tracking-wider text-green-700"><Headphones size={13} /> Order support</div>
            <h1 className="font-display text-3xl font-900 tracking-tight text-gray-900 sm:text-4xl">How can we help?</h1>
            <p className="mt-2 text-sm text-gray-500">Choose an order, tell us what happened, and continue with our support team here.</p>
          </div>
          <button onClick={openNew} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-3 text-sm font-800 text-white shadow-[0_10px_25px_rgba(73,138,12,.24)] transition hover:-translate-y-0.5 hover:bg-green-700"><Sparkles size={16} /> Start new request</button>
        </div>

        {error && <div role="alert" className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <div className="grid min-h-[680px] overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_20px_70px_rgba(37,73,8,.10)] lg:grid-cols-[330px_1fr]">
          <aside className="border-b border-gray-100 bg-[#fbfdf8] lg:border-b-0 lg:border-r">
            <div className="border-b border-gray-100 p-5"><p className="font-display font-800 text-gray-900">Your conversations</p><p className="mt-1 text-xs text-gray-400">{cases.filter((item) => item.status !== 'resolved').length} open request{cases.filter((item) => item.status !== 'resolved').length === 1 ? '' : 's'}</p></div>
            <div className="max-h-[260px] overflow-y-auto p-3 lg:max-h-[610px]">
              {cases.length === 0 ? <div className="px-4 py-12 text-center"><MessageCircle className="mx-auto text-green-200" size={32} /><p className="mt-3 text-sm font-700 text-gray-600">No support requests</p><p className="mt-1 text-xs text-gray-400">Start with one of your orders.</p></div> : cases.map((item) => {
                const meta = STATUS[item.status]; const Icon = meta.icon
                return <button key={item.id} onClick={() => { setCreating(false); setSelectedId(item.id) }} className={`mb-2 w-full rounded-2xl border p-4 text-left transition ${selectedId === item.id && !creating ? 'border-green-200 bg-white shadow-sm' : 'border-transparent hover:bg-white'}`}>
                  <div className="flex items-center justify-between gap-2"><span className="text-[10px] font-800 uppercase tracking-wider text-gray-400">Order #{item.order_id.slice(0, 8)}</span>{item.customer_unread > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-green-600 px-1 text-[10px] font-800 text-white">{item.customer_unread}</span>}</div>
                  <p className="mt-2 line-clamp-2 text-sm font-800 text-gray-900">{item.summary}</p>
                  <span className={`mt-3 inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-800 ${meta.classes}`}><Icon size={10} /> {meta.label}</span>
                </button>
              })}
            </div>
          </aside>

          {creating ? (
            <section className="overflow-y-auto p-5 sm:p-8">
              <button onClick={() => setCreating(false)} className="mb-6 inline-flex items-center gap-1 text-sm font-700 text-gray-500 hover:text-gray-900"><ArrowLeft size={15} /> Conversations</button>
              <div className="mx-auto max-w-2xl">
                <h2 className="font-display text-2xl font-900 text-gray-900">Start an order support request</h2>
                <p className="mt-2 text-sm text-gray-500">A short guided form gives the support team the context they need before the chat begins.</p>

                <Step number="1" title="Which order needs help?">
                  <div className="grid gap-2 sm:grid-cols-2">{orders.map((order) => <button key={order.id} onClick={() => setForm((current) => ({ ...current, orderId: order.id }))} className={`rounded-2xl border p-4 text-left transition ${form.orderId === order.id ? 'border-green-500 bg-green-50 ring-2 ring-green-100' : 'border-gray-200 hover:border-green-200'}`}><p className="text-sm font-800 text-gray-900">Order #{order.id.slice(0, 8).toUpperCase()}</p><p className="mt-1 text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString('en-IN')} · ₹{order.total}</p><p className="mt-2 line-clamp-1 text-xs text-gray-400">{order.order_items.map((item) => item.product_name).join(', ')}</p></button>)}</div>
                </Step>

                <Step number="2" title="What do you need help with?">
                  <div className="grid gap-2 sm:grid-cols-2">{SUPPORT_CATEGORIES.map((item) => <button key={item.key} onClick={() => setForm((current) => ({ ...current, category: item.key, issue: '' }))} className={`flex items-center justify-between rounded-2xl border p-4 text-left text-sm font-800 transition ${form.category === item.key ? 'border-green-500 bg-green-50 text-green-800 ring-2 ring-green-100' : 'border-gray-200 text-gray-700 hover:border-green-200'}`}>{item.label}<ChevronRight size={15} /></button>)}</div>
                </Step>

                {category && <Step number="3" title="Which option matches best?"><div className="flex flex-wrap gap-2">{category.issues.map((issue) => <button key={issue} onClick={() => setForm((current) => ({ ...current, issue }))} className={`rounded-full border px-4 py-2.5 text-sm font-700 transition ${form.issue === issue ? 'border-green-600 bg-green-600 text-white' : 'border-gray-200 text-gray-600 hover:border-green-300'}`}>{issue}</button>)}</div></Step>}

                {form.issue && <Step number="4" title="Add a few details"><textarea value={form.note} onChange={(event) => setForm((current) => ({ ...current, note: event.target.value.slice(0, 2000) }))} rows={5} placeholder="Tell us what happened and what resolution you need…" className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-green-400 focus:ring-2 focus:ring-green-100" /><p className="mt-2 text-right text-xs text-gray-400">{form.note.length}/2000</p></Step>}

                <button onClick={submitCase} disabled={busy || !form.orderId || !form.category || !form.issue} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-6 py-4 text-sm font-800 text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40">{busy ? <Loader2 size={16} className="animate-spin" /> : <MessageCircle size={16} />} Start secure chat</button>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-400"><ShieldCheck size={13} /> Shared only with Samachify support</p>
              </div>
            </section>
          ) : selected ? (
            <section className="flex min-h-0 flex-col">
              <div className="border-b border-gray-100 p-5 sm:px-7"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-800 uppercase tracking-wider text-green-600">Order #{selected.order_id.slice(0, 8).toUpperCase()}</p><h2 className="mt-1 font-display text-xl font-900 text-gray-900">{selected.summary}</h2></div><Status status={selected.status} /></div>{selected.orders && <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl bg-gray-50 px-4 py-3 text-xs text-gray-500"><span className="inline-flex items-center gap-1.5 font-700 text-gray-700"><Package size={13} /> {selected.orders.order_items.map((item) => `${item.quantity}× ${item.product_name}`).join(', ')}</span><span>₹{selected.orders.total}</span><span className="inline-flex items-center gap-1"><Clock3 size={12} /> {new Date(selected.created_at).toLocaleDateString('en-IN')}</span></div>}</div>
              <div className="flex-1 overflow-y-auto bg-[#fbfdf8] p-5 sm:p-7">{messages.map((message) => <div key={message.id} className={`mb-4 flex ${message.sender_role === 'customer' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${message.sender_role === 'customer' ? 'rounded-br-md bg-green-600 text-white' : 'rounded-bl-md border border-gray-100 bg-white text-gray-700'}`}><p>{message.body}</p><p className={`mt-1.5 text-[10px] ${message.sender_role === 'customer' ? 'text-green-100' : 'text-gray-400'}`}>{message.sender_role === 'admin' ? 'Samachify support · ' : ''}{new Date(message.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}</p></div></div>)}<div ref={endRef} /></div>
              <form onSubmit={send} className="border-t border-gray-100 bg-white p-4 sm:p-5"><div className="flex items-end gap-3"><textarea value={draft} onChange={(event) => setDraft(event.target.value.slice(0, 4000))} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit() } }} rows={1} placeholder={selected.status === 'resolved' ? 'Reply to reopen this request…' : 'Write a message…'} className="max-h-32 min-h-12 flex-1 resize-none rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100" /><button disabled={busy || !draft.trim()} className="grid h-12 w-12 place-items-center rounded-2xl bg-green-600 text-white transition hover:bg-green-700 disabled:opacity-40" aria-label="Send message">{busy ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}</button></div></form>
            </section>
          ) : <section className="grid place-items-center p-8 text-center"><div><Headphones className="mx-auto text-green-300" size={48} /><h2 className="mt-4 font-display text-xl font-900 text-gray-900">Support starts with an order</h2><p className="mt-2 text-sm text-gray-500">Select “Start new request” and we’ll collect the right details.</p><button onClick={openNew} className="mt-5 rounded-2xl bg-green-600 px-5 py-3 text-sm font-800 text-white">Start new request</button></div></section>}
        </div>
      </div>
    </main>
  )
}

function Step({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8"><div className="mb-3 flex items-center gap-2"><span className="grid h-6 w-6 place-items-center rounded-full bg-green-100 text-xs font-900 text-green-700">{number}</span><h3 className="font-display font-800 text-gray-900">{title}</h3></div>{children}</motion.section>
}

function Status({ status }: { status: SupportCase['status'] }) {
  const meta = STATUS[status]; const Icon = meta.icon
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-800 ${meta.classes}`}><Icon size={12} /> {meta.label}</span>
}
