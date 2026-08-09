-- ============================================================================
-- PROPOSED — DO NOT RUN YET. Awaiting sign-off.
-- ============================================================================
-- Store the delivery point, not just the delivery address.
--
-- WHY
--   Today an address is text only: house_no, area, city, pincode. A delivery
--   partner has to read it and guess. Geocoding a South Indian address at the
--   door-number level is unreliable, so "23/4A, 2nd Cross" can land a rider on
--   the wrong street.
--
--   The mobile app now lets a customer drop a pin on exactly where they want
--   delivery. That pin is currently thrown away after it fills the form. These
--   columns keep it, so the planned delivery-partner app can open turn-by-turn
--   navigation to the precise point while still showing the written address for
--   human context ("green gate, 2nd floor").
--
-- WHAT CHANGES
--   Four nullable columns. No table is created, altered in type, or dropped:
--     + addresses.latitude   double precision
--     + addresses.longitude  double precision
--     + orders.latitude      double precision
--     + orders.longitude     double precision
--
--   Nullable is deliberate. Every existing address and order predates the pin
--   and has no coordinates; the website's checkout does not collect one. A NOT
--   NULL column would break both.
--
--   The duplication onto `orders` is intentional, matching how order_items
--   already snapshots product_name and price. An address can be edited or
--   deleted after an order ships; the delivery point for *that* order must not
--   change under the rider. Orders are immutable history, addresses are current
--   state.
--
-- WEBSITE IMPACT
--   None. The columns are nullable and nothing on the website reads or writes
--   them. Web checkout keeps producing orders with NULL coordinates until (and
--   unless) a map picker is added there too.
--
-- MOBILE IMPACT
--   The app writes coordinates when the customer pins a location, and passes
--   them to /api/orders so they land on the order.
--
-- ADMIN IMPACT
--   The admin portal can add a "open in maps" link on the order detail page:
--     https://www.google.com/maps/search/?api=1&query=<lat>,<lng>
--   Nothing breaks if it doesn't - the columns are simply unread.
--
-- API IMPACT
--   /api/orders must accept optional latitude/longitude and pass them through
--   to insertOrder. Values are validated as real numbers in range, never
--   trusted as-is - a bad coordinate sends a rider to the wrong hemisphere.
--
-- MIGRATION
--   Idempotent (IF NOT EXISTS). Safe to re-run. No backfill: historical rows
--   legitimately have no pin.
--
-- ROLLBACK
--   alter table public.addresses drop column latitude, drop column longitude;
--   alter table public.orders    drop column latitude, drop column longitude;
--   Safe at any point - nothing reads them until the app code ships.
-- ============================================================================

alter table public.addresses
  add column if not exists latitude  double precision,
  add column if not exists longitude double precision;

alter table public.orders
  add column if not exists latitude  double precision,
  add column if not exists longitude double precision;

-- Guard against impossible points. A pin outside these ranges is a bug, not a
-- location, and it is much cheaper to reject it here than to dispatch a rider.
alter table public.addresses
  drop constraint if exists addresses_latitude_range,
  drop constraint if exists addresses_longitude_range;

alter table public.addresses
  add constraint addresses_latitude_range
    check (latitude is null or (latitude between -90 and 90)),
  add constraint addresses_longitude_range
    check (longitude is null or (longitude between -180 and 180));

alter table public.orders
  drop constraint if exists orders_latitude_range,
  drop constraint if exists orders_longitude_range;

alter table public.orders
  add constraint orders_latitude_range
    check (latitude is null or (latitude between -90 and 90)),
  add constraint orders_longitude_range
    check (longitude is null or (longitude between -180 and 180));

comment on column public.addresses.latitude is
  'Customer-placed delivery pin. Null for addresses saved before pinning existed, or entered on the website.';
comment on column public.orders.latitude is
  'Delivery pin snapshotted at order time. Deliberately duplicated from addresses so editing an address never moves a shipped order.';
