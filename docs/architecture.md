# Nexus Operations — Architecture & Security Reference

> **Last updated:** 2026-04-23
> Covers trust boundaries, data-flow, RLS bypass inventory, failure modes,
> env catalog, roles/permissions matrix, and migration strategy.

---

## 1. Trust Boundaries & Data-Flow

### 1.1 Principal hierarchy

```
Browser / Mobile
  │
  │  HTTPS + Supabase JWT (anon or authenticated)
  ▼
Next.js Edge / Node.js API Routes
  ├─► Supabase (RLS-enforced, authenticated client)     ← user boundary
  ├─► Supabase (service-role admin client)              ← service boundary
  ├─► Stripe API                                        ← external boundary
  └─► OpenAI API                                        ← external boundary
```

### 1.2 Synchronous mutation paths (request → response in same HTTP call)

| Route | Caller | Writes |
|---|---|---|
| `POST /api/projects/create` | authenticated user | `service_requests` (INSERT) |
| `POST /api/projects/claim/[id]` | contractor | `service_requests` (UPDATE status+contractor) |
| `POST /api/projects/[id]` | owner / contractor / admin | `service_requests` (UPDATE) |
| `POST /api/invoices` | contractor | `invoices` (INSERT) |
| `PATCH /api/invoices` | contractor / admin | `invoices` (UPDATE status) |
| `POST /api/stripe/checkout` | authenticated user | Stripe session (external); no DB write |
| `POST /api/stripe/portal` | authenticated user | Stripe portal session (external); no DB write |
| `POST /api/automation/match-contractor` | authenticated user | `service_requests` (conditional UPDATE) |
| `POST /api/automation/update-status` | owner / contractor | `service_requests` + `notifications` |
| `POST /api/portal/jobs/[id]/assign` | admin | `service_requests` (UPDATE) |
| `POST /api/portal/jobs/[id]/status` | owner / contractor / admin | `service_requests` + `notifications` |
| `POST /api/match` | authenticated user | `service_requests` or `jobs` (UPDATE) + `matches` + `job_status_history` + `lead_credits` |
| `POST /api/upload` | authenticated user | `documents` (INSERT) + Storage |

### 1.3 Asynchronous / fire-and-forget paths

| Trigger | Path | Side-effects | Failure mode |
|---|---|---|---|
| Stripe webhook delivery | `POST /api/stripe/webhooks` | `payments`, `invoices`, `jobs`, `billing_subscriptions`, `profiles` updates + email | Idempotent via `stripe_events` table; Stripe retries on 5xx |
| Background auto-match | `POST /api/match` or `POST /api/automation/match-contractor` fires after `/api/projects/create` | `service_requests.assigned_contractor_id` | Best-effort; failure leaves request unassigned |
| Fire-and-forget email (match) | Inside `/api/match` (async IIFE) | Resend API call | Logged; non-fatal |
| Fire-and-forget email (invoice sent) | Inside `PATCH /api/invoices` | Resend API call | Logged; non-fatal |
| Fire-and-forget email (invoice paid) | Inside Stripe webhook handler | Resend API call | Logged; non-fatal |
| Cron: document-expiry | `GET /api/cron/document-expiry` (09:00 UTC daily) | Resend API calls per contractor | Non-fatal per-user; result logged |
| Cron: invoice-maintenance | `GET /api/cron/invoice-maintenance` (09:15 UTC daily) | `invoices` status → `overdue` via DB function | Retried next day |
| Cron: sla-sweep | `GET /api/cron/sla-sweep` (every 5 min) | `service_requests.sla_breached` flag via DB function | Retried on next tick |

---

## 2. RLS Bypass Inventory (service-role usage)

All service-role usage goes through `lib/supabase/admin.ts → getAdminClient()`.
**Never import this in client-side code.**

