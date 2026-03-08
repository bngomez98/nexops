-- ============================================================
-- Nexus Operations — Stripe Connect integration
-- Run this after 003_stripe_billing.sql
-- ============================================================

-- Add Stripe Connect fields to contractor profiles
alter table public.profiles
  add column if not exists stripe_connect_account_id text;

alter table public.profiles
  add column if not exists stripe_connect_status text
    check (stripe_connect_status in ('pending', 'active', 'restricted'));

create index if not exists profiles_stripe_connect_account_id_idx
  on public.profiles (stripe_connect_account_id);

-- ── payments ──────────────────────────────────────────────────
-- Tracks dispatch fees and final invoice charges per service request
create table if not exists public.payments (
  id                       uuid primary key default gen_random_uuid(),
  request_id               uuid not null references public.service_requests(id) on delete cascade,
  payer_id                 uuid not null references public.profiles(id),
  contractor_id            uuid not null references public.profiles(id),
  type                     text not null check (type in ('dispatch', 'invoice')),
  amount_cents             integer not null,
  application_fee_cents    integer not null,
  stripe_session_id        text,
  stripe_payment_intent_id text,
  status                   text not null default 'pending'
                             check (status in ('pending', 'paid', 'refunded', 'failed')),
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

alter table public.payments enable row level security;

-- Homeowner (payer) can view their own payments
create policy "payments_payer_select" on public.payments
  for select using (auth.uid() = payer_id);

-- Contractor can view payments where they receive funds
create policy "payments_contractor_select" on public.payments
  for select using (auth.uid() = contractor_id);

-- Index for fast webhook lookups
create index if not exists payments_stripe_session_id_idx
  on public.payments (stripe_session_id);

create index if not exists payments_stripe_payment_intent_id_idx
  on public.payments (stripe_payment_intent_id);
