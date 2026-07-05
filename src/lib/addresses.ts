'use client'

import { createClient } from '@/lib/supabase/client'

/** A saved delivery address, mirroring the checkout form fields. */
export interface Address {
  id: string
  label: string          // 'Home' | 'Work'
  name: string
  phone: string
  pincode: string
  house_no: string
  area: string
  landmark: string
  city: string
  state: string
  is_default: boolean
  created_at?: string
}

export type AddressInput = Omit<Address, 'id' | 'created_at' | 'is_default'> & { is_default?: boolean }

const COLUMNS = 'id, label, name, phone, pincode, house_no, area, landmark, city, state, is_default, created_at'

/** All saved addresses for the signed-in user (default first, then newest). */
export async function listAddresses(): Promise<Address[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('addresses')
    .select(COLUMNS)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false })
  if (error) { console.error('listAddresses failed:', error.message); return [] }
  return (data as Address[]) ?? []
}

/** Insert a new address for the current user. RLS fills user_id via the policy. */
export async function createAddress(input: AddressInput): Promise<Address | null> {
  const supabase = createClient()
  const { data: auth } = await supabase.auth.getUser()
  if (!auth.user) return null
  const { data, error } = await supabase
    .from('addresses')
    .insert({ ...input, user_id: auth.user.id })
    .select(COLUMNS)
    .single()
  if (error) { console.error('createAddress failed:', error.message); return null }
  return data as Address
}

export async function updateAddress(id: string, input: AddressInput): Promise<Address | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('addresses')
    .update(input)
    .eq('id', id)
    .select(COLUMNS)
    .single()
  if (error) { console.error('updateAddress failed:', error.message); return null }
  return data as Address
}

export async function deleteAddress(id: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase.from('addresses').delete().eq('id', id)
  if (error) { console.error('deleteAddress failed:', error.message); return false }
  return true
}

/** Make one address the default (clears the flag on the others first). */
export async function setDefaultAddress(id: string): Promise<boolean> {
  const supabase = createClient()
  const { data: auth } = await supabase.auth.getUser()
  if (!auth.user) return false
  await supabase.from('addresses').update({ is_default: false }).eq('user_id', auth.user.id)
  const { error } = await supabase.from('addresses').update({ is_default: true }).eq('id', id)
  if (error) { console.error('setDefaultAddress failed:', error.message); return false }
  return true
}
