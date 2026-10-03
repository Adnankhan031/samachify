'use client'

import { createClient } from '@/lib/supabase/client'

export const EVENTS = {
  SESSION_STARTED: 'session.started',
  PAGE_VIEWED: 'page.viewed',
  USER_SIGNED_UP: 'user.signed_up',
  USER_SIGNED_IN: 'user.signed_in',
  USER_SIGNED_OUT: 'user.signed_out',
  APP_DOWNLOAD_CLICKED: 'app.download_clicked',
  PRODUCT_VIEWED: 'product.viewed',
  PRODUCT_SHARED: 'product.shared',
  CART_ITEM_ADDED: 'cart.item_added',
  CART_ITEM_REMOVED: 'cart.item_removed',
  CHECKOUT_STARTED: 'checkout.started',
  CHECKOUT_ADDRESS_VERIFIED: 'checkout.address_verified',
  PAYMENT_STARTED: 'payment.started',
  ORDER_PLACED: 'order.placed',
  SEARCH_PERFORMED: 'search.performed',
  SUPPORT_CASE_CREATED: 'support.case_created',
} as const

export type AnalyticsEvent = typeof EVENTS[keyof typeof EVENTS]
export type AnalyticsProperties = Record<string, string | number | boolean | null | undefined>

const ANONYMOUS_KEY = 'samachify_analytics_anonymous_id'
const SESSION_KEY = 'samachify_analytics_session'
const ATTRIBUTION_KEY = 'samachify_analytics_attribution'
const SESSION_TIMEOUT_MS = 30 * 60 * 1000
const FORBIDDEN_KEYS = /email|name|phone|address|latitude|longitude|message|payment_id|razorpay/i

type SessionRecord = { id: string; lastActivity: number }
type Attribution = { source?: string; medium?: string; campaign?: string; referrerDomain?: string }

function uuid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
    (Number(c) ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))).toString(16)
  )
}

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) as T : null
  } catch {
    return null
  }
}

function getAnonymousId(): string {
  const current = localStorage.getItem(ANONYMOUS_KEY)
  if (current) return current
  const next = uuid()
  localStorage.setItem(ANONYMOUS_KEY, next)
  return next
}

function getSession(): { record: SessionRecord; isNew: boolean } {
  const now = Date.now()
  const current = readJson<SessionRecord>(SESSION_KEY)
  const isNew = !current || now - current.lastActivity > SESSION_TIMEOUT_MS
  const record = { id: isNew ? uuid() : current.id, lastActivity: now }
  localStorage.setItem(SESSION_KEY, JSON.stringify(record))
  return { record, isNew }
}

function browserName(): string {
  const ua = navigator.userAgent
  if (/Edg\//.test(ua)) return 'Edge'
  if (/CriOS|Chrome\//.test(ua)) return 'Chrome'
  if (/FxiOS|Firefox\//.test(ua)) return 'Firefox'
  if (/Safari\//.test(ua)) return 'Safari'
  return 'Other'
}

function defaultProperties(): AnalyticsProperties {
  const width = window.innerWidth
  return {
    device_type: width < 768 ? 'mobile' : width < 1100 ? 'tablet' : 'desktop',
    browser: browserName(),
    language: navigator.language?.slice(0, 8) || 'unknown',
    viewport: width < 480 ? 'small' : width < 768 ? 'medium' : width < 1280 ? 'large' : 'wide',
  }
}

function getAttribution(): Attribution {
  const stored = readJson<Attribution>(ATTRIBUTION_KEY)
  if (stored) return stored

  const params = new URLSearchParams(window.location.search)
  let referrerDomain: string | undefined
  try {
    if (document.referrer) referrerDomain = new URL(document.referrer).hostname.replace(/^www\./, '')
  } catch {
    referrerDomain = undefined
  }

  const attribution: Attribution = {
    source: params.get('utm_source') || undefined,
    medium: params.get('utm_medium') || undefined,
    campaign: params.get('utm_campaign') || undefined,
    referrerDomain,
  }
  localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution))
  return attribution
}

function cleanProperties(input: AnalyticsProperties): Record<string, string | number | boolean | null> {
  return Object.fromEntries(
    Object.entries(input)
      .filter(([key, value]) => !FORBIDDEN_KEYS.test(key) && value !== undefined)
      .slice(0, 30)
      .map(([key, value]) => [key.slice(0, 80), value === null ? null : typeof value === 'string' ? value.slice(0, 300) : value])
  ) as Record<string, string | number | boolean | null>
}

export async function trackEvent(event: AnalyticsEvent, properties: AnalyticsProperties = {}): Promise<boolean> {
  if (typeof window === 'undefined') return false
  try {
    const anonymousId = getAnonymousId()
    const { record, isNew } = getSession()
    const attribution = getAttribution()
    const supabase = createClient()
    const payload = {
      p_event_name: event,
      p_anonymous_id: anonymousId,
      p_session_id: record.id,
      p_platform: 'web',
      p_page_path: window.location.pathname,
      p_screen_name: null,
      p_referrer_domain: attribution.referrerDomain ?? null,
      p_source: attribution.source ?? null,
      p_medium: attribution.medium ?? null,
      p_campaign: attribution.campaign ?? null,
      p_properties: cleanProperties({ ...defaultProperties(), ...properties }),
    }

    if (isNew && event !== EVENTS.SESSION_STARTED) {
      await supabase.rpc('track_analytics_event', { ...payload, p_event_name: EVENTS.SESSION_STARTED })
    }
    const { error } = await supabase.rpc('track_analytics_event', payload)
    return !error
  } catch {
    return false
  }
}

export function trackPageView(path: string): void {
  const globalKey = '__samachifyLastPageView'
  const state = window as typeof window & { [globalKey]?: string }
  const marker = `${path}:${Math.floor(Date.now() / 1000)}`
  if (state[globalKey] === marker) return
  state[globalKey] = marker
  void trackEvent(EVENTS.PAGE_VIEWED)
}

