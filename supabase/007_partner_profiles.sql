-- ============================================================================
-- Delivery partner profiles: photo and joining details.
--
-- Run in Supabase → SQL Editor. Idempotent — safe to re-run.
-- ============================================================================
--
-- WHY A PHOTO MATTERS HERE
--   It is not decoration. A customer opening their door to a stranger holding
--   their food has no way to tell a Samachify rider from anyone else. A photo
--   on the delivery record is the thing that lets them check.
--
--   It also gives dispatch a face to match to a name when several partners are
--   on shift.
--
-- STORAGE
--   Photos live in a public storage bucket. Public is the right call: the image
--   is shown to customers, it contains no private data beyond a face the
--   customer is about to see in person anyway, and a signed URL would expire
--   mid-shift. Uploads are restricted to staff.
-- ============================================================================

alter table public.delivery_partners
  add column if not exists photo_url  text,
  add column if not exists vehicle    text,
  add column if not exists joined_on  date default current_date;

comment on column public.delivery_partners.photo_url is
  'Public URL of the partner photo. Shown so a customer can confirm who is at their door.';
comment on column public.delivery_partners.vehicle is
  'Free text, e.g. "Bike - TN 09 AB 1234". Helps dispatch and lets a customer spot the arrival.';

-- ─── Storage bucket ─────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('partner-photos', 'partner-photos', true)
on conflict (id) do update set public = true;

-- Anyone may read: the photo is shown to customers at the door.
drop policy if exists "partner photos are publicly readable" on storage.objects;
create policy "partner photos are publicly readable" on storage.objects
  for select using (bucket_id = 'partner-photos');

-- Only staff may write. Uploads come from the admin portal through the
-- service-role client, which bypasses RLS — this policy exists so that a
-- signed-in customer or rider cannot upload directly, not to enable the admin.
drop policy if exists "only admins write partner photos" on storage.objects;
create policy "only admins write partner photos" on storage.objects
  for insert with check (
    bucket_id = 'partner-photos'
    and exists (select 1 from public.admins a where a.user_id = auth.uid())
  );

drop policy if exists "only admins replace partner photos" on storage.objects;
create policy "only admins replace partner photos" on storage.objects
  for update using (
    bucket_id = 'partner-photos'
    and exists (select 1 from public.admins a where a.user_id = auth.uid())
  );
