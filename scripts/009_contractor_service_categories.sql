-- Migration 009: Add service_categories column to profiles for contractor matching
--
-- This allows contractors to specify which trade categories they work in.
-- When set, only service_requests matching these categories will be surfaced
-- to the contractor in their available projects feed.
-- When empty (default), all categories are shown (safe backwards-compatible default).

alter table public.profiles
  add column if not exists service_categories text[] not null default '{}';

comment on column public.profiles.service_categories is
  'Array of trade category values (e.g. roofing, hvac) that a contractor covers. Empty means all categories.';
