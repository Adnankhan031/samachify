'use client'

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

export interface AuthUser {
  id: string
  email: string
  name: string
}

interface AuthResult {
  error?: string
  /** Set when the action succeeded but needs a follow-up (e.g. email confirmation). */
  message?: string
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signUp: (name: string, email: string, password: string) => Promise<AuthResult>
  signIn: (email: string, password: string) => Promise<AuthResult>
  signInWithGoogle: (next?: string) => Promise<AuthResult>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

/** Map a Supabase user to our lightweight shape. */
function toAuthUser(u: User | null): AuthUser | null {
  if (!u) return null
  const name =
    (u.user_metadata?.name as string) ||
    (u.user_metadata?.full_name as string) ||
    (u.email ? u.email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Friend')
  return { id: u.id, email: u.email ?? '', name }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const supabase = useMemo(() => createClient(), [])
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return
      setUser(toAuthUser(data.user))
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(toAuthUser(session?.user ?? null))
      setLoading(false)
    })

    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [supabase])

  const signUp = useCallback(
    async (name: string, email: string, password: string): Promise<AuthResult> => {
      if (!name.trim()) return { error: 'Please enter your name.' }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Please enter a valid email address.' }
      if (password.length < 8) return { error: 'Password must be at least 8 characters.' }

      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password,
        options: { data: { name: name.trim() } },
      })
      if (error) return { error: error.message }
      // If email confirmation is enabled, there's no active session yet.
      if (data.user && !data.session) {
        return { message: 'Check your email to confirm your account, then sign in.' }
      }
      return {}
    },
    [supabase]
  )

  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      })
      if (error) return { error: error.message }
      return {}
    },
    [supabase]
  )

  const signInWithGoogle = useCallback(async (next?: string): Promise<AuthResult> => {
    // Carry the post-login destination through the OAuth round-trip so the
    // user lands back where they started (e.g. /checkout).
    const safeNext = next && next.startsWith('/') ? next : undefined
    const callback = `${window.location.origin}/auth/callback${safeNext ? `?next=${encodeURIComponent(safeNext)}` : ''}`
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: callback },
    })
    if (error) return { error: error.message }
    return {}
  }, [supabase])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
  }, [supabase])

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
