-- ============================================================================
-- PROPOSED — DO NOT RUN YET. Awaiting sign-off.
-- ============================================================================
-- Phase: move the catalogue out of the codebase and into the database.
--
-- WHY
--   Products, prices and categories currently live in `src/data/products.ts`.
--   The website renders from it and `/api/orders` re-prices from it, so a price
--   change is a code change. Once the Android app ships, a price change becomes a
--   code change *and* a Play Store release — and until every customer updates,
--   the app shows a price the server will not honour.
--
-- WHAT CHANGES
--   Adds two new tables. Nothing existing is altered or dropped:
--     + public.categories
--     + public.products
--   `orders` and `order_items` are untouched. `order_items` keeps its denormalised
--   `product_name` and `price` snapshot, which is correct — a past order must not
--   change when a price does.
--
-- WEBSITE IMPACT
--   None until `src/data/products.ts` and `src/lib/orders.ts#priceCart` are
--   switched to read from these tables. Deploy the SQL first, migrate the reads
--   second, delete the hardcoded array third.
--
-- MOBILE IMPACT
--   `mobile/src/lib/catalogue.ts` is the only file that changes. Every screen
--   already awaits those functions.
--
-- MIGRATION
--   Idempotent (IF NOT EXISTS / ON CONFLICT). Safe to re-run.
--   The seed below reproduces the four packs at their current live prices.
--
-- ROLLBACK
--   `drop table public.products; drop table public.categories;`
--   Nothing references them until the app code is switched over, so rollback is
--   clean at any point before that switch.
-- ============================================================================

create table if not exists public.categories (
  id         text primary key,          -- 'sambar', 'kuzhambu', 'chutney'
  label      text not null,
  sort_order integer not null default 0
);

create table if not exists public.products (
  id           text primary key,        -- matches order_items.product_id
  name         text not null,
  subtitle     text not null default '',
  description  text not null default '',
  emoji        text not null default '',
  price        integer not null check (price >= 0),   -- whole rupees
  cook_time    text not null default '',
  servings     integer not null default 1,
  category_id  text references public.categories(id),
  spice_level  text check (spice_level in ('Mild','Medium','Hot')),
  diet_type    text check (diet_type in ('Vegetarian','Vegan')),
  is_one_pot   boolean not null default false,
  tags         text[] not null default '{}',
  ingredients  text[] not null default '{}',
  highlights   text[] not null default '{}',
  image_path   text,                    -- '/assets/product-sambar.webp'
  gallery      text[] not null default '{}',
  is_active    boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_active_idx on public.products(is_active);

-- ─── Row Level Security ─────────────────────────────────────────────────────
-- The catalogue is public information: anyone may read active products, nobody
-- may write from a browser or app. Writes go through the service-role key only,
-- which bypasses RLS — same trust model as order creation.
alter table public.categories enable row level security;
alter table public.products   enable row level security;

drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories
  for select using (true);

drop policy if exists "public read active products" on public.products;
create policy "public read active products" on public.products
  for select using (is_active);

-- ─── Seed: the four live packs, at current prices ───────────────────────────
insert into public.categories (id, label, sort_order) values
  ('sambar',   'Sambar',   1),
  ('kuzhambu', 'Kuzhambu', 2),
  ('chutney',  'Chutney',  3)
on conflict (id) do nothing;

insert into public.products
  (id, name, subtitle, price, cook_time, servings, category_id, spice_level, diet_type, is_one_pot, emoji, image_path, sort_order)
values
  ('sambar-pack',          'Sambar Pack',          'The heart of every South Indian meal',    79, '10-15 mins', 4, 'sambar',   'Medium', 'Vegetarian', true,  '🍲', '/assets/product-sambar.webp',          1),
  ('kara-kuzhambu-pack',   'Kara Kuzhambu Pack',   'Bold, tangy and fiery South Indian gravy', 79, '10-15 mins', 4, 'kuzhambu', 'Hot',    'Vegan',      true,  '🌶',  '/assets/product-kara-kuzhambu.webp',   2),
  ('coconut-chutney-pack', 'Coconut Chutney Pack', 'Fresh coconut chutney — the perfect side', 35, '10-15 mins', 4, 'chutney',  'Mild',   'Vegan',      false, '🥥', '/assets/product-coconut-chutney.webp', 3),
  ('tomato-chutney-pack',  'Tomato Chutney Pack',  'Tangy roasted tomato chutney',             35, '10-15 mins', 4, 'chutney',  'Medium', 'Vegan',      false, '🍅', '/assets/product-tomato-chutney.webp',  4)
on conflict (id) do nothing;
