-- Samachify database schema
-- Run this in Supabase → SQL Editor → New query → paste → Run.
-- Safe to re-run (uses IF NOT EXISTS / OR REPLACE).

-- ─── Orders ────────────────────────────────────────────────────────────────
create table if not exists public.orders (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  user_id        uuid references auth.users(id) on delete set null,
  customer_name  text not null,
  email          text not null,
  phone          text not null,
  address        text not null,
  city           text not null,
  pincode        text not null,
  payment_method text not null default 'cod',
  subtotal       integer not null,
  delivery_fee   integer not null default 0,
  total          integer not null,
  status         text not null default 'pending',
  razorpay_payment_id text,
  razorpay_order_id   text
);

create table if not exists public.order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references public.orders(id) on delete cascade,
  product_id   text not null,
  product_name text not null,
  price        integer not null,
  quantity     integer not null
);

create index if not exists order_items_order_id_idx on public.order_items(order_id);
create index if not exists orders_user_id_idx on public.orders(user_id);

-- ─── Row Level Security ───────────────────────────────────────────────────
-- Orders are inserted by the server (service_role, which bypasses RLS).
-- These policies only allow a logged-in user to READ their own orders.
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "read own orders" on public.orders;
create policy "read own orders" on public.orders
  for select using (auth.uid() = user_id);

drop policy if exists "read own order items" on public.order_items;
create policy "read own order items" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );
