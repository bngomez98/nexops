-- ============================================================
-- Nexus Operations — full database setup
-- Run this in the Supabase SQL Editor (once, in order)
-- ============================================================

-- ── helpers ──────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── profiles ─────────────────────────────────────────────────
create table if not exists public.profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  full_name      text,
  role           text not null default 'homeowner'
                   check (role in ('homeowner', 'property_manager', 'contractor', 'admin')),
  phone          text,
  company        text,
  avatar_url     text,
  stripe_customer_id          text,
  stripe_connect_account_id   text,
  stripe_connect_status       text
                   check (stripe_connect_status in ('pending', 'active', 'restricted')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', null),
    coalesce(new.raw_user_meta_data ->> 'role', 'homeowner')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- indexes
create index if not exists profiles_stripe_connect_account_id_idx
  on public.profiles (stripe_connect_account_id);

-- compatibility columns used by API routes across schema generations
alter table public.profiles
  add column if not exists user_id uuid,
  add column if not exists photo_url text,
  add column if not exists subscription_tier text default 'free',
  add column if not exists subscription_status text default 'inactive',
  add column if not exists stripe_subscription_id text,
  add column if not exists subscription_plan_type text
    check (subscription_plan_type in ('contractor', 'owner')),
  add column if not exists subscription_price_cents integer
    check (subscription_price_cents is null or subscription_price_cents > 0),
  add column if not exists contractor_hourly_rate numeric(10,2)
    check (contractor_hourly_rate is null or contractor_hourly_rate >= 0),
  add column if not exists contractor_minimum_service_fee numeric(10,2)
    check (contractor_minimum_service_fee is null or contractor_minimum_service_fee >= 0);

update public.profiles set user_id = id where user_id is null;
create unique index if not exists profiles_user_id_unique_idx on public.profiles (user_id);
create index if not exists profiles_subscription_status_idx on public.profiles (subscription_status);
create index if not exists profiles_stripe_customer_id_idx on public.profiles (stripe_customer_id);

-- ── properties ───────────────────────────────────────────────
create table if not exists public.properties (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references public.profiles(id) on delete cascade,
  address     text not null,
  city        text not null default 'Topeka',
  state       text not null default 'KS',
  zip_code    text not null,
  nickname    text,
  created_at  timestamptz not null default now()
);

alter table public.properties enable row level security;

drop policy if exists "properties_owner" on public.properties;
create policy "properties_owner" on public.properties for all
  using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

alter table public.properties
  add column if not exists zip text;

-- ── service_requests ─────────────────────────────────────────
create table if not exists public.service_requests (
  id                      uuid primary key default gen_random_uuid(),
  owner_id                uuid not null references public.profiles(id) on delete cascade,
  property_id             uuid references public.properties(id) on delete set null,
  category                text not null,
  description             text not null,
  budget_min              numeric(10,2),
  budget_max              numeric(10,2),
  address                 text not null,
  city                    text not null,
  state                   text not null default 'KS',
  zip_code                text not null,
  preferred_dates         text,
  additional_notes        text,
  photo_urls              text[],
  status                  text not null default 'pending_review'
                            check (status in (
                              'pending_review',
                              'in_queue',
                              'assigned',
                              'consultation_scheduled',
                              'in_progress',
                              'completed',
                              'declined',
                              'cancelled'
                            )),
  assigned_contractor_id  uuid references public.profiles(id) on delete set null,
  consultation_date       timestamptz,
  final_cost              numeric(10,2),
  completion_date         timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

alter table public.service_requests
  add column if not exists contractor_id uuid,
  add column if not exists invoice_paid boolean not null default false,
  add column if not exists owner_fee_amount_cents integer not null default 9900,
  add column if not exists contractor_fee_amount_cents integer not null default 9900,
  add column if not exists owner_fee_paid boolean not null default false,
  add column if not exists contractor_fee_paid boolean not null default false;

create or replace function public.sync_service_request_contractor_ids()
returns trigger language plpgsql as $$
begin
  if new.assigned_contractor_id is not null then
    new.contractor_id = new.assigned_contractor_id;
  elsif new.contractor_id is not null then
    new.assigned_contractor_id = new.contractor_id;
  end if;
  return new;
end;
$$;

alter table public.service_requests enable row level security;

-- owner policies
drop policy if exists "requests_owner_select" on public.service_requests;
create policy "requests_owner_select" on public.service_requests for select
  using (auth.uid() = owner_id);
drop policy if exists "requests_owner_insert" on public.service_requests;
create policy "requests_owner_insert" on public.service_requests for insert
  with check (auth.uid() = owner_id);
drop policy if exists "requests_owner_update" on public.service_requests;
create policy "requests_owner_update" on public.service_requests for update
  using (auth.uid() = owner_id);

-- assigned contractor policies
drop policy if exists "requests_contractor_select" on public.service_requests;
create policy "requests_contractor_select" on public.service_requests for select
  using (auth.uid() = assigned_contractor_id);
drop policy if exists "requests_contractor_update" on public.service_requests;
create policy "requests_contractor_update" on public.service_requests for update
  using (auth.uid() = assigned_contractor_id);

-- contractor open-request access (view unassigned queue and claim)
drop policy if exists "requests_contractor_view_open" on public.service_requests;
create policy "requests_contractor_view_open" on public.service_requests for select
  using (
    status in ('pending_review', 'in_queue')
    and assigned_contractor_id is null
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'contractor'
    )
  );

drop policy if exists "requests_contractor_claim" on public.service_requests;
create policy "requests_contractor_claim" on public.service_requests for update
  using (
    status in ('pending_review', 'in_queue')
    and assigned_contractor_id is null
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'contractor'
    )
  )
  with check (auth.uid() = assigned_contractor_id);

