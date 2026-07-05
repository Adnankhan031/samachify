'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './AuthContext'
import type { OrderStatus } from '@/lib/orderStatus'

export interface ActiveOrder {
  id: string
  order_status: OrderStatus
  created_at: string
  total: number
}

const Ctx = createContext<{ activeOrder: ActiveOrder | null }>({ activeOrder: null })

/**
 * Tracks the signed-in user's most recent *in-progress* order (anything not yet
 * delivered/cancelled) and keeps it live via realtime. Powers the navbar dot,
 * the floating track-order pill, and the account-page banner — all in sync.
 */
export function ActiveOrderProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(null)

  useEffect(() => {
    if (!user) { setActiveOrder(null); return }
    const supabase = createClient()
    const load = () =>
      supabase
        .from('orders')
        .select('id, order_status, created_at, total')
        .not('order_status', 'in', '(delivered,cancelled)')
        .order('created_at', { ascending: false })
        .limit(1)
        .then(({ data }) => setActiveOrder(((data && data[0]) as ActiveOrder) ?? null))
    load()
    const ch = supabase
      .channel('active-order')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `user_id=eq.${user.id}` }, load)
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [user])

  return <Ctx.Provider value={{ activeOrder }}>{children}</Ctx.Provider>
}

export const useActiveOrder = () => useContext(Ctx)
