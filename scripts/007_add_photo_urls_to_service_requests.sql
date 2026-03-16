-- ============================================================
-- Nexus Operations — add photo_urls column to service_requests
-- ============================================================
-- The service_requests table was created without a photo_urls column,
-- but the API inserts this field. This migration adds the missing column.

alter table public.service_requests
  add column if not exists photo_urls text[];
