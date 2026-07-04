import { createClient } from '@supabase/supabase-js'

/**
 * Privileged server-only Supabase client using the SERVICE ROLE key.
 * Bypasses Row Level Security — NEVER import this into a client component.
 * Used for trusted server operations like writing orders.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}
