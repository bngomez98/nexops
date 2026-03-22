'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardNav } from '@/components/dashboard-nav'
import { Logo } from '@/components/logo'
import { getPlansByRole, formatPrice, type Plan } from '@/lib/plans'
import {
  Check, Crown, Loader2, ExternalLink, ArrowLeft,
  CreditCard, Shield, AlertCircle, Zap, Star, TrendingUp, BriefcaseBusiness, BarChart3,
} from 'lucide-react'
import { toast } from 'sonner'

interface UserData {
  id: string
  name: string
  role: string
  stripeCustomerId?: string | null
  subscriptionTier?: string
  subscriptionStatus?: string
}

const PLAN_CAPACITY: Record<string, string> = {
  contractor_free: 'Up to 3 active projects',
  contractor_pro: 'Up to 10 active projects',
  contractor_elite: 'Unlimited active projects',
}

const PLAN_LABELS: Record<string, string> = {
  contractor_free: 'Contractor Free',
  contractor_pro: 'Contractor Pro',
  contractor_elite: 'Contractor Elite',
}

export default function ContractorBillingPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const [portalLoading, setPortalLoading] = useState(false)

  const plans = getPlansByRole('contractor')

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch('/api/auth/me')
        if (!res.ok) { router.push('/auth/login'); return }
        const { user: u } = await res.json()
        if (u.role !== 'contractor') { router.push('/dashboard/homeowner/billing'); return }
        setUser(u)
      } catch {
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [router])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/auth/login')
  }

  async function handleUpgrade(planId: string) {
    setCheckoutLoading(planId)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Failed to start checkout.'); return }
      window.location.href = `https://checkout.stripe.com/pay/${data.clientSecret}`
      if (!res.ok) { toast.error(data.error || 'Failed to start checkout'); return }
      if (!data.url) { toast.error('Stripe checkout URL was not returned'); return }
      window.location.href = data.url
    } catch {
      toast.error('Something went wrong while opening checkout. Please try again.')
    } finally {
      setCheckoutLoading(null)
    }
  }

  async function handleManageBilling() {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Failed to open the billing portal.'); return }
      window.location.href = data.url
    } catch {
      toast.error('Something went wrong while opening the billing portal. Please try again.')
    } finally {
      setPortalLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    )
  }
  if (!user) return null

  const currentPlan = user.subscriptionTier ?? 'contractor_free'
  const currentPlanPrice = plans.find(plan => plan.id === currentPlan)?.priceInCents ?? 0
  const isActive = user.subscriptionStatus === 'active' || user.subscriptionStatus === 'trialing'
  const hasPortalAccess = Boolean(user.stripeCustomerId) || isActive || user.subscriptionStatus === 'past_due'

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="contractor" onLogout={handleLogout} />
      <main className="md:ml-[220px] p-5 md:p-8 space-y-8">
        <section className="max-w-6xl rounded-[28px] border border-border bg-card p-6 md:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-3xl space-y-4">
              <Link href="/dashboard/contractor" className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
                Return to your dashboard
              </Link>
              <Logo />
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Billing built to match the contractor portal.</h1>
                <p className="text-sm leading-7 text-muted-foreground">
                  Review membership capacity, open the Stripe billing portal, and upgrade with a layout that feels like the rest of your dashboard instead of a disconnected payment screen.
                </p>
              </div>
            </div>

            <div className="w-full max-w-md rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Membership summary</p>
              <div className="mt-3 flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  {isActive && currentPlan !== 'contractor_free' ? <Crown className="h-5 w-5" /> : <CreditCard className="h-5 w-5" />}
                </div>
                <div className="space-y-1">
                  <p className="text-base font-semibold text-foreground">{PLAN_LABELS[currentPlan] ?? currentPlan}</p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {PLAN_CAPACITY[currentPlan] ?? 'Project capacity depends on your current plan configuration.'}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                {hasPortalAccess && (
                  <button
                    onClick={handleManageBilling}
                    disabled={portalLoading}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {portalLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ExternalLink className="h-4 w-4" />}
                    Open billing portal
                  </button>
                )}
                <Link
                  href="/dashboard/contractor/settings"
                  className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:border-primary hover:text-primary"
                >
                  <Shield className="h-4 w-4" />
                  Update contractor profile
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              {
                title: 'Capacity by plan',
                body: 'Each membership level clearly shows how many concurrent projects your team can manage.',
                icon: BriefcaseBusiness,
              },
              {
                title: 'Billing portal continuity',
                body: 'The Stripe portal now returns you to contractor billing so plan management feels consistent.',
                icon: ExternalLink,
              },
              {
                title: 'Growth visibility',
                body: 'Plan copy and pricing now explain how each upgrade supports more volume and better reporting.',
                icon: BarChart3,
              },
            ].map(({ title, body, icon: Icon }) => (
              <div key={title} className="rounded-2xl border border-border bg-background p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <h2 className="mt-4 text-sm font-semibold text-foreground">{title}</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {user.subscriptionStatus === 'past_due' && (
          <section className="max-w-6xl rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <p className="text-sm leading-6">
                Your last payment did not complete. Please open the billing portal and update your payment method so your project capacity and contractor access remain uninterrupted.
              </p>
            </div>
          </section>
        )}

        {!isActive && (
          <section className="max-w-6xl rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">Upgrade when you are ready to take on more work.</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Paid plans increase project capacity, improve visibility in the network, and unlock the reporting tools most growing contractors rely on every week.
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="max-w-6xl">
          <div className="mb-5">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Choose the contractor plan that fits your operation.</h2>
            <p className="mt-1 text-sm leading-7 text-muted-foreground">
              Every plan includes access to the Nexus contractor network. Higher tiers expand project capacity and add the tools that support faster growth.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan: Plan) => {
              const isCurrent = currentPlan === plan.id
              const isHighlighted = plan.highlighted
              const isDowngrade = plan.priceInCents < currentPlanPrice

              return (
                <article
                  key={plan.id}
                  className={`relative rounded-3xl border p-6 transition-all ${
                    isHighlighted
                      ? 'border-primary/40 bg-primary/5 shadow-lg shadow-primary/10'
                      : 'border-border bg-card'
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-6">
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[10px] font-bold tracking-wide text-primary-foreground">
                        <Star className="h-2.5 w-2.5" />
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{plan.description}</p>
                    <p className="mt-4 text-2xl font-bold text-foreground">{formatPrice(plan.priceInCents, plan.interval)}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{PLAN_CAPACITY[plan.id] ?? 'Custom capacity available.'}</p>
                  </div>

                  <ul className="mt-5 space-y-3">
                    {plan.features.map(feature => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm leading-6 text-muted-foreground">
                        <Check className="mt-1 h-4 w-4 flex-shrink-0 text-emerald-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    {isCurrent ? (
                      <div className="flex items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-3 text-sm font-semibold text-secondary-foreground">
                        <Check className="h-4 w-4" />
                        This is your current plan.
                      </div>
                    ) : isDowngrade ? (
                      <button
                        disabled
                        className="w-full cursor-not-allowed rounded-xl bg-secondary px-4 py-3 text-sm font-semibold text-secondary-foreground opacity-50"
                      >
                        Open the billing portal to request a downgrade.
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpgrade(plan.id)}
                        disabled={checkoutLoading === plan.id}
                        className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                          isHighlighted
                            ? 'bg-primary text-primary-foreground hover:opacity-90'
                            : 'border border-border bg-background hover:border-primary hover:text-primary'
                        }`}
                      >
                        {checkoutLoading === plan.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Zap className="h-4 w-4" />
                        )}
                        Upgrade to {plan.name}
                      </button>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}
