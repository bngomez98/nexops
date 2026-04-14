-- Migration 016: Add public/anonymous submission support to service_requests
-- Run with: psql $DATABASE_URL -f scripts/016_public_requests.sql

-- Allow owner_id to be NULL for anonymous/guest submissions
alter table public.service_requests
  alter column owner_id drop not null;

-- Add guest/public submission columns
alter table public.service_requests
  add column if not exists submission_token text unique,
  add column if not exists guest_name      text,
  add column if not exists guest_email     text,
  add column if not exists guest_phone     text,
  add column if not exists budget_range    text;

-- Index for token-based lookups
create index if not exists idx_service_requests_submission_token
  on public.service_requests (submission_token)
  where submission_token is not null;

-- Allow anonymous users to insert public requests (no auth required)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename  = 'service_requests'
      and policyname = 'anon_can_submit_requests'
  ) then
    execute $policy$
      create policy "anon_can_submit_requests"
        on public.service_requests
        for insert
        to anon
        with check (owner_id is null and submission_token is not null)
    $policy$;
  end if;
end
$$;

-- Allow anyone to read their own request by token (status tracking)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename  = 'service_requests'
      and policyname = 'public_can_read_own_request_by_token'
  ) then
    execute $policy$
      create policy "public_can_read_own_request_by_token"
        on public.service_requests
        for select
        to anon
        using (submission_token is not null)
    $policy$;
  end if;
end
$$;
