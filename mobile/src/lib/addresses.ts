/**
 * Saved delivery addresses — the same `addresses` table the website's address book
 * uses, so an address added on the web shows up in the app and vice versa.
 * All access is under RLS as the signed-in user.
 */
import { supabase } from './supabase';

export interface Address {
  id: string;
  label: string; // 'Home' | 'Work'
  name: string;
  phone: string;
  pincode: string;
  house_no: string;
  area: string;
  landmark: string;
  city: string;
  state: string;
  is_default: boolean;
  created_at?: string;
  /**
   * The customer's delivery pin. Null on addresses saved before pinning
   * existed, and on anything entered through the website, which has no picker.
   * The delivery-partner app navigates to this; the text is context for the
   * last few metres.
   */
  latitude?: number | null;
  longitude?: number | null;
}

export type AddressInput = Omit<Address, 'id' | 'created_at' | 'is_default'> & {
  is_default?: boolean;
};

const COLUMNS =
  'id, label, name, phone, pincode, house_no, area, landmark, city, state, is_default, created_at, latitude, longitude';

/** Default first, then newest. */
export async function listAddresses(): Promise<Address[]> {
  const { data, error } = await supabase
    .from('addresses')
    .select(COLUMNS)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data as Address[]) ?? [];
}

export async function createAddress(input: AddressInput): Promise<Address> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error('Please sign in to save an address.');

  const { data, error } = await supabase
    .from('addresses')
    .insert({ ...input, user_id: auth.user.id })
    .select(COLUMNS)
    .single();

  if (error) throw new Error(error.message);
  return data as Address;
}

export async function updateAddress(id: string, input: AddressInput): Promise<Address> {
  const { data, error } = await supabase
    .from('addresses')
    .update(input)
    .eq('id', id)
    .select(COLUMNS)
    .single();

  if (error) throw new Error(error.message);
  return data as Address;
}

export async function deleteAddress(id: string): Promise<void> {
  const { error } = await supabase.from('addresses').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

/** Clears the flag on the user's other addresses first, then sets this one. */
export async function setDefaultAddress(id: string): Promise<void> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error('Please sign in first.');

  await supabase.from('addresses').update({ is_default: false }).eq('user_id', auth.user.id);
  const { error } = await supabase.from('addresses').update({ is_default: true }).eq('id', id);
  if (error) throw new Error(error.message);
}

/** The single-line form `/api/orders` expects for its `address` column. */
export function formatAddressLine(a: Address): string {
  return [a.house_no, a.area, a.landmark].filter(Boolean).join(', ');
}

/** Human-readable second line for address cards. */
export function formatAddressSubtitle(a: Address): string {
  return `${[a.house_no, a.area].filter(Boolean).join(', ')}, ${a.city} — ${a.pincode}`;
}
