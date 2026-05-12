export interface Plan {
  id: string
  name: string
  role: 'homeowner' | 'contractor' | 'property_manager'
  /** Display price per month in cents (e.g. 5900 = $59/mo). 0 = free, -1 = contact sales */
  priceInCents: number
  /**
   * The Stripe price_data recurring interval used only when no stripePriceId is
   * set (dev/fallback). Annual plans are billed monthly at a discounted rate
   * ($59/mo) — the actual Stripe Price on the dashboard governs live billing.
   */
  interval: 'month' | 'year'
  /** Billing cadence label shown in UI */
  billingLabel?: string
  description: string
  features: string[]
  highlighted?: boolean
  badge?: string
  /** When true, the price is per unit/month rather than a flat fee */
  perUnit?: boolean
  /** Minimum monthly charge in cents when perUnit is true */
  minimumCents?: number
  /** Stripe Price ID – set via STRIPE_PRICE_ID_<PLAN_ID_UPPER> env var */
  stripePriceId?: string
}

export const PLANS: Plan[] = [
  // ── Homeowner Plans ──────────────────────────────────────────────────────
  {
    id: 'homeowner_basic',
    name: 'Homeowner Starter',
    role: 'homeowner',
    priceInCents: 0,
    interval: 'month',
    description: 'Ideal for occasional service requests with full platform access.',
    features: [
      'Up to 3 service requests / year',
      'Verified contractor assignment',
      'Real-time project tracking',
      'Digital project history',
      'Email support',
    ],
  },
  {
    id: 'homeowner_pro_monthly',
    name: 'Homeowner Pro',
    role: 'homeowner',
    priceInCents: 7900,
    interval: 'month',
    billingLabel: 'billed monthly',
    description: 'For active homeowners who need reliable, ongoing service.',
    features: [
      'Unlimited service requests',
      'Priority contractor matching',
      'Maintenance schedule & reminders',
      'Portfolio-level spend analytics',
      'Invoice & document storage',
      'Priority phone & email support',
      'Insurance-ready project reports',
    ],
    stripePriceId: process.env.STRIPE_PRICE_ID_HOMEOWNER_PRO_MONTHLY,
  },
  {
    id: 'homeowner_pro_annual',
    name: 'Homeowner Pro',
    role: 'homeowner',
    priceInCents: 5900,
    interval: 'month',
    billingLabel: 'billed annually ($708/yr)',
    description: 'Full access at our best rate — save 25% with an annual commitment.',
    features: [
      'Everything in Pro Monthly',
      'Annual billing at $59/mo',
      'Save $240 per year vs monthly',
      'Priority contractor matching',
      'Maintenance schedule & reminders',
      'Portfolio-level spend analytics',
      'Insurance-ready project reports',
    ],
    highlighted: true,
    badge: 'Best Value',
    stripePriceId: process.env.STRIPE_PRICE_ID_HOMEOWNER_PRO_ANNUAL,
  },

  // ── Property Manager Plans ───────────────────────────────────────────────
  {
    id: 'pm_starter',
    name: 'PM Starter',
    role: 'property_manager',
    priceInCents: 0,
    interval: 'month',
    description: 'Get started coordinating maintenance for up to 2 properties at no cost.',
    features: [
      'Up to 2 properties',
      'Up to 3 service requests / year',
      'Verified contractor assignment',
      'Real-time work order tracking',
      'Unified billing across properties',
      'Email support',
    ],
  },
  {
    id: 'pm_growth',
    name: 'PM Growth',
    role: 'property_manager',
    priceInCents: 400,
    interval: 'month',
    billingLabel: '$4 / unit · mo (min $50/mo)',
    description: 'For small landlords growing a rental portfolio.',
    perUnit: true,
    minimumCents: 5000,
    features: [
      '3 – 20 units',
      'Unlimited service requests',
      'Portfolio analytics & spend reports',
      'Maintenance scheduling & reminders',
      'Invoice & document storage',
      'SLA monitoring dashboard',
      'Priority phone & email support',
    ],
    highlighted: true,
    badge: 'Most Popular',
    stripePriceId: process.env.STRIPE_PRICE_ID_PM_GROWTH,
  },
  {
    id: 'pm_scale',
    name: 'PM Scale',
    role: 'property_manager',
    priceInCents: -1,
    interval: 'month',
    billingLabel: 'custom pricing',
    description: 'Enterprise-grade maintenance operations for 21+ unit portfolios.',
    features: [
      '21+ units — custom per-unit rate',
      'Everything in PM Growth',
      'Dedicated account manager',
      'Priority contractor dispatch',
      'Custom SLA agreements',
      'API access for integrations',
      'Portfolio-level reporting & exports',
    ],
    stripePriceId: process.env.STRIPE_PRICE_ID_PM_SCALE,
  },

  // ── Contractor Plans ─────────────────────────────────────────────────────
  {
    id: 'contractor_free',
    name: 'Contractor Starter',
    role: 'contractor',
    priceInCents: 0,
    interval: 'month',
    description: 'Free to join. Earn on every completed job with a simple commission.',
    features: [
      'Up to 3 active projects',
      'Access to open project board',
      'Basic project tracking',
      '10–15% commission on completed jobs',
      'Direct project payouts',
      'Email support',
    ],
  },
  {
    id: 'contractor_pro_monthly',
    name: 'Contractor Pro',
    role: 'contractor',
    priceInCents: 4900,
    interval: 'month',
    billingLabel: 'billed monthly',
    description: 'Enhanced visibility and faster payouts for growing contractors.',
    features: [
      'Up to 10 active projects',
      '"Verified Pro" badge on profile',
      'Priority project notifications & routing',
      'Reduced commission rate on completed jobs',
      'Earnings analytics & reports',
      'Same-day payouts',
      'Priority support & onboarding',
    ],
    stripePriceId: process.env.STRIPE_PRICE_ID_CONTRACTOR_PRO_MONTHLY,
  },
  {
    id: 'contractor_pro_annual',
    name: 'Contractor Pro',
    role: 'contractor',
    priceInCents: 3900,
    interval: 'month',
    billingLabel: 'billed annually ($468/yr)',
    description: 'Full Pro access at our best rate — save 20% with an annual commitment.',
    features: [
      'Everything in Pro Monthly',
      'Annual billing at $39/mo',
      'Save $120 per year vs monthly',
      '"Verified Pro" badge on profile',
      'Priority routing & same-day payouts',
    ],
    highlighted: true,
    badge: 'Best Value',
    stripePriceId: process.env.STRIPE_PRICE_ID_CONTRACTOR_PRO_ANNUAL,
  },
  {
    id: 'contractor_elite',
    name: 'Contractor Elite',
    role: 'contractor',
    priceInCents: 19900,
    interval: 'month',
    billingLabel: 'billed monthly',
    description: 'Unlimited capacity and lowest commission rate for high-volume contractors.',
    features: [
      'Unlimited active projects',
      'Lowest commission rate on completed jobs',
      'First-look on all new requests',
      'Advanced earnings dashboard',
      'Dedicated account manager',
      'White-glove onboarding',
      'Custom service area settings',
      'API access for integrations',
    ],
    stripePriceId: process.env.STRIPE_PRICE_ID_CONTRACTOR_ELITE,
  },
]

export function getPlanById(id: string): Plan | undefined {
  return PLANS.find(p => p.id === id)
}

export function getPlansByRole(role: 'homeowner' | 'contractor' | 'property_manager'): Plan[] {
  return PLANS.filter(p => p.role === role)
}

export function formatPrice(priceInCents: number, interval: string): string {
  if (priceInCents === 0) return 'Free'
  if (priceInCents === -1) return 'Contact us'
  return `$${(priceInCents / 100).toFixed(0)}/${interval === 'month' ? 'mo' : 'yr'}`
}
