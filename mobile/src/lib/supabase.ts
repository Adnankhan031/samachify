import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';

import { SUPABASE_ANON_KEY, SUPABASE_URL } from './config';

/**
 * The one Supabase client for the app — same project as the website, so an account
 * created on samachify.in signs in here and vice versa.
 *
 * `detectSessionInUrl` is a browser concept (it reads the OAuth hash off
 * `window.location`); on native there is no URL to read, and leaving it on makes
 * the client throw during start-up.
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

/**
 * Supabase refreshes tokens on a timer. That timer keeps firing while the app is
 * backgrounded, which burns battery and racks up failed requests with no network.
 * Stop it when we leave the foreground and start it again on return.
 */
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    void supabase.auth.startAutoRefresh();
  } else {
    void supabase.auth.stopAutoRefresh();
  }
});

/**
 * The current access token, or null when signed out. Sent as a bearer header to the
 * storefront's API routes — they have no cookie from us to read.
 */
export async function getAccessToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}
