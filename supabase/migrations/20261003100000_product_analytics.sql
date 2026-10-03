-- First-party product analytics shared by the storefront and customer app.
-- Raw events contain anonymous installation/session identifiers and product context,
-- never email addresses, names, phone numbers, precise locations, or message text.

create table if not exists public.analytics_events (
  id bigint generated always as identity primary key,
  occurred_at timestamptz not null default now(),
  event_name text not null,
  anonymous_id uuid not null,
  session_id uuid not null,
  user_id uuid references auth.users(id) on delete set null,
  platform text not null check (platform in ('web', 'android', 'ios')),
  page_path text,
  screen_name text,
  referrer_domain text,
  source text,
  medium text,
  campaign text,
  properties jsonb not null default '{}'::jsonb,
  constraint analytics_event_name_length check (char_length(event_name) between 3 and 80),
  constraint analytics_page_path_length check (page_path is null or char_length(page_path) <= 500),
  constraint analytics_screen_name_length check (screen_name is null or char_length(screen_name) <= 160),
  constraint analytics_properties_object check (jsonb_typeof(properties) = 'object')
);

create index if not exists analytics_events_occurred_idx
  on public.analytics_events (occurred_at desc);
create index if not exists analytics_events_name_occurred_idx
  on public.analytics_events (event_name, occurred_at desc);
create index if not exists analytics_events_visitor_occurred_idx
  on public.analytics_events (anonymous_id, occurred_at desc);
create index if not exists analytics_events_user_occurred_idx
  on public.analytics_events (user_id, occurred_at desc)
  where user_id is not null;

alter table public.analytics_events enable row level security;

