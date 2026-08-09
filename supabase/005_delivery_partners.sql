-- ============================================================================
-- Delivery partners, order assignment, and rider access control.
--
-- Run this in Supabase → SQL Editor. Idempotent — safe to re-run.
-- ============================================================================
--
-- THE PRIVACY REQUIREMENT, AND HOW IT IS ENFORCED
--
--   A rider must never see *what* a customer ordered. That falls out of the
--   existing table split rather than needing a redacted view:
--
--     orders       — who, where, how much, how they're paying.  Rider needs this.
--     order_items  — what is in the box.                        Rider must not.
--
--   `order_items` already has exactly one SELECT policy, and it requires the
--   reader to be the customer who placed the order. A rider is not that
--   customer, so the rows are invisible to them. We add nothing to that table;
--   the guarantee comes from not granting anything, which is far harder to
--   get wrong than a view that has to remember to omit a column.
--
--   The rider does see the order total, because they collect it on a COD
--   delivery. Item *count* is exposed so they can check the handover, which is
--   a number, not a description.
--
-- WHY STATUS CHANGES GO THROUGH A FUNCTION
--
--   Postgres RLS gates rows, not columns. An UPDATE policy permissive enough to
--   let a rider set `order_status` would also let them rewrite the delivery
--   address or the total. `delivery_set_status` is SECURITY DEFINER and touches
--   exactly two columns, after checking the caller is the assigned rider and
--   that the transition is one a rider is allowed to make.
--
-- ROLLBACK
--   drop function if exists public.delivery_set_status(uuid, text);
--   drop view if exists public.delivery_jobs;
--   alter table public.orders drop column assigned_to, drop column assigned_at, drop column delivered_at;
--   drop table if exists public.delivery_partners;
-- ============================================================================

-- ─── Who is allowed to deliver ──────────────────────────────────────────────
-- A row here is what turns an ordinary Supabase account into a rider. Same
-- auth.users table as customers and admins: one identity per person, with
-- capability granted by membership rather than by a separate credential store.
create table if not exists public.delivery_partners (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  name       text not null,
  phone      text not null,
  -- Deactivating keeps history intact. Never delete a partner who has
  -- delivered orders, or you lose the record of who handled them.
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

-- ─── Assignment ─────────────────────────────────────────────────────────────
alter table public.orders
  add column if not exists assigned_to  uuid references auth.users(id) on delete set null,
  add column if not exists assigned_at  timestamptz,
  add column if not exists delivered_at timestamptz;

create index if not exists orders_assigned_to_idx
  on public.orders(assigned_to)
  where assigned_to is not null;

-- ─── Rider read access ──────────────────────────────────────────────────────
alter table public.delivery_partners enable row level security;

drop policy if exists "partner reads own record" on public.delivery_partners;
create policy "partner reads own record" on public.delivery_partners
  for select using (auth.uid() = user_id);

-- A rider sees an order only while it is assigned to them. Nothing else on the
-- table changes: customers keep their own policy, and the service-role client
-- the website uses bypasses RLS entirely.
drop policy if exists "assigned partner reads order" on public.orders;
create policy "assigned partner reads order" on public.orders
  for select using (
    assigned_to = auth.uid()
    and exists (
      select 1 from public.delivery_partners dp
      where dp.user_id = auth.uid() and dp.is_active
    )
  );

-- ─── Item count without item detail ─────────────────────────────────────────
-- SECURITY INVOKER so the caller's own RLS still decides which orders they can
-- see. This exposes how many packs are in the box, never which ones.
create or replace view public.delivery_job_summary
with (security_invoker = true) as
  select
    o.id                                as order_id,
    (select count(*) from public.order_items oi where oi.order_id = o.id)::int
                                        as item_count
  from public.orders o;

-- ─── Status transitions a rider may make ────────────────────────────────────
create or replace function public.delivery_set_status(
  p_order_id uuid,
  p_status   text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_assigned uuid;
begin
  -- A rider may only move an order forward through their own two stages.
  -- 'confirmed', 'packed' and 'cancelled' belong to admin staff.
  if p_status not in ('out_for_delivery', 'delivered') then
    raise exception 'Status % is not a delivery status', p_status
      using errcode = 'check_violation';
  end if;

  select assigned_to into v_assigned
  from public.orders
  where id = p_order_id;

  if v_assigned is null or v_assigned <> auth.uid() then
    raise exception 'This order is not assigned to you'
      using errcode = 'insufficient_privilege';
  end if;

  if not exists (
    select 1 from public.delivery_partners
    where user_id = auth.uid() and is_active
  ) then
    raise exception 'Not an active delivery partner'
      using errcode = 'insufficient_privilege';
  end if;

  update public.orders
  set order_status = p_status,
      status_updated_at = now(),
      delivered_at = case when p_status = 'delivered' then now() else delivered_at end
  where id = p_order_id;
end;
$$;

revoke all on function public.delivery_set_status(uuid, text) from public;
grant execute on function public.delivery_set_status(uuid, text) to authenticated;

comment on function public.delivery_set_status is
  'Lets an assigned, active delivery partner advance an order to out_for_delivery or delivered. SECURITY DEFINER because RLS cannot restrict which columns an UPDATE may touch.';

comment on table public.delivery_partners is
  'Membership grants the delivery-partner capability to an existing auth user. Deactivate rather than delete so delivery history survives.';
