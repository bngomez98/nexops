Here is a complete, production-quality README for the [bngomez98/nexops](https://github.com/bngomez98/nexops/) repository, written based on the live site at [nexusoperations.org](https://nexusoperations.org) and the actual tech stack in your repo:

***

```markdown
# Nexus Operations

Web platform for [Nexus Operations](https://nexusoperations.org) — a property service management company based in Topeka, Kansas. The platform handles the full lifecycle of residential property service requests: submission, contractor assignment, documentation, project records, and maintenance advisory reporting.

## Overview

Nexus Operations connects property owners and managers with a vetted network of licensed, insured, and background-checked contractors across the primary residential trades. Each service request is reviewed by Nexus staff, assigned to a single contractor exclusively, and tracked from submission through completion. All project records persist permanently and power data-driven maintenance advisory reporting for property owners and managers.

The platform serves three distinct account types:

- **Homeowners** — Submit and track service requests for residential properties
- **Property Managers** — Manage requests, records, and reporting across a portfolio of addresses
- **Contractors** — Apply for and receive project notifications in their trade and service area

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org/) 16 (App Router) |
| Language | TypeScript 5.9 |
| UI Components | [Radix UI](https://www.radix-ui.com/) primitives |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Database / Auth | [Supabase](https://supabase.com/) (`@supabase/ssr`) |
| Payments | [Stripe](https://stripe.com/) |
| Analytics | Vercel Analytics + Speed Insights |
| Package Manager | pnpm 9 |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/) 9+

### Installation

```bash
git clone https://github.com/bngomez98/nexops.git
cd nexops
pnpm install
```

### Environment Variables

Create a `.env.local` file in the root of the project. The following variables are required:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Vercel Edge Config (if applicable)
EDGE_CONFIG=
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
pnpm build
pnpm start
```

## Project Structure

```
nexops/
├── app/              # Next.js App Router — pages, layouts, route handlers
├── components/       # Shared UI components (Radix UI + Tailwind)
├── lib/              # Utility functions, Supabase client, Stripe helpers
├── scripts/          # Standalone scripts (seeding, migrations, etc.)
├── docs/             # Internal documentation
├── public/           # Static assets
├── middleware.ts     # Route-level auth and redirect logic
├── next.config.mjs   # Next.js configuration
└── package.json
```

## Service Area

Shawnee County and immediately surrounding areas — Topeka, Kansas. Service area expands as additional verified contractors are approved into the network.

## Contact

- **Phone:** (785) 428-0244 — Monday–Friday, 8 AM–6 PM CT
- **Email:** admin@nexusoperations.org
- **Address:** Nexus Operations, LLC — Topeka, KS 66606

## License

Private. All rights reserved.
```

***

A few notes on what was included and why:

The tech stack table was built directly from [`package.json`](https://github.com/bngomez98/nexops/blob/main/package.json) in the repo, so the versions and dependencies are accurate.  The project structure reflects the actual directories (`app/`, `components/`, `lib/`, `scripts/`, `docs/`) present in the root of the repository.  The environment variable section covers Supabase, Stripe, and Vercel Edge Config — the three external services wired into the dependencies.

Would you like me to push this directly to the `README.md` file in the repo, or do you want to review/edit it first?