| Location | Reason for bypass | Allowed operations | Abuse controls |
|---|---|---|---|
| `app/api/stripe/webhooks/route.ts` | Webhook has no user JWT; must update payments/profiles/subscriptions on Stripe's behalf | UPDATE `payments`, `invoices`, `jobs`, `billing_subscriptions`, `profiles`; INSERT `job_status_history`, `stripe_events` | Stripe HMAC signature verified before any DB write; idempotency via `stripe_events` |
| `app/api/match/route.ts` (email IIFE) | `auth.admin.getUserById` requires service role to look up emails of other users | READ auth.users email only | Called only after successful assignment; wrapped in try/catch; no data written |
| `app/api/invoices/route.ts` (PATCH, email IIFE) | `auth.admin.getUserById` for client/contractor email lookup | READ auth.users email only | Called only on `sent` transition; wrapped in try/catch; no data written |
| `app/api/cron/document-expiry/route.ts` | Reads documents of many users + looks up auth emails | SELECT `documents`, `profiles`; READ auth.users email | Requires `CRON_SECRET` Bearer token; no writes via admin client |
| `app/api/cron/invoice-maintenance/route.ts` | Calls `maintenance_mark_overdue_invoices()` DB function which requires elevated access | RPC call only | Requires `CRON_SECRET` Bearer token |
| `app/api/cron/sla-sweep/route.ts` | Calls `maintenance_flag_sla_breaches()` DB function | RPC call only | Requires `CRON_SECRET` Bearer token |
| `app/api/portal/public-request/route.ts` | Anon submissions lack user JWT | INSERT `service_requests` (owner_id = null, submission_token required) | Validated against `anon_can_submit_requests` RLS policy; submission_token enforced |
| `app/api/portal/public-upload/route.ts` | Anon uploads lack user JWT | INSERT Storage objects | File type + size validated; path scoped to submission_token |

---

## 3. Matching Engine Canonical Rules

### 3.1 Canonical engine: `/api/match`

`POST /api/match` is the **authoritative** matching endpoint. It uses:

1. **Primary path:** `match_contractors_by_distance()` DB RPC (migration 017) — distance-weighted, SLA-aware, compliance-checked.
2. **Fallback path (if RPC unavailable):** TypeScript scorer in `fallbackScoreContractors()` using `scoreContractorMatch()` from `lib/business-logic.ts`.

**Score breakdown (100 points max):**
- +40 primary trade category match
- +25 within service radius (linear decay)
- +15/10/5 rating ≥ 4.5/4.0/3.5
- +10 verified + compliance docs current
- +10 SLA headroom (< max_active_jobs)

**Tie-breaking:** score DESC, then distance_miles ASC (closer wins).

**Concurrency guard:** `UPDATE service_requests WHERE id = ? AND assigned_contractor_id IS NULL`

### 3.2 `POST /api/automation/match-contractor` (simplified scorer)

This is a **convenience endpoint** for admin/automation surfaces. It uses a simplified 0–100 scoring model (category match, workload, rating) and only calls the DB update when score > 85. It shares the same concurrency guard as `/api/match`.

**Rule:** Both endpoints must use `.is('assigned_contractor_id', null)` on the assignment UPDATE to prevent double-assignment.

### 3.3 Fallback correctness rules

| Situation | Behavior |
|---|---|
| `match_contractors_by_distance` RPC missing (migration 017 not run) | Fall back to TS scorer; log `rpcErr` at warn level |
| RPC returns 0 results | Fall back to TS scorer |
| TS scorer returns 0 results | Return `{ matched: false, reason: '...' }` — do not assign |
| Assignment UPDATE matches 0 rows (already claimed) | Return `{ matched: false, reason: 'race condition' }` |

---

## 4. Money-Flow Lifecycle

### 4.1 Canonical fee model

Fees are urgency-based and calculated server-side in `calculateInvoiceTotals()` (`lib/business-logic.ts`):

| Urgency | Nexus fee rate |
|---|---|
| `routine` | 25% of subtotal |
| `urgent` | 30% of subtotal |
| `emergency` | 35% of subtotal |

`water-damage` and `mold-remediation` service categories have a `feeOverride = 0.30` regardless of urgency (defined in `lib/service-categories.ts`).

**The Nexus fee is always calculated server-side at invoice creation time** (`POST /api/invoices`). Clients cannot pass a fee rate.

