'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardNav } from '@/components/dashboard-nav'
import { getPlansByRole, formatPrice, type Plan } from '@/lib/plans'
import {
  Check, Crown, Loader2, ExternalLink, ArrowLeft,
  CreditCard, Shield, AlertCircle, Zap, Star,
} from 'lucide-react'
import { toast } from 'sonner'

interface UserData {
  id: string
  name: string
  role: string
  subscriptionTier?: string
  subscriptionStatus?: string
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
        if (u.role !== 'homeowner') { router.push('/dashboard/contractor/settings'); return }
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
      if (!res.ok) { toast.error(data.error || 'Failed to start checkout'); return }
      if (!data.url) { toast.error('Stripe checkout URL was not returned'); return }
      window.location.href = data.url
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setCheckoutLoading(null)
    }
  }

  async function handleManageBilling() {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Failed to open billing portal'); return }
      window.location.href = data.url
    } catch {
      toast.error('Something went wrong. Please try again.')
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
  const isPro = (currentPlan === 'homeowner_pro_monthly' || currentPlan === 'homeowner_pro_annual' || currentPlan === 'homeowner_pro') && isActive
  const isAnnual = currentPlan === 'homeowner_pro_annual'

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="homeowner" onLogout={handleLogout} />
      <main className="md:ml-[220px] p-5 md:p-8 max-w-4xl space-y-8">

        {/* Header */}
        <div>
          <Link href="/dashboard/homeowner" className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors mb-5">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to dashboard
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Billing & Subscription</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your plan and payment methods.
          </p>
        </div>

        {/* Current status card */}
        <div className={`rounded-2xl border p-6 ${
          isPro
            ? 'border-primary/30 bg-primary/5'
            : 'border-border bg-card'
        }`}>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isPro ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                {isPro ? <Crown className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
              </div>
              <div>
                <p className="font-bold text-foreground text-[15px]">
                  {isPro ? 'Homeowner Pro' : 'Homeowner Starter'}
                </p>
                <p className="text-[12px] text-muted-foreground mt-0.5">
                  {isPro ? 'Active subscription · ' + (isAnnual ? '$59/mo (annual)' : '$79/mo (monthly)') : 'No active subscription'}
                </p>
              </div>
            </div>
            {isPro && (
              <button
                onClick={handleManageBilling}
                disabled={portalLoading}
                className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-primary border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors px-4 py-2 rounded-xl"
              >
                {portalLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ExternalLink className="w-3.5 h-3.5" />}
                Manage billing
              </button>
            )}
          </div>

          {user.subscriptionStatus === 'past_due' && (
            <div className="mt-4 flex items-center gap-2.5 text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3 text-[12px]">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Your payment is past due. Please update your payment method to avoid service interruption.</span>
            </div>
          )}
        </div>

        {/* Plans */}
        <div>
          <h2 className="font-bold text-foreground text-[17px] mb-1">Plans</h2>
          <p className="text-[13px] text-muted-foreground mb-5">
            Choose the plan that fits your home management needs.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {plans.map((plan: Plan) => {
              const isCurrent = currentPlan === plan.id
              const isHighlighted = plan.highlighted

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl border p-6 flex flex-col transition-all ${
                    isHighlighted
                      ? 'border-primary/40 bg-primary/5 shadow-lg shadow-primary/10'
                      : 'border-border bg-card'
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full tracking-wide">
                        <Star className="w-2.5 h-2.5" />
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-foreground text-[15px]">{plan.name}</h3>
                      <p className="text-[12px] text-muted-foreground mt-1 leading-relaxed">{plan.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <p className="text-2xl font-bold text-foreground">
                        {plan.priceInCents === 0 ? 'Starter' : `$${plan.priceInCents / 100}`}
                      </p>
                      {plan.priceInCents > 0 && (
                        <p className="text-[11px] text-muted-foreground">/month</p>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-2.5 mb-6 flex-1">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-[12.5px] text-muted-foreground">
                        <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {isCurrent ? (
                    <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-[12.5px] font-semibold">
                      <Check className="w-3.5 h-3.5" />
                      Current Plan
                    </div>
                  ) : plan.priceInCents === 0 ? (
                    <button
                      disabled
                      className="py-2.5 rounded-xl bg-secondary text-secondary-foreground text-[12.5px] font-semibold opacity-50 cursor-not-allowed"
                    >
                      Downgrade
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={checkoutLoading === plan.id}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12.5px] font-semibold transition-all ${
                        isHighlighted
                          ? 'bg-primary text-primary-foreground hover:opacity-90'
                          : 'border border-border hover:border-primary hover:text-primary bg-background'
                      }`}
                    >
                      {checkoutLoading === plan.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Zap className="w-3.5 h-3.5" />
                      )}
                      Upgrade to {plan.name}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Security note */}
        <div className="flex items-center gap-2.5 text-[12px] text-muted-foreground border border-border rounded-xl p-4">
          <Shield className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
          <span>
            All payments are processed securely. Your card details are never stored on our servers.
          </span>
        </div>
      </main>
    </div>
  )
}
