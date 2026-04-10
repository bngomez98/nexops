-- ============================================================
-- Nexus Operations — canonical bootstrap schema
-- ============================================================

-- ── helpers ──────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── profiles ─────────────────────────────────────────────────
create table if not exists public.profiles (
  id                               uuid primary key references auth.users(id) on delete cascade,
  full_name                        text,
  email                            text,
  role                             text not null default 'homeowner'
                                    check (role in ('homeowner', 'property_manager', 'contractor', 'admin')),
  phone                            text,
  company                          text,
  avatar_url                       text,
  photo_url                        text,
  bio                              text,
  license_number                   text,
  years_in_business                integer not null default 0,
  service_categories               text[],
  stripe_customer_id               text,
  stripe_connect_account_id        text,
  stripe_connect_status            text
                                    check (stripe_connect_status in ('pending', 'active', 'restricted')),
  subscription_tier                text default 'free',
  subscription_status              text default 'inactive',
  stripe_subscription_id           text,
  subscription_plan_type           text
                                    check (subscription_plan_type in ('contractor', 'owner')),
  subscription_price_cents         integer
                                    check (subscription_price_cents is null or subscription_price_cents > 0),
  contractor_hourly_rate           numeric(10,2)
                                    check (contractor_hourly_rate is null or contractor_hourly_rate >= 0),
  contractor_minimum_service_fee   numeric(10,2)
                                    check (contractor_minimum_service_fee is null or contractor_minimum_service_fee >= 0),
  created_at                       timestamptz not null default now(),
  updated_at                       timestamptz not null default now()
);

create or replace function public.is_admin(uid uuid default auth.uid())
returns boolean
language plpgsql
security definer
set search_path = public
stable
as $$
begin
  return exists (
    select 1 from public.profiles p
    where p.id = uid
      and p.role = 'admin'
  );
end;
$$;

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin" on public.profiles
for select using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
for insert with check (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin" on public.profiles
for update using (auth.uid() = id or public.is_admin())
with check (auth.uid() = id or public.is_admin());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text;
begin
  v_role := coalesce(new.raw_user_meta_data ->> 'role', 'homeowner');
  if v_role = 'property-manager' then
    v_role := 'property_manager';
  end if;
  if v_role not in ('homeowner', 'property_manager', 'contractor', 'admin') then
    v_role := 'homeowner';
  end if;

  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', null),
    new.email,
    v_role
  )
  on conflict (id) do update
    set full_name = coalesce(excluded.full_name, public.profiles.full_name),
        email = coalesce(excluded.email, public.profiles.email),
        role = coalesce(public.profiles.role, excluded.role);

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

create index if not exists profiles_stripe_connect_account_id_idx
  on public.profiles (stripe_connect_account_id);

