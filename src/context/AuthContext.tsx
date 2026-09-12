'use client'

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

export interface AuthUser {
  id: string
  email: string
  name: string
  phone: string
}

interface AuthResult {
  error?: string
  /** Set when the action succeeded but needs a follow-up (e.g. email confirmation). */
  message?: string
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signUp: (name: string, email: string, password: string, phone?: string) => Promise<AuthResult>
  signIn: (email: string, password: string) => Promise<AuthResult>
  signInWithGoogle: (next?: string) => Promise<AuthResult>
  signOut: () => Promise<void>
  updateProfile: (updates: { name?: string; phone?: string }) => Promise<AuthResult>
  resetPassword: (email: string) => Promise<AuthResult>
  updatePassword: (newPassword: string) => Promise<AuthResult>
}

const AuthContext = createContext<AuthContextType | null>(null)

/** Map a Supabase user to our lightweight shape. */
function toAuthUser(u: User | null): AuthUser | null {
  if (!u) return null
  const name =
    (u.user_metadata?.name as string) ||
    (u.user_metadata?.full_name as string) ||
    (u.email ? u.email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Friend')
  const phone = (u.user_metadata?.phone as string) || ''
  return { id: u.id, email: u.email ?? '', name, phone }
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
    async (name: string, email: string, password: string, phone?: string): Promise<AuthResult> => {
      if (!name.trim()) return { error: 'Please enter your name.' }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Please enter a valid email address.' }
      if (password.length < 8) return { error: 'Password must be at least 8 characters.' }
      // Phone is optional at signup, but if given it must be a valid 10-digit number.
      const cleanedPhone = (phone ?? '').replace(/\D/g, '')
      if (cleanedPhone && !/^[0-9]{10}$/.test(cleanedPhone)) {
        return { error: 'Enter a valid 10-digit mobile number, or leave it blank.' }
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password,
        options: { data: { name: name.trim(), phone: cleanedPhone } },
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
      options: {
        redirectTo: callback,
        queryParams: { prompt: 'select_account' },
      },
    })
    if (error) return { error: error.message }
    return {}
  }, [supabase])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
  }, [supabase])

  // Update the signed-in user's name / phone (stored in auth metadata).
  const updateProfile = useCallback(
    async (updates: { name?: string; phone?: string }): Promise<AuthResult> => {
      const data: Record<string, string> = {}
      if (updates.name !== undefined) {
        if (!updates.name.trim()) return { error: 'Please enter your name.' }
        data.name = updates.name.trim()
      }
      if (updates.phone !== undefined) {
        const cleaned = updates.phone.replace(/\D/g, '')
        if (cleaned && !/^[0-9]{10}$/.test(cleaned)) {
          return { error: 'Enter a valid 10-digit mobile number, or leave it blank.' }
        }
        data.phone = cleaned
      }
      const { data: res, error } = await supabase.auth.updateUser({ data })
      if (error) return { error: error.message }
      setUser(toAuthUser(res.user))
      return {}
    },
    [supabase]
  )

  // Send a password-reset link. It returns to /auth/callback, which exchanges
  // the code for a session then forwards to /reset-password.
  const resetPassword = useCallback(async (email: string): Promise<AuthResult> => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Please enter a valid email address.' }
    const { error } = await supabase.auth.resetPasswordForEmail(email.toLowerCase(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })
    if (error) return { error: error.message }
    return { message: 'If an account exists for that email, a reset link is on its way.' }
  }, [supabase])

  // Set a new password for the user in the recovery session.
  const updatePassword = useCallback(async (newPassword: string): Promise<AuthResult> => {
    if (newPassword.length < 8) return { error: 'Password must be at least 8 characters.' }
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) return { error: error.message }
    return {}
  }, [supabase])

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signInWithGoogle, signOut, updateProfile, resetPassword, updatePassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
