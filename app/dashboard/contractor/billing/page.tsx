'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardNav } from '@/components/dashboard-nav'
import { EmbeddedCheckoutModal } from '@/components/embedded-checkout'
import { getPlansByRole, type Plan } from '@/lib/plans'
import {
  Check, Crown, Loader2, ExternalLink, ArrowLeft,
  CreditCard, Shield, AlertCircle, Zap, Star, TrendingUp,
} from 'lucide-react'
import { toast } from 'sonner'

interface UserData {
  id: string
  name: string
  role: string
  subscriptionTier?: string
  subscriptionStatus?: string
}

export default function ContractorBillingPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, _setCheckoutLoading] = useState<string | null>(null)
  const [checkoutPlanId, setCheckoutPlanId] = useState<string | null>(null)
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
    setCheckoutPlanId(planId)
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

  const currentPlan = user.subscriptionTier ?? 'contractor_free'
  const isActive = user.subscriptionStatus === 'active' || user.subscriptionStatus === 'trialing'
  const isPaid = currentPlan !== 'contractor_free' && isActive

  const planLabels: Record<string, string> = {
    contractor_free: 'Contractor Starter',
    contractor_pro: 'Contractor Pro · $79/mo',
    contractor_elite: 'Contractor Elite · $199/mo',
  }

  const maxProjects: Record<string, string> = {
    contractor_free: '3 active projects',
    contractor_pro: '10 active projects',
    contractor_elite: 'Unlimited projects',
  }

  return (
    <div className="min-h-screen bg-background">
      {checkoutPlanId && (
        <EmbeddedCheckoutModal
          planId={checkoutPlanId}
          onClose={() => setCheckoutPlanId(null)}
        />
      )}
      <DashboardNav userName={user.name} role="contractor" onLogout={handleLogout} />
      <main className="md:ml-[220px] p-5 md:p-8 max-w-4xl space-y-8">

        {/* Header */}
        <div>
          <Link href="/dashboard/contractor" className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors mb-5">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to dashboard
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Billing & Subscription</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your membership and unlock more project capacity.
          </p>
        </div>

        {/* Current plan */}
        <div className={`rounded-2xl border p-6 ${
          isPaid ? 'border-primary/30 bg-primary/5' : 'border-border bg-card'
        }`}>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isPaid ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
              }`}>
                {isPaid ? <Crown className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
              </div>
              <div>
                <p className="font-bold text-foreground text-[15px]">
                  {planLabels[currentPlan] ?? currentPlan}
                </p>
                <p className="text-[12px] text-muted-foreground mt-0.5">
                  {maxProjects[currentPlan] ?? '—'}
                </p>
              </div>
            </div>
            {isPaid && (
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
              <span>Your payment is past due. Please update your payment method to avoid losing access.</span>
            </div>
          )}
        </div>

        {/* Why upgrade callout */}
        {!isPaid && (
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 flex items-start gap-4">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-[13.5px] mb-1">Grow your business with a paid plan</p>
              <p className="text-[12.5px] text-muted-foreground leading-relaxed">
                Contractors on paid plans earn significantly more — more project slots means more revenue. Upgrade today to take on more work without limits.
              </p>
            </div>
          </div>
        )}

        {/* Plans grid */}
        <div>
          <h2 className="font-bold text-foreground text-[17px] mb-1">Plans</h2>
          <p className="text-[13px] text-muted-foreground mb-5">
            All plans include access to the verified Nexus contractor network.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {plans.map((plan: Plan) => {
              const isCurrent = currentPlan === plan.id
              const isHighlighted = plan.highlighted

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl border p-5 flex flex-col transition-all ${
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

                  <div className="mb-4">
                    <h3 className="font-bold text-foreground text-[14px]">{plan.name}</h3>
                    <p className="text-[11.5px] text-muted-foreground mt-1 leading-relaxed">{plan.description}</p>
                    <p className="text-2xl font-bold text-foreground mt-3">
                      {plan.priceInCents === 0 ? 'Starter' : `$${plan.priceInCents / 100}`}
                      {plan.priceInCents > 0 && (
                        <span className="text-[12px] font-normal text-muted-foreground">/mo</span>
                      )}
                    </p>
                  </div>

                  <ul className="space-y-2 mb-5 flex-1">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-[12px] text-muted-foreground">
                        <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {isCurrent ? (
                    <div className="flex items-center justify-center gap-2 py-2 rounded-xl bg-secondary text-secondary-foreground text-[12px] font-semibold">
                      <Check className="w-3.5 h-3.5" />
                      Current Plan
                    </div>
                  ) : plan.priceInCents < (plans.find(p => p.id === currentPlan)?.priceInCents ?? 0) ? (
                    <button disabled className="py-2 rounded-xl bg-secondary text-secondary-foreground text-[12px] font-semibold opacity-40 cursor-not-allowed">
                      Downgrade
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={checkoutLoading === plan.id}
                      className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-semibold transition-all ${
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
                      Upgrade
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Security */}
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
