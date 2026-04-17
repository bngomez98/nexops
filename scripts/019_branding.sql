-- ============================================================
-- Migration 019: Personalized Branding
-- Adds a JSONB column to profiles for per-user branding config.
-- Schema: { brandName?, primaryColor?, accentColor?, logoUrl? }
-- ============================================================

alter table public.profiles
  add column if not exists branding jsonb;
