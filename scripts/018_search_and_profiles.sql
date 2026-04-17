-- ============================================================
-- Nexus Operations — Search & Extended Profile Schema
-- scripts/018_search_and_profiles.sql
--
-- Adds trigram fuzzy-search indexes for profiles, requests,
-- and properties, plus extended profile columns for
-- contractor bios, trade categories, license info.
--
-- Idempotent — safe to run multiple times.
-- ============================================================

-- ── Enable pg_trgm for fuzzy text search ─────────────────────
create extension if not exists pg_trgm;

-- ── profiles: extended contractor columns ────────────────────

-- Bio / description
do $$ begin
  alter table public.profiles add column bio text;
exception when duplicate_column then null; end $$;

-- Trade categories array (mirrors contractor_profiles but also on profiles for fast search)
do $$ begin
  alter table public.profiles add column trade_categories text[];
exception when duplicate_column then null; end $$;

-- License number
do $$ begin
  alter table public.profiles add column license_number text;
exception when duplicate_column then null; end $$;

-- Insurance expiry date
do $$ begin
  alter table public.profiles add column insurance_expiry date;
exception when duplicate_column then null; end $$;

-- ── GIN trigram indexes for fuzzy search ─────────────────────

-- profiles: full_name + email search
create index if not exists idx_profiles_full_name_trgm
  on public.profiles
  using gin (full_name gin_trgm_ops);

create index if not exists idx_profiles_email_trgm
  on public.profiles
  using gin (email gin_trgm_ops);

-- requests: title search (column may be title or subject depending on schema version)
do $$ begin
  create index idx_requests_title_trgm
    on public.requests
    using gin (title gin_trgm_ops);
exception when undefined_column then
  raise notice 'requests.title does not exist; skipping index';
when duplicate_table then null;
end $$;

do $$ begin
  create index idx_requests_description_trgm
    on public.requests
    using gin (description gin_trgm_ops);
exception when undefined_column then
  raise notice 'requests.description does not exist; skipping index';
when duplicate_table then null;
end $$;

-- properties: name + address search
do $$ begin
  create index idx_properties_name_trgm
    on public.properties
    using gin (name gin_trgm_ops);
exception when undefined_column then
  raise notice 'properties.name does not exist; skipping index';
when duplicate_table then null;
end $$;

do $$ begin
  create index idx_properties_address_trgm
    on public.properties
    using gin (address gin_trgm_ops);
exception when undefined_column then
  raise notice 'properties.address does not exist; skipping index';
when duplicate_table then null;
end $$;
