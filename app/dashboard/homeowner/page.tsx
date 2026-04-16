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
  'in-progress':     { label: 'In Progress', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10', dot: 'bg-blue-500', step: 3 },
  in_progress:       { label: 'In Progress', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10', dot: 'bg-blue-500', step: 3 },
  completed:         { label: 'Completed',   color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', dot: 'bg-emerald-500', step: 4 },
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
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${st.bg} ${st.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${st.dot} flex-shrink-0`} />
      {st.label}
    </span>
  )
}

function ProgressTrack({ status }: { status: string }) {
  const st = STATUS_MAP[status]
  if (!st || st.step === 0) return null
  return (
    <div className="flex items-center gap-0 mt-4">
      {STEPS.map((step, i) => {
        const num = i + 1
        const done = num < st.step
        const active = num === st.step
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
              done   ? 'bg-primary text-primary-foreground' :
              active ? 'ring-2 ring-primary/30 bg-primary/15 text-primary' :
              'bg-muted text-muted-foreground'
            }`}>
              {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : num}
            </div>
            <span className={`ml-1.5 text-xs font-medium hidden sm:block truncate ${
              active ? 'text-primary' : done ? 'text-foreground/60' : 'text-muted-foreground'
            }`}>{step}</span>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-2 ${num < st.step ? 'bg-primary/40' : 'bg-border'}`} />
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
          toast.success('Operations update received.')
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
          toast.success('Request submitted. Nexus Operations will route this to a verified contractor.')
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
    toast.success('Dashboard refreshed.')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
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
    { label: 'Submitted for Triage', value: open.length,       icon: Clock,        color: 'text-amber-600 dark:text-amber-400',   bg: 'bg-amber-500/10' },
    { label: 'Active Dispatch',      value: active.length,     icon: Wrench,       color: 'text-blue-600 dark:text-blue-400',     bg: 'bg-blue-500/10' },
    { label: 'Completed',   value: completed.length,  icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Tracked Cost', value: `$${totalSpend.toLocaleString()}`, icon: DollarSign, color: 'text-primary', bg: 'bg-primary/10' },
  ]

  const tier = user.subscriptionTier ?? 'homeowner_basic'
  const subActive = user.subscriptionStatus === 'active' || user.subscriptionStatus === 'trialing'
  const isPro = subActive && (tier === 'homeowner_pro_monthly' || tier === 'homeowner_pro_annual' || tier === 'homeowner_pro')
  const planLabel = isPro
    ? (tier === 'homeowner_pro_annual' ? 'Pro Annual' : 'Pro Monthly')
    : 'Starter'
  const requestsRemaining = isPro ? null : Math.max(0, 3 - requests.length)

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="homeowner" onLogout={handleLogout} avatarUrl={user.avatarUrl} />

      <main id="main-content" className="lg:ml-[260px] p-5 sm:p-6 lg:p-8 space-y-6 pt-20 lg:pt-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-primary p-6 sm:p-8 text-primary-foreground">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_70%_-20%,rgba(255,255,255,0.15),transparent_50%)]" />
          <div className="pointer-events-none absolute inset-0 dot-grid opacity-20" />
          
          <div className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-5">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 text-primary-foreground/80 text-xs font-semibold uppercase tracking-wider bg-white/10 border border-white/15 px-3 py-1.5 rounded-full mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                Homeowner Command Dashboard
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                {requests.length === 0
                  ? `Welcome, ${user.name.split(' ')[0]}`
                  : `Welcome back, ${user.name.split(' ')[0]}`}
              </h1>
              <p className="text-primary-foreground/75 text-sm mt-2 leading-relaxed max-w-lg">
                {requests.length === 0
                  ? 'Submit your first request to begin property service tracking, messaging, and cost visibility.'
                  : `${open.length + active.length} active request${open.length + active.length !== 1 ? 's' : ''} · ${completed.length} completed · $${totalSpend.toLocaleString()} tracked`}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2.5 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
                title={`Last updated ${lastRefresh.toLocaleTimeString()}`}
                aria-label="Refresh"
              >
                <RefreshCw className={`w-4 h-4 text-white ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <Link
                href="/dashboard/homeowner/new-request"
                className="inline-flex items-center gap-2 bg-white text-primary font-semibold text-sm px-5 py-3 rounded-xl hover:bg-white/95 transition-colors shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Dispatch Request
              </Link>
            </div>
          </div>
        </div>

        {/* Subscription Card */}
        <div className={`relative overflow-hidden rounded-xl border p-5 sm:p-6 ${
          isPro
            ? 'border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent'
            : 'border-border bg-card'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isPro
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                  : 'bg-primary/10 text-primary'
              }`}>
                {isPro ? <Crown className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-foreground">{planLabel} Plan</p>
                  {isPro && (
                    <span className="text-xs font-semibold uppercase tracking-wider bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {isPro
                    ? 'Unlimited dispatch requests, priority routing, and insurance-ready reporting.'
                    : requestsRemaining != null && requestsRemaining > 0
                    ? `${requestsRemaining} of 3 Starter requests remaining. Upgrade for unlimited volume.`
                    : 'Starter request limit reached. Upgrade to continue dispatching work.'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {!isPro && (
                <Link
                  href="/dashboard/homeowner/billing"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-sm px-4 py-2.5 rounded-lg hover:opacity-95 transition-opacity shadow-sm"
                >
                  <Zap className="w-4 h-4" />
                  Upgrade Plan
                </Link>
              )}
              <Link
                href="/dashboard/homeowner/billing"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary border border-primary/30 bg-background hover:bg-primary/5 transition-colors px-4 py-2.5 rounded-lg"
              >
                {isPro ? 'Manage plan' : 'Compare plans'}
              </Link>
            </div>
          </div>

          {!isPro && (
            <div className="mt-5 pt-5 border-t border-border grid grid-cols-3 gap-4 text-center">
              {[
                { icon: Zap, label: 'Unlimited request volume' },
                { icon: TrendingUp, label: 'Priority contractor routing' },
                { icon: CheckCircle2, label: 'Insurance-ready documentation' },
              ].map(b => {
                const Icon = b.icon
                return (
                  <div key={b.label} className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-xs font-medium text-foreground/80">{b.label}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s => {
            const Icon = s.icon
            return (
              <div key={s.label} className="group bg-card border border-border rounded-xl p-5 card-elevated card-elevated-hover">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{s.label}</span>
                  <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${s.color}`} />
                  </div>
                </div>
                <p className="font-display text-2xl sm:text-3xl font-bold text-foreground tabular-nums">{s.value}</p>
              </div>
            )
          })}
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: 'Service Level',
              value: isPro ? 'Priority Routing' : 'Standard Routing',
              description: isPro
                ? 'Pro requests receive top-priority contractor matching and escalation handling.'
                : 'Starter requests are routed in standard queue order.',
            },
            {
              title: 'Open Exposure',
              value: `${open.length + active.length} Active`,
              description: 'Monitor open and in-progress work impacting your property operations.',
            },
            {
              title: 'Financial Visibility',
              value: `$${totalSpend.toLocaleString()}`,
              description: 'Track completed project value and maintain invoice-ready records.',
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-card p-5 card-elevated">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{item.title}</p>
              <p className="mt-2 text-2xl font-display font-bold text-foreground">{item.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </section>

        {/* Requests List */}
        <div className="bg-card border border-border rounded-xl overflow-hidden card-elevated">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border gap-3 flex-wrap">
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              {(['all', 'active', 'completed'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all capitalize ${
                    tab === t ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <Link
              href="/dashboard/homeowner/new-request"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Dispatch request
            </Link>
          </div>

          {displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="font-semibold text-foreground mb-1">
                {tab === 'all' ? 'No requests yet' : `No ${tab} requests`}
              </p>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                {tab === 'all'
                  ? 'Submit your first request to begin dispatch, tracking, and financial visibility.'
                  : `You have no ${tab} requests at this time.`}
              </p>
              {tab === 'all' && (
                <Link
                  href="/dashboard/homeowner/new-request"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-sm px-5 py-2.5 rounded-lg hover:opacity-95 transition-opacity"
                >
                  <Plus className="w-4 h-4" />
                  Dispatch First Request
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
                    className="flex items-start gap-4 px-5 py-5 hover:bg-muted/50 transition-colors group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center text-xl flex-shrink-0">
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2.5 flex-wrap mb-1">
                            <p className="font-semibold text-foreground truncate">
                              {req.title || fmt(req.category)}
                            </p>
                            <StatusBadge status={req.status} />
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
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
                          <p className="text-sm text-muted-foreground line-clamp-1">{req.description}</p>
                          <ProgressTrack status={req.status} />
                        </div>
                        <div className="flex-shrink-0 text-right flex flex-col items-end gap-2">
                          {req.budget != null && (
                            <span className="font-bold text-foreground flex items-center gap-0.5">
                              <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
                              {req.budget.toLocaleString()}
                            </span>
                          )}
                          <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
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
          requests={requests as any}
        />

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              href: '/dashboard/homeowner/new-request',
              icon: Plus,
              iconBg: 'bg-primary/10',
              iconColor: 'text-primary',
              title: 'Create Service Request',
              sub: 'Launch a new request and start live service tracking',
            },
            {
              href: '/dashboard/homeowner/properties',
              icon: MapPin,
              iconBg: 'bg-violet-500/10',
              iconColor: 'text-violet-600 dark:text-violet-400',
              title: 'Property Tracker',
              sub: 'View every property and related open service activity',
            },
            {
              href: '/dashboard/messages',
              icon: Activity,
              iconBg: 'bg-blue-500/10',
              iconColor: 'text-blue-600 dark:text-blue-400',
              title: 'Messages',
              sub: 'Open conversations with your assigned service professionals',
            },
            {
              href: '/dashboard/homeowner/profile',
              icon: CreditCard,
              iconBg: 'bg-emerald-500/10',
              iconColor: 'text-emerald-600 dark:text-emerald-400',
              title: 'Profile & Photo',
              sub: isPro ? `${planLabel} Plan · Active profile` : 'Update your profile photo and account details',
            },
          ].map(({ href, icon: Icon, iconBg, iconColor, title, sub }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-4 p-5 bg-card border border-border rounded-xl card-elevated card-elevated-hover"
            >
              <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm">{title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{sub}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
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
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>}>
      <HomeownerDashboardInner />
    </Suspense>
  )
}
