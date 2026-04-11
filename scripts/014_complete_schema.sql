-- ============================================================
-- Nexus Operations — Complete Database Schema
-- scripts/014_complete_schema.sql
--
-- Single authoritative, idempotent schema for fresh installs
-- and incremental upgrades.  Covers every table, function,
-- trigger, index, RLS policy, storage bucket, realtime
-- subscription, and vector embedding used by the app.
--
-- Run this once against a blank Supabase project, or re-run
-- against an existing one — all statements use CREATE IF NOT
-- EXISTS / CREATE OR REPLACE / DROP IF EXISTS patterns so
-- running it again is safe.
--
-- Prerequisites:
--   • Supabase project with auth schema already present
--   • pgvector extension enabled in the dashboard
--     (Database → Extensions → vector) — optional but
--     required for semantic contractor matching
-- ============================================================

-- ── Extensions ────────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- pgvector — enable if available; skip gracefully if not
do $$
begin
  create extension if not exists vector schema extensions;
exception when others then
  raise notice 'pgvector not available; semantic-search tables will be skipped';
end;
$$;

-- ============================================================
-- UTILITY TRIGGER FUNCTION
-- ============================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- ENUM TYPES  (idempotent — exception-swallowed DO blocks)
-- ============================================================

do $$ begin
  create type public.profile_role as enum (
    'homeowner', 'property_manager', 'contractor', 'admin'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.stripe_connect_status as enum (
    'pending', 'active', 'restricted'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.subscription_plan_type as enum ('contractor', 'owner');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.subscription_status as enum (
    'inactive', 'incomplete', 'incomplete_expired', 'trialing',
    'active', 'past_due', 'canceled', 'unpaid', 'paused'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.service_request_status as enum (
    'pending_review', 'in_queue', 'assigned', 'consultation_scheduled',
    'in_progress', 'completed', 'declined', 'cancelled'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.document_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.job_urgency as enum ('routine', 'urgent', 'emergency');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.job_status as enum (
    'open', 'unmatched', 'matched', 'assigned',
    'in_progress', 'completed', 'cancelled'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.match_response as enum ('accepted', 'declined');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.invoice_status as enum ('draft', 'sent', 'paid', 'void');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_type as enum ('dispatch', 'invoice', 'claim_fee');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_status as enum ('pending', 'paid', 'refunded', 'failed');
exception when duplicate_object then null; end $$;

-- ============================================================
-- TABLE: profiles
-- One row per user; id = auth.users.id (Supabase canonical).
-- Contains all role-specific fields so a single query always
-- returns a complete user record.
-- ============================================================

create table if not exists public.profiles (
  -- identity: id mirrors auth.users.id; user_id kept for legacy code paths
  id                             uuid primary key references auth.users(id) on delete cascade,
  user_id                        uuid,                       -- legacy alias; kept in sync with id
  full_name                      text,
  email                          text,
  role                           public.profile_role not null default 'homeowner',
  phone                          text,
  company                        text,
  avatar_url                     text,
  photo_url                      text,                       -- legacy alias for avatar_url
  bio                            text,
  -- contractor-specific fields stored here for fast single-table reads
  license_number                 text,
  years_in_business              integer not null default 0,
  category                       text,                       -- primary trade category
  skills                         text[] not null default '{}',
  service_area                   text,
  service_categories             text[] not null default '{}',
  average_rating                 numeric(3,2) not null default 0
                                   check (average_rating >= 0 and average_rating <= 5),
  reviews_count                  integer not null default 0,
  is_active                      boolean not null default true,
  -- notification preferences (used by /api/portal/preferences)
  notify_messages                boolean not null default true,
  notify_status_changes          boolean not null default true,
  notify_payments                boolean not null default false,
  -- stripe billing
  stripe_customer_id             text,
  stripe_connect_account_id      text,
  stripe_connect_status          public.stripe_connect_status,
  subscription_tier              text default 'free',
  subscription_status            public.subscription_status default 'inactive',
  stripe_subscription_id         text,
  subscription_plan_type         public.subscription_plan_type,
  subscription_price_cents       integer
                                   check (subscription_price_cents is null or subscription_price_cents > 0),
  -- contractor rate / fee settings
  contractor_hourly_rate         numeric(10,2)
                                   check (contractor_hourly_rate is null or contractor_hourly_rate >= 0),
  contractor_minimum_service_fee numeric(10,2)
                                   check (contractor_minimum_service_fee is null or contractor_minimum_service_fee >= 0),
  created_at                     timestamptz not null default now(),
  updated_at                     timestamptz not null default now()
);

-- ── profiles: keep id / user_id in sync ───────────────────────
create or replace function public.sync_profile_identity_columns()
returns trigger
language plpgsql
as $$
begin
  new.id      := coalesce(new.id, new.user_id);
  new.user_id := coalesce(new.user_id, new.id);
  return new;
end;
$$;

drop trigger if exists sync_profile_identity_columns_trigger on public.profiles;
create trigger sync_profile_identity_columns_trigger
  before insert or update on public.profiles
  for each row execute function public.sync_profile_identity_columns();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- indexes
create index if not exists profiles_user_id_idx
  on public.profiles (user_id);
create index if not exists profiles_role_idx
  on public.profiles (role);
create index if not exists profiles_is_active_role_idx
  on public.profiles (is_active, role);
create index if not exists profiles_stripe_customer_id_idx
  on public.profiles (stripe_customer_id);
create index if not exists profiles_stripe_connect_account_id_idx
  on public.profiles (stripe_connect_account_id);
create index if not exists profiles_stripe_subscription_id_idx
  on public.profiles (stripe_subscription_id);
create index if not exists profiles_subscription_status_idx
  on public.profiles (subscription_status);
-- GIN index for fast array containment queries on service_categories
create index if not exists profiles_service_categories_gin_idx
  on public.profiles using gin (service_categories);

-- ── profiles: admin helper ─────────────────────────────────────
-- security definer so it runs outside the caller's RLS context,
-- preventing infinite recursion in policies.
create or replace function public.is_admin(uid uuid default auth.uid())
returns boolean
language plpgsql
security definer
set search_path = public
stable
as $$
begin
  return exists (
    select 1 from public.profiles where id = uid and role = 'admin'
  );
end;
$$;

-- ── profiles: auto-create on sign-up ──────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text;
begin
  -- normalise role from user_metadata
  v_role := coalesce(new.raw_user_meta_data ->> 'role', 'homeowner');
  if v_role = 'property-manager' then v_role := 'property_manager'; end if;
  if v_role not in ('homeowner', 'property_manager', 'contractor', 'admin') then
    v_role := 'homeowner';
  end if;

  insert into public.profiles (id, user_id, full_name, email, role)
  values (
    new.id,
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', null),
    new.email,
    v_role::public.profile_role
  )
  on conflict (id) do update
    set full_name = coalesce(excluded.full_name, public.profiles.full_name),
        email     = coalesce(excluded.email,     public.profiles.email),
        role      = coalesce(public.profiles.role, excluded.role),
        user_id   = excluded.user_id;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── profiles: RLS ─────────────────────────────────────────────
alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

-- Active contractors are publicly readable (marketplace / homeowner search)
drop policy if exists "profiles_contractors_public_read" on public.profiles;
create policy "profiles_contractors_public_read" on public.profiles
  for select using (role = 'contractor' and is_active = true);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin" on public.profiles
  for update
  using  (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

-- ============================================================
-- TABLE: contractor_profiles
-- Extended contractor data; user_id PK = profiles.id.
-- ============================================================

create table if not exists public.contractor_profiles (
  user_id              uuid primary key references public.profiles(id) on delete cascade,
  bio                  text,
  service_radius_miles integer not null default 25,
  trade_categories     text[] not null default '{}',
  stripe_account_id    text,
  is_verified          boolean not null default false,
  is_available         boolean not null default true,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

drop trigger if exists set_contractor_profiles_updated_at on public.contractor_profiles;
create trigger set_contractor_profiles_updated_at
  before update on public.contractor_profiles
  for each row execute function public.set_updated_at();

create index if not exists contractor_profiles_verified_available_idx
  on public.contractor_profiles (is_verified, is_available);

alter table public.contractor_profiles enable row level security;

drop policy if exists "contractor_profiles_self_or_admin" on public.contractor_profiles;
create policy "contractor_profiles_self_or_admin" on public.contractor_profiles
  for all
  using  (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "contractor_profiles_public_read" on public.contractor_profiles;
create policy "contractor_profiles_public_read" on public.contractor_profiles
  for select using (is_available = true);

-- ============================================================
-- TABLE: homeowner_profiles
-- ============================================================

create table if not exists public.homeowner_profiles (
  user_id    uuid primary key references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.homeowner_profiles enable row level security;

drop policy if exists "homeowner_profiles_self_or_admin" on public.homeowner_profiles;
create policy "homeowner_profiles_self_or_admin" on public.homeowner_profiles
  for all
  using  (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

-- ============================================================
-- TABLE: property_manager_profiles
-- ============================================================

create table if not exists public.property_manager_profiles (
  user_id        uuid primary key references public.profiles(id) on delete cascade,
  company_name   text,
  portfolio_size integer,
  created_at     timestamptz not null default now()
);

alter table public.property_manager_profiles enable row level security;

drop policy if exists "pm_profiles_self_or_admin" on public.property_manager_profiles;
create policy "pm_profiles_self_or_admin" on public.property_manager_profiles
  for all
  using  (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

-- ============================================================
-- TABLE: properties
-- Physical properties owned / managed by homeowners and PMs.
-- ============================================================

create table if not exists public.properties (
  id         uuid primary key default gen_random_uuid(),
  owner_id   uuid not null references public.profiles(id) on delete cascade,
  address    text not null,
  city       text not null default 'Topeka',
  state      text not null default 'KS',
  zip_code   text not null,
  zip        text,           -- legacy alias kept in sync with zip_code
  lat        double precision,
  lng        double precision,
  nickname   text,
  created_at timestamptz not null default now()
);

-- keep zip / zip_code mirrors in sync
create or replace function public.sync_property_zip()
returns trigger
language plpgsql
as $$
begin
  if new.zip is null and new.zip_code is not null then
    new.zip := new.zip_code;
  elsif new.zip_code is null and new.zip is not null then
    new.zip_code := new.zip;
  end if;
  return new;
end;
$$;

drop trigger if exists sync_property_zip_trigger on public.properties;
create trigger sync_property_zip_trigger
  before insert or update on public.properties
  for each row execute function public.sync_property_zip();

create index if not exists properties_owner_id_idx    on public.properties (owner_id);
create index if not exists properties_state_city_idx  on public.properties (state, city);

alter table public.properties enable row level security;

drop policy if exists "properties_owner_or_admin" on public.properties;
create policy "properties_owner_or_admin" on public.properties
  for all
  using  (auth.uid() = owner_id or public.is_admin())
  with check (auth.uid() = owner_id or public.is_admin());

-- ============================================================
-- TABLE: documents
-- Compliance and contract documents (license, insurance, etc.).
-- Files live in the compliance-docs / contracts storage buckets.
-- ============================================================

create table if not exists public.documents (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  -- 'license' | 'insurance' | 'eo_insurance' | 'homeowner_insurance' | 'contract' | 'other'
  type       text not null,
  file_url   text not null,
  status     public.document_status not null default 'pending',
  expires_at timestamptz,
  verified   boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- keep verified boolean in sync with the status enum
create or replace function public.sync_document_verified_status()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'approved' then
    new.verified := true;
  elsif new.status in ('rejected', 'pending') then
    new.verified := false;
  end if;
  return new;
end;
$$;

drop trigger if exists sync_document_verified_status_trigger on public.documents;
create trigger sync_document_verified_status_trigger
  before insert or update on public.documents
  for each row execute function public.sync_document_verified_status();

drop trigger if exists set_documents_updated_at on public.documents;
create trigger set_documents_updated_at
  before update on public.documents
  for each row execute function public.set_updated_at();

create index if not exists documents_user_id_idx    on public.documents (user_id);
create index if not exists documents_expires_at_idx on public.documents (expires_at);
create index if not exists documents_type_status_idx on public.documents (type, status);
create index if not exists documents_user_type_idx  on public.documents (user_id, type);

alter table public.documents enable row level security;

drop policy if exists "documents_owner_select" on public.documents;
create policy "documents_owner_select" on public.documents
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "documents_owner_insert" on public.documents;
create policy "documents_owner_insert" on public.documents
  for insert with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "documents_owner_update" on public.documents;
create policy "documents_owner_update" on public.documents
  for update
  using  (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "documents_owner_delete" on public.documents;
create policy "documents_owner_delete" on public.documents
  for delete using (auth.uid() = user_id or public.is_admin());

-- ============================================================
-- TABLE: service_requests
-- Core entity.  A homeowner creates a request; a contractor
-- claims it; admin monitors the whole pipeline.
-- ============================================================

create table if not exists public.service_requests (
  id                          uuid primary key default gen_random_uuid(),
  owner_id                    uuid not null references public.profiles(id) on delete cascade,
  property_id                 uuid references public.properties(id) on delete set null,
  -- categorisation
  category                    text not null,
  title                       text,
  description                 text not null,
  additional_notes            text,
  -- location
  address                     text not null,
  city                        text not null default 'Topeka',
  state                       text not null default 'KS',
  zip_code                    text not null default '66603',
  -- scheduling
  preferred_dates             text,
  consultation_date           timestamptz,
  -- urgency + media
  urgency                     public.job_urgency not null default 'routine',
  photo_urls                  text[],
  -- pipeline metadata (JSON snapshot from lib/request-pipeline.ts:PipelineSnapshot)
  pipeline_snapshot           jsonb,
  community_visible           boolean not null default true,
  access_requirements         text,
  -- budget
  budget_min                  numeric(10,2),
  budget_max                  numeric(10,2),
  -- lifecycle
  status                      public.service_request_status not null default 'pending_review',
  status_reason               text,
  -- assignment — two columns kept in sync for legacy compatibility
  assigned_contractor_id      uuid references public.profiles(id) on delete set null,
  contractor_id               uuid references public.profiles(id) on delete set null,
  -- financial tracking
  final_cost                  numeric(10,2),
  invoice_amount              numeric(10,2),
  invoice_paid                boolean not null default false,
  completion_date             timestamptz,
  -- dispatch / claim fee tracking
  owner_fee_amount_cents      integer not null default 9900,
  contractor_fee_amount_cents integer not null default 9900,
  owner_fee_paid              boolean not null default false,
  contractor_fee_paid         boolean not null default false,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

-- keep assigned_contractor_id / contractor_id mirrors in sync
create or replace function public.sync_service_request_contractor_ids()
returns trigger
language plpgsql
as $$
begin
  if new.assigned_contractor_id is not null then
    new.contractor_id := new.assigned_contractor_id;
  elsif new.contractor_id is not null then
    new.assigned_contractor_id := new.contractor_id;
  end if;
  return new;
end;
$$;

drop trigger if exists sync_service_request_contractor_ids on public.service_requests;
create trigger sync_service_request_contractor_ids
  before insert or update on public.service_requests
  for each row execute function public.sync_service_request_contractor_ids();

-- auto-stamp completion_date when request first transitions to 'completed'
create or replace function public.set_service_request_completion_date()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'completed'
     and old.status is distinct from new.status
     and new.completion_date is null then
    new.completion_date := now();
  end if;
  return new;
end;
$$;

drop trigger if exists set_service_request_completion_date_trigger on public.service_requests;
create trigger set_service_request_completion_date_trigger
  before update of status on public.service_requests
  for each row execute function public.set_service_request_completion_date();

drop trigger if exists set_service_requests_updated_at on public.service_requests;
create trigger set_service_requests_updated_at
  before update on public.service_requests
  for each row execute function public.set_updated_at();

create index if not exists service_requests_owner_id_idx
  on public.service_requests (owner_id);
create index if not exists service_requests_assigned_contractor_id_idx
  on public.service_requests (assigned_contractor_id);
create index if not exists service_requests_status_idx
  on public.service_requests (status);
create index if not exists service_requests_category_idx
  on public.service_requests (category);
-- partial index for the open-marketplace browse query (contractors looking for work)
create index if not exists service_requests_open_community_idx
  on public.service_requests (status, created_at desc)
  where assigned_contractor_id is null and community_visible = true;
create index if not exists service_requests_created_at_idx
  on public.service_requests (created_at desc);
create index if not exists service_requests_owner_status_idx
  on public.service_requests (owner_id, status);
-- GIN index for photo_urls array queries
create index if not exists service_requests_photo_urls_gin_idx
  on public.service_requests using gin (photo_urls);

alter table public.service_requests enable row level security;

-- owner always has full access to their requests
drop policy if exists "requests_owner_all" on public.service_requests;
create policy "requests_owner_all" on public.service_requests
  for all
  using  (auth.uid() = owner_id or public.is_admin())
  with check (auth.uid() = owner_id or public.is_admin());

-- assigned contractor: read + update their own requests
drop policy if exists "requests_assigned_contractor_select" on public.service_requests;
create policy "requests_assigned_contractor_select" on public.service_requests
  for select using (auth.uid() = assigned_contractor_id);

drop policy if exists "requests_assigned_contractor_update" on public.service_requests;
create policy "requests_assigned_contractor_update" on public.service_requests
  for update
  using  (auth.uid() = assigned_contractor_id)
  with check (auth.uid() = assigned_contractor_id);

-- any contractor can browse open (unassigned) requests
drop policy if exists "requests_open_contractor_view" on public.service_requests;
create policy "requests_open_contractor_view" on public.service_requests
  for select using (
    status in ('pending_review', 'in_queue')
    and assigned_contractor_id is null
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'contractor'
    )
  );

-- contractor can self-assign / claim an open request
drop policy if exists "requests_contractor_claim" on public.service_requests;
create policy "requests_contractor_claim" on public.service_requests
  for update
  using (
    status in ('pending_review', 'in_queue')
    and assigned_contractor_id is null
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'contractor'
    )
  )
  with check (auth.uid() = assigned_contractor_id);

-- ============================================================
-- TABLE: messages
-- In-platform threaded chat; each thread is scoped to one
-- service_request (job_id).
-- ============================================================

create table if not exists public.messages (
  id           uuid primary key default gen_random_uuid(),
  job_id       uuid not null references public.service_requests(id) on delete cascade,
  sender_id    uuid not null references auth.users(id) on delete cascade,
  recipient_id uuid not null references auth.users(id) on delete cascade,
  content      text not null,
  read_at      timestamptz,
  created_at   timestamptz not null default now()
);

create index if not exists messages_job_id_idx       on public.messages (job_id);
create index if not exists messages_sender_id_idx    on public.messages (sender_id);
create index if not exists messages_recipient_id_idx on public.messages (recipient_id);
create index if not exists messages_created_at_idx   on public.messages (created_at desc);
-- partial index: fast unread count per thread
create index if not exists messages_job_unread_idx
  on public.messages (job_id, recipient_id)
  where read_at is null;

alter table public.messages enable row level security;

drop policy if exists "messages_participants_select" on public.messages;
create policy "messages_participants_select" on public.messages
  for select using (
    auth.uid() = sender_id
    or auth.uid() = recipient_id
    or public.is_admin()
  );

drop policy if exists "messages_sender_insert" on public.messages;
create policy "messages_sender_insert" on public.messages
  for insert with check (auth.uid() = sender_id or public.is_admin());

drop policy if exists "messages_recipient_update" on public.messages;
create policy "messages_recipient_update" on public.messages
  for update
  using  (auth.uid() = recipient_id or public.is_admin())
  with check (auth.uid() = recipient_id or public.is_admin());

-- ============================================================
-- TABLE: notifications
-- In-app notification feed.  Can be triggered by API routes or
-- Postgres triggers.  message / body columns are kept in sync.
-- ============================================================

create table if not exists public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  -- 'message' | 'status_change' | 'payment' | 'match' | 'document' | 'system'
  type       text,
  title      text not null,
  message    text,           -- canonical body text
  body       text,           -- legacy alias kept in sync with message
  project_id uuid references public.service_requests(id) on delete set null,
  read       boolean not null default false,
  link       text,
  metadata   jsonb,
  created_at timestamptz not null default now()
);

-- keep message / body mirrors in sync
create or replace function public.sync_notification_message_body()
returns trigger
language plpgsql
as $$
begin
  if new.body is null and new.message is not null then
    new.body := new.message;
  elsif new.message is null and new.body is not null then
    new.message := new.body;
  end if;
  return new;
end;
$$;

drop trigger if exists sync_notification_message_body_trigger on public.notifications;
create trigger sync_notification_message_body_trigger
  before insert or update on public.notifications
  for each row execute function public.sync_notification_message_body();

create index if not exists notifications_user_id_idx
  on public.notifications (user_id, read, created_at desc);
create index if not exists notifications_project_id_idx
  on public.notifications (project_id);
-- partial index: fast unread count
create index if not exists notifications_unread_idx
  on public.notifications (user_id)
  where read = false;

alter table public.notifications enable row level security;

drop policy if exists "notifications_self_select" on public.notifications;
create policy "notifications_self_select" on public.notifications
  for select using (auth.uid() = user_id);

-- allow system / admin inserts and notifications targeting a project participant
drop policy if exists "notifications_insert" on public.notifications;
create policy "notifications_insert" on public.notifications
  for insert with check (
    auth.uid() = user_id
    or public.is_admin()
    or (
      project_id is not null
      and exists (
        select 1 from public.service_requests sr
        where sr.id = project_id
          and auth.uid() in (sr.owner_id, sr.assigned_contractor_id)
          and user_id   in (sr.owner_id, sr.assigned_contractor_id)
      )
    )
  );

drop policy if exists "notifications_update_own" on public.notifications;
create policy "notifications_update_own" on public.notifications
  for update
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "notifications_delete_own" on public.notifications;
create policy "notifications_delete_own" on public.notifications
  for delete using (auth.uid() = user_id);

-- ============================================================
-- TABLE: payments
-- Stripe payment records: dispatch fees, invoice payments,
-- and claim fees.  Linked to a service_request, not a job.
-- ============================================================

create table if not exists public.payments (
  id                       uuid primary key default gen_random_uuid(),
  request_id               uuid not null references public.service_requests(id) on delete cascade,
  payer_id                 uuid not null references auth.users(id),
  contractor_id            uuid not null references auth.users(id),
  type                     public.payment_type not null,
  amount_cents             integer not null check (amount_cents > 0),
  application_fee_cents    integer not null check (application_fee_cents >= 0),
  stripe_session_id        text,
  stripe_payment_intent_id text,
  status                   public.payment_status not null default 'pending',
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

drop trigger if exists set_payments_updated_at on public.payments;
create trigger set_payments_updated_at
  before update on public.payments
  for each row execute function public.set_updated_at();

create index if not exists payments_request_id_idx
  on public.payments (request_id);
create index if not exists payments_payer_id_idx
  on public.payments (payer_id);
create index if not exists payments_contractor_id_idx
  on public.payments (contractor_id);
create index if not exists payments_stripe_session_id_idx
  on public.payments (stripe_session_id);
create index if not exists payments_stripe_payment_intent_id_idx
  on public.payments (stripe_payment_intent_id);
-- composite index for the double-charge guard query
create index if not exists payments_request_type_status_idx
  on public.payments (request_id, type, status);

alter table public.payments enable row level security;

drop policy if exists "payments_participants_select" on public.payments;
create policy "payments_participants_select" on public.payments
  for select using (
    auth.uid() = payer_id
    or auth.uid() = contractor_id
    or public.is_admin()
  );

drop policy if exists "payments_payer_insert" on public.payments;
create policy "payments_payer_insert" on public.payments
  for insert with check (auth.uid() = payer_id or public.is_admin());

-- webhook / admin updates
drop policy if exists "payments_admin_update" on public.payments;
create policy "payments_admin_update" on public.payments
  for update using (public.is_admin());

-- ============================================================
-- TABLE: jobs
-- Structured job postings with a formal accept/decline workflow
-- (distinct from the lighter-weight service_requests flow).
-- client_id / contractor_id both reference profiles.id.
-- ============================================================

create table if not exists public.jobs (
  id             uuid primary key default gen_random_uuid(),
  client_id      uuid not null references public.profiles(id) on delete cascade,
  property_id    uuid references public.properties(id) on delete set null,
  service_type   text not null,
  urgency        public.job_urgency not null default 'routine',
  description    text,
  budget_ceiling numeric(10,2),
  status         public.job_status not null default 'open',
  contractor_id  uuid references public.profiles(id) on delete set null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Ensure FK names expected by the app's Supabase join syntax
alter table public.jobs
  drop constraint if exists jobs_client_id_fkey;
alter table public.jobs
  add constraint jobs_client_id_fkey
  foreign key (client_id) references public.profiles(id) on delete cascade;

alter table public.jobs
  drop constraint if exists jobs_contractor_id_fkey;
alter table public.jobs
  add constraint jobs_contractor_id_fkey
  foreign key (contractor_id) references public.profiles(id) on delete set null;

drop trigger if exists set_jobs_updated_at on public.jobs;
create trigger set_jobs_updated_at
  before update on public.jobs
  for each row execute function public.set_updated_at();

create index if not exists jobs_client_id_idx     on public.jobs (client_id);
create index if not exists jobs_contractor_id_idx on public.jobs (contractor_id);
create index if not exists jobs_status_idx        on public.jobs (status);
create index if not exists jobs_property_id_idx   on public.jobs (property_id);

alter table public.jobs enable row level security;

drop policy if exists "jobs_participants_or_admin" on public.jobs;
create policy "jobs_participants_or_admin" on public.jobs
  for all
  using (
    auth.uid() = client_id
    or auth.uid() = contractor_id
    or public.is_admin()
  )
  with check (
    auth.uid() = client_id
    or auth.uid() = contractor_id
    or public.is_admin()
  );

-- ============================================================
-- TABLE: matches
-- Contractor offers on jobs.  Contractor accepts or declines.
-- ============================================================

create table if not exists public.matches (
  id             uuid primary key default gen_random_uuid(),
  job_id         uuid not null references public.jobs(id) on delete cascade,
  contractor_id  uuid not null references public.profiles(id) on delete cascade,
  offered_at     timestamptz not null default now(),
  response       public.match_response,
  responded_at   timestamptz
);

create index if not exists matches_job_id_idx       on public.matches (job_id);
create index if not exists matches_contractor_id_idx on public.matches (contractor_id);

alter table public.matches enable row level security;

drop policy if exists "matches_participants_select" on public.matches;
create policy "matches_participants_select" on public.matches
  for select using (
    public.is_admin()
    or auth.uid() = contractor_id
    or exists (
      select 1 from public.jobs j
      where j.id = matches.job_id
        and (auth.uid() = j.client_id or auth.uid() = j.contractor_id)
    )
  );

drop policy if exists "matches_insert" on public.matches;
create policy "matches_insert" on public.matches
  for insert with check (auth.uid() is not null or public.is_admin());

drop policy if exists "matches_contractor_respond" on public.matches;
create policy "matches_contractor_respond" on public.matches
  for update
  using  (auth.uid() = contractor_id or public.is_admin())
  with check (auth.uid() = contractor_id or public.is_admin());

-- ============================================================
-- TABLE: job_status_history
-- Immutable audit log of every job status transition.
-- ============================================================

create table if not exists public.job_status_history (
  id         uuid primary key default gen_random_uuid(),
  job_id     uuid not null references public.jobs(id) on delete cascade,
  status     public.job_status not null,
  changed_at timestamptz not null default now(),
  changed_by text not null default 'system'
);

create index if not exists job_status_history_job_id_idx
  on public.job_status_history (job_id);
create index if not exists job_status_history_changed_at_idx
  on public.job_status_history (changed_at desc);

alter table public.job_status_history enable row level security;

drop policy if exists "job_status_history_participants_select" on public.job_status_history;
create policy "job_status_history_participants_select" on public.job_status_history
  for select using (
    public.is_admin()
    or exists (
      select 1 from public.jobs j
      where j.id = job_status_history.job_id
        and (auth.uid() = j.client_id or auth.uid() = j.contractor_id)
    )
  );

drop policy if exists "job_status_history_insert" on public.job_status_history;
create policy "job_status_history_insert" on public.job_status_history
  for insert with check (auth.uid() is not null or public.is_admin());

-- ============================================================
-- TABLE: invoices
-- Job-level billing records, linked to Stripe Invoices.
-- contractor_id / client_id reference profiles.id.
-- ============================================================

create table if not exists public.invoices (
  id                 uuid primary key default gen_random_uuid(),
  job_id             uuid not null references public.jobs(id) on delete cascade,
  contractor_id      uuid not null references public.profiles(id),
  client_id          uuid not null references public.profiles(id),
  -- line_items: [{description, quantity, unit_price, total}]
  line_items         jsonb not null default '[]',
  subtotal           numeric(10,2) not null default 0 check (subtotal   >= 0),
  nexus_fee          numeric(10,2) not null default 0 check (nexus_fee  >= 0),
  total              numeric(10,2) not null default 0 check (total      >= 0),
  fee_rate           numeric(4,3)  not null default 0.25
                       check (fee_rate >= 0 and fee_rate <= 1),
  urgency            public.job_urgency not null default 'routine',
  status             public.invoice_status not null default 'draft',
  stripe_invoice_id  text,
  stripe_payment_url text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

drop trigger if exists set_invoices_updated_at on public.invoices;
create trigger set_invoices_updated_at
  before update on public.invoices
  for each row execute function public.set_updated_at();

create index if not exists invoices_contractor_id_idx on public.invoices (contractor_id);
create index if not exists invoices_client_id_idx     on public.invoices (client_id);
create index if not exists invoices_job_id_idx        on public.invoices (job_id);
create index if not exists invoices_status_idx        on public.invoices (status);
create unique index if not exists invoices_stripe_invoice_id_unique_idx
  on public.invoices (stripe_invoice_id)
  where stripe_invoice_id is not null;

alter table public.invoices enable row level security;

drop policy if exists "invoices_participants_select" on public.invoices;
create policy "invoices_participants_select" on public.invoices
  for select using (
    auth.uid() = contractor_id
    or auth.uid() = client_id
    or public.is_admin()
  );

drop policy if exists "invoices_contractor_insert" on public.invoices;
create policy "invoices_contractor_insert" on public.invoices
  for insert with check (auth.uid() = contractor_id or public.is_admin());

drop policy if exists "invoices_contractor_update" on public.invoices;
create policy "invoices_contractor_update" on public.invoices
  for update
  using  (auth.uid() = contractor_id or public.is_admin())
  with check (auth.uid() = contractor_id or public.is_admin());

-- ============================================================
-- TABLE: billing_subscriptions
-- Mirrors Stripe subscription state for the app's billing UI.
-- Kept up-to-date by the Stripe webhook handler.
-- ============================================================

create table if not exists public.billing_subscriptions (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null references public.profiles(id) on delete cascade,
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

drop trigger if exists set_billing_subscriptions_updated_at on public.billing_subscriptions;
create trigger set_billing_subscriptions_updated_at
  before update on public.billing_subscriptions
  for each row execute function public.set_updated_at();

create index if not exists billing_subscriptions_user_id_idx
  on public.billing_subscriptions (user_id);
create index if not exists billing_subscriptions_customer_idx
  on public.billing_subscriptions (stripe_customer_id);
create index if not exists billing_subscriptions_status_idx
  on public.billing_subscriptions (status);

alter table public.billing_subscriptions enable row level security;

drop policy if exists "billing_subscriptions_self_or_admin" on public.billing_subscriptions;
create policy "billing_subscriptions_self_or_admin" on public.billing_subscriptions
  for all
  using  (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

-- ============================================================
-- TABLE: reviews
-- Star ratings + written reviews after job completion.
-- Automatically recomputes profiles.average_rating.
-- ============================================================

create table if not exists public.reviews (
  id            uuid primary key default gen_random_uuid(),
  request_id    uuid not null references public.service_requests(id) on delete cascade,
  contractor_id uuid not null references public.profiles(id) on delete cascade,
  reviewer_id   uuid not null references public.profiles(id) on delete cascade,
  rating        integer not null check (rating between 1 and 5),
  comment       text,
  created_at    timestamptz not null default now(),
  -- one review per completed request per reviewer
  constraint reviews_request_reviewer_unique unique (request_id, reviewer_id)
);

-- recompute contractor rating after every review change
create or replace function public.update_contractor_rating()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_contractor_id uuid;
begin
  v_contractor_id := coalesce(new.contractor_id, old.contractor_id);
  update public.profiles
  set
    average_rating = coalesce(
      (select round(avg(rating)::numeric, 2)
       from public.reviews
       where contractor_id = v_contractor_id),
      0
    ),
    reviews_count = (
      select count(*)::integer
      from public.reviews
      where contractor_id = v_contractor_id
    )
  where id = v_contractor_id;
  return coalesce(new, old);
end;
$$;

drop trigger if exists update_contractor_rating_trigger on public.reviews;
create trigger update_contractor_rating_trigger
  after insert or update or delete on public.reviews
  for each row execute function public.update_contractor_rating();

create index if not exists reviews_contractor_id_idx on public.reviews (contractor_id);
create index if not exists reviews_reviewer_id_idx   on public.reviews (reviewer_id);
create index if not exists reviews_request_id_idx    on public.reviews (request_id);
create index if not exists reviews_rating_idx        on public.reviews (contractor_id, rating);

alter table public.reviews enable row level security;

-- reviews are publicly readable (displayed on contractor cards)
drop policy if exists "reviews_public_read" on public.reviews;
create policy "reviews_public_read" on public.reviews
  for select using (true);

-- only the homeowner who owns the completed request may submit a review
drop policy if exists "reviews_owner_insert" on public.reviews;
create policy "reviews_owner_insert" on public.reviews
  for insert with check (
    auth.uid() = reviewer_id
    and exists (
      select 1 from public.service_requests sr
      where sr.id = request_id
        and sr.owner_id = auth.uid()
        and sr.status = 'completed'
    )
  );

drop policy if exists "reviews_reviewer_update" on public.reviews;
create policy "reviews_reviewer_update" on public.reviews
  for update
  using  (auth.uid() = reviewer_id or public.is_admin())
  with check (auth.uid() = reviewer_id or public.is_admin());

-- ============================================================
-- TABLE: contractor_availability
-- Weekly or date-specific time-slot schedule for contractors.
-- Homeowners use this when picking consultation_date.
-- ============================================================

create table if not exists public.contractor_availability (
  id            uuid primary key default gen_random_uuid(),
  contractor_id uuid not null references public.profiles(id) on delete cascade,
  -- 0=Sun … 6=Sat for recurring weekly slots; null when specific_date is set
  day_of_week   smallint check (day_of_week between 0 and 6),
  -- overrides day_of_week: one-off date override (e.g. holiday blackout)
  specific_date date,
  start_time    time not null,
  end_time      time not null,
  is_available  boolean not null default true,
  created_at    timestamptz not null default now(),
  -- exactly one of day_of_week or specific_date must be set
  check (
    (day_of_week is not null and specific_date is null)
    or (day_of_week is null  and specific_date is not null)
  )
);

create index if not exists contractor_availability_contractor_id_idx
  on public.contractor_availability (contractor_id);
create index if not exists contractor_availability_date_idx
  on public.contractor_availability (specific_date)
  where specific_date is not null;
create index if not exists contractor_availability_day_idx
  on public.contractor_availability (contractor_id, day_of_week)
  where day_of_week is not null;

alter table public.contractor_availability enable row level security;

drop policy if exists "contractor_availability_owner_manage" on public.contractor_availability;
create policy "contractor_availability_owner_manage" on public.contractor_availability
  for all
  using  (auth.uid() = contractor_id or public.is_admin())
  with check (auth.uid() = contractor_id or public.is_admin());

drop policy if exists "contractor_availability_public_read" on public.contractor_availability;
create policy "contractor_availability_public_read" on public.contractor_availability
  for select using (is_available = true);

-- ============================================================
-- TABLE: stripe_events
-- Idempotency store for Stripe webhook payloads.
-- Prevents double-processing of the same event.
-- id = Stripe event ID (evt_...)
-- ============================================================

create table if not exists public.stripe_events (
  id           text primary key,   -- Stripe evt_xxx
  type         text not null,
  processed_at timestamptz not null default now(),
  payload      jsonb
);

create index if not exists stripe_events_type_idx
  on public.stripe_events (type);
create index if not exists stripe_events_processed_at_idx
  on public.stripe_events (processed_at desc);

alter table public.stripe_events enable row level security;

-- only the service role (webhooks) can access this table
drop policy if exists "stripe_events_no_user_access" on public.stripe_events;
create policy "stripe_events_no_user_access" on public.stripe_events
  for all using (false);

-- ============================================================
-- VECTOR EMBEDDING TABLES  (requires pgvector extension)
-- Semantic similarity search for contractor ↔ request matching
-- and for the AI insights endpoint.
-- ============================================================

do $$
begin
  -- only create if vector extension is available
  if not exists (
    select 1 from pg_extension where extname = 'vector'
  ) then
    raise notice 'pgvector not installed — skipping embedding tables';
    return;
  end if;

  -- request_embeddings: one embedding per service_request
  execute $sql$
    create table if not exists public.request_embeddings (
      id         uuid primary key references public.service_requests(id) on delete cascade,
      embedding  extensions.vector(1536),   -- OpenAI text-embedding-3-small
      model      text not null default 'text-embedding-3-small',
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create index if not exists request_embeddings_hnsw_idx
      on public.request_embeddings
      using hnsw (embedding extensions.vector_cosine_ops)
      with (m = 16, ef_construction = 64);
  $sql$;

  -- contractor_embeddings: one embedding per contractor profile
  execute $sql$
    create table if not exists public.contractor_embeddings (
      id         uuid primary key references public.profiles(id) on delete cascade,
      embedding  extensions.vector(1536),
      model      text not null default 'text-embedding-3-small',
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create index if not exists contractor_embeddings_hnsw_idx
      on public.contractor_embeddings
      using hnsw (embedding extensions.vector_cosine_ops)
      with (m = 16, ef_construction = 64);
  $sql$;

exception when others then
  raise notice 'Could not create vector tables: %', sqlerrm;
end;
$$;

-- ============================================================
-- UTILITY FUNCTIONS
-- ============================================================

-- Returns the number of active projects currently assigned to a contractor.
-- Used by the matching algorithm to avoid over-assigning.
create or replace function public.get_active_project_count(p_contractor_id uuid)
returns integer
language sql
security definer
set search_path = public
stable
as $$
  select count(*)::integer
  from public.service_requests
  where assigned_contractor_id = p_contractor_id
    and status in ('assigned', 'consultation_scheduled', 'in_progress');
$$;

grant execute on function public.get_active_project_count to authenticated, service_role;

-- Returns aggregate performance stats for a contractor as JSON.
-- Used by the portal bootstrap and the admin dashboard.
create or replace function public.get_contractor_stats(p_contractor_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  v_active    integer;
  v_completed integer;
  v_rating    numeric;
  v_reviews   integer;
begin
  select count(*)::integer into v_active
  from public.service_requests
  where assigned_contractor_id = p_contractor_id
    and status in ('assigned', 'consultation_scheduled', 'in_progress');

  select count(*)::integer into v_completed
  from public.service_requests
  where assigned_contractor_id = p_contractor_id
    and status = 'completed';

  select average_rating, reviews_count
  into   v_rating, v_reviews
  from   public.profiles
  where  id = p_contractor_id;

  return jsonb_build_object(
    'active_projects',    v_active,
    'completed_projects', v_completed,
    'average_rating',     coalesce(v_rating, 0),
    'reviews_count',      coalesce(v_reviews, 0)
  );
end;
$$;

grant execute on function public.get_contractor_stats to authenticated, service_role;

-- Returns platform-wide metrics (admin only).
create or replace function public.get_platform_stats()
returns jsonb
language plpgsql
security definer
set search_path = public
stable
as $$
begin
  if not public.is_admin() then
    raise exception 'Permission denied';
  end if;

  return jsonb_build_object(
    'total_users',         (select count(*)::integer from public.profiles),
    'total_contractors',   (select count(*)::integer from public.profiles where role = 'contractor'),
    'total_homeowners',    (select count(*)::integer from public.profiles where role = 'homeowner'),
    'open_requests',       (select count(*)::integer from public.service_requests
                            where status in ('pending_review', 'in_queue')),
    'active_requests',     (select count(*)::integer from public.service_requests
                            where status in ('assigned', 'consultation_scheduled', 'in_progress')),
    'completed_requests',  (select count(*)::integer from public.service_requests
                            where status = 'completed'),
    'total_revenue_cents', (select coalesce(sum(amount_cents), 0)::bigint from public.payments
                            where status = 'paid')
  );
end;
$$;

grant execute on function public.get_platform_stats to authenticated, service_role;

-- Semantic contractor match using pgvector cosine similarity.
-- Falls back to an empty result set when pgvector is unavailable.
create or replace function public.match_contractors_for_request(
  p_request_id   uuid,
  p_match_count  int     default 5,
  p_min_score    float   default 0.50
)
returns table (
  contractor_id      uuid,
  full_name          text,
  email              text,
  service_categories text[],
  average_rating     numeric,
  reviews_count      integer,
  similarity         float
)
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  v_extension_exists boolean;
  v_query_embedding  extensions.vector(1536);
begin
  -- bail out gracefully if pgvector is not installed
  select exists(select 1 from pg_extension where extname = 'vector')
  into   v_extension_exists;

  if not v_extension_exists then
    return;
  end if;

  -- fetch the embedding stored for this request
  execute format(
    'select embedding from public.request_embeddings where id = $1'
  ) using p_request_id into v_query_embedding;

  if v_query_embedding is null then
    return;
  end if;

  return query
    execute format($q$
      select
        p.id                 as contractor_id,
        p.full_name,
        p.email,
        p.service_categories,
        p.average_rating,
        p.reviews_count,
        (1 - (ce.embedding <=> $1))::float as similarity
      from   public.contractor_embeddings ce
      join   public.profiles p on p.id = ce.id
      where  p.role     = 'contractor'
        and  p.is_active = true
        and  (1 - (ce.embedding <=> $1)) >= $2
      order by ce.embedding <=> $1
      limit $3
    $q$)
    using v_query_embedding, p_min_score, p_match_count;
end;
$$;

grant execute on function public.match_contractors_for_request to authenticated, service_role;

-- Schema health check — returns missing tables / functions.
-- Called by GET /api/health to verify the database is properly provisioned.
create or replace function public.schema_health_check()
returns jsonb
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  required_tables text[] := array[
    'profiles', 'properties', 'service_requests', 'messages',
    'notifications', 'documents', 'payments',
    'jobs', 'invoices', 'billing_subscriptions', 'reviews',
    'matches', 'job_status_history', 'contractor_availability',
    'stripe_events'
  ];
  required_functions text[] := array[
    'set_updated_at', 'handle_new_user', 'is_admin',
    'get_contractor_stats', 'get_platform_stats',
    'schema_health_check'
  ];
  missing_tables    text[] := '{}';
  missing_functions text[] := '{}';
  t text;
  f text;
begin
  foreach t in array required_tables loop
    if not exists (
      select 1 from information_schema.tables
      where table_schema = 'public' and table_name = t
    ) then
      missing_tables := array_append(missing_tables, t);
    end if;
  end loop;

  foreach f in array required_functions loop
    if not exists (
      select 1 from pg_proc p
      join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public' and p.proname = f
    ) then
      missing_functions := array_append(missing_functions, f);
    end if;
  end loop;

  return jsonb_build_object(
    'ok',
    coalesce(array_length(missing_tables, 1), 0) = 0
      and coalesce(array_length(missing_functions, 1), 0) = 0,
    'missing_tables',    missing_tables,
    'missing_functions', missing_functions
  );
end;
$$;

grant execute on function public.schema_health_check() to anon, authenticated, service_role;

-- ============================================================
-- VIEWS
-- ============================================================

-- Active-request dashboard (admin / property-manager portal).
-- Returns every in-flight request with flattened owner + contractor info.
create or replace view public.v_active_requests as
select
  sr.id,
  sr.category,
  sr.title,
  sr.description,
  sr.address,
  sr.city,
  sr.state,
  sr.status,
  sr.urgency,
  sr.budget_max,
  sr.invoice_amount,
  sr.invoice_paid,
  sr.community_visible,
  sr.created_at,
  sr.consultation_date,
  o.full_name  as owner_name,
  o.email      as owner_email,
  o.phone      as owner_phone,
  c.full_name  as contractor_name,
  c.email      as contractor_email,
  c.phone      as contractor_phone
from  public.service_requests sr
join  public.profiles o on o.id = sr.owner_id
left join public.profiles c on c.id = sr.assigned_contractor_id;

-- Contractor marketplace cards (homepage / browse-contractors page).
create or replace view public.v_contractor_cards as
select
  p.id,
  p.full_name,
  p.company,
  p.bio,
  p.service_categories,
  p.service_area,
  p.average_rating,
  p.reviews_count,
  p.avatar_url,
  p.photo_url,
  p.stripe_connect_status,
  cp.service_radius_miles,
  cp.is_verified,
  cp.is_available
from  public.profiles p
join  public.contractor_profiles cp on cp.user_id = p.id
where p.role = 'contractor'
  and p.is_active = true;

-- ============================================================
-- REALTIME PUBLICATIONS
-- Enable row-level change events for messaging, notifications,
-- and project status so the frontend can subscribe.
-- ============================================================

-- supabase_realtime publication is created automatically by Supabase;
-- we just add our tables to it.
do $$
begin
  begin
    alter publication supabase_realtime add table public.messages;
  exception when undefined_object then null; end;

  begin
    alter publication supabase_realtime add table public.notifications;
  exception when undefined_object then null; end;

  begin
    alter publication supabase_realtime add table public.service_requests;
  exception when undefined_object then null; end;
end;
$$;

-- ============================================================
-- STORAGE BUCKETS + POLICIES
-- ============================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  -- Public buckets — profile and avatar images readable by anyone
  ('avatars',         'avatars',         true,  5242880,   array['image/jpeg','image/png','image/webp','image/gif']),
  ('profile-photos',  'profile-photos',  true,  10485760,  array['image/jpeg','image/png','image/webp']),
  -- Private buckets — compliance docs and contracts are owner + admin only
  ('compliance-docs', 'compliance-docs', false, 10485760,  array['application/pdf','image/jpeg','image/png']),
  ('contracts',       'contracts',       false, 10485760,  array['application/pdf','image/jpeg','image/png']),
  -- Job photos: authenticated read (participants + admin), owner write
  ('job-photos',      'job-photos',      false, 20971520,  array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

-- public read: avatars
drop policy if exists "avatars_public_read" on storage.objects;
create policy "avatars_public_read" on storage.objects
  for select using (bucket_id = 'avatars');

-- public read: profile photos
drop policy if exists "profile_photos_public_read" on storage.objects;
create policy "profile_photos_public_read" on storage.objects
  for select using (bucket_id = 'profile-photos');

-- authenticated upload into any owned folder (folder[0] = auth.uid())
drop policy if exists "storage_owner_upload" on storage.objects;
create policy "storage_owner_upload" on storage.objects
  for insert with check (
    bucket_id in ('avatars', 'profile-photos', 'compliance-docs', 'contracts', 'job-photos')
    and (
      auth.uid()::text = (storage.foldername(name))[1]
      or public.is_admin()
    )
  );

drop policy if exists "storage_owner_update" on storage.objects;
create policy "storage_owner_update" on storage.objects
  for update using (
    bucket_id in ('avatars', 'profile-photos', 'compliance-docs', 'contracts', 'job-photos')
    and (
      auth.uid()::text = (storage.foldername(name))[1]
      or public.is_admin()
    )
  );

drop policy if exists "storage_owner_delete" on storage.objects;
create policy "storage_owner_delete" on storage.objects
  for delete using (
    bucket_id in ('avatars', 'profile-photos', 'compliance-docs', 'contracts', 'job-photos')
    and (
      auth.uid()::text = (storage.foldername(name))[1]
      or public.is_admin()
    )
  );

-- private bucket read: own folder or admin
drop policy if exists "compliance_docs_authenticated_read" on storage.objects;
create policy "compliance_docs_authenticated_read" on storage.objects
  for select using (
    bucket_id in ('compliance-docs', 'contracts')
    and (
      auth.uid()::text = (storage.foldername(name))[1]
      or public.is_admin()
    )
  );

-- job photos: any authenticated user can read (URLs are shared in messages)
drop policy if exists "job_photos_authenticated_read" on storage.objects;
create policy "job_photos_authenticated_read" on storage.objects
  for select using (
    bucket_id = 'job-photos'
    and auth.uid() is not null
  );
