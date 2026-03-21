export interface Plan {
  id: string
  name: string
  role: 'homeowner' | 'contractor'
  priceInCents: number
  interval: 'month' | 'year'
  description: string
  features: string[]
  highlighted?: boolean
  badge?: string
}

export const PLANS: Plan[] = [
  // ── Homeowner Plans ──────────────────────────────────────────────────────
  {
    id: 'homeowner_basic',
    name: 'Homeowner Basic',
    role: 'homeowner',
    priceInCents: 0,
    interval: 'month',
    description: 'Perfect for occasional one-off service requests.',
    features: [
      'Up to 3 service requests / year',
      'Verified contractor assignment',
      'Real-time project tracking',
      'Digital project history',
      'Basic email support',
    ],
  },
  {
    id: 'homeowner_pro',
    name: 'Homeowner Pro',
    role: 'homeowner',
    priceInCents: 2900,
    interval: 'month',
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
    highlighted: true,
    badge: 'Most Popular',
  },

  // ── Contractor Plans ─────────────────────────────────────────────────────
  {
    id: 'contractor_free',
    name: 'Contractor Free',
    role: 'contractor',
    priceInCents: 0,
    interval: 'month',
    description: 'Get started with the Nexus contractor network at no cost.',
    features: [
      'Up to 3 active projects',
      'Access to open project board',
      'Basic project tracking',
      'Direct homeowner payments',
      'Community support',
    ],
  },
  {
    id: 'contractor_pro',
    name: 'Contractor Pro',
    role: 'contractor',
    priceInCents: 7900,
    interval: 'month',
    description: 'Grow your business with more capacity and visibility.',
    features: [
      'Up to 10 active projects',
      'Priority project notifications',
      'Earnings analytics & reports',
      'Verified badge on profile',
      'Stripe Connect payouts',
      'Priority support & onboarding',
    ],
    highlighted: true,
    badge: 'Best Value',
  },
  {
    id: 'contractor_elite',
    name: 'Contractor Elite',
    role: 'contractor',
    priceInCents: 19900,
    interval: 'month',
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
  },
]

export function getPlanById(id: string): Plan | undefined {
  return PLANS.find(p => p.id === id)
}

export function getPlansByRole(role: 'homeowner' | 'contractor'): Plan[] {
  return PLANS.filter(p => p.role === role)
}

export function formatPrice(priceInCents: number, interval: string): string {
  if (priceInCents === 0) return 'Free'
  return `$${(priceInCents / 100).toFixed(0)}/${interval === 'month' ? 'mo' : 'yr'}`
}
