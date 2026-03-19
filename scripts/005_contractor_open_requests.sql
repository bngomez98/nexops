-- ============================================================
-- Nexus Operations — contractor open-request access
-- ============================================================
-- Allows verified contractors to see unassigned (open) requests
-- and claim them by setting themselves as the assigned contractor.

-- Contractors can view open/queued requests (not yet assigned)
drop policy if exists "requests_contractor_view_open" on public.service_requests;
create policy "requests_contractor_view_open" on public.service_requests for select
  using (
    status in ('pending_review', 'in_queue')
    and assigned_contractor_id is null
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role = 'contractor'
    )
  );

-- Contractors can claim an open request by updating assigned_contractor_id to themselves
drop policy if exists "requests_contractor_claim" on public.service_requests;
create policy "requests_contractor_claim" on public.service_requests for update
  using (
    status in ('pending_review', 'in_queue')
    and assigned_contractor_id is null
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role = 'contractor'
    )
  )
  with check (
    auth.uid() = assigned_contractor_id
  );
