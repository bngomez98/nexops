-- ============================================================
-- Nexus Operations — avatar storage setup
-- Run this in the Supabase SQL editor
-- ============================================================

-- Add avatar_url column to profiles
alter table public.profiles
  add column if not exists avatar_url text;

-- Create the avatars storage bucket (public read, authenticated write)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  5242880,  -- 5 MB limit
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- Storage RLS: users can upload/update/delete their own avatar
create policy "avatars_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatars_update_own"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatars_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Public read — avatars are visible to anyone with the URL
create policy "avatars_select_public"
  on storage.objects for select
  using (bucket_id = 'avatars');
