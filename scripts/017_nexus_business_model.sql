-- ============================================================
-- Nexus Operations — Migration 017
-- Business-model alignment: geo matching, SLA tracking,
-- lead credits, audit history, canonical service categories.
--
-- This migration is additive and idempotent. Run after
-- scripts/setup.sql has successfully applied.
--
-- Design goals:
--   • Match the exclusive-claim + monthly-membership model:
--     track lead credits and contractor claim attempts.
--   • Enable real distance-based matching: contractor home
--     base lat/lng + service radius.
--   • Enforce SLA response / completion windows per urgency.
--   • Audit every service_request status change (parity with
--     job_status_history).
--   • Canonicalise service categories in a reference table
--     that lib/service-categories.ts syncs against.
--   • Extend invoices with due_date + overdue status.
-- ============================================================

-- ── Enum extension: invoice_status += 'overdue' ───────────────
do $$
begin
  alter type public.invoice_status add value if not exists 'overdue';
exception when undefined_object then
  -- enum didn't exist: recreate
  create type public.invoice_status as enum ('draft', 'sent', 'paid', 'void', 'overdue');
end;
$$;

-- ── Enum: service_request source ──────────────────────────────
do $$ begin
  create type public.request_source as enum (
    'homeowner_web', 'homeowner_mobile', 'property_manager', 'phone_intake', 'partner_referral', 'admin_created'
  );
exception when duplicate_object then null; end $$;

-- ── Enum: lead credit transaction type ───────────────────────
do $$ begin
  create type public.lead_credit_txn_type as enum (
    'grant_monthly', 'grant_bonus', 'grant_refund', 'consume_claim', 'consume_dispatch', 'expire', 'admin_adjust'
  );
exception when duplicate_object then null; end $$;

-- ============================================================
-- TABLE: service_categories (canonical reference)
-- Mirror of lib/service-categories.ts. The app may seed this
-- at boot, but FKs treat it as the source of truth for matching
-- and compliance rules.
-- ============================================================

