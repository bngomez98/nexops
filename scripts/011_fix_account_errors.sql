-- Migration 011: Fix account errors
--
-- 1. Add missing contractor columns to profiles table
-- 2. Fix handle_new_user trigger to normalise 'property-manager' → 'property_manager'
-- 3. Backfill profile rows for existing property-manager users that were skipped
--    due to the constraint violation.

-- ── Add missing contractor profile columns ───────────────────────────────────
alter table public.profiles
  add column if not exists bio               text,
  add column if not exists license_number    text,
  add column if not exists years_in_business int not null default 0;

-- ── Fix handle_new_user trigger ───────────────────────────────────────────────
-- The original trigger inserted raw_user_meta_data->>'role' directly, but the
-- check constraint only accepts 'property_manager' (underscore).  Users who
-- signed up with role='property-manager' (hyphen) had their profile row
-- silently rejected, so settings / phone updates never persisted.

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
declare
  v_role text;
begin
  -- Normalise 'property-manager' (hyphen) to 'property_manager' (underscore)
  v_role := coalesce(new.raw_user_meta_data ->> 'role', 'homeowner');
  if v_role = 'property-manager' then
    v_role := 'property_manager';
  end if;

  -- Only insert roles that pass the check constraint
  if v_role not in ('homeowner', 'property_manager', 'contractor', 'admin') then
    v_role := 'homeowner';
  end if;

  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', null),
    v_role
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
