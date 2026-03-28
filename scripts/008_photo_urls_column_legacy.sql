-- ============================================================
-- Nexus Operations — add photo_urls column (legacy / superseded)
-- ============================================================
-- NOTE: 007_photo_urls.sql is the canonical migration — it adds this
-- column AND creates the request-photos storage bucket with RLS policies.
-- This file is kept for reference only. All statements are idempotent.

alter table public.service_requests
  add column if not exists photo_urls text[];
