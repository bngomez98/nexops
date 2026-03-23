-- ============================================================
-- Nexus Operations — service billing and invoicing expansion
-- Run this after 004_stripe_connect.sql
-- ============================================================

alter table public.profiles
  add column if not exists subscription_plan_type text
    check (subscription_plan_type in ('contractor', 'owner'));

alter table public.profiles
  add column if not exists subscription_price_cents integer
    check (subscription_price_cents is null or subscription_price_cents > 0);

alter table public.profiles
  add column if not exists contractor_hourly_rate numeric(10,2)
    check (contractor_hourly_rate is null or contractor_hourly_rate >= 0);

alter table public.profiles
  add column if not exists contractor_minimum_service_fee numeric(10,2)
    check (contractor_minimum_service_fee is null or contractor_minimum_service_fee >= 0);

alter table public.service_requests
  -- Default 9900 cents ($99.00) matches SERVICE_REQUEST_FEE_CENTS in lib/billing/config.ts
  add column if not exists owner_fee_amount_cents integer not null default 9900,
  add column if not exists contractor_fee_amount_cents integer not null default 9900,
  add column if not exists owner_fee_paid boolean not null default false,
  add column if not exists contractor_fee_paid boolean not null default false;

alter table public.payments
  drop constraint if exists payments_type_check;

alter table public.payments
  add constraint payments_type_check
  check (type in ('dispatch', 'invoice', 'claim_fee'));

comment on column public.profiles.subscription_plan_type is
  'Whether the user''s Stripe subscription is the contractor plan or the owner plan.';

comment on column public.profiles.subscription_price_cents is
  'Configured monthly subscription price in cents. Contractors can set this; owner price is derived in app logic.';

comment on column public.profiles.contractor_hourly_rate is
  'Optional contractor-configured hourly billing rate for service work.';

comment on column public.profiles.contractor_minimum_service_fee is
  'Optional contractor-configured minimum job charge shown in billing surfaces.';
