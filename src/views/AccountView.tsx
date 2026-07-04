'use client'

import { useEffect, useState } from 'react'
import { Link, useNavigate } from '@/lib/nav'
import { motion } from 'framer-motion'
import { Mail, Package, LogOut, ShoppingBag, ChevronRight, Heart } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'

interface OrderItem {
  id: string
  product_name: string
  price: number
  quantity: number
}
interface Order {
  id: string
  created_at: string
  total: number
  status: string
  payment_method: string
  order_items: OrderItem[]
}

export default function AccountView() {
  const { user, loading, signOut } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[] | null>(null)

  useEffect(() => {
    if (!loading && !user) navigate('/login')
  }, [loading, user, navigate])

  useEffect(() => {
    if (!user) return
    const supabase = createClient()
    supabase
      .from('orders')
      .select('id, created_at, total, status, payment_method, order_items(id, product_name, price, quantity)')
      .order('created_at', { ascending: false })
      .then(({ data }) => setOrders((data as Order[]) ?? []))
  }, [user])

  if (loading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--cream)' }}>
        <div className="w-10 h-10 rounded-full border-2 border-green-200 border-t-green-600 animate-spin" />
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--cream)' }}>
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Profile header */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7 sm:p-9 mb-6 flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-green-600 text-white flex items-center justify-center text-3xl font-900 flex-shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="font-display font-900 text-gray-900 text-2xl tracking-tight">{user.name}</h1>
              <p className="text-gray-500 flex items-center gap-1.5 mt-1"><Mail size={14} /> {user.email}</p>
            </div>
            <button onClick={() => { signOut(); navigate('/') }}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 hover:border-red-200 hover:bg-red-50 text-gray-600 hover:text-red-500 font-700 rounded-xl text-sm transition-all">
              <LogOut size={15} /> Sign out
            </button>
          </div>

          {/* Orders */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7 sm:p-9 mb-6">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
                <Package size={17} className="text-green-600" />
              </div>
              <h2 className="font-display font-800 text-gray-900 text-lg">Order history</h2>
            </div>
            {orders === null ? (
              <div className="py-10 flex justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-green-100 border-t-green-600 animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag size={26} className="text-gray-300" />
                </div>
                <p className="text-gray-500 font-600 mb-1">No orders yet</p>
                <p className="text-gray-400 text-sm mb-5">Your past orders will appear here.</p>
                <Link to="/products" className="inline-flex items-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-700 rounded-xl text-sm transition-colors">
                  Start shopping <ChevronRight size={15} />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((o) => (
                  <div key={o.id} className="rounded-2xl border border-gray-100 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-800 text-gray-900 text-sm">#{o.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          {' · '}{o.payment_method === 'cod' ? 'Cash on Delivery' : 'Online'}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block text-[10px] font-800 uppercase tracking-wide px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                          {o.status}
                        </span>
                        <p className="font-900 text-gray-900 mt-1">₹{o.total}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      {o.order_items.map((it) => `${it.quantity}× ${it.product_name}`).join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Link to="/products" className="group flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:-translate-y-0.5 transition-all">
              <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center"><ShoppingBag size={19} className="text-green-600" /></div>
              <div className="flex-1"><p className="font-800 text-gray-900">Browse products</p><p className="text-sm text-gray-400">Fresh ready-to-cook packs</p></div>
              <ChevronRight size={18} className="text-gray-300 group-hover:text-green-600 transition-colors" />
            </Link>
            <Link to="/contact" className="group flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:-translate-y-0.5 transition-all">
              <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center"><Heart size={19} className="text-green-600" /></div>
              <div className="flex-1"><p className="font-800 text-gray-900">Need help?</p><p className="text-sm text-gray-400">Contact our team</p></div>
              <ChevronRight size={18} className="text-gray-300 group-hover:text-green-600 transition-colors" />
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
