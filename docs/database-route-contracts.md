## Database Route Contract Matrix

| Route | Tables | Contract |
|---|---|---|
| `/api/auth/me` | `profiles`, `service_requests` | `profiles.id = auth.users.id`; contractor counts from `service_requests.assigned_contractor_id` |
| `/api/projects/*` | `profiles`, `service_requests` | owner/contractor authorization and lifecycle status updates |
| `/api/messages*` | `messages`, `service_requests`, `profiles` | `messages.job_id` maps to `service_requests.id`; participant authorization via owner/assigned contractor |
| `/api/notifications` | `notifications` | user-scoped read/update/delete via `notifications.user_id` |
| `/api/upload` | `documents`, `storage.objects` | document metadata persisted with `user_id`, `verified`, `status` |
| `/api/cron/document-expiry` | `documents`, `profiles` | expiring compliance docs by `documents.user_id`; recipient name from `profiles.id`; requires `CRON_SECRET` Bearer token |
| `/api/cron/invoice-maintenance` | `invoices` (via DB function) | calls `maintenance_mark_overdue_invoices(p_grace_days)` using service role; requires `CRON_SECRET` |
| `/api/cron/sla-sweep` | `service_requests` (via DB function) | calls `maintenance_flag_sla_breaches()` using service role; requires `CRON_SECRET` |
| `/api/stripe/dispatch` | `service_requests`, `profiles`, `payments` | owner pay flow, assigned contractor payout metadata |
| `/api/stripe/invoice` | `invoices`, `jobs`, `profiles`, `payments`, `service_requests` | jobs/invoices flow and legacy service_requests invoice flow |
| `/api/stripe/webhooks` | `stripe_events`, `billing_subscriptions`, `profiles`, `payments`, `invoices`, `jobs`, `job_status_history`, `service_requests` | idempotency check via `stripe_events`; asynchronous Stripe reconciliation and subscription state sync |
| `/api/match` | `jobs`, `contractor_profiles`, `documents`, `profiles`, `matches`, `job_status_history`, `lead_credits` | automated contractor selection and assignment; DB-RPC primary, TS fallback |
| `/api/invoices` | `invoices`, `jobs`, `profiles` | contractor invoice create/update and client visibility; role sourced from `profiles.role` |
| `/api/health` | `profiles`, `schema_health_check()` | connectivity and schema consistency checks |

### Canonical identity model

- `profiles.id` is canonical and equals `auth.users.id`.
- `documents.user_id`, `notifications.user_id`, `jobs.client_id`, `jobs.contractor_id`, and billing/payment identity columns also reference `auth.users.id`.

### Role authority

Route-level authorization uses `profiles.role` (DB) as the primary source of truth.
`user.user_metadata.role` is used only as a fallback during the initial registration flow
(before the `on_auth_user_created` trigger has written the `profiles` row).
See `docs/architecture.md` §6 for the full roles/permissions matrix.