-- ── contractor profiles ──────────────────────────────────────
create table if not exists public.contractor_profiles (
  user_id              uuid primary key references auth.users(id) on delete cascade,
  bio                  text,
  service_radius_miles integer not null default 25,
  trade_categories     text[] not null default '{}',
  stripe_account_id    text,
  is_verified          boolean not null default false,
  is_available         boolean not null default true,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

alter table public.contractor_profiles enable row level security;

drop policy if exists "contractor_profiles_self_or_admin" on public.contractor_profiles;
create policy "contractor_profiles_self_or_admin" on public.contractor_profiles
for all using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

drop trigger if exists set_contractor_profiles_updated_at on public.contractor_profiles;
create trigger set_contractor_profiles_updated_at
before update on public.contractor_profiles
for each row execute function public.set_updated_at();

-- ── properties ───────────────────────────────────────────────
create table if not exists public.properties (
  id         uuid primary key default gen_random_uuid(),
  owner_id   uuid not null references auth.users(id) on delete cascade,
  address    text not null,
  city       text not null default 'Topeka',
  state      text not null default 'KS',
  zip_code   text not null,
  lat        double precision,
  lng        double precision,
  nickname   text,
  created_at timestamptz not null default now()
);

alter table public.properties enable row level security;

drop policy if exists "properties_owner_or_admin" on public.properties;
create policy "properties_owner_or_admin" on public.properties
for all using (auth.uid() = owner_id or public.is_admin())
with check (auth.uid() = owner_id or public.is_admin());

-- ── service requests ─────────────────────────────────────────
create table if not exists public.service_requests (
  id                           uuid primary key default gen_random_uuid(),
  owner_id                     uuid not null references auth.users(id) on delete cascade,
  property_id                  uuid references public.properties(id) on delete set null,
  category                     text not null,
  description                  text not null,
  budget_min                   numeric(10,2),
  budget_max                   numeric(10,2),
  address                      text not null,
  city                         text not null default 'Topeka',
  state                        text not null default 'KS',
  zip_code                     text not null default '66603',
  preferred_dates              text,
  additional_notes             text,
  photo_urls                   text[],
  status                       text not null default 'pending_review'
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
  status_reason                text,
  assigned_contractor_id       uuid references auth.users(id) on delete set null,
  consultation_date            timestamptz,
  final_cost                   numeric(10,2),
  completion_date              timestamptz,
  owner_fee_amount_cents       integer not null default 9900,
  contractor_fee_amount_cents  integer not null default 9900,
  owner_fee_paid               boolean not null default false,
  contractor_fee_paid          boolean not null default false,
  invoice_paid                 boolean not null default false,
  created_at                   timestamptz not null default now(),
  updated_at                   timestamptz not null default now()
);

alter table public.service_requests enable row level security;

drop policy if exists "requests_owner_select" on public.service_requests;
create policy "requests_owner_select" on public.service_requests
for select using (auth.uid() = owner_id or public.is_admin());

drop policy if exists "requests_owner_insert" on public.service_requests;
create policy "requests_owner_insert" on public.service_requests
for insert with check (auth.uid() = owner_id or public.is_admin());

drop policy if exists "requests_owner_update" on public.service_requests;
create policy "requests_owner_update" on public.service_requests
for update using (auth.uid() = owner_id or public.is_admin())
with check (auth.uid() = owner_id or public.is_admin());

drop policy if exists "requests_contractor_select" on public.service_requests;
create policy "requests_contractor_select" on public.service_requests
for select using (auth.uid() = assigned_contractor_id or public.is_admin());

drop policy if exists "requests_contractor_update" on public.service_requests;
create policy "requests_contractor_update" on public.service_requests
for update using (auth.uid() = assigned_contractor_id or public.is_admin())
with check (auth.uid() = assigned_contractor_id or public.is_admin());

drop policy if exists "requests_contractor_view_open" on public.service_requests;
create policy "requests_contractor_view_open" on public.service_requests
for select using (
  status in ('pending_review', 'in_queue')
  and assigned_contractor_id is null
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'contractor'
  )
);

drop policy if exists "requests_contractor_claim" on public.service_requests;
create policy "requests_contractor_claim" on public.service_requests
for update using (
  status in ('pending_review', 'in_queue')
  and assigned_contractor_id is null
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'contractor'
  )
) with check (auth.uid() = assigned_contractor_id);

drop trigger if exists set_service_requests_updated_at on public.service_requests;
create trigger set_service_requests_updated_at
before update on public.service_requests
for each row execute function public.set_updated_at();

-- ── messages ─────────────────────────────────────────────────
create table if not exists public.messages (
  id           uuid primary key default gen_random_uuid(),
  job_id       uuid not null references public.service_requests(id) on delete cascade,
  sender_id    uuid not null references auth.users(id) on delete cascade,
  recipient_id uuid not null references auth.users(id) on delete cascade,
  content      text not null,
  read_at      timestamptz,
  created_at   timestamptz not null default now()
);

alter table public.messages enable row level security;

drop policy if exists "messages_select_participants_or_admin" on public.messages;
create policy "messages_select_participants_or_admin" on public.messages
for select using (
  auth.uid() = sender_id
  or auth.uid() = recipient_id
  or public.is_admin()
);

drop policy if exists "messages_insert_sender_or_admin" on public.messages;
create policy "messages_insert_sender_or_admin" on public.messages
for insert with check (auth.uid() = sender_id or public.is_admin());

drop policy if exists "messages_update_recipient_or_admin" on public.messages;
create policy "messages_update_recipient_or_admin" on public.messages
for update using (auth.uid() = recipient_id or public.is_admin())
with check (auth.uid() = recipient_id or public.is_admin());