### 4.2 Money-flow lifecycle

```
1. Homeowner submits request (no payment required)
2. Contractor claims / is assigned
3. Contractor creates invoice → status: draft
   → fee calculated from job.urgency via calculateInvoiceTotals()
4. Contractor sends invoice → status: sent
   → client receives email with total due
5. Client pays (via Stripe Checkout session created by /api/stripe/invoice)
6. Stripe fires checkout.session.completed webhook
   → payments.status = 'paid'
   → invoices.status = 'paid' (via stripe_events idempotency)
   → jobs.status = 'completed'
   → contractor/client receipt emails sent
7. Stripe fires invoice.paid webhook (for subscription renewals — separate flow)
```

### 4.3 Invoice mutation rules

| Who | Allowed transition | Notes |
|---|---|---|
| Contractor | `draft → sent` | Triggers client email |
| Contractor | `draft → void`, `sent → void` | Only before payment |
| Admin | Any transition | Including `→ paid` |
| Stripe webhook | `sent → paid`, `overdue → paid` | Via service-role; idempotent |
| Cron | `sent → overdue` | After `due_date + 3-day grace` |
| Client | None | Clients can only pay, not mutate status |

---

## 5. Failure-Mode Matrix

| System | Outage scenario | User-visible behavior | Retry owner | Idempotency key | Compensating action |
|---|---|---|---|---|---|
| Supabase (auth) | Auth service down | Login fails; dashboard blocked | Client retries | — | Session cookie valid until expiry; offline grace period |
| Supabase (DB) | Database unavailable | API routes return 500 | Client retries | — | No partial writes (single-statement mutations) |
| Stripe (API) | Cannot create checkout | Error surfaced to user | Client retries | — | No DB write occurs before Stripe session |
| Stripe (webhooks) | Webhook delivery fails | Payment not reconciled | Stripe retries (up to 3 days) | `stripe_events.id` = Stripe evt_xxx | Stripe retries; idempotency guard prevents double-processing |
| Stripe (partial webhook) | Webhook processes but DB write fails mid-switch | Payment state inconsistent | Stripe retries | `stripe_events.id` | Re-insert of `stripe_events` will find existing row and skip |
| OpenAI | API unavailable | AI routes return 503 | Client retries | — | Non-blocking; all AI routes degrade gracefully via `OPENAI_API_KEY` check |
| Resend (email) | Email delivery fails | No email sent | None (fire-and-forget) | — | Errors logged; no DB rollback needed |
| Cron (document-expiry) | Route fails | Warning email not sent | Vercel retries once | — | Resent next day |
| Cron (invoice-maintenance) | Route fails | Invoices not flipped to overdue | Vercel retries once | — | Processed on next day's run |
| Cron (sla-sweep) | Route fails | SLA breach not flagged | Vercel retries | — | Flagged on next 5-minute tick |

### 5.1 Partial-failure hotspots

**Multi-table webhook updates:**
- `checkout.session.completed` writes `payments` + `invoices` + `jobs` + `profiles`.
- If any write after the first `stripe_events` insert fails, the webhook returns 500.
- Stripe retries → `stripe_events` record exists → returns `{ received: true, duplicate: true }` immediately, preventing double-processing.
- **Risk:** Partial state if first write succeeds and second fails before the 500 response. Mitigation: each table write is a separate `UPDATE` that is safe to replay.

**Background auto-match (fire-and-forget from `/api/projects/create`):**
- If match fails, request remains `pending_review` — the admin can manually assign.
- No partial state risk: a single `UPDATE ... WHERE assigned_contractor_id IS NULL`.

---

## 6. Roles & Permissions Enforcement Matrix

### 6.1 Application roles

| Role | Source of truth | Enforcement |
|---|---|---|
| `homeowner` | `profiles.role` | RLS `auth.uid() = owner_id` |
| `contractor` | `profiles.role` | RLS `auth.uid() = assigned_contractor_id` or `role = 'contractor'` |
| `property-manager` | `profiles.role` | Stored as `property_manager` in DB; mapped in app |
| `admin` | `profiles.role` via `is_admin()` DB function | RLS + API route check |

