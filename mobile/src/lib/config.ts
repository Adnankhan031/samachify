/**
 * Runtime config, read once from the EXPO_PUBLIC_* env vars that Expo inlines
 * at build time. Fail loudly here rather than with a confusing network error
 * three screens later.
 */

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing ${name}. Copy .env.example to .env and fill it in, then restart the bundler with \`npx expo start -c\`.`
    );
  }
  return value;
}

export const SUPABASE_URL = required(
  'EXPO_PUBLIC_SUPABASE_URL',
  process.env.EXPO_PUBLIC_SUPABASE_URL
);

export const SUPABASE_ANON_KEY = required(
  'EXPO_PUBLIC_SUPABASE_ANON_KEY',
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

/** Base URL of the Next.js storefront — it owns order creation and pricing. */
export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://samachify.in'
).replace(/\/$/, '');

/** Pricing rules, mirrored from the storefront's `src/lib/orders.ts`. */
export const FREE_DELIVERY_THRESHOLD = 299;
export const DELIVERY_FEE = 39;

export const SUPPORT_PHONE = '+919342266666';
export const SUPPORT_EMAIL = 'support@samachify.in';
