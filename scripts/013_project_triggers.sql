-- ============================================================
-- Migration 013 — project trigger automation
-- ============================================================

-- Keep profile identity columns aligned for legacy + canonical paths.
create or replace function public.sync_profile_identity_columns()
returns trigger
language plpgsql
as $$
begin
  new.id := coalesce(new.id, new.user_id);
  new.user_id := coalesce(new.user_id, new.id);
  return new;
end;
$$;

drop trigger if exists sync_profile_identity_columns_trigger on public.profiles;
create trigger sync_profile_identity_columns_trigger
before insert or update on public.profiles
for each row execute function public.sync_profile_identity_columns();

-- Keep legacy notifications.message and notifications.body in sync.
alter table public.notifications add column if not exists message text;
alter table public.notifications add column if not exists body text;

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

-- Automatically stamp completion_date the first time a request is marked completed.
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
