'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardNav } from '@/components/dashboard-nav'
import { Logo } from '@/components/logo'
import { getPlansByRole, formatPrice, type Plan } from '@/lib/plans'
import {
  Check, Crown, Loader2, ExternalLink, ArrowLeft,
  CreditCard, Shield, AlertCircle, Zap, Star, CheckCircle2, Receipt,
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

const STATUS_COPY: Record<string, string> = {
  active: 'Your subscription is active and your billing details are up to date.',
  trialing: 'Your trial is active. You can manage billing details before the next renewal.',
  past_due: 'Your payment is past due. Please update your payment method to avoid service interruption.',
  inactive: 'You are on the free plan. Upgrade whenever you want additional support and reporting.',
}

export default function HomeownerBillingPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const [portalLoading, setPortalLoading] = useState(false)

  const plans = getPlansByRole('homeowner')

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch('/api/auth/me')
        if (!res.ok) { router.push('/auth/login'); return }
        const { user: u } = await res.json()
        if (u.role !== 'homeowner') { router.push('/dashboard/contractor/billing'); return }
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

  const currentPlan = user.subscriptionTier ?? 'homeowner_basic'
  const isActive = user.subscriptionStatus === 'active' || user.subscriptionStatus === 'trialing'
  const isPro = currentPlan === 'homeowner_pro' && isActive
  const hasPortalAccess = Boolean(user.stripeCustomerId) || isPro || user.subscriptionStatus === 'past_due'
  const statusMessage = STATUS_COPY[user.subscriptionStatus ?? 'inactive'] ?? STATUS_COPY.inactive

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="homeowner" onLogout={handleLogout} />
      <main className="md:ml-[220px] p-5 md:p-8 space-y-8">
        <section className="max-w-5xl rounded-[28px] border border-border bg-card p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4 max-w-2xl">
              <Link href="/dashboard/homeowner" className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
                Return to your dashboard
              </Link>
              <Logo />
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Homeowner billing that matches the rest of your portal.</h1>
                <p className="text-sm leading-7 text-muted-foreground">
                  Review your current plan, upgrade when you need more support, and open the Stripe billing portal without leaving the Nexus Operations dashboard experience behind.
                </p>
              </div>
            </div>

            <div className="w-full max-w-sm rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Current plan</p>
              <div className="mt-3 flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  {isPro ? <Crown className="h-5 w-5" /> : <CreditCard className="h-5 w-5" />}
                </div>
                <div className="space-y-1">
                  <p className="text-base font-semibold text-foreground">
                    {isPro ? 'Homeowner Pro' : 'Homeowner Basic'}
                  </p>
                  <p className="text-sm leading-6 text-muted-foreground">{statusMessage}</p>
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
                  href="/dashboard/homeowner/new-request"
                  className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:border-primary hover:text-primary"
                >
                  <Receipt className="h-4 w-4" />
                  Create a new request
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              {
                title: 'Secure billing',
                body: 'Stripe handles every payment method, invoice, and subscription action securely.',
                icon: Shield,
              },
              {
                title: 'Clear plan visibility',
                body: 'You can see your current plan status, renewal posture, and upgrade options in one place.',
                icon: CheckCircle2,
              },
              {
                title: 'Portal continuity',
                body: 'The billing portal now returns you to the homeowner billing screen so the experience stays connected.',
                icon: ExternalLink,
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
          <section className="max-w-5xl rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <p className="text-sm leading-6">
                Your last payment did not complete. Please open the billing portal and update your payment method so future homeowner services continue without interruption.
              </p>
            </div>
          </section>
        )}

        <section className="max-w-5xl">
          <div className="mb-5">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Choose the homeowner plan that fits your property workload.</h2>
            <p className="mt-1 text-sm leading-7 text-muted-foreground">
              Every plan includes verified contractor coordination. Upgrade to Pro when you need priority support, unlimited requests, and organized billing records.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {plans.map((plan: Plan) => {
              const isCurrent = currentPlan === plan.id
              const isHighlighted = plan.highlighted

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

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{plan.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-foreground">{formatPrice(plan.priceInCents, plan.interval)}</p>
                    </div>
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
                    ) : plan.priceInCents === 0 ? (
                      <button
                        disabled
                        className="w-full cursor-not-allowed rounded-xl bg-secondary px-4 py-3 text-sm font-semibold text-secondary-foreground opacity-50"
                      >
                        You are already on a higher plan.
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