**Role source precedence (API routes):** `profiles.role` (DB) → `user.user_metadata.role` (fallback, only used when DB lookup is not yet possible, e.g., during registration).

### 6.2 Route access matrix

| Route | homeowner | contractor | property-manager | admin |
|---|---|---|---|---|
| `GET /api/projects/list?type=my-projects` | own requests | assigned requests | own requests | all |
| `GET /api/projects/list?type=available` | ✗ | unclaimed only | ✗ | ✗ |
| `GET /api/projects/list?type=all` | ✗ | ✗ | ✓ | ✓ |
| `POST /api/projects/claim/[id]` | ✗ | ✓ (verified only) | ✗ | ✗ |
| `POST /api/match` | ✓ (own) | ✗ | ✓ | ✓ |
| `POST /api/invoices` | ✗ | ✓ (own jobs) | ✗ | ✓ |
| `GET /api/invoices` | own (client_id) | own (contractor_id) | — | all |
| `PATCH /api/invoices` | ✗ | draft→sent, void | ✗ | any |
| `POST /api/portal/jobs/[id]/assign` | ✗ | ✗ | ✗ | ✓ |
| `POST /api/portal/jobs/[id]/status` | owner | assigned | ✗ | ✓ |
| `GET /api/cron/*` | ✗ | ✗ | ✗ | CRON_SECRET only |
| `POST /api/stripe/webhooks` | ✗ | ✗ | ✗ | Stripe HMAC only |
| `POST /api/ai/chat` | ✓ | ✓ | ✓ | ✓ |
| `POST /api/ai/insights` | ✓ | ✓ | ✓ | ✓ |
| `POST /api/automation/categorize-request` | ✓ | ✓ | ✓ | ✓ |
| `POST /api/automation/match-contractor` | owner (own request) | ✗ | ✗ | ✓ |
| `POST /api/automation/update-status` | owner | assigned | ✗ | ✓ |

### 6.3 RLS policy summary (from `scripts/setup.sql`)

| Table | RLS policy | Notes |
|---|---|---|
| `profiles` | Own row or admin; contractors readable publicly if active | |
| `contractor_profiles` | Self or admin; publicly readable if `is_available = true` | |
| `service_requests` | Owner all; assigned contractor select+update; contractors browse open; admin all | `requests_contractor_claim` allows self-assign |
| `messages` | Sender and recipient; admin all | |
| `notifications` | Own user_id only | Insert allowed for project participants |
| `documents` | Own user_id or admin | |
| `payments` | Payer, contractor, or admin | Updates: admin only |
| `jobs` | Client, contractor, or admin | |
| `matches` | Job participants or admin | |
| `invoices` | Contractor or client or admin | Update: contractor or admin only |
| `billing_subscriptions` | Own user_id or admin | |
| `service_categories` | Public read (active only); admin write | |

---

## 7. Environment Variable Catalog

### 7.1 Required — server-only (never expose to browser)

| Variable | Purpose |
|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Admin client (RLS bypass) |
| `STRIPE_SECRET_KEY` | Stripe API server calls |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signature verification |
| `CRON_SECRET` | Authenticate Vercel Cron invocations to `/api/cron/*` |

### 7.2 Required — public (browser + server)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Supabase anon/publishable key |

### 7.3 Conditionally required

| Variable | Required when |
|---|---|
| `RESEND_API_KEY` | Sending transactional emails |
| `OPENAI_API_KEY` | Using `/api/ai/*` or `/api/automation/categorize-request` |

### 7.4 Optional — public

| Variable | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://nexusoperations.org` | Canonical URL for links in emails and redirects |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | — | Stripe.js on client |
| `NEXT_PUBLIC_AUTOMATION_ENABLED` | `false` | Feature flag for automation endpoints |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | — | Google Analytics 4 |
| `NEXT_PUBLIC_GOOGLE_MERCHANT_ID` | — | Google Customer Reviews |
| `NEXT_PUBLIC_ZENDESK_KEY` | — | Zendesk widget |
| `NEXT_PUBLIC_CONTRACTOR_SUBSCRIPTION_PRICE_CENTS` | `7900` | Default contractor plan price override |
| `NEXT_PUBLIC_DISPATCH_REGION_LAT/LNG/RADIUS_MILES` | Topeka KS, 30 mi | Dispatch region config |

