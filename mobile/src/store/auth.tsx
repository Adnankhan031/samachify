import type { Session, User } from '@supabase/supabase-js';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { supabase } from '@/lib/supabase';

/**
 * Samachify has no `profiles` table — name and phone live in Supabase auth
 * metadata, exactly as the website stores them. Same shape as the web's AuthUser
 * so behaviour matches across the two clients.
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone: string;
}

export interface AuthResult {
  error?: string;
  /** Set when the call succeeded but needs a follow-up, e.g. email confirmation. */
  message?: string;
}

interface AuthValue {
  user: AuthUser | null;
  /** True until the persisted session has been restored. Gate redirects on this. */
  loading: boolean;
  signUp: (name: string, email: string, password: string, phone?: string) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  updateProfile: (updates: { name?: string; phone?: string }) => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthValue | null>(null);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9]{10}$/;

/** Same fallback chain the website uses, so a user sees one name in both places. */
function toAuthUser(u: User | null): AuthUser | null {
  if (!u) return null;
  const meta = u.user_metadata ?? {};
  const derived = u.email
    ? u.email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : 'Friend';
  return {
    id: u.id,
    email: u.email ?? '',
    name: (meta.name as string) || (meta.full_name as string) || derived,
    phone: (meta.phone as string) || '',
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    supabase.auth
      .getSession()
      .then(({ data }: { data: { session: Session | null } }) => {
        if (!active) return;
        setUser(toAuthUser(data.session?.user ?? null));
      })
      .catch(() => {
        // Offline start-up: no session yet, but the app must still open.
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(toAuthUser(session?.user ?? null));
      setLoading(false);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signUp = useCallback(
    async (name: string, email: string, password: string, phone?: string): Promise<AuthResult> => {
      if (!name.trim()) return { error: 'Please enter your name.' };
      if (!EMAIL_RE.test(email)) return { error: 'Please enter a valid email address.' };
      if (password.length < 8) return { error: 'Password must be at least 8 characters.' };

      const cleanedPhone = (phone ?? '').replace(/\D/g, '');
      if (cleanedPhone && !PHONE_RE.test(cleanedPhone)) {
        return { error: 'Enter a valid 10-digit mobile number, or leave it blank.' };
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: { data: { name: name.trim(), phone: cleanedPhone } },
      });
      if (error) return { error: error.message };

      // With email confirmation enabled there is no session yet.
      if (data.user && !data.session) {
        return { message: 'Check your email to confirm your account, then sign in.' };
      }
      return {};
    },
    []
  );

  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    if (!EMAIL_RE.test(email)) return { error: 'Please enter a valid email address.' };
    if (!password) return { error: 'Please enter your password.' };

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    return error ? { error: error.message } : {};
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (updates: { name?: string; phone?: string }): Promise<AuthResult> => {
      const data: Record<string, string> = {};

      if (updates.name !== undefined) {
        if (!updates.name.trim()) return { error: 'Please enter your name.' };
        data.name = updates.name.trim();
      }
      if (updates.phone !== undefined) {
        const cleaned = updates.phone.replace(/\D/g, '');
        if (cleaned && !PHONE_RE.test(cleaned)) {
          return { error: 'Enter a valid 10-digit mobile number, or leave it blank.' };
        }
        data.phone = cleaned;
      }

      const { data: res, error } = await supabase.auth.updateUser({ data });
      if (error) return { error: error.message };
      setUser(toAuthUser(res.user));
      return {};
    },
    []
  );

  const resetPassword = useCallback(async (email: string): Promise<AuthResult> => {
    if (!EMAIL_RE.test(email)) return { error: 'Please enter a valid email address.' };
    // Recovery finishes on the website — the app has no password-reset screen and
    // inventing one would mean handling the deep link before it is configured.
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: 'https://samachify.in/auth/callback?next=/reset-password',
    });
    if (error) return { error: error.message };
    return { message: 'If an account exists for that email, a reset link is on its way.' };
  }, []);

  const value = useMemo<AuthValue>(
    () => ({ user, loading, signUp, signIn, signOut, updateProfile, resetPassword }),
    [user, loading, signUp, signIn, signOut, updateProfile, resetPassword]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
