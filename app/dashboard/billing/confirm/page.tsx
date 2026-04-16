'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from '@/lib/router'
import Link from '@/components/link'
import { DashboardNav } from '@/components/dashboard-nav'
import { CheckCircle, Crown, CreditCard, Loader2, ArrowRight, RefreshCw } from 'lucide-react'

interface UserData {
  id: string
  name: string
  role: string
  subscriptionTier?: string
  subscriptionStatus?: string
}

const PLAN_LABELS: Record<string, string> = {
  contractor_free: 'Contractor Starter',
  contractor_pro: 'Contractor Pro',
  contractor_pro_monthly: 'Contractor Pro',
  contractor_pro_annual: 'Contractor Pro (Annual)',
  contractor_elite: 'Contractor Elite',
  homeowner_basic: 'Homeowner Starter',
  homeowner_pro: 'Homeowner Pro',
  homeowner_pro_monthly: 'Homeowner Pro',
  homeowner_pro_annual: 'Homeowner Pro (Annual)',
}

function BillingConfirmInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const sessionId = searchParams.get('session_id')

  const loadUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (!res.ok) { router.push('/auth/login'); return }
      const { user: u } = await res.json()
      setUser(u)
    } catch (err) {
      console.error(err)
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }, [router])

  async function handleRefresh() {
    setRefreshing(true)
    try {
      const res = await fetch('/api/auth/me')
      if (!res.ok) return
      const { user: u } = await res.json()
      setUser(u)
    } catch (err) {
      console.error(err)
      // ignore refresh errors silently
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadUser()
  }, [loadUser])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/auth/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) return null

  const dashboardPath = user.role === 'contractor'
    ? '/dashboard/contractor'
    : '/dashboard/homeowner'

  const billingPath = user.role === 'contractor'
    ? '/dashboard/contractor/billing'
    : '/dashboard/homeowner/billing'

  const currentPlan = user.subscriptionTier ?? (user.role === 'contractor' ? 'contractor_free' : 'homeowner_basic')
  const isActive = user.subscriptionStatus === 'active' || user.subscriptionStatus === 'trialing'
  const isProcessing = !!sessionId && !isActive

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role={user.role as 'contractor' | 'homeowner' | 'property-manager' | 'admin'} onLogout={handleLogout} />
      <main className="md:ml-[220px] p-5 md:p-8">
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center py-16 text-center space-y-6">

          {/* Icon */}
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            isProcessing ? 'bg-amber-100' : 'bg-emerald-100'
          }`}>
            {isProcessing
              ? <RefreshCw className="w-8 h-8 text-amber-600" />
              : <CheckCircle className="w-8 h-8 text-emerald-600" />
            }
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {isProcessing ? 'Activating your subscription…' : "You're all set!"}
            </h1>
            <p className="text-muted-foreground text-sm mt-2">
              {isProcessing
                ? 'Your payment was received. Your subscription is being activated — this usually takes just a moment.'
                : 'Your subscription is now active and ready to use.'
              }
            </p>
          </div>

          {/* Active subscription card */}
          <div className={`w-full rounded-2xl border p-6 text-left ${
            isActive ? 'border-primary/30 bg-primary/5' : 'border-border bg-card'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
              }`}>
                {isActive ? <Crown className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
              </div>
              <div>
                <p className="font-bold text-foreground text-[15px]">
                  {PLAN_LABELS[currentPlan] ?? currentPlan}
                </p>
                <p className="text-[12px] text-muted-foreground mt-0.5">
                  {isActive
                    ? 'Active subscription'
                    : isProcessing
                      ? 'Activating…'
                      : user.subscriptionStatus ?? 'Updating…'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Refresh button if still processing */}
          {isProcessing && (
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors border border-border rounded-xl px-4 py-2"
            >
              {refreshing
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <RefreshCw className="w-3.5 h-3.5" />
              }
              Check status
            </button>
          )}

          {/* Go to dashboard CTA */}
          <Link
            href={dashboardPath}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-[13.5px] font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            Go to your dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* View billing link */}
          <Link
            href={billingPath}
            className="text-[12px] text-muted-foreground hover:text-foreground transition-colors"
          >
            View billing details
          </Link>
        </div>
      </main>
    </div>
  )
}

export default function BillingConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        </div>
      }
    >
      <BillingConfirmInner />
    </Suspense>
  )
}
