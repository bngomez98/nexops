-- ============================================================
-- Nexus Operations — Full Platform Schema (Phase 1–10)
-- Run this in your Supabase SQL editor after existing migrations
-- NOTE: Runtime migrations use scripts/setup.sql as the canonical schema.
-- ============================================================

-- Profiles (one row per user, for all roles)
create table if not exists profiles (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  role        text not null default 'homeowner',
  full_name   text,
  photo_url   text,
  phone       text,
  created_at  timestamptz not null default now(),
  constraint profiles_user_id_unique unique (user_id)
);

alter table profiles add column if not exists email text;
alter table profiles add column if not exists category text;
alter table profiles add column if not exists skills text[] not null default '{}';
alter table profiles add column if not exists service_area text;
alter table profiles add column if not exists service_categories text[] not null default '{}';
alter table profiles add column if not exists average_rating numeric(3,2) not null default 0;
alter table profiles add column if not exists reviews_count integer not null default 0;
alter table profiles add column if not exists is_active boolean not null default true;

-- Contractor profiles
create table if not exists contractor_profiles (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references auth.users(id) on delete cascade,
  bio                  text,
  service_radius_miles integer not null default 25,
  trade_categories     text[] not null default '{}',
  stripe_account_id    text,
  is_verified          boolean not null default false,
  is_available         boolean not null default true,
  created_at           timestamptz not null default now(),
  constraint contractor_profiles_user_id_unique unique (user_id)
);

-- Homeowner profiles
create table if not exists homeowner_profiles (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint homeowner_profiles_user_id_unique unique (user_id)
);

-- Property manager profiles
create table if not exists property_manager_profiles (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  company_name   text,
  portfolio_size integer,
  created_at     timestamptz not null default now(),
  constraint property_manager_profiles_user_id_unique unique (user_id)
);

-- Properties
create table if not exists properties (
  id         uuid primary key default gen_random_uuid(),
  owner_id   uuid not null references auth.users(id) on delete cascade,
  address    text not null,
  city       text,
  state      text,
  zip        text,
  lat        double precision,
  lng        double precision,
  created_at timestamptz not null default now()
);

create index if not exists properties_owner_id_idx on properties(owner_id);

-- Documents (compliance + uploaded files)
create table if not exists documents (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  type       text not null,  -- 'license', 'insurance', 'eo_insurance', 'homeowner_insurance', 'contract', 'other'
  file_url   text not null,
  expires_at timestamptz,
  verified   boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists documents_user_id_idx on documents(user_id);
create index if not exists documents_expires_at_idx on documents(expires_at);

-- Jobs
create table if not exists jobs (
  id             uuid primary key default gen_random_uuid(),
  client_id      uuid not null references auth.users(id) on delete cascade,
  property_id    uuid references properties(id) on delete set null,
  service_type   text not null,
  urgency        text not null default 'routine',  -- 'routine', 'urgent', 'emergency'
  description    text,
  budget_ceiling numeric(10,2),
  status         text not null default 'open',
  contractor_id  uuid references auth.users(id) on delete set null,
  created_at     timestamptz not null default now()
);

create index if not exists jobs_client_id_idx on jobs(client_id);
create index if not exists jobs_contractor_id_idx on jobs(contractor_id);
create index if not exists jobs_status_idx on jobs(status);

-- Job photos
create table if not exists job_photos (
  id         uuid primary key default gen_random_uuid(),
  job_id     uuid not null references jobs(id) on delete cascade,
  photo_url  text not null,
  created_at timestamptz not null default now()
);

-- Job status history
create table if not exists job_status_history (
  id          uuid primary key default gen_random_uuid(),
  job_id      uuid not null references jobs(id) on delete cascade,
  status      text not null,
  changed_at  timestamptz not null default now(),
  changed_by  text not null default 'system'
);

-- Matches
create table if not exists matches (
  id             uuid primary key default gen_random_uuid(),
  job_id         uuid not null references jobs(id) on delete cascade,
  contractor_id  uuid not null references auth.users(id) on delete cascade,
  offered_at     timestamptz not null default now(),
  response       text,  -- 'accepted', 'declined', null (pending)
  responded_at   timestamptz
);

create index if not exists matches_job_id_idx on matches(job_id);
create index if not exists matches_contractor_id_idx on matches(contractor_id);

-- Invoices
create table if not exists invoices (
  id             uuid primary key default gen_random_uuid(),
  job_id         uuid not null references jobs(id) on delete cascade,
  contractor_id  uuid not null references auth.users(id),
  client_id      uuid not null references auth.users(id),
  line_items     jsonb not null default '[]',
  subtotal       numeric(10,2) not null default 0,
  nexus_fee      numeric(10,2) not null default 0,
  total          numeric(10,2) not null default 0,
  fee_rate       numeric(4,3) not null default 0.25,
  urgency        text not null default 'routine',
  status         text not null default 'draft',  -- 'draft', 'sent', 'paid'
  stripe_invoice_id   text,
  stripe_payment_url  text,
  created_at     timestamptz not null default now()
);

create index if not exists invoices_contractor_id_idx on invoices(contractor_id);
create index if not exists invoices_client_id_idx on invoices(client_id);
create index if not exists invoices_job_id_idx on invoices(job_id);

-- Notifications
create table if not exists notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  title      text not null,
  body       text,
  type       text,
  read       boolean not null default false,
  link       text,
  created_at timestamptz not null default now()
);

alter table notifications add column if not exists message text;
alter table notifications add column if not exists project_id uuid;

create index if not exists notifications_user_id_idx on notifications(user_id);
create index if not exists notifications_read_idx on notifications(user_id, read);

-- ============================================================
-- Storage buckets (run once in Supabase Storage settings or via API)
-- profile-photos  — public read, authenticated write
-- compliance-docs — private, owner + admin
-- contracts       — private, both parties + admin
-- job-photos      — private per job
-- ============================================================

-- RLS Policies (examples — adjust to your security requirements)

-- Enable RLS on all tables
alter table profiles                   enable row level security;
alter table contractor_profiles        enable row level security;
alter table homeowner_profiles         enable row level security;
alter table property_manager_profiles  enable row level security;
alter table properties                 enable row level security;
alter table documents                  enable row level security;
alter table jobs                       enable row level security;
alter table job_photos                 enable row level security;
alter table job_status_history         enable row level security;
alter table matches                    enable row level security;
alter table invoices                   enable row level security;
alter table notifications              enable row level security;

-- profiles: users can read/write their own row; admins can read all
create policy if not exists "profiles_self_access" on profiles
  for all using (auth.uid() = user_id);

-- contractor_profiles: owners + admins
create policy if not exists "contractor_profiles_self_access" on contractor_profiles
  for all using (auth.uid() = user_id);

-- jobs: clients and assigned contractors can access
create policy if not exists "jobs_client_access" on jobs
  for all using (auth.uid() = client_id or auth.uid() = contractor_id);

-- properties: owner access
create policy if not exists "properties_owner_access" on properties
  for all using (auth.uid() = owner_id);

-- documents: user access
create policy if not exists "documents_user_access" on documents
  for all using (auth.uid() = user_id);

-- invoices: contractor or client access
create policy if not exists "invoices_party_access" on invoices
  for all using (auth.uid() = contractor_id or auth.uid() = client_id);

-- notifications: own user access only
create policy if not exists "notifications_self_access" on notifications
  for all using (auth.uid() = user_id);
