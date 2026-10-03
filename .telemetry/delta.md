# Tracking implementation delta

The existing codebase had no analytics SDK, event calls, visitor identity, or
admin reporting. This implementation adds a validated first-party event store,
anonymous and session identity, web and app instrumentation, and a private admin
analytics page. It also enables Vercel Web Analytics for independent website
visitor reporting.

The first-party dashboard reports unique website visitors, page views, sessions,
signed-in users, registrations, app first opens, app active users, APK download
clicks, product views, cart additions, checkout starts, placed orders, traffic
sources, platforms, top pages, top products, and funnel movement.