### 7.5 Optional — server

| Variable | Purpose |
|---|---|
| `RESEND_FROM_EMAIL` | Sending address (defaults to `noreply@nexusoperations.org`) |
| `SUPABASE_PROJECT_REF` | Migration scripts |
| `SUPABASE_ACCESS_TOKEN` | Migration scripts |
| `NEXUS_FEE_RATE_ROUTINE/URGENT/EMERGENCY` | Override fee rates from `lib/business-logic.ts` |
| `NEXUS_INVOICE_DUE_DAYS_DEFAULT` | Override default net-terms (default: 15) |

### 7.6 Legacy / deprecated (Neon)

| Variable | Status |
|---|---|
| `DATABASE_URL` | **Deprecated.** Neon pooled connection. Used only by `/api/health` and migration scripts. Remove after Q3 2026. |
| `DATABASE_URL_UNPOOLED` | **Deprecated.** Neon direct connection. Same as above. |
| `POSTGRES_URL` / `POSTGRES_PRISMA_URL` / `POSTGRES_URL_NON_POOLING` / `NEON_DATABASE_URL` | **Deprecated.** Legacy aliases. Remove after Q3 2026. |

### 7.7 Duplicate / inconsistency notes

- `OPENAI_API_KEY` appears twice in `env.example` (lines 12 and 92). The later entry under `# ─── OpenAI ───` is the canonical one.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `EXPO_PUBLIC_SUPABASE_KEY`, `SUPABASE_ANON_KEY` are legacy fallback aliases for the publishable key. Prefer `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`.
- `AUTOMATION_ENABLED` (server-only) takes precedence over `NEXT_PUBLIC_AUTOMATION_ENABLED` when both are set.

---

## 8. Migration & Versioning Strategy

### 8.1 Canonical migration order

Run scripts in this exact order against the Supabase project:

```
1. scripts/setup.sql                      — base schema, RLS, triggers
2. scripts/007_service_billing_setup.sql  — subscription/billing columns
3. scripts/016_public_requests.sql        — anonymous/guest submission support
4. scripts/017_nexus_business_model.sql   — geo matching, SLA, lead credits, audit
```

**Never use** `scripts/010_full_platform_schema.sql` or `scripts/014_complete_schema.sql` on an existing database — these are frozen snapshots used only for greenfield deployments that were superseded by `setup.sql`.

### 8.2 Schema drift issues to resolve

| Issue | File | Resolution |
|---|---|---|
| `service_requests.owner_id` is `NOT NULL` in `setup.sql` but made nullable in migration 016 | `setup.sql` line 500 vs `016_public_requests.sql` line 4 | Migration 016 is additive and correct; `setup.sql` will be updated in the next revision |
| `messages` table in `setup.sql` uses `job_id` + `sender_id`/`recipient_id` columns but the portal bootstrap query selects `request_id` and `body` | `setup.sql` vs `app/api/portal/bootstrap/route.ts` | Portal bootstrap uses the canonical `messages` schema from `setup.sql`; the `request_id` in the query maps to `job_id` |

### 8.3 Neon status decision

**Status: Deprecated fallback — removal target Q3 2026.**

Neon (PostgreSQL) was the original backend. **Supabase is now the primary and sole runtime database.** Neon connection strings (`DATABASE_URL`, `DATABASE_URL_UNPOOLED`, and aliases) are retained only because:

1. The `/api/health` route reports whether they are configured.
2. Some developers may use them with `psql` to run migration scripts directly.

**Action items:**
- Q2 2026: Update migration scripts to require `SUPABASE_PROJECT_REF` / `SUPABASE_ACCESS_TOKEN` and deprecate `DATABASE_URL` usage.
- Q3 2026: Remove all Neon/Postgres env vars from `env.example`, `lib/env.ts`, and the health check.