-- ── documents ────────────────────────────────────────────────
create table if not exists public.documents (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  type       text not null,
  file_url   text not null,
  expires_at timestamptz,
  verified   boolean not null default false,
  status     text not null default 'pending'
             check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.documents enable row level security;

drop policy if exists "documents_owner_or_admin_select" on public.documents;
create policy "documents_owner_or_admin_select" on public.documents
for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "documents_owner_or_admin_insert" on public.documents;
create policy "documents_owner_or_admin_insert" on public.documents
for insert with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "documents_owner_or_admin_update" on public.documents;
create policy "documents_owner_or_admin_update" on public.documents
for update using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

create index if not exists documents_user_id_idx on public.documents(user_id);
create index if not exists documents_expires_at_idx on public.documents(expires_at);

drop trigger if exists set_documents_updated_at on public.documents;
create trigger set_documents_updated_at
before update on public.documents
for each row execute function public.set_updated_at();

-- ── notifications ────────────────────────────────────────────
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

drop policy if exists "notifications_owner_or_admin" on public.notifications;
create policy "notifications_owner_or_admin" on public.notifications
for all using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

create index if not exists notifications_user_id_idx
  on public.notifications(user_id, read, created_at desc);

-- ── payments ─────────────────────────────────────────────────
create table if not exists public.payments (
  id                       uuid primary key default gen_random_uuid(),
  request_id               uuid not null references public.service_requests(id) on delete cascade,
  payer_id                 uuid not null references auth.users(id),
  contractor_id            uuid not null references auth.users(id),
  type                     text not null check (type in ('dispatch', 'invoice', 'claim_fee')),
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

drop policy if exists "payments_select_participants_or_admin" on public.payments;
create policy "payments_select_participants_or_admin" on public.payments
for select using (
  auth.uid() = payer_id
  or auth.uid() = contractor_id
  or public.is_admin()
);

drop policy if exists "payments_insert_payer_or_admin" on public.payments;
create policy "payments_insert_payer_or_admin" on public.payments
for insert with check (auth.uid() = payer_id or public.is_admin());

create index if not exists payments_stripe_session_id_idx
  on public.payments (stripe_session_id);
create index if not exists payments_stripe_payment_intent_id_idx
  on public.payments (stripe_payment_intent_id);

drop trigger if exists set_payments_updated_at on public.payments;
create trigger set_payments_updated_at
before update on public.payments
for each row execute function public.set_updated_at();

-- ── jobs / matching / invoices ───────────────────────────────
create table if not exists public.jobs (
  id            uuid primary key default gen_random_uuid(),
  client_id     uuid not null references auth.users(id) on delete cascade,
  property_id   uuid references public.properties(id) on delete set null,
  service_type  text not null,
  urgency       text not null default 'routine',
  description   text,
  budget_ceiling numeric(10,2),
  status        text not null default 'open',
  contractor_id uuid references auth.users(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.jobs enable row level security;

drop policy if exists "jobs_participants_or_admin" on public.jobs;
create policy "jobs_participants_or_admin" on public.jobs
for all using (
  auth.uid() = client_id
  or auth.uid() = contractor_id
  or public.is_admin()
) with check (
  auth.uid() = client_id
  or auth.uid() = contractor_id
  or public.is_admin()
);

create index if not exists jobs_client_id_idx on public.jobs(client_id);
create index if not exists jobs_contractor_id_idx on public.jobs(contractor_id);
create index if not exists jobs_status_idx on public.jobs(status);

drop trigger if exists set_jobs_updated_at on public.jobs;
create trigger set_jobs_updated_at
before update on public.jobs
for each row execute function public.set_updated_at();

create table if not exists public.matches (
  id             uuid primary key default gen_random_uuid(),
  job_id         uuid not null references public.jobs(id) on delete cascade,
  contractor_id  uuid not null references auth.users(id) on delete cascade,
  offered_at     timestamptz not null default now(),
  response       text,
  responded_at   timestamptz
);

alter table public.matches enable row level security;

drop policy if exists "matches_participants_or_admin_select" on public.matches;
create policy "matches_participants_or_admin_select" on public.matches
for select using (
  public.is_admin()
  or exists (
    select 1 from public.jobs j
    where j.id = matches.job_id
      and (auth.uid() = j.client_id or auth.uid() = j.contractor_id)
  )
);

drop policy if exists "matches_authenticated_insert" on public.matches;
create policy "matches_authenticated_insert" on public.matches
for insert with check (auth.uid() is not null);

create table if not exists public.job_status_history (
  id          uuid primary key default gen_random_uuid(),
  job_id      uuid not null references public.jobs(id) on delete cascade,
  status      text not null,
  changed_at  timestamptz not null default now(),
  changed_by  text not null default 'system'
);

alter table public.job_status_history enable row level security;

drop policy if exists "job_status_history_participants_or_admin_select" on public.job_status_history;
create policy "job_status_history_participants_or_admin_select" on public.job_status_history
for select using (
  public.is_admin()
  or exists (
    select 1 from public.jobs j
    where j.id = job_status_history.job_id
      and (auth.uid() = j.client_id or auth.uid() = j.contractor_id)
  )
);

drop policy if exists "job_status_history_authenticated_insert" on public.job_status_history;
create policy "job_status_history_authenticated_insert" on public.job_status_history
for insert with check (auth.uid() is not null);

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
  status              text not null default 'draft',
  stripe_invoice_id   text,
  stripe_payment_url  text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table public.invoices enable row level security;

drop policy if exists "invoices_participants_or_admin_select" on public.invoices;
create policy "invoices_participants_or_admin_select" on public.invoices
for select using (
  auth.uid() = contractor_id
  or auth.uid() = client_id
  or public.is_admin()
);

drop policy if exists "invoices_contractor_or_admin_insert" on public.invoices;
create policy "invoices_contractor_or_admin_insert" on public.invoices
for insert with check (auth.uid() = contractor_id or public.is_admin());

drop policy if exists "invoices_contractor_or_admin_update" on public.invoices;
create policy "invoices_contractor_or_admin_update" on public.invoices
for update using (auth.uid() = contractor_id or public.is_admin())
with check (auth.uid() = contractor_id or public.is_admin());

create index if not exists invoices_contractor_id_idx on public.invoices(contractor_id);
create index if not exists invoices_client_id_idx on public.invoices(client_id);
create index if not exists invoices_job_id_idx on public.invoices(job_id);

drop trigger if exists set_invoices_updated_at on public.invoices;
create trigger set_invoices_updated_at
before update on public.invoices
for each row execute function public.set_updated_at();

create table if not exists public.billing_subscriptions (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null references auth.users(id) on delete cascade,
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

alter table public.billing_subscriptions enable row level security;

drop policy if exists "billing_subscriptions_owner_or_admin" on public.billing_subscriptions;
create policy "billing_subscriptions_owner_or_admin" on public.billing_subscriptions
for all using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

drop trigger if exists set_billing_subscriptions_updated_at on public.billing_subscriptions;
create trigger set_billing_subscriptions_updated_at
before update on public.billing_subscriptions
for each row execute function public.set_updated_at();

-- ── schema health ────────────────────────────────────────────
create or replace function public.schema_health_check()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  required_tables text[] := array[
    'profiles',
    'service_requests',
    'messages',
    'documents',
    'notifications',
    'payments',
    'jobs',
    'invoices'
  ];
  required_functions text[] := array[
    'set_updated_at',
    'handle_new_user',
    'schema_health_check'
  ];
  missing_tables text[] := '{}';
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
    'missing_tables', missing_tables,
    'missing_functions', missing_functions
  );
end;
$$;

grant execute on function public.schema_health_check() to anon, authenticated, service_role;

-- ── storage buckets + policies ───────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('profile-photos', 'profile-photos', true, 10485760, array['image/jpeg','image/png','image/webp']),
  ('compliance-docs', 'compliance-docs', false, 10485760, array['application/pdf','image/jpeg','image/png']),
  ('contracts', 'contracts', false, 10485760, array['application/pdf','image/jpeg','image/png']),
  ('job-photos', 'job-photos', false, 10485760, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

drop policy if exists "profile_photos_public_read" on storage.objects;
create policy "profile_photos_public_read" on storage.objects
for select using (bucket_id = 'profile-photos');

drop policy if exists "storage_owner_or_admin_write" on storage.objects;
create policy "storage_owner_or_admin_write" on storage.objects
for all using (
  bucket_id in ('profile-photos', 'compliance-docs', 'contracts', 'job-photos')
  and (
    auth.uid()::text = (storage.foldername(name))[1]
    or public.is_admin()
  )
) with check (
  bucket_id in ('profile-photos', 'compliance-docs', 'contracts', 'job-photos')
  and (
    auth.uid()::text = (storage.foldername(name))[1]
    or public.is_admin()
  )
);
