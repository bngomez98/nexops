-- ============================================================
-- Migration 012 — schema unification to canonical profile model
-- ============================================================
-- This migration is incremental-safe. It aligns older environments with
-- the canonical model defined in scripts/setup.sql.

-- Canonical profile keying (`profiles.id = auth.users.id`)
alter table public.profiles
  add column if not exists id uuid;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public' and table_name = 'profiles' and column_name = 'user_id'
  ) then
    execute '
      update public.profiles
      set id = user_id
      where id is null
        and user_id is not null
    ';
  end if;
end;
$$;

-- Keep legacy support fields expected by current routes
alter table public.profiles
  add column if not exists photo_url text,
  add column if not exists email text,
  add column if not exists bio text,
  add column if not exists license_number text,
  add column if not exists years_in_business integer not null default 0,
  add column if not exists service_categories text[],
  add column if not exists subscription_tier text default 'free',
  add column if not exists subscription_status text default 'inactive',
  add column if not exists stripe_subscription_id text;

-- Documents + notifications operational columns
alter table public.documents
  add column if not exists status text not null default 'pending';

alter table public.service_requests
  add column if not exists status_reason text;

-- Messages table evolution (legacy request_id/body -> job_id/content)
alter table public.messages
  add column if not exists job_id uuid,
  add column if not exists recipient_id uuid,
  add column if not exists content text,
  add column if not exists read_at timestamptz;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public' and table_name = 'messages' and column_name = 'request_id'
  ) then
    execute '
      update public.messages
      set job_id = request_id
      where job_id is null
        and request_id is not null
    ';
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public' and table_name = 'messages' and column_name = 'body'
  ) then
    execute '
      update public.messages
      set content = body
      where content is null
        and body is not null
    ';
  end if;
end;
$$;

-- Canonical health-check function for runtime verification
create or replace function public.schema_health_check()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  required_tables text[] := array['profiles','service_requests','messages','documents','notifications','payments','jobs','invoices'];
  missing_tables text[] := '{}';
  t text;
begin
  foreach t in array required_tables loop
    if not exists (
      select 1 from information_schema.tables
      where table_schema = 'public' and table_name = t
    ) then
      missing_tables := array_append(missing_tables, t);
    end if;
  end loop;

  return jsonb_build_object(
    'ok', coalesce(array_length(missing_tables, 1), 0) = 0,
    'missing_tables', missing_tables
  );
end;
$$;
