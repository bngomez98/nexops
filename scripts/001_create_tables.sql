-- ============================================================
-- Nexus Operations — core schema
-- ============================================================

-- ── profiles ─────────────────────────────────────────────────
create table if not exists public.profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  full_name      text,
  role           text not null default 'homeowner'
                   check (role in ('homeowner', 'property_manager', 'contractor', 'admin')),
  phone          text,
  company        text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"  on public.profiles for select  using (auth.uid() = id);
create policy "profiles_insert_own"  on public.profiles for insert  with check (auth.uid() = id);
create policy "profiles_update_own"  on public.profiles for update  using (auth.uid() = id);

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

create policy "properties_owner"  on public.properties for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- ── service_requests ─────────────────────────────────────────
create table if not exists public.service_requests (
  id                  uuid primary key default gen_random_uuid(),
  owner_id            uuid not null references public.profiles(id) on delete cascade,
  property_id         uuid references public.properties(id) on delete set null,
  category            text not null,
  description         text not null,
  budget_min          numeric(10,2),
  budget_max          numeric(10,2),
  address             text not null,
  city                text not null,
  state               text not null default 'KS',
  zip_code            text not null,
  preferred_dates     text,
  additional_notes    text,
  status              text not null default 'pending_review'
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
  consultation_date   timestamptz,
  final_cost          numeric(10,2),
  completion_date     timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table public.service_requests enable row level security;

-- owners can CRUD their own requests
create policy "requests_owner_select" on public.service_requests for select  using (auth.uid() = owner_id);
create policy "requests_owner_insert" on public.service_requests for insert  with check (auth.uid() = owner_id);
create policy "requests_owner_update" on public.service_requests for update  using (auth.uid() = owner_id);

-- assigned contractors can view and update requests assigned to them
create policy "requests_contractor_select" on public.service_requests for select
  using (auth.uid() = assigned_contractor_id);
create policy "requests_contractor_update" on public.service_requests for update
  using (auth.uid() = assigned_contractor_id);

-- ── messages ─────────────────────────────────────────────────
create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  request_id  uuid not null references public.service_requests(id) on delete cascade,
  sender_id   uuid not null references public.profiles(id) on delete cascade,
  body        text not null,
  created_at  timestamptz not null default now()
);

alter table public.messages enable row level security;

-- participants in a request can send/read messages
create policy "messages_select" on public.messages for select
  using (
    exists (
      select 1 from public.service_requests sr
      where sr.id = messages.request_id
        and (auth.uid() = sr.owner_id or auth.uid() = sr.assigned_contractor_id)
    )
  );

create policy "messages_insert" on public.messages for insert
  with check (
    auth.uid() = sender_id and
    exists (
      select 1 from public.service_requests sr
      where sr.id = messages.request_id
        and (auth.uid() = sr.owner_id or auth.uid() = sr.assigned_contractor_id)
    )
  );
