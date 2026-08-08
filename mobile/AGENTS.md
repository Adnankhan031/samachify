# Samachify Mobile — agent notes

React Native + Expo SDK 57 + TypeScript + Expo Router. Android is the first target;
everything must stay iOS-compatible.

## Expo has changed

Read the exact versioned docs at <https://docs.expo.dev/versions/v57.0.0/> before
writing any code. Do not rely on remembered API shapes.

## Ground rules for this app

- **The backend is shared with the website.** Same Supabase project, same `/api/*`
  routes on `samachify.in`. Never create a second Supabase project or a parallel table.
- **Money is priced server-side.** The app never computes a total that it then sends
  to be trusted. `/api/orders` and `/api/razorpay/order` re-price the cart from the
  catalogue. The app's totals are for display only and must match.
- **Two status columns.** `orders.status` is *payment* state (`pending` | `paid`).
  `orders.order_status` is *fulfilment* state (`placed` → `delivered`, or `cancelled`).
  Tracking reads `order_status`. Never conflate them.
- **Only `EXPO_PUBLIC_*` env vars exist here.** The service-role key and the Razorpay
  secret must never appear in this directory.
- **No fake features.** If the backend cannot support it, do not render a control for
  it. Ratings, discounts, wishlist, combo packs and wallet payments do not exist yet.
- **Catalogue access goes through `src/lib/catalogue.ts`.** It reads the bundled
  catalogue today and will switch to a Supabase `products` table without screen changes.

## Design system

Tokens live in `src/theme/`. Never hardcode a colour, radius, or spacing value in a
screen — import from the theme. Reusable primitives are in `src/components/ui/`.
Minimum touch target is 44px. Every elevation ships both `shadow*` and Android
`elevation`.

## Before saying a feature is done

```
npm run typecheck && npm run lint && npx expo-doctor
```

Then run it on Android and look at it.
