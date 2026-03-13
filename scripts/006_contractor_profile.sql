-- ─────────────────────────────────────────────────────────────────────────────
-- 006_contractor_profile.sql
-- Adds contractor-specific profile fields:
--   business_name, license_number, insurance_carrier, bio,
--   service_radius, service_categories
-- Run in Supabase SQL editor (or via supabase db push)
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Add contractor profile columns to existing profiles table ────────────────

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS business_name      text,
  ADD COLUMN IF NOT EXISTS license_number     text,
  ADD COLUMN IF NOT EXISTS insurance_carrier  text,
  ADD COLUMN IF NOT EXISTS bio               text,
  ADD COLUMN IF NOT EXISTS service_radius    integer DEFAULT 25,
  ADD COLUMN IF NOT EXISTS service_categories text[]  DEFAULT '{}';

-- ── Indexes for contractor lookups ───────────────────────────────────────────

CREATE INDEX IF NOT EXISTS profiles_business_name_idx
  ON public.profiles (business_name)
  WHERE business_name IS NOT NULL;

-- ── RLS policies for new columns ─────────────────────────────────────────────
-- (Existing RLS on profiles already allows users to update their own row,
--  so no new policies are required — these columns are covered.)

-- ── Comments for documentation ───────────────────────────────────────────────

COMMENT ON COLUMN public.profiles.business_name      IS 'Contractor business or trade name';
COMMENT ON COLUMN public.profiles.license_number     IS 'State contractor license number';
COMMENT ON COLUMN public.profiles.insurance_carrier  IS 'General liability insurance carrier and policy reference';
COMMENT ON COLUMN public.profiles.bio                IS 'Short business description shown to property owners post-claim';
COMMENT ON COLUMN public.profiles.service_radius     IS 'Service area radius in miles from Topeka, KS 66604';
COMMENT ON COLUMN public.profiles.service_categories IS 'Array of trade categories this contractor handles';
