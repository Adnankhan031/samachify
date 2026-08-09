-- ============================================================================
-- Record rider status changes on the order timeline.
--
-- Run in Supabase → SQL Editor. Idempotent — safe to re-run.
-- ============================================================================
--
-- THE GAP THIS CLOSES
--
--   `delivery_set_status` updated orders.order_status, so the customer's live
--   tracking moved correctly. But it wrote nothing to `order_events`, which is
--   the table the admin portal renders as an order's History.
--
--   The result: an order could show "Delivered" with no record of who marked it
--   so, or when. For a delivery business that is the one event you most need to
--   be able to prove — it is the handover of goods and, on COD, of cash.
--
--   Every other status change in the system writes an event. This makes the
--   rider's two transitions do the same, attributed to the rider rather than to
--   a member of staff who was not involved.
--
--   `created_by` is set to the rider's auth.uid(), so History answers "who" and
--   not just "what".
-- ============================================================================

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
  -- A rider may only move an order through their own two stages. 'confirmed',
  -- 'packed' and 'cancelled' belong to admin staff.
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
  set order_status      = p_status,
      status_updated_at = now(),
      delivered_at      = case when p_status = 'delivered' then now() else delivered_at end
  where id = p_order_id;

  -- The audit trail. Attributed to the rider, because they are who did it.
  insert into public.order_events (order_id, status, note, created_by)
  values (
    p_order_id,
    p_status,
    case
      when p_status = 'out_for_delivery' then 'Rider started delivery'
      else 'Rider marked delivered'
    end,
    auth.uid()
  );
end;
$$;

revoke all on function public.delivery_set_status(uuid, text) from public;
grant execute on function public.delivery_set_status(uuid, text) to authenticated;

-- The function runs as definer, but the INSERT above still needs the rider to
-- be permitted to write the row under RLS if that table has it enabled.
-- SECURITY DEFINER runs as the function owner, so this is already satisfied —
-- stated here so nobody "fixes" it later by loosening a policy.
