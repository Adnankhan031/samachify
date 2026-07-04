'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

export interface AuthUser {
  id: string
  email: string
  name: string
}

interface AuthResult {
  error?: string
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signUp: (name: string, email: string, password: string) => Promise<AuthResult>
  signIn: (email: string, password: string) => Promise<AuthResult>
  signInWithGoogle: () => Promise<AuthResult>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

const SESSION_KEY = 'samachify_session'

/**
 * ⚠️ PLACEHOLDER AUTH — Phase 2 (UI only).
 *
 * This simulates a session so the full login → account → logout flow is
 * navigable and "logically correct" end to end. It does NOT verify credentials
 * and never stores passwords.
 *
 * Phase 3 swap: replace the bodies of signUp / signIn / signInWithGoogle /
 * signOut with Supabase Auth calls (supabase.auth.signUp, signInWithPassword,
 * signInWithOAuth({ provider: 'google' }), signOut). The public interface here
 * is intentionally shaped to match Supabase so the components don't change.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY)
      if (stored) setUser(JSON.parse(stored))
    } catch {
      /* ignore */
    }
    setLoading(false)
  }, [])

  const persist = (u: AuthUser | null) => {
    setUser(u)
    try {
      if (u) localStorage.setItem(SESSION_KEY, JSON.stringify(u))
      else localStorage.removeItem(SESSION_KEY)
    } catch {
      /* ignore */
    }
  }

  const signUp = useCallback(async (name: string, email: string, password: string): Promise<AuthResult> => {
    if (!name.trim()) return { error: 'Please enter your name.' }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Please enter a valid email address.' }
    if (password.length < 8) return { error: 'Password must be at least 8 characters.' }
    await new Promise((r) => setTimeout(r, 500)) // simulate network
    persist({ id: crypto.randomUUID(), email: email.toLowerCase(), name: name.trim() })
    return {}
  }, [])

  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Please enter a valid email address.' }
    if (password.length < 1) return { error: 'Please enter your password.' }
    await new Promise((r) => setTimeout(r, 500))
    const name = email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    persist({ id: crypto.randomUUID(), email: email.toLowerCase(), name })
    return {}
  }, [])

  const signInWithGoogle = useCallback(async (): Promise<AuthResult> => {
    // Phase 3: supabase.auth.signInWithOAuth({ provider: 'google' })
    return { error: 'Google sign-in will be enabled once the backend is connected.' }
  }, [])

  const signOut = useCallback(async () => {
    persist(null)
  }, [])

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
