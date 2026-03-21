-- Nexus Operations — Full Schema (Supabase-compatible via service role)
-- Tables use UUID primary keys that map to Supabase auth.users(id)
-- RLS policies reference auth.uid() and are applied at runtime by Supabase

-- ─── profiles ────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id                     text primary key,
  full_name              text,
  phone                  text,
  company                text,
  role                   text not null default 'homeowner',
  avatar_url             text,
  stripe_customer_id     text,
  subscription_tier      text default 'free',
  subscription_status    text default 'inactive',
  stripe_subscription_id text,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- ─── service_requests ────────────────────────────────────────────────────────
create table if not exists public.service_requests (
  id                     text primary key default gen_random_uuid()::text,
  owner_id               text not null,
  assigned_contractor_id text,
  category               text not null,
  title                  text,
  description            text not null,
  additional_notes       text,
  address                text not null,
  city                   text default 'Topeka',
  state                  text default 'KS',
  zip_code               text default '66603',
  budget_max             numeric(10,2),
  urgency                text default 'routine',
  status                 text not null default 'pending_review',
  photo_urls             text[],
  completion_notes       text,
  invoice_amount         numeric(10,2),
  invoice_paid           boolean default false,
  stripe_payment_intent  text,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create index if not exists sr_owner_idx      on public.service_requests(owner_id);
create index if not exists sr_contractor_idx on public.service_requests(assigned_contractor_id);
create index if not exists sr_status_idx     on public.service_requests(status);
create index if not exists sr_category_idx   on public.service_requests(category);

-- ─── contractor_profiles ─────────────────────────────────────────────────────
create table if not exists public.contractor_profiles (
  id                   text primary key,
  company_name         text,
  license_number       text,
  insurance_verified   boolean default false,
  years_in_business    int default 0,
  service_categories   text[],
  service_area         text,
  bio                  text,
  average_rating       numeric(3,2) default 0,
  total_reviews        int default 0,
  total_jobs_completed int default 0,
  total_earnings       numeric(12,2) default 0,
  membership_tier      text default 'free',
  max_active_projects  int default 3,
  stripe_account_id    text,
  stripe_onboarded     boolean default false,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- ─── notifications ────────────────────────────────────────────────────────────
create table if not exists public.notifications (
  id         text primary key default gen_random_uuid()::text,
  user_id    text not null,
  type       text not null,
  title      text not null,
  body       text,
  read       boolean default false,
  metadata   jsonb,
  created_at timestamptz not null default now()
);

create index if not exists notif_user_idx on public.notifications(user_id, read, created_at desc);

-- ─── billing_subscriptions ────────────────────────────────────────────────────
create table if not exists public.billing_subscriptions (
  id                     text primary key default gen_random_uuid()::text,
  user_id                text not null,
  stripe_subscription_id text unique,
  stripe_customer_id     text,
  plan_id                text not null,
  status                 text not null,
  current_period_start   timestamptz,
  current_period_end     timestamptz,
  cancel_at_period_end   boolean default false,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create index if not exists billing_user_idx on public.billing_subscriptions(user_id);

-- ─── reviews ─────────────────────────────────────────────────────────────────
create table if not exists public.reviews (
  id            text primary key default gen_random_uuid()::text,
  request_id    text not null references public.service_requests(id) on delete cascade,
  reviewer_id   text not null,
  contractor_id text not null,
  rating        int not null check (rating >= 1 and rating <= 5),
  comment       text,
  created_at    timestamptz not null default now()
);

-- ─── updated_at trigger ───────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_sr_updated_at on public.service_requests;
create trigger set_sr_updated_at
  before update on public.service_requests
  for each row execute function public.set_updated_at();

drop trigger if exists set_cp_updated_at on public.contractor_profiles;
create trigger set_cp_updated_at
  before update on public.contractor_profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_billing_updated_at on public.billing_subscriptions;
create trigger set_billing_updated_at
  before update on public.billing_subscriptions
  for each row execute function public.set_updated_at();
