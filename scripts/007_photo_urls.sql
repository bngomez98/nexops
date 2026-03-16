-- ============================================================
-- Nexus Operations — add photo_urls to service_requests
-- Run this in Supabase SQL Editor after 006_contractor_profile.sql
-- ============================================================

-- Add photo_urls column (array of storage URLs) to service_requests
alter table public.service_requests
  add column if not exists photo_urls text[];

-- Create storage bucket for request photos (safe to re-run)
insert into storage.buckets (id, name, public)
  values ('request-photos', 'request-photos', true)
  on conflict (id) do nothing;

-- RLS: owners can upload photos for their own requests
create policy "request_photos_owner_insert"
  on storage.objects for insert
  with check (
    bucket_id = 'request-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- RLS: anyone can view request photos (public bucket)
create policy "request_photos_public_select"
  on storage.objects for select
  using (bucket_id = 'request-photos');

-- RLS: owners can delete their own photos
create policy "request_photos_owner_delete"
  on storage.objects for delete
  using (
    bucket_id = 'request-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
