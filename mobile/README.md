# Samachify Mobile

The Android-first Samachify app. React Native + Expo SDK 57 + TypeScript + Expo Router.

It shares the website's backend completely: the same Supabase project, the same
`orders` / `order_items` / `addresses` tables, the same `/api/*` routes on
samachify.in, and the same customer accounts. Orders placed here appear in the
existing admin portal with no changes.

## Setup

```bash
cd mobile
npm install
cp .env.example .env   # then fill in the two Supabase values
npx expo start
```

Scan the QR code with **Expo Go** on an Android phone on the same Wi-Fi. If your
network blocks device-to-device traffic, use `npx expo start --tunnel`.

Node **22.13+** is required by React Native 0.86.

## Environment

Only `EXPO_PUBLIC_*` variables exist here — they are compiled into the bundle and
are therefore public. The Supabase service-role key and the Razorpay secret must
never appear in this directory.

| Variable | Purpose |
| --- | --- |
| `EXPO_PUBLIC_SUPABASE_URL` | Same project as the website |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Public anon key, safe to bundle |
| `EXPO_PUBLIC_API_BASE_URL` | Storefront that owns order creation |

## Layout

```
src/
  app/          Expo Router routes — the file tree is the navigation graph
  components/   ui/ holds the design-system primitives; the rest is domain UI
  data/         catalogue mirrored from the website (see "Catalogue" below)
  lib/          supabase client, API calls, catalogue access, formatting
  store/        cart, auth and on-device preferences
  theme/        design tokens, mirrored from the website's src/index.css
```

## How money works

The app never decides a price. `/api/orders` re-prices every cart from the trusted
catalogue and writes the order with the service-role key. Totals shown in the cart
and at checkout are display-only and mirror the server's arithmetic
(`₹39` delivery, free over `₹299`). If the two ever disagree, the server is right.

Authentication to those routes uses `Authorization: Bearer <supabase access token>`
because a native client has no cookie jar.

## Order status

Two different columns, easy to confuse:

- `orders.status` — **payment**: `pending` (COD) or `paid` (Razorpay)
- `orders.order_status` — **fulfilment**: `placed → confirmed → packed →
  out_for_delivery → delivered`, or `cancelled`

Tracking renders `order_status`. The admin portal moves it, and the app subscribes
to Supabase realtime so the timeline updates without a manual refresh.

## Catalogue

`src/lib/catalogue.ts` is the only way screens reach product data. It currently
resolves from a bundled mirror of the website's `src/data/products.ts`, because
Samachify has no `products` table yet. `supabase/003_products.sql` proposes one;
when it ships, only `catalogue.ts` changes.

## Not built yet

Deliberately absent, because the backend does not support them. Do not add UI for
these until the data exists:

- Ratings and reviews
- Discounts, coupons, offers
- Wishlist
- Combo packs
- Online payment in-app — needs the native Razorpay module and an EAS development
  build. COD works today; online payment works on the website.
- Push notifications

## Checks

```bash
npm run typecheck
npm run lint
npx expo-doctor
```
