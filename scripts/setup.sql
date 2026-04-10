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

create index if not exists payments_stripe_session_id_idx
  on public.payments (stripe_session_id);
create index if not exists payments_stripe_payment_intent_id_idx
  on public.payments (stripe_payment_intent_id);

drop trigger if exists set_payments_updated_at on public.payments;
create trigger set_payments_updated_at
  before update on public.payments
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

-- ── compatibility extensions (portal + automation + settings) ────────────────
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists bio text;
alter table public.profiles add column if not exists license_number text;
alter table public.profiles add column if not exists years_in_business integer not null default 0;
alter table public.profiles add column if not exists service_categories text[] not null default '{}';
alter table public.profiles add column if not exists service_area text;
alter table public.profiles add column if not exists average_rating numeric(3,2) not null default 0;
alter table public.profiles add column if not exists reviews_count integer not null default 0;
alter table public.profiles add column if not exists is_active boolean not null default true;
alter table public.profiles add column if not exists notify_messages boolean not null default true;
alter table public.profiles add column if not exists notify_status_changes boolean not null default true;
alter table public.profiles add column if not exists notify_payments boolean not null default false;

alter table public.service_requests add column if not exists title text;
alter table public.service_requests add column if not exists urgency text not null default 'routine';
alter table public.service_requests add column if not exists invoice_amount numeric(10,2);
alter table public.service_requests add column if not exists invoice_paid boolean not null default false;
alter table public.service_requests add column if not exists status_reason text;

create table if not exists public.documents (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  type        text not null,
  file_url    text not null,
  status      text not null default 'pending'
                check (status in ('pending', 'approved', 'rejected')),
  expires_at  timestamptz,
  created_at  timestamptz not null default now()
);

alter table public.documents enable row level security;

drop policy if exists "documents_self_access" on public.documents;
create policy "documents_self_access" on public.documents for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table if not exists public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  title      text not null,
  body       text,
  type       text,
  read       boolean not null default false,
  link       text,
  metadata   jsonb,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

drop policy if exists "notifications_self_access" on public.notifications;
create policy "notifications_self_access" on public.notifications for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists notifications_user_id_idx
  on public.notifications (user_id, read, created_at desc);
