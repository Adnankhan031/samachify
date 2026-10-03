# Samachify product model

Samachify is a direct-to-consumer meal-kit business with a Next.js storefront,
an Expo customer app, and a private Next.js operations portal. Customers browse
South Indian meal kits, create an account, add packs to a cart, choose a verified
delivery location, place an order, and contact order-linked support.

The primary value action is a successfully placed order. The useful journey is:
visit or app open → product discovery → product view → cart → checkout → order.

Core entities are anonymous visitors/installations, authenticated customers,
sessions, products, carts, orders, delivery addresses, and support cases. The
storefront and customer app share one Supabase project and customer identity.

Analytics destinations:

- First-party event records in Supabase for the private admin dashboard.
- Vercel Web Analytics for an independent website traffic count.

Analytics must exclude names, email addresses, phone numbers, full referrers,
precise locations, addresses, support text, and payment identifiers.

