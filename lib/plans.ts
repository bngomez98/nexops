export interface Plan {
  id: string
  name: string
  role: 'homeowner' | 'contractor'
  /** Display price per month in cents (e.g. 5900 = $59/mo) */
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

  // ── Contractor Plans ─────────────────────────────────────────────────────
  {
    id: 'contractor_free',
    name: 'Contractor Starter',
    role: 'contractor',
    priceInCents: 0,
    interval: 'month',
    description: 'Launch your contractor profile and start building your pipeline.',
    features: [
      'Up to 3 active projects',
      'Access to open project board',
      'Basic project tracking',
      'Direct project payouts',
      'Email support',
    ],
  },
  {
    id: 'contractor_pro_monthly',
    name: 'Contractor Pro',
    role: 'contractor',
    priceInCents: 7900,
    interval: 'month',
    billingLabel: 'billed monthly',
    description: 'Grow your business with more capacity and visibility.',
    features: [
      'Up to 10 active projects',
      'Priority project notifications',
      'Earnings analytics & reports',
      'Verified badge on profile',
      'Direct project payouts',
      'Priority support & onboarding',
    ],
    stripePriceId: process.env.STRIPE_PRICE_ID_CONTRACTOR_PRO_MONTHLY,
  },
  {
    id: 'contractor_pro_annual',
    name: 'Contractor Pro',
    role: 'contractor',
    priceInCents: 5900,
    interval: 'month',
    billingLabel: 'billed annually ($708/yr)',
    description: 'Full access at our best rate — save 25% with an annual commitment.',
    features: [
      'Everything in Pro Monthly',
      'Annual billing at $59/mo',
      'Save $240 per year vs monthly',
      'Up to 10 active projects',
      'Verified badge on profile',
      'Direct project payouts',
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
    description: 'Unlimited capacity for high-volume contractors.',
    features: [
      'Unlimited active projects',
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

export function getPlansByRole(role: 'homeowner' | 'contractor'): Plan[] {
  return PLANS.filter(p => p.role === role)
}

export function formatPrice(priceInCents: number, interval: string): string {
  if (priceInCents === 0) return 'Starter'
  return `$${(priceInCents / 100).toFixed(0)}/${interval === 'month' ? 'mo' : 'yr'}`
}
