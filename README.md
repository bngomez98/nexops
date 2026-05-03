Nexus Operations is a Next.js web application serving Topeka, KS and the surrounding region. Homeowners submit documented project requests — including photos, written scope, and a maximum budget — and licensed, insured contractors can claim projects exclusively. Projects are immediately removed from all other contractors' feeds upon claim.

**For homeowners:** Free to submit requests. Matched with one verified contractor, confirmed within 24 hours.

**For contractors:** Flat monthly membership ($299–$749/month). Unlimited project claims. No per-lead fees.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Database | Supabase (Postgres + Auth + Realtime) |
| Styling | Tailwind CSS 4, shadcn/ui |
| Forms | React Hook Form + Zod |
| Payments | Stripe (subscriptions + Connect) |
| Email | Resend |
| Storage | Vercel Blob |
| Charts | Recharts |
| Package manager | pnpm |

For a detailed description of the system architecture, data model, RLS policies, matching engine, fee lifecycle, and environment variables see [`docs/architecture.md`](docs/architecture.md).

## Prerequisites

- Node.js 20 or later
- pnpm 9 or later

## Getting Started

**Install dependencies:**

\`\`\`bash
pnpm install
\`\`\`

**Start the development server:**

\`\`\`bash
pnpm dev
\`\`\`

The application will be available at `http://localhost:3000`.

**Build for production:**

\`\`\`bash
pnpm build
pnpm start
\`\`\`


## Database Configuration

- Primary runtime database: **Supabase** (`NEXT_PUBLIC_SUPABASE_URL` + publishable/anon key)
- Optional auxiliary Postgres variables for Neon are still supported, but app APIs and migrations target Supabase tables.
- Source-of-truth schema for automated setup: `scripts/setup.sql`

Apply schema with:

```bash
SUPABASE_PROJECT_REF=... SUPABASE_ACCESS_TOKEN=... node scripts/migrate.mjs
```

By default the migration runner applies `scripts/setup.sql`.

To apply only the project trigger migration:

```bash
SUPABASE_PROJECT_REF=... SUPABASE_ACCESS_TOKEN=... SUPABASE_MIGRATION_FILE=013_project_triggers.sql node scripts/migrate.mjs
```

## Project Structure

\`\`\`
nexops/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/                # Server-side API handlers
│   │   ├── auth/           # Authentication endpoints (login, signup, logout, me)
│   │   ├── leads/          # Contractor project feed
│   │   └── requests/       # Homeowner request management
│   ├── dashboard/
│   │   ├── contractor/     # Contractor portal (projects, analytics, settings)
│   │   └── homeowner/      # Homeowner portal (requests, new submission, settings)
│   ├── contractors/        # Public contractor landing page
│   ├── pricing/            # Membership tier comparison
│   ├── services/           # Service category directory
│   └── ...                 # Additional public pages (contact, terms, privacy)
├── components/             # Reusable React components
│   ├── ui/                 # Base UI primitives (shadcn/ui)
│   └── ...                 # Feature components (hero, FAQ, comparison, etc.)
├── lib/
│   ├── auth.ts             # Session management utilities
│   ├── store.ts            # In-memory data store (development)
│   └── utils.ts            # Shared helpers
└── middleware.ts            # Security headers and route protection
\`\`\`

## Authentication

Four roles exist: `homeowner`, `contractor`, `property-manager`, and `admin`. Middleware redirects unauthenticated users from `/dashboard/*` to `/auth/login`. Role is stored in `profiles.role` (Supabase Postgres) and `user_metadata.role` (Supabase Auth). RLS policies enforce data access per role.

## Security

`middleware.ts` applies the following HTTP security headers on every response:

- `Strict-Transport-Security` (2-year max-age, includeSubDomains)
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Content-Security-Policy`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` (camera, microphone, geolocation restricted)
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Resource-Policy: same-origin`

## CI/CD

GitHub Actions now runs a full CI pipeline on every push and pull request:

- ESLint (`pnpm lint`)
- TypeScript type checks (`npx tsc --noEmit`)
- Vitest test suite (`pnpm test`)
- Production build verification (`pnpm build`)

Each CI run now executes all four checks and then fails at the end if any check failed, so every run surfaces the full set of issues instead of stopping after the first failure.

A dedicated CD workflow deploys to Vercel production after CI succeeds on `main` (or via manual dispatch), when `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` secrets are configured in repository settings.


## Deployment

The application deploys to Vercel. Connect the repository in the Vercel dashboard; production deploys run automatically after CI passes on `main`.

Required environment variables are listed in [`env.example`](env.example) and documented in detail in [`docs/architecture.md`](docs/architecture.md#environment-variable-inventory).