drop trigger if exists set_service_requests_updated_at on public.service_requests;
create trigger set_service_requests_updated_at
  before update on public.service_requests
  for each row execute function public.set_updated_at();

drop trigger if exists sync_service_request_contractor_ids on public.service_requests;
create trigger sync_service_request_contractor_ids
  before insert or update on public.service_requests
  for each row execute function public.sync_service_request_contractor_ids();

-- ── messages ─────────────────────────────────────────────────
create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  request_id  uuid not null references public.service_requests(id) on delete cascade,
  sender_id   uuid not null references public.profiles(id) on delete cascade,
  body        text not null,
  created_at  timestamptz not null default now()
);

alter table public.messages enable row level security;

drop policy if exists "messages_select" on public.messages;
create policy "messages_select" on public.messages for select
  using (
    exists (
      select 1 from public.service_requests sr
      where sr.id = messages.request_id
        and (auth.uid() = sr.owner_id or auth.uid() = sr.assigned_contractor_id)
    )
  );

drop policy if exists "messages_insert" on public.messages;
create policy "messages_insert" on public.messages for insert
  with check (
    auth.uid() = sender_id and
    exists (
      select 1 from public.service_requests sr
      where sr.id = messages.request_id
        and (auth.uid() = sr.owner_id or auth.uid() = sr.assigned_contractor_id)
    )
  );

-- ── payments ─────────────────────────────────────────────────
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

drop policy if exists "payments_payer_select" on public.payments;
create policy "payments_payer_select" on public.payments
  for select using (auth.uid() = payer_id);

drop policy if exists "payments_contractor_select" on public.payments;
create policy "payments_contractor_select" on public.payments
  for select using (auth.uid() = contractor_id);

alter table public.payments
  drop constraint if exists payments_type_check;

alter table public.payments
  add constraint payments_type_check
  check (type in ('dispatch', 'invoice', 'claim_fee'));

create index if not exists payments_stripe_session_id_idx
  on public.payments (stripe_session_id);
create index if not exists payments_stripe_payment_intent_id_idx
  on public.payments (stripe_payment_intent_id);

