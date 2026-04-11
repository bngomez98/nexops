## Database Route Contract Matrix

| Route | Tables | Contract |
|---|---|---|
| `/api/auth/me` | `profiles`, `service_requests` | `profiles.id = auth.users.id`; contractor counts from `service_requests.assigned_contractor_id` |
| `/api/projects/*` | `profiles`, `service_requests` | owner/contractor authorization and lifecycle status updates |
| `/api/messages*` | `messages`, `service_requests`, `profiles` | `messages.job_id` maps to `service_requests.id`; participant authorization via owner/assigned contractor |
| `/api/notifications` | `notifications` | user-scoped read/update/delete via `notifications.user_id` |
| `/api/upload` | `documents`, `storage.objects` | document metadata persisted with `user_id`, `verified`, `status` |
| `/api/cron/document-expiry` | `documents`, `profiles` | expiring compliance docs by `documents.user_id`; recipient name from `profiles.id` |
| `/api/stripe/dispatch` | `service_requests`, `profiles`, `payments` | owner pay flow, assigned contractor payout metadata |
| `/api/stripe/invoice` | `invoices`, `jobs`, `profiles`, `payments`, `service_requests` | jobs/invoices flow and legacy service_requests invoice flow |
| `/api/stripe/webhooks` | `billing_subscriptions`, `profiles`, `payments`, `invoices`, `jobs`, `job_status_history`, `service_requests` | asynchronous Stripe reconciliation and subscription state sync |
| `/api/match` | `jobs`, `contractor_profiles`, `documents`, `profiles`, `matches`, `job_status_history` | automated contractor selection and assignment |
| `/api/invoices` | `invoices`, `jobs`, `profiles` | contractor invoice create/update and client visibility |
| `/api/health` | `profiles`, `schema_health_check()` | connectivity and schema consistency checks |

### Canonical identity model

- `profiles.id` is canonical and equals `auth.users.id`.
- `documents.user_id`, `notifications.user_id`, `jobs.client_id`, `jobs.contractor_id`, and billing/payment identity columns also reference `auth.users.id`.