create table if not exists public.service_categories (
  slug               text primary key,
  label              text not null,
  category_group     text not null check (category_group in (
                       'mechanical','exterior','interior','grounds',
                       'restoration','specialty','general')),
  emergency_eligible boolean not null default false,
  requires_license   boolean not null default false,
  requires_insurance boolean not null default true,
  fee_override       numeric(4,3) check (fee_override is null or (fee_override >= 0 and fee_override <= 1)),
  description        text,
  sort_order         integer not null default 100,
  is_active          boolean not null default true,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

drop trigger if exists set_service_categories_updated_at on public.service_categories;
create trigger set_service_categories_updated_at
  before update on public.service_categories
  for each row execute function public.set_updated_at();

alter table public.service_categories enable row level security;

drop policy if exists "service_categories_public_read" on public.service_categories;
create policy "service_categories_public_read" on public.service_categories
  for select using (is_active = true or public.is_admin());

drop policy if exists "service_categories_admin_write" on public.service_categories;
create policy "service_categories_admin_write" on public.service_categories
  for all using (public.is_admin()) with check (public.is_admin());

-- Seed the canonical Topeka-area trades (idempotent upsert).
insert into public.service_categories
  (slug, label, category_group, emergency_eligible, requires_license, requires_insurance, fee_override, description, sort_order)
values
  ('plumbing',           'Plumbing',                     'mechanical',  true,  true,  true,  null, 'Leaks, burst pipes, water heaters, fixtures, drain cleaning.', 10),
  ('hvac',               'HVAC',                         'mechanical',  true,  true,  true,  null, 'Heating, cooling, furnace, AC, thermostats, ductwork.',       11),
  ('electrical',         'Electrical',                   'mechanical',  true,  true,  true,  null, 'Wiring, outlets, panels, lighting, code violations.',         12),
  ('roofing',            'Roofing',                      'exterior',    true,  true,  true,  null, 'Repairs, replacements, storm damage, leaks.',                 20),
  ('gutter',             'Gutters',                      'exterior',    false, false, true,  null, null,                                                          21),
  ('window-door',        'Windows & Doors',              'exterior',    false, false, true,  null, null,                                                          22),
  ('concrete-masonry',   'Concrete & Masonry',           'exterior',    false, false, true,  null, null,                                                          23),
  ('foundation',         'Foundation',                   'exterior',    false, true,  true,  null, null,                                                          24),
  ('general-contracting','General Contracting',          'general',     false, true,  true,  null, null,                                                          30),
  ('carpentry',          'Carpentry',                    'interior',    false, false, true,  null, null,                                                          31),
  ('painting',           'Painting',                     'interior',    false, false, true,  null, null,                                                          32),
  ('flooring',           'Flooring',                     'interior',    false, false, true,  null, null,                                                          33),
  ('drywall',            'Drywall',                      'interior',    false, false, true,  null, null,                                                          34),
  ('insulation',         'Insulation',                   'interior',    false, false, true,  null, null,                                                          35),
  ('appliance-repair',   'Appliance Repair',             'interior',    false, false, true,  null, null,                                                          36),
  ('garage-door',        'Garage Door',                  'interior',    true,  false, true,  null, null,                                                          37),
  ('locksmith',          'Locksmith',                    'specialty',   true,  true,  true,  null, null,                                                          40),
  ('landscaping',        'Landscaping',                  'grounds',     false, false, true,  null, null,                                                          50),
  ('tree-service',       'Tree Service',                 'grounds',     true,  false, true,  null, 'Fallen-tree removal qualifies for emergency SLA.',            51),
  ('snow-removal',       'Snow Removal',                 'grounds',     true,  false, true,  null, null,                                                          52),
  ('water-damage',       'Water Damage Restoration',     'restoration', true,  true,  true,  0.30, null,                                                          60),
  ('mold-remediation',   'Mold Remediation',             'restoration', false, true,  true,  0.30, null,                                                          61),
  ('pest-control',       'Pest Control',                 'specialty',   false, true,  true,  null, null,                                                          70),
  ('cleaning',           'Cleaning',                     'specialty',   false, false, false, null, null,                                                          71),
  ('handyman',           'Handyman',                     'specialty',   false, false, true,  null, null,                                                          72),
  ('open-request',       'Not Sure — Let Us Decide',     'general',     false, false, false, null, 'Dispatcher triages and routes to the right trade.',            99)
on conflict (slug) do update set
  label              = excluded.label,
  category_group     = excluded.category_group,
  emergency_eligible = excluded.emergency_eligible,
  requires_license   = excluded.requires_license,
  requires_insurance = excluded.requires_insurance,
  fee_override       = excluded.fee_override,
  description        = excluded.description,
  sort_order         = excluded.sort_order,
  updated_at         = now();

-- ============================================================
-- contractor_profiles — add geo + membership fields
-- Enables real Haversine distance matching in /api/match.
-- ============================================================

alter table public.contractor_profiles
  add column if not exists base_lat         double precision,
  add column if not exists base_lng         double precision,
  add column if not exists base_zip         text,
  add column if not exists base_city        text default 'Topeka',
  add column if not exists base_state       text default 'KS',
  add column if not exists max_active_jobs  integer not null default 10
    check (max_active_jobs between 1 and 100),
  add column if not exists primary_category text references public.service_categories(slug) on update cascade on delete set null,
  add column if not exists accepts_emergency boolean not null default false,
  add column if not exists after_hours_response boolean not null default false,
  add column if not exists minimum_job_amount_cents integer not null default 0
    check (minimum_job_amount_cents >= 0),
  add column if not exists last_claim_at   timestamptz,
  add column if not exists claim_streak    integer not null default 0;

create index if not exists contractor_profiles_base_geo_idx
  on public.contractor_profiles (base_lat, base_lng)
  where base_lat is not null and base_lng is not null;

create index if not exists contractor_profiles_primary_category_idx
  on public.contractor_profiles (primary_category);

create index if not exists contractor_profiles_accepts_emergency_idx
  on public.contractor_profiles (accepts_emergency)
  where accepts_emergency = true;

-- ============================================================
-- service_requests — add SLA + source + geo snapshot
-- ============================================================

alter table public.service_requests
  add column if not exists source          public.request_source not null default 'homeowner_web',
  add column if not exists lat             double precision,
  add column if not exists lng             double precision,
  add column if not exists sla_respond_by  timestamptz,
  add column if not exists sla_complete_by timestamptz,
  add column if not exists sla_breached    boolean not null default false,
  add column if not exists first_claimed_at timestamptz,
  add column if not exists claim_attempts  integer not null default 0,
  add column if not exists dispatch_notes  text,
  add column if not exists category_slug   text references public.service_categories(slug) on update cascade;

create index if not exists service_requests_sla_respond_by_idx
  on public.service_requests (sla_respond_by)
  where assigned_contractor_id is null and status in ('pending_review', 'in_queue');

create index if not exists service_requests_category_slug_idx
  on public.service_requests (category_slug);

create index if not exists service_requests_geo_idx
  on public.service_requests (lat, lng)
  where lat is not null and lng is not null;

-- Auto-populate SLA windows when a request is created, based on urgency.
create or replace function public.set_service_request_sla()
returns trigger
language plpgsql
as $$
declare
  v_respond_minutes  integer;
  v_complete_hours   integer;
begin
  -- emergency: 30m respond / 24h complete
  -- urgent:    4h  respond / 72h complete
  -- routine:   24h respond / 14d complete
  case coalesce(new.urgency::text, 'routine')
    when 'emergency' then
      v_respond_minutes := 30;   v_complete_hours := 24;
    when 'urgent' then
      v_respond_minutes := 240;  v_complete_hours := 72;
    else
      v_respond_minutes := 1440; v_complete_hours := 336;
  end case;

  if new.sla_respond_by is null then
    new.sla_respond_by := coalesce(new.created_at, now()) + make_interval(mins => v_respond_minutes);
  end if;
  if new.sla_complete_by is null then
    new.sla_complete_by := coalesce(new.created_at, now()) + make_interval(hours => v_complete_hours);
  end if;

  -- Mirror category → category_slug when the text value matches a canonical slug.
  if new.category_slug is null and new.category is not null then
    if exists (select 1 from public.service_categories where slug = new.category) then
      new.category_slug := new.category;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists set_service_request_sla_trigger on public.service_requests;
create trigger set_service_request_sla_trigger
  before insert on public.service_requests
  for each row execute function public.set_service_request_sla();

-- Track first claim + increment claim_attempts when a contractor claims.
create or replace function public.track_service_request_claim()
returns trigger
language plpgsql
as $$
begin
  if new.assigned_contractor_id is not null
     and old.assigned_contractor_id is distinct from new.assigned_contractor_id then
    if new.first_claimed_at is null then
      new.first_claimed_at := now();
    end if;
    new.claim_attempts := coalesce(new.claim_attempts, 0) + 1;

    -- SLA breach = respond deadline already passed at claim time.
    if new.sla_respond_by is not null and now() > new.sla_respond_by then
      new.sla_breached := true;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists track_service_request_claim_trigger on public.service_requests;
create trigger track_service_request_claim_trigger
  before update of assigned_contractor_id on public.service_requests
  for each row execute function public.track_service_request_claim();

-- ============================================================
-- TABLE: service_request_status_history
-- Audit log mirroring job_status_history, for the primary
-- service_requests pipeline.
-- ============================================================

create table if not exists public.service_request_status_history (
  id          uuid primary key default gen_random_uuid(),
  request_id  uuid not null references public.service_requests(id) on delete cascade,
  from_status public.service_request_status,
  to_status   public.service_request_status not null,
  changed_at  timestamptz not null default now(),
  changed_by  uuid references public.profiles(id) on delete set null,
  reason      text
);

create index if not exists srsh_request_id_idx
  on public.service_request_status_history (request_id, changed_at desc);
create index if not exists srsh_to_status_idx
  on public.service_request_status_history (to_status);

alter table public.service_request_status_history enable row level security;

drop policy if exists "srsh_participants_select" on public.service_request_status_history;
create policy "srsh_participants_select" on public.service_request_status_history
  for select using (
    public.is_admin()
    or exists (
      select 1 from public.service_requests sr
      where sr.id = request_id
        and (auth.uid() = sr.owner_id or auth.uid() = sr.assigned_contractor_id)
    )
  );

drop policy if exists "srsh_system_insert" on public.service_request_status_history;
create policy "srsh_system_insert" on public.service_request_status_history
  for insert with check (auth.uid() is not null or public.is_admin());

create or replace function public.log_service_request_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.status is distinct from new.status then
    insert into public.service_request_status_history
      (request_id, from_status, to_status, changed_by)
    values
      (new.id, old.status, new.status, auth.uid());
  end if;
  return new;
end;
$$;

drop trigger if exists log_service_request_status_change_trigger on public.service_requests;
create trigger log_service_request_status_change_trigger
  after update of status on public.service_requests
  for each row execute function public.log_service_request_status_change();

-- ============================================================
-- TABLE: lead_credits
-- Ledger for the contractor-membership "unlimited claims"
-- model. Pro tier grants a monthly budget of lead credits;
-- Elite tier is effectively unlimited (max_active_jobs cap).
-- Each claim consumes one credit. Net balance lives in
-- contractor_profiles.lead_credit_balance (derived).
-- ============================================================

create table if not exists public.lead_credits (
  id            uuid primary key default gen_random_uuid(),
  contractor_id uuid not null references public.profiles(id) on delete cascade,
  txn_type      public.lead_credit_txn_type not null,
  amount        integer not null,  -- positive = grant, negative = consume
  request_id    uuid references public.service_requests(id) on delete set null,
  note          text,
  created_at    timestamptz not null default now(),
  check (amount <> 0)
);

create index if not exists lead_credits_contractor_idx
  on public.lead_credits (contractor_id, created_at desc);
create index if not exists lead_credits_request_idx
  on public.lead_credits (request_id)
  where request_id is not null;

alter table public.lead_credits enable row level security;

drop policy if exists "lead_credits_self_select" on public.lead_credits;
create policy "lead_credits_self_select" on public.lead_credits
  for select using (auth.uid() = contractor_id or public.is_admin());

drop policy if exists "lead_credits_admin_insert" on public.lead_credits;
create policy "lead_credits_admin_insert" on public.lead_credits
  for insert with check (public.is_admin());

-- Balance helper — used by /api/portal/bootstrap to show "X claims left".
create or replace function public.get_lead_credit_balance(p_contractor_id uuid)
returns integer
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(sum(amount)::integer, 0)
  from public.lead_credits
  where contractor_id = p_contractor_id;
$$;

grant execute on function public.get_lead_credit_balance to authenticated, service_role;

-- ============================================================
-- TABLE: service_area_zones
-- Named ZIP/lat-lng polygons defining where Nexus dispatches.
-- Starts with Topeka metro ZIPs; expanded via admin UI.
-- ============================================================

create table if not exists public.service_area_zones (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  zip_codes  text[] not null default '{}',
  center_lat double precision,
  center_lng double precision,
  radius_miles integer not null default 25 check (radius_miles > 0),
  is_primary boolean not null default false,
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_service_area_zones_updated_at on public.service_area_zones;
create trigger set_service_area_zones_updated_at
  before update on public.service_area_zones
  for each row execute function public.set_updated_at();

create index if not exists service_area_zones_zip_gin_idx
  on public.service_area_zones using gin (zip_codes);

alter table public.service_area_zones enable row level security;

drop policy if exists "service_area_zones_public_read" on public.service_area_zones;
create policy "service_area_zones_public_read" on public.service_area_zones
  for select using (is_active = true or public.is_admin());

drop policy if exists "service_area_zones_admin_write" on public.service_area_zones;
create policy "service_area_zones_admin_write" on public.service_area_zones
  for all using (public.is_admin()) with check (public.is_admin());

-- Seed the primary Topeka metro service area (Shawnee County core ZIPs).
insert into public.service_area_zones (name, zip_codes, center_lat, center_lng, radius_miles, is_primary, is_active)
values (
  'Topeka Metro',
  array[
    '66603','66604','66605','66606','66607','66608','66609','66610','66611','66612',
    '66614','66615','66616','66617','66618','66619','66620','66621','66622'
  ],
  39.0473, -95.6752,     -- Topeka, KS centroid
  30, true, true
)
on conflict do nothing;

-- ============================================================
-- invoices — due_date + overdue maintenance
-- ============================================================

alter table public.invoices
  add column if not exists due_date   timestamptz,
  add column if not exists paid_at    timestamptz,
  add column if not exists voided_at  timestamptz,
  add column if not exists sent_at    timestamptz;

create index if not exists invoices_due_date_idx
  on public.invoices (due_date)
  where status in ('sent', 'overdue');

-- Auto-stamp timestamps + default due_date (net-15) on status changes.
create or replace function public.set_invoice_lifecycle_timestamps()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    if new.due_date is null then
      new.due_date := coalesce(new.created_at, now()) + interval '15 days';
    end if;
  end if;
  if old.status is distinct from new.status then
    if new.status = 'sent'  and new.sent_at   is null then new.sent_at   := now(); end if;
    if new.status = 'paid'  and new.paid_at   is null then new.paid_at   := now(); end if;
    if new.status = 'void'  and new.voided_at is null then new.voided_at := now(); end if;
  end if;
  return new;
end;
$$;

drop trigger if exists set_invoice_lifecycle_timestamps_trigger on public.invoices;
create trigger set_invoice_lifecycle_timestamps_trigger
  before insert or update on public.invoices
  for each row execute function public.set_invoice_lifecycle_timestamps();

-- ============================================================
-- UTILITY: match_contractors_by_distance
-- Distance-ranked, category-filtered, availability-aware match.
-- Used by /api/match as the primary (non-vector) ranker.
-- ============================================================

create or replace function public.match_contractors_by_distance(
  p_request_id   uuid,
  p_max_results  integer default 10
)
returns table (
  contractor_id       uuid,
  full_name           text,
  distance_miles      double precision,
  rating              numeric,
  active_projects     integer,
  is_verified         boolean,
  accepts_emergency   boolean,
  primary_category_match boolean,
  lead_credit_balance integer,
  score               integer
)
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  v_req    public.service_requests;
begin
  select * into v_req from public.service_requests where id = p_request_id;
  if v_req is null then return; end if;

  return query
  with candidates as (
    select
      p.id                     as cid,
      p.full_name,
      p.average_rating         as rating,
      cp.service_radius_miles  as radius,
      cp.is_verified,
      cp.is_available,
      cp.accepts_emergency,
      cp.primary_category,
      cp.max_active_jobs,
      cp.base_lat, cp.base_lng,
      public.get_active_project_count(p.id)  as active_projects,
      public.get_lead_credit_balance(p.id)   as credits,
      -- Haversine distance (miles) — null if contractor has no base geo.
      case
        when cp.base_lat is null or cp.base_lng is null
          or v_req.lat is null or v_req.lng is null then null
        else 3958.7613 * 2 * asin(least(1.0, sqrt(
          sin(radians(v_req.lat  - cp.base_lat)/2) ^ 2 +
          cos(radians(cp.base_lat)) * cos(radians(v_req.lat)) *
          sin(radians(v_req.lng  - cp.base_lng)/2) ^ 2
        )))
      end as dist_miles
    from public.profiles p
    join public.contractor_profiles cp on cp.user_id = p.id
    where p.role = 'contractor'
      and p.is_active  = true
      and cp.is_available = true
      and (
        coalesce(v_req.category_slug, v_req.category) = any(cp.trade_categories)
        or cp.primary_category = coalesce(v_req.category_slug, v_req.category)
      )
      and (
        v_req.urgency::text <> 'emergency'
        or cp.accepts_emergency = true
      )
      -- exclude contractors already at capacity
      and public.get_active_project_count(p.id) < cp.max_active_jobs
  )
  select
    cid,
    full_name,
    dist_miles,
    coalesce(rating, 0)::numeric,
    active_projects,
    is_verified,
    accepts_emergency,
    (primary_category = coalesce(v_req.category_slug, v_req.category)) as primary_category_match,
    credits,
    (
      -- scoring (mirrors scoreContractorMatch in lib/business-logic.ts)
      (case when primary_category = coalesce(v_req.category_slug, v_req.category) then 40 else 0 end)
    + (case
         when dist_miles is null or dist_miles > radius then 0
         else greatest(0, round(25 * (1 - dist_miles / greatest(1, radius)))::integer)
       end)
    + (case
         when coalesce(rating, 0) >= 4.5 then 15
         when coalesce(rating, 0) >= 4.0 then 10
         when coalesce(rating, 0) >= 3.5 then 5
         else 0 end)
    + (case when is_verified then 10 else 0 end)
    + (case when active_projects < max_active_jobs then 10 else 0 end)
    ) as score
  from candidates
  where dist_miles is null or dist_miles <= radius
  order by score desc, dist_miles nulls last, active_projects asc
  limit p_max_results;
end;
$$;

grant execute on function public.match_contractors_by_distance to authenticated, service_role;

-- ============================================================
-- UTILITY: maintenance_mark_overdue_invoices
-- Cron-callable: flips sent invoices past due_date + grace
-- period to 'overdue'. Run daily.
-- ============================================================

create or replace function public.maintenance_mark_overdue_invoices(p_grace_days integer default 3)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  update public.invoices
     set status = 'overdue'
   where status = 'sent'
     and due_date is not null
     and now() > due_date + make_interval(days => p_grace_days);
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

grant execute on function public.maintenance_mark_overdue_invoices to service_role;

-- ============================================================
-- UTILITY: maintenance_flag_sla_breaches
-- Marks unclaimed requests past their sla_respond_by as
-- sla_breached = true. Run every 5 min by Vercel Cron.
-- ============================================================

create or replace function public.maintenance_flag_sla_breaches()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  update public.service_requests
     set sla_breached = true
   where sla_breached = false
     and assigned_contractor_id is null
     and status in ('pending_review', 'in_queue')
     and sla_respond_by is not null
     and now() > sla_respond_by;
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

grant execute on function public.maintenance_flag_sla_breaches to service_role;

-- ============================================================
-- VIEW: v_contractor_dashboard
-- One-query dashboard feed combining profile, performance,
-- lead credits, and SLA posture. Used by /api/portal/bootstrap.
-- ============================================================

create or replace view public.v_contractor_dashboard as
select
  p.id                              as contractor_id,
  p.full_name,
  p.email,
  p.average_rating,
  p.reviews_count,
  p.subscription_tier,
  p.subscription_status,
  cp.service_radius_miles,
  cp.primary_category,
  cp.accepts_emergency,
  cp.is_verified,
  cp.is_available,
  cp.max_active_jobs,
  public.get_active_project_count(p.id)  as active_projects,
  public.get_lead_credit_balance(p.id)   as lead_credit_balance,
  (select count(*) from public.service_requests
     where assigned_contractor_id = p.id and status = 'completed')::integer as completed_projects,
  (select count(*) from public.service_requests
     where assigned_contractor_id = p.id
       and status = 'completed'
       and sla_breached = false)::integer as on_time_completions
from public.profiles p
join public.contractor_profiles cp on cp.user_id = p.id
where p.role = 'contractor';

-- ============================================================
-- Schema-health: extend required_tables list.
-- ============================================================

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
    'stripe_events',
    -- migration 017 additions
    'service_categories', 'service_request_status_history',
    'lead_credits', 'service_area_zones'
  ];
  required_functions text[] := array[
    'set_updated_at', 'handle_new_user', 'is_admin',
    'get_contractor_stats', 'get_platform_stats',
    'schema_health_check',
    -- migration 017 additions
    'match_contractors_by_distance', 'get_lead_credit_balance',
    'maintenance_mark_overdue_invoices', 'maintenance_flag_sla_breaches',
    'set_service_request_sla', 'log_service_request_status_change'
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