drop trigger if exists set_payments_updated_at on public.payments;
create trigger set_payments_updated_at
  before update on public.payments
  for each row execute function public.set_updated_at();

-- ── documents ─────────────────────────────────────────────────
create table if not exists public.documents (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  type       text not null,
  file_url   text not null,
  expires_at timestamptz,
  verified   boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.documents enable row level security;

drop policy if exists "documents_user_access" on public.documents;
create policy "documents_user_access" on public.documents for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists documents_user_id_idx on public.documents (user_id);
create index if not exists documents_expires_at_idx on public.documents (expires_at);

drop trigger if exists set_documents_updated_at on public.documents;
create trigger set_documents_updated_at
  before update on public.documents
  for each row execute function public.set_updated_at();

-- ── contractor_profiles ───────────────────────────────────────
create table if not exists public.contractor_profiles (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references auth.users(id) on delete cascade,
  bio                  text,
  service_radius_miles integer not null default 25,
  trade_categories     text[] not null default '{}',
  stripe_account_id    text,
  is_verified          boolean not null default false,
  is_available         boolean not null default true,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  constraint contractor_profiles_user_id_unique unique (user_id)
);

alter table public.contractor_profiles enable row level security;

drop policy if exists "contractor_profiles_self_access" on public.contractor_profiles;
create policy "contractor_profiles_self_access" on public.contractor_profiles for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists contractor_profiles_verified_available_idx
  on public.contractor_profiles (is_verified, is_available);

drop trigger if exists set_contractor_profiles_updated_at on public.contractor_profiles;
create trigger set_contractor_profiles_updated_at
  before update on public.contractor_profiles
  for each row execute function public.set_updated_at();

-- ── jobs ──────────────────────────────────────────────────────
create table if not exists public.jobs (
  id             uuid primary key default gen_random_uuid(),
  client_id      uuid not null references auth.users(id) on delete cascade,
  property_id    uuid references public.properties(id) on delete set null,
  service_type   text not null,
  urgency        text not null default 'routine',
  description    text,
  budget_ceiling numeric(10,2),
  status         text not null default 'open',
  contractor_id  uuid references auth.users(id) on delete set null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.jobs enable row level security;

drop policy if exists "jobs_party_access" on public.jobs;
create policy "jobs_party_access" on public.jobs for all
  using (auth.uid() = client_id or auth.uid() = contractor_id)
  with check (auth.uid() = client_id or auth.uid() = contractor_id);

create index if not exists jobs_client_id_idx on public.jobs (client_id);
create index if not exists jobs_contractor_id_idx on public.jobs (contractor_id);
create index if not exists jobs_status_idx on public.jobs (status);

drop trigger if exists set_jobs_updated_at on public.jobs;
create trigger set_jobs_updated_at
  before update on public.jobs
  for each row execute function public.set_updated_at();

-- ── matches ───────────────────────────────────────────────────
create table if not exists public.matches (
  id             uuid primary key default gen_random_uuid(),
  job_id         uuid not null references public.jobs(id) on delete cascade,
  contractor_id  uuid not null references auth.users(id) on delete cascade,
  offered_at     timestamptz not null default now(),
  response       text,
  responded_at   timestamptz
);

alter table public.matches enable row level security;

drop policy if exists "matches_party_access" on public.matches;
create policy "matches_party_access" on public.matches for all
  using (
    auth.uid() = contractor_id or
    exists (
      select 1 from public.jobs j
      where j.id = matches.job_id and j.client_id = auth.uid()
    )
  );

create index if not exists matches_job_id_idx on public.matches (job_id);
create index if not exists matches_contractor_id_idx on public.matches (contractor_id);

-- ── job_status_history ────────────────────────────────────────
create table if not exists public.job_status_history (
  id          uuid primary key default gen_random_uuid(),
  job_id      uuid not null references public.jobs(id) on delete cascade,
  status      text not null,
  changed_at  timestamptz not null default now(),
  changed_by  text not null default 'system'
);

alter table public.job_status_history enable row level security;

drop policy if exists "job_status_history_party_access" on public.job_status_history;
create policy "job_status_history_party_access" on public.job_status_history for all
  using (
    exists (
      select 1 from public.jobs j
      where j.id = job_status_history.job_id
        and (j.client_id = auth.uid() or j.contractor_id = auth.uid())
    )
  );

create index if not exists job_status_history_job_id_idx on public.job_status_history (job_id);

-- ── invoices ──────────────────────────────────────────────────
create table if not exists public.invoices (
  id                  uuid primary key default gen_random_uuid(),
  job_id              uuid not null references public.jobs(id) on delete cascade,
  contractor_id       uuid not null references auth.users(id),
  client_id           uuid not null references auth.users(id),
  line_items          jsonb not null default '[]',
  subtotal            numeric(10,2) not null default 0,
  nexus_fee           numeric(10,2) not null default 0,
  total               numeric(10,2) not null default 0,
  fee_rate            numeric(4,3) not null default 0.25,
  urgency             text not null default 'routine',
  status              text not null default 'draft'
                      check (status in ('draft', 'sent', 'paid', 'void')),
  stripe_invoice_id   text,
  stripe_payment_url  text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table public.invoices enable row level security;

drop policy if exists "invoices_party_access" on public.invoices;
create policy "invoices_party_access" on public.invoices for all
  using (auth.uid() = contractor_id or auth.uid() = client_id)
  with check (auth.uid() = contractor_id or auth.uid() = client_id);

create index if not exists invoices_contractor_id_idx on public.invoices (contractor_id);
create index if not exists invoices_client_id_idx on public.invoices (client_id);
create index if not exists invoices_job_id_idx on public.invoices (job_id);
create unique index if not exists invoices_stripe_invoice_id_unique_idx on public.invoices (stripe_invoice_id);

drop trigger if exists set_invoices_updated_at on public.invoices;
create trigger set_invoices_updated_at
  before update on public.invoices
  for each row execute function public.set_updated_at();

-- ── notifications ─────────────────────────────────────────────
create table if not exists public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  title      text not null,
  body       text,
  type       text,
  read       boolean not null default false,
  link       text,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

drop policy if exists "notifications_self_access" on public.notifications;
create policy "notifications_self_access" on public.notifications for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists notifications_user_id_idx on public.notifications (user_id);
create index if not exists notifications_user_id_read_idx on public.notifications (user_id, read);

-- ── billing_subscriptions ─────────────────────────────────────
create table if not exists public.billing_subscriptions (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null references auth.users(id) on delete cascade,
  stripe_subscription_id text unique,
  stripe_customer_id     text,
  plan_id                text not null,
  status                 text not null,
  current_period_start   timestamptz,
  current_period_end     timestamptz,
  cancel_at_period_end   boolean not null default false,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

alter table public.billing_subscriptions enable row level security;

drop policy if exists "billing_subscriptions_self_access" on public.billing_subscriptions;
create policy "billing_subscriptions_self_access" on public.billing_subscriptions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists billing_subscriptions_user_id_idx on public.billing_subscriptions (user_id);
create index if not exists billing_subscriptions_customer_idx on public.billing_subscriptions (stripe_customer_id);

drop trigger if exists set_billing_subscriptions_updated_at on public.billing_subscriptions;
create trigger set_billing_subscriptions_updated_at
  before update on public.billing_subscriptions
  for each row execute function public.set_updated_at();

-- ── avatars storage bucket ───────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

drop policy if exists "avatars_insert_own" on storage.objects;
create policy "avatars_insert_own" on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "avatars_update_own" on storage.objects;
create policy "avatars_update_own" on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "avatars_delete_own" on storage.objects;
create policy "avatars_delete_own" on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "avatars_select_public" on storage.objects;
create policy "avatars_select_public" on storage.objects for select
  using (bucket_id = 'avatars');