-- Browsers and mobile apps can only submit a validated event through this RPC.
-- auth.uid() is read by the database, so clients cannot impersonate another user.
create or replace function public.track_analytics_event(
  p_event_name text,
  p_anonymous_id uuid,
  p_session_id uuid,
  p_platform text,
  p_page_path text default null,
  p_screen_name text default null,
  p_referrer_domain text default null,
  p_source text default null,
  p_medium text default null,
  p_campaign text default null,
  p_properties jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  allowed_events constant text[] := array[
    'session.started',
    'page.viewed',
    'screen.viewed',
    'user.signed_up',
    'user.signed_in',
    'user.signed_out',
    'app.first_opened',
    'app.download_clicked',
    'product.viewed',
    'product.shared',
    'cart.item_added',
    'cart.item_removed',
    'checkout.started',
    'checkout.address_verified',
    'payment.started',
    'order.placed',
    'search.performed',
    'support.case_created'
  ];
begin
  if not (p_event_name = any(allowed_events)) then
    raise exception 'Unsupported analytics event';
  end if;
  if p_platform not in ('web', 'android', 'ios') then
    raise exception 'Unsupported analytics platform';
  end if;
  if p_properties is null or jsonb_typeof(p_properties) <> 'object'
     or pg_column_size(p_properties) > 8192 then
    raise exception 'Invalid analytics properties';
  end if;

  insert into public.analytics_events (
    event_name, anonymous_id, session_id, user_id, platform,
    page_path, screen_name, referrer_domain, source, medium, campaign, properties
  ) values (
    p_event_name,
    p_anonymous_id,
    p_session_id,
    auth.uid(),
    p_platform,
    nullif(left(coalesce(p_page_path, ''), 500), ''),
    nullif(left(coalesce(p_screen_name, ''), 160), ''),
    nullif(left(coalesce(p_referrer_domain, ''), 255), ''),
    nullif(left(coalesce(p_source, ''), 160), ''),
    nullif(left(coalesce(p_medium, ''), 160), ''),
    nullif(left(coalesce(p_campaign, ''), 160), ''),
    p_properties
  );
end;
$$;

revoke all on function public.track_analytics_event(
  text, uuid, uuid, text, text, text, text, text, text, text, jsonb
) from public;
grant execute on function public.track_analytics_event(
  text, uuid, uuid, text, text, text, text, text, text, text, jsonb
) to anon, authenticated;

-- One server-side aggregate powers the admin analytics page without exposing raw
-- visitor rows or auth.users to the browser.
create or replace function public.admin_analytics_overview(
  p_since timestamptz,
  p_until timestamptz,
  p_timezone text default 'Asia/Kolkata'
)
returns jsonb
language sql
security definer
set search_path = public, pg_temp
stable
as $$
with scoped as (
  select *, (occurred_at at time zone p_timezone)::date as local_day
  from public.analytics_events
  where occurred_at >= p_since and occurred_at < p_until
),
summary as (
  select jsonb_build_object(
    'unique_visitors', count(distinct anonymous_id) filter (where event_name = 'page.viewed' and platform = 'web'),
    'page_views', count(*) filter (where event_name = 'page.viewed' and platform = 'web'),
    'sessions', count(distinct session_id),
    'signed_in_users', count(distinct user_id) filter (where user_id is not null),
    'sign_in_events', count(*) filter (where event_name = 'user.signed_in'),
    'app_installs', count(distinct anonymous_id) filter (where event_name = 'app.first_opened'),
    'app_active_users', count(distinct anonymous_id) filter (
      where platform in ('android', 'ios') and event_name in ('session.started', 'screen.viewed')
    ),
    'app_downloads', count(*) filter (where event_name = 'app.download_clicked'),
    'product_views', count(*) filter (where event_name = 'product.viewed'),
    'cart_adds', count(*) filter (where event_name = 'cart.item_added'),
    'checkout_starts', count(*) filter (where event_name = 'checkout.started'),
    'orders_placed', count(*) filter (where event_name = 'order.placed'),
    'support_cases', count(*) filter (where event_name = 'support.case_created')
  ) as value from scoped
),
auth_summary as (
  select jsonb_build_object(
    'total_registered_users', count(*),
    'new_registered_users', count(*) filter (where created_at >= p_since and created_at < p_until)
  ) as value
  from auth.users
),
days as (
  select day::date as local_day
  from generate_series(
    (p_since at time zone p_timezone)::date,
    ((p_until - interval '1 millisecond') at time zone p_timezone)::date,
    interval '1 day'
  ) day
),
trend as (
  select coalesce(jsonb_agg(jsonb_build_object(
    'date', to_char(d.local_day, 'YYYY-MM-DD'),
    'visitors', coalesce(x.visitors, 0),
    'page_views', coalesce(x.page_views, 0),
    'app_users', coalesce(x.app_users, 0),
    'sign_ins', coalesce(x.sign_ins, 0),
    'installs', coalesce(x.installs, 0),
    'orders', coalesce(x.orders, 0)
  ) order by d.local_day), '[]'::jsonb) as value
  from days d
  left join (
    select local_day,
      count(distinct anonymous_id) filter (where event_name = 'page.viewed' and platform = 'web') as visitors,
      count(*) filter (where event_name = 'page.viewed' and platform = 'web') as page_views,
      count(distinct anonymous_id) filter (where platform in ('android', 'ios') and event_name in ('session.started', 'screen.viewed')) as app_users,
      count(*) filter (where event_name = 'user.signed_in') as sign_ins,
      count(distinct anonymous_id) filter (where event_name = 'app.first_opened') as installs,
      count(*) filter (where event_name = 'order.placed') as orders
    from scoped group by local_day
  ) x using (local_day)
),
top_pages as (
  select coalesce(jsonb_agg(to_jsonb(p) order by p.views desc), '[]'::jsonb) as value
  from (
    select page_path as path, count(*) as views, count(distinct anonymous_id) as visitors
    from scoped
    where event_name = 'page.viewed' and platform = 'web' and page_path is not null
    group by page_path order by views desc limit 8
  ) p
),
top_products as (
  select coalesce(jsonb_agg(to_jsonb(p) order by p.views desc), '[]'::jsonb) as value
  from (
    select coalesce(properties->>'product_name', properties->>'product_id', 'Unknown product') as product,
      count(*) filter (where event_name = 'product.viewed') as views,
      count(*) filter (where event_name = 'cart.item_added') as cart_adds
    from scoped
    where event_name in ('product.viewed', 'cart.item_added')
    group by 1 order by views desc limit 8
  ) p
),
platforms as (
  select coalesce(jsonb_agg(to_jsonb(p) order by p.visitors desc), '[]'::jsonb) as value
  from (
    select platform, count(distinct anonymous_id) as visitors
    from scoped
    where event_name in ('page.viewed', 'screen.viewed')
    group by platform
  ) p
),
sources as (
  select coalesce(jsonb_agg(to_jsonb(s) order by s.visitors desc), '[]'::jsonb) as value
  from (
    select coalesce(source, referrer_domain, 'Direct') as source,
      count(distinct anonymous_id) as visitors
    from scoped
    where event_name = 'page.viewed' and platform = 'web'
    group by 1 order by visitors desc limit 8
  ) s
),
funnel as (
  select jsonb_build_array(
    jsonb_build_object('label', 'Visited', 'value', count(distinct anonymous_id) filter (where event_name = 'page.viewed' and platform = 'web')),
    jsonb_build_object('label', 'Viewed product', 'value', count(distinct anonymous_id) filter (where event_name = 'product.viewed')),
    jsonb_build_object('label', 'Added to cart', 'value', count(distinct anonymous_id) filter (where event_name = 'cart.item_added')),
    jsonb_build_object('label', 'Started checkout', 'value', count(distinct anonymous_id) filter (where event_name = 'checkout.started')),
    jsonb_build_object('label', 'Placed order', 'value', count(distinct anonymous_id) filter (where event_name = 'order.placed'))
  ) as value from scoped
)
select jsonb_build_object(
  'summary', summary.value || auth_summary.value,
  'trend', trend.value,
  'top_pages', top_pages.value,
  'top_products', top_products.value,
  'platforms', platforms.value,
  'sources', sources.value,
  'funnel', funnel.value,
  'timezone', p_timezone,
  'generated_at', now()
)
from summary, auth_summary, trend, top_pages, top_products, platforms, sources, funnel;
$$;

revoke all on function public.admin_analytics_overview(timestamptz, timestamptz, text) from public;
grant execute on function public.admin_analytics_overview(timestamptz, timestamptz, text) to service_role;
