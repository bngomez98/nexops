# Nexus Operations

Contractor marketplace platform connecting homeowners with a single, verified contractor per project. No shared leads. No bidding wars. One request, one professional.

## Overview

Nexus Operations is a Next.js web application serving Topeka, KS and the surrounding region. Homeowners submit a documented project request — including photos, written scope, and a maximum budget — and one licensed, insured contractor claims it exclusively. The project is immediately removed from all other contractors' feeds upon claim.

**For homeowners:** Free to submit requests. Matched with one verified contractor, confirmed within 24 hours.

**For contractors:** Flat monthly membership ($299–$749/month). Unlimited project claims. No per-lead fees.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4, shadcn/ui |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Package manager | pnpm |

## Prerequisites

- Node.js 20 or later
- pnpm 9 or later

## Getting Started

**Install dependencies:**

```bash
pnpm install
```

**Start the development server:**

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

**Build for production:**

```bash
pnpm build
pnpm start
```

## Project Structure

```
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
```

## Authentication

Role-based routing is enforced via `middleware.ts`. Two user roles exist:

- `homeowner` — access to `/dashboard/homeowner/*`
- `contractor` — access to `/dashboard/contractor/*`

Session tokens are validated server-side on every protected request. Unauthenticated users are redirected to `/login`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Authenticate a user and issue a session |
| POST | `/api/auth/signup` | Register a new homeowner or contractor |
| POST | `/api/auth/logout` | Terminate the current session |
| GET | `/api/auth/me` | Return the authenticated user's profile |
| GET | `/api/leads` | Return available project requests (contractor-only) |
| GET/POST | `/api/requests` | Manage homeowner project submissions |

## Service Categories

Three categories are currently active in Topeka, KS:

| Category | Status | Typical Budget Range |
|---|---|---|
| Tree Removal | Live | $500 – $8,000 |
| Concrete Work | Live | $1,200 – $15,000 |
| Roofing | Live | $300 – $25,000 |
| HVAC | Launching Q3 | $3,000 – $20,000 |
| Fencing | Launching Q3 | $1,500 – $8,000 |
| Electrical | Launching Q4 | $500 – $10,000 |
| Plumbing | Launching Q4 | TBD |
| Excavation | Planned 2026 | TBD |

## Membership Tiers

| Tier | Price | Key Differentiator |
|---|---|---|
| Standard | $299/month | Full project feed, first-come first-served |
| Premium | $499/month | 90-second advance notification window |
| Elite | $749/month | 10-minute exclusive window on $5K+ projects |

All tiers include unlimited project claims, full project documentation before claiming, and a performance dashboard. No annual contracts. Cancel anytime.

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

## Deployment

The application is configured for deployment on Vercel. No additional configuration is required beyond connecting the repository. The `next.config.mjs` file does not require environment-specific overrides for basic deployment.

For production deployments that require a persistent data layer, replace the in-memory store in `lib/store.ts` with a database-backed implementation.
