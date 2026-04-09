'use client'

import { Suspense, useEffect, useState, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { DashboardNav } from '@/components/dashboard-nav'
import { AIAssistant } from '@/components/ai-assistant'
import { AIInsightsCard } from '@/components/ai-insights-card'
import {
  Plus, Clock, CheckCircle2, Wrench, FileText,
  ArrowRight, Loader2,
  ChevronRight, Calendar, DollarSign, MapPin,
  RefreshCw, CreditCard, Activity, Crown, Sparkles, Zap, TrendingUp,
} from 'lucide-react'
import { toast } from 'sonner'

interface ServiceRequest {
  id: string
  title: string
  description: string
  category: string
  location: string
  status: string
  budget?: number
  createdAt: string
  urgency?: string
}

interface UserData {
  id: string
  email: string
  name: string
  role: string
  avatarUrl?: string | null
  subscriptionTier?: string
  subscriptionStatus?: string
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; dot: string; step: number }> = {
  open:              { label: 'Submitted',   color: 'text-foreground/70',   bg: 'bg-muted',       dot: 'bg-muted-foreground', step: 1 },
  pending_review:    { label: 'In Review',   color: 'text-foreground/70',   bg: 'bg-muted',       dot: 'bg-muted-foreground', step: 1 },
  claimed:           { label: 'Assigned',    color: 'text-primary',         bg: 'bg-primary/10',  dot: 'bg-primary',          step: 2 },
  'in-progress':     { label: 'In Progress', color: 'text-primary',         bg: 'bg-primary/10',  dot: 'bg-primary',          step: 3 },
  in_progress:       { label: 'In Progress', color: 'text-primary',         bg: 'bg-primary/10',  dot: 'bg-primary',          step: 3 },
  completed:         { label: 'Completed',   color: 'text-foreground',      bg: 'bg-muted',       dot: 'bg-foreground/60',    step: 4 },
  cancelled:         { label: 'Cancelled',   color: 'text-muted-foreground',bg: 'bg-muted',       dot: 'bg-muted-foreground', step: 0 },
}

const STEPS = ['Submitted', 'Assigned', 'In Progress', 'Completed']

const CATEGORY_ICONS: Record<string, string> = {
  'tree-removal': '🌳', 'concrete-work': '🏗️', roofing: '🏠',
  hvac: '❄️', fencing: '🏡', electrical: '⚡', plumbing: '🔧', excavation: '🚜',
}

function fmt(cat: string) {
  return cat.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 30) return `${days}d ago`
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function StatusBadge({ status }: { status: string }) {
  const st = STATUS_MAP[status] ?? { label: status, color: 'text-muted-foreground', bg: 'bg-muted', dot: 'bg-muted-foreground', step: 0 }
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${st.bg} ${st.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${st.dot} flex-shrink-0`} />
      {st.label}
    </span>
  )
}

function ProgressTrack({ status }: { status: string }) {
  const st = STATUS_MAP[status]
  if (!st || st.step === 0) return null
  return (
    <div className="flex items-center gap-0 mt-3">
      {STEPS.map((step, i) => {
        const num = i + 1
        const done = num < st.step
        const active = num === st.step
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 transition-all ${
              done   ? 'bg-primary text-primary-foreground' :
              active ? 'ring-2 ring-primary/40 bg-primary/15 text-primary' :
              'bg-muted text-muted-foreground'
            }`}>
              {done ? '✓' : num}
            </div>
            <span className={`ml-1 text-[9.5px] font-medium hidden sm:block truncate ${
              active ? 'text-primary' : done ? 'text-foreground/50' : 'text-muted-foreground'
            }`}>{step}</span>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-2 ${num < st.step ? 'bg-primary/50' : 'bg-border'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function HomeownerDashboardInner() {
  const router = useRouter()
  const params = useSearchParams()
  const [user, setUser] = useState<UserData | null>(null)
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [tab, setTab] = useState<'all' | 'active' | 'completed'>('all')
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const loadRequests = useCallback(async () => {
    const res = await fetch('/api/projects/list?type=my-projects')
    if (res.ok) {
      const { projects } = await res.json()
      setRequests(prev => {
        const newList = projects ?? []
        const prevIds = new Set(prev.map((p: ServiceRequest) => p.id))
        const hasNew = newList.some((p: ServiceRequest) => !prevIds.has(p.id))
        if (hasNew && prev.length > 0) {
          toast.success('Request status updated!')
        }
        return newList
      })
      setLastRefresh(new Date())
    }
  }, [])

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch('/api/auth/me')
        if (!res.ok) { router.push('/auth/login'); return }
        const { user: u } = await res.json()
        if (u.role === 'contractor') { router.push('/dashboard/contractor'); return }
        setUser(u)
        await loadRequests()
        if (params.get('submitted') === '1') {
          toast.success('Request submitted! A contractor will be assigned shortly.')
        }
      } catch (err) {
        console.error(err)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [router, loadRequests, params])

  // Auto-poll every 30 seconds for status updates
  useEffect(() => {
    pollingRef.current = setInterval(loadRequests, 30000)
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [loadRequests])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/auth/login')
  }

  async function handleRefresh() {
    setRefreshing(true)
    await loadRequests()
    setRefreshing(false)
    toast.success('Refreshed')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    )
  }
  if (!user) return null

  const open      = requests.filter(r => ['open', 'pending_review'].includes(r.status))
  const active    = requests.filter(r => ['claimed', 'in-progress', 'in_progress'].includes(r.status))
  const completed = requests.filter(r => r.status === 'completed')

  const displayed = tab === 'all' ? requests : tab === 'active' ? [...open, ...active] : completed

  const totalSpend = completed.reduce((s, r) => s + (r.budget ?? 0), 0)

  const stats = [
    { label: 'Submitted',   value: open.length,       icon: Clock,        color: 'text-amber-600 dark:text-amber-400',   bg: 'bg-amber-500/10',   ring: 'ring-amber-500/20' },
    { label: 'In Progress', value: active.length,     icon: Wrench,       color: 'text-blue-600 dark:text-blue-400',     bg: 'bg-blue-500/10',    ring: 'ring-blue-500/20' },
    { label: 'Completed',   value: completed.length,  icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', ring: 'ring-emerald-500/20' },
    { label: 'Total Spend', value: `$${totalSpend.toLocaleString()}`, icon: DollarSign, color: 'text-primary',              bg: 'bg-primary/10',     ring: 'ring-primary/20' },
  ]

  const tier = user.subscriptionTier ?? 'homeowner_basic'
  const subActive = user.subscriptionStatus === 'active' || user.subscriptionStatus === 'trialing'
  const isPro = subActive && (tier === 'homeowner_pro_monthly' || tier === 'homeowner_pro_annual' || tier === 'homeowner_pro')
  const planLabel = isPro
    ? (tier === 'homeowner_pro_annual' ? 'Pro Annual · $59/mo' : 'Pro Monthly · $79/mo')
    : 'Starter · Free'
  const requestsRemaining = isPro ? null : Math.max(0, 3 - requests.length)

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="homeowner" onLogout={handleLogout} avatarUrl={user.avatarUrl} />

      <main id="main-content" className="md:ml-[240px] p-5 md:p-7 space-y-6">
        {/* Welcome banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/70 p-6 md:p-8 text-primary-foreground shadow-xl shadow-primary/20">
          <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <pattern id="g" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40L40 0M-10 10L10-10M30 50L50 30" stroke="white" strokeWidth="1" fill="none"/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#g)"/>
            </svg>
          </div>
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-10 w-60 h-60 bg-white/[0.04] rounded-full blur-3xl pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-5">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-1.5 text-primary-foreground/80 text-[10px] font-bold uppercase tracking-[0.16em] bg-white/10 border border-white/15 px-2.5 py-1 rounded-full mb-3">
                <Sparkles className="w-3 h-3" />
                Homeowner Portal
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {requests.length === 0
                  ? `Welcome, ${user.name.split(' ')[0]}.`
                  : `Welcome back, ${user.name.split(' ')[0]}`}
              </h1>
              <p className="text-primary-foreground/75 text-[13.5px] mt-2 leading-relaxed">
                {requests.length === 0
                  ? 'Submit your first service request — we\'ll match you with a verified contractor.'
                  : `${open.length + active.length} active · ${completed.length} completed · $${totalSpend.toLocaleString()} tracked spend`}
              </p>
            </div>
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2.5 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-colors backdrop-blur-sm"
                title={`Last updated ${lastRefresh.toLocaleTimeString()} · Auto-refreshes every 30s`}
                aria-label="Refresh"
              >
                <RefreshCw className={`w-4 h-4 text-white ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <Link
                href="/dashboard/homeowner/new-request"
                className="inline-flex items-center gap-2 bg-white text-primary font-bold text-[13px] px-5 py-2.5 rounded-xl hover:bg-white/90 transition-all shadow-lg shadow-black/10"
              >
                <Plus className="w-4 h-4" />
                New Request
              </Link>
            </div>
          </div>
        </div>

        {/* Subscription Card — prominent */}
        <div className={`relative overflow-hidden rounded-2xl border ${
          isPro
            ? 'border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent'
            : 'border-primary/25 bg-gradient-to-br from-primary/8 via-card to-card'
        } p-5 md:p-6`}>
          <div className="absolute -top-16 -right-16 w-52 h-52 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
          <div className="relative flex flex-col md:flex-row md:items-center gap-5 justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                isPro
                  ? 'bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg shadow-primary/30'
                  : 'bg-primary/10 text-primary ring-1 ring-primary/20'
              }`}>
                {isPro ? <Crown className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-foreground text-[15px]">{planLabel}</p>
                  {isPro && (
                    <span className="text-[9.5px] font-bold uppercase tracking-wider bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-[12.5px] text-muted-foreground mt-0.5 leading-relaxed">
                  {isPro
                    ? 'Unlimited requests, priority matching, and insurance-ready reports.'
                    : requestsRemaining != null && requestsRemaining > 0
                    ? `${requestsRemaining} of 3 free requests remaining this year. Upgrade for unlimited.`
                    : 'Free tier limit reached. Upgrade to Pro to keep submitting requests.'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {!isPro && (
                <Link
                  href="/dashboard/homeowner/billing"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold text-[12.5px] px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-md shadow-primary/20"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Upgrade to Pro
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
              <Link
                href="/dashboard/homeowner/billing"
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary border border-primary/30 bg-background hover:bg-primary/5 transition-colors px-3.5 py-2.5 rounded-xl"
              >
                {isPro ? 'Manage' : 'Compare plans'}
              </Link>
            </div>
          </div>

          {/* Benefits strip when not Pro */}
          {!isPro && (
            <div className="relative mt-5 pt-5 border-t border-primary/15 grid grid-cols-3 gap-3 text-center">
              {[
                { icon: Zap,        label: 'Unlimited requests' },
                { icon: TrendingUp, label: 'Priority matching' },
                { icon: CheckCircle2, label: 'Insurance reports' },
              ].map(b => {
                const Icon = b.icon
                return (
                  <div key={b.label} className="flex flex-col items-center gap-1.5">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <p className="text-[11px] font-medium text-foreground/80">{b.label}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s => {
            const Icon = s.icon
            return (
              <div key={s.label} className="group relative bg-card border border-border rounded-xl p-4 md:p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{s.label}</span>
                  <div className={`w-9 h-9 rounded-xl ${s.bg} ring-1 ${s.ring} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <Icon className={`w-4 h-4 ${s.color}`} />
                  </div>
                </div>
                <p className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">{s.value}</p>
              </div>
            )
          })}
        </div>

        {/* Requests list */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border gap-3 flex-wrap">
            <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5">
              {(['all', 'active', 'completed'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-3.5 py-1.5 text-[12px] font-semibold rounded-md transition-all capitalize ${
                    tab === t ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <Link
              href="/dashboard/homeowner/new-request"
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              New request
            </Link>
          </div>

          {displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="font-semibold text-foreground mb-1">
                {tab === 'all' ? 'No requests yet' : `No ${tab} requests`}
              </p>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                {tab === 'all'
                  ? 'Post your first service request and get matched with a verified contractor.'
                  : `You have no ${tab} requests at this time.`}
              </p>
              {tab === 'all' && (
                <Link
                  href="/dashboard/homeowner/new-request"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-sm px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" />
                  Post First Request
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {displayed.map(req => {
                const icon = CATEGORY_ICONS[req.category] ?? '🔨'
                return (
                  <Link
                    key={req.id}
                    href={`/dashboard/requests/${req.id}`}
                    className="flex items-start gap-4 px-5 py-4 hover:bg-muted/30 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-xl flex-shrink-0 mt-0.5">
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <p className="font-semibold text-foreground text-[13.5px] truncate">
                              {req.title || fmt(req.category)}
                            </p>
                            <StatusBadge status={req.status} />
                          </div>
                          <div className="flex items-center gap-3 text-[12px] text-muted-foreground mb-1">
                            <span>{fmt(req.category)}</span>
                            {req.location && (
                              <>
                                <span className="opacity-30">·</span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {req.location}
                                </span>
                              </>
                            )}
                            <span className="opacity-30">·</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {timeAgo(req.createdAt)}
                            </span>
                          </div>
                          <p className="text-[12px] text-muted-foreground line-clamp-1">{req.description}</p>
                          <ProgressTrack status={req.status} />
                        </div>
                        <div className="flex-shrink-0 text-right flex flex-col items-end gap-1">
                          {req.budget != null && (
                            <span className="font-bold text-foreground text-[14px] flex items-center gap-0.5">
                              <DollarSign className="w-3 h-3 text-muted-foreground" />
                              {req.budget.toLocaleString()}
                            </span>
                          )}
                          <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* AI Insights */}
        <AIInsightsCard
          role="homeowner"
          requests={requests}
        />

        {/* Quick actions */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              href: '/dashboard/homeowner/new-request',
              icon: Plus,
              iconBg: 'bg-gradient-to-br from-primary/15 to-primary/5',
              iconColor: 'text-primary',
              title: 'New Service Request',
              sub: 'Get matched with a verified contractor',
            },
            {
              href: '/dashboard/homeowner/billing',
              icon: CreditCard,
              iconBg: 'bg-gradient-to-br from-emerald-500/15 to-emerald-500/5',
              iconColor: 'text-emerald-600 dark:text-emerald-400',
              title: 'Billing & Subscription',
              sub: isPro ? `${planLabel} · Active` : 'Starter plan · Upgrade to Pro',
            },
            {
              href: '/dashboard/homeowner/settings',
              icon: Activity,
              iconBg: 'bg-gradient-to-br from-blue-500/15 to-blue-500/5',
              iconColor: 'text-blue-600 dark:text-blue-400',
              title: 'Account Settings',
              sub: 'Profile photo, notifications & security',
            },
          ].map(({ href, icon: Icon, iconBg, iconColor, title, sub }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-4 p-5 bg-card border border-border rounded-xl hover:border-primary/30 hover:bg-primary/[0.03] hover:shadow-lg hover:shadow-primary/5 transition-all"
            >
              <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-[13px]">{title}</p>
                <p className="text-[11.5px] text-muted-foreground mt-0.5 truncate">{sub}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </Link>
          ))}
        </div>
      </main>

      <AIAssistant
        role="homeowner"
        context={`Homeowner with ${requests.length} total requests, ${completed.length} completed, $${totalSpend.toLocaleString()} tracked spend.`}
      />
    </div>
  )
}

export default function HomeownerDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>}>
      <HomeownerDashboardInner />
    </Suspense>
  )
}
