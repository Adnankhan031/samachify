-- Order-linked customer support shared by the storefront and mobile apps.
-- Apply after schema.sql and the order migrations.

create table if not exists public.support_cases (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null,
  issue text not null,
  summary text not null,
  customer_note text not null default '',
  status text not null default 'active' check (status in ('active', 'on_hold', 'resolved')),
  priority text not null default 'normal' check (priority in ('normal', 'high', 'urgent')),
  assigned_admin_id uuid references auth.users(id) on delete set null,
  customer_unread integer not null default 0 check (customer_unread >= 0),
  admin_unread integer not null default 0 check (admin_unread >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_message_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.support_cases(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  sender_role text not null check (sender_role in ('customer', 'admin')),
  body text not null check (char_length(trim(body)) between 1 and 4000),
  created_at timestamptz not null default now()
);

create index if not exists support_cases_user_idx on public.support_cases(user_id, last_message_at desc);
create index if not exists support_cases_status_idx on public.support_cases(status, last_message_at desc);
create index if not exists support_cases_order_idx on public.support_cases(order_id);
create index if not exists support_messages_case_idx on public.support_messages(case_id, created_at);

alter table public.support_cases enable row level security;
alter table public.support_messages enable row level security;

drop policy if exists "customers read own support cases" on public.support_cases;
create policy "customers read own support cases" on public.support_cases
  for select using (
    user_id = auth.uid()
    or exists (select 1 from public.admins a where a.user_id = auth.uid())
  );

drop policy if exists "customers create own support cases" on public.support_cases;
create policy "customers create own support cases" on public.support_cases
  for insert with check (
    user_id = auth.uid()
    and exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

drop policy if exists "admins manage support cases" on public.support_cases;
create policy "admins manage support cases" on public.support_cases
  for update using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "participants read support messages" on public.support_messages;
create policy "participants read support messages" on public.support_messages
  for select using (
    exists (
      select 1 from public.support_cases c
      where c.id = case_id
        and (c.user_id = auth.uid() or exists (select 1 from public.admins a where a.user_id = auth.uid()))
    )
  );

drop policy if exists "participants send support messages" on public.support_messages;
create policy "participants send support messages" on public.support_messages
  for insert with check (
    sender_id = auth.uid()
    and (
      (sender_role = 'customer' and exists (
        select 1 from public.support_cases c where c.id = case_id and c.user_id = auth.uid()
      ))
      or
      (sender_role = 'admin' and exists (select 1 from public.admins a where a.user_id = auth.uid()))
    )
  );

create or replace function public.touch_support_case_from_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.support_cases
  set last_message_at = new.created_at,
      updated_at = new.created_at,
      status = case when status = 'resolved' then 'active' else status end,
      resolved_at = case when status = 'resolved' then null else resolved_at end,
      admin_unread = admin_unread + case when new.sender_role = 'customer' then 1 else 0 end,
      customer_unread = customer_unread + case when new.sender_role = 'admin' then 1 else 0 end
  where id = new.case_id;
  return new;
end;
$$;

drop trigger if exists support_message_touch_case on public.support_messages;
create trigger support_message_touch_case
after insert on public.support_messages
for each row execute function public.touch_support_case_from_message();

create or replace function public.mark_support_case_read(p_case_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.admins a where a.user_id = auth.uid()) then
    update public.support_cases set admin_unread = 0 where id = p_case_id and admin_unread > 0;
  else
    update public.support_cases set customer_unread = 0 where id = p_case_id and user_id = auth.uid() and customer_unread > 0;
  end if;
end;
$$;

revoke all on function public.mark_support_case_read(uuid) from public;
grant execute on function public.mark_support_case_read(uuid) to authenticated;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'support_cases'
  ) then
    alter publication supabase_realtime add table public.support_cases;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'support_messages'
  ) then
    alter publication supabase_realtime add table public.support_messages;
  end if;
end $$;
