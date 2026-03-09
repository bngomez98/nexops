-- ============================================================
-- Nexus Operations — Stripe billing columns
-- Run this in the Supabase SQL editor after 001 and 002
-- ============================================================

-- Add Stripe customer ID to profiles
alter table public.profiles
  add column if not exists stripe_customer_id text;

-- Add subscription status for quick display
alter table public.profiles
  add column if not exists subscription_status text
    check (subscription_status in ('active', 'past_due', 'canceled', 'trialing', null));

-- Index for webhook lookups by Stripe customer ID
create index if not exists profiles_stripe_customer_id_idx
  on public.profiles (stripe_customer_id);
