'use client'
import { useAuth } from '@/app/lib/auth-context'
import { useRequests } from '@/app/lib/requests-context'
import { DashboardLayout } from '@/components/dashboard-layout'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { isHomeownerDashboardRole } from '@/lib/dashboard-role'
import {
  FileText, CheckCircle2, Clock, AlertCircle,
  Briefcase, Plus, ArrowRight, TrendingUp, Activity,
  Zap, Shield, DollarSign, BarChart3,
} from 'lucide-react'
import Link from 'next/link'

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    available:    { label: 'Open',        cls: 'bg-sky-50 text-sky-700 border-sky-200' },
    claimed:      { label: 'Assigned',    cls: 'bg-violet-50 text-violet-700 border-violet-200' },
    'in-progress':{ label: 'Active',      cls: 'bg-amber-50 text-amber-700 border-amber-200' },
    completed:    { label: 'Closed',      cls: 'bg-muted text-muted-foreground border-border' },
    invoiced:     { label: 'Invoiced',    cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    pending:      { label: 'Pending',     cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  }
  const s = map[status] ?? { label: status, cls: 'bg-muted text-muted-foreground border-border' }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold border ${s.cls}`}>
      {s.label}
    </span>
  )
}

function UrgencyDot({ urgency }: { urgency?: string }) {
  if (!urgency || urgency === 'routine') return null
  return (
    <span className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${
      urgency === 'emergency' ? 'bg-red-500' : 'bg-amber-400'
    }`} title={urgency} />
  )
}

export default function DashboardPage() {
  const { user, isLoggedIn, logout } = useAuth()
  const { clientRequests, contractorJobs, clearCachedData } = useRequests()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn) router.push('/auth/login')
  }, [isLoggedIn, router])

  if (!isLoggedIn) return null

  const handleLogout = async () => {
    await logout()
    router.push('/auth/login')
  }

  return (
    <DashboardLayout
      userName={user?.name ?? 'System User'}
      userRole={user?.role ?? 'client'}
      userEmail={user?.email ?? ''}
      onLogout={handleLogout}
    >
      <div id="main-content" className="space-y-8 max-w-5xl">

        {/* ── CLIENT / PROPERTY MANAGER VIEW ── */}
        {isHomeownerDashboardRole(user?.role) && (
          <ClientOperationsView
            requests={clientRequests}
            onReset={clearCachedData}
          />
        )}

        {/* ── CONTRACTOR VIEW ── */}
        {user?.role === 'contractor' && (
          <ContractorDispatchView jobs={contractorJobs} />
        )}

        {/* ── ADMIN VIEW ── */}
        {user?.role === 'admin' && (
          <AdminOperationsView />
        )}
      </div>
    </DashboardLayout>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Client / Property Manager                                                   */
/* ─────────────────────────────────────────────────────────────────────────── */

function ClientOperationsView({
  requests,
  onReset,
}: {
  requests: ReturnType<typeof useRequests>['clientRequests']
  onReset: () => void
}) {
  const active    = requests.filter(r => !['completed', 'invoiced'].includes(r.status))
  const completed = requests.filter(r => ['completed', 'invoiced'].includes(r.status))
  const spend     = requests.filter(r => r.invoiceAmount).reduce((s, r) => s + (r.invoiceAmount || 0), 0)

  const metrics = [
    {
      label: 'Open Operations',
      value: active.length,
      icon: Activity,
      color: 'text-sky-600',
      bg: 'bg-sky-50 border-sky-100',
    },
    {
      label: 'Closed This Year',
      value: completed.length,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-100',
    },
    {
      label: 'Portfolio Spend',
      value: '$' + spend.toLocaleString(),
      icon: DollarSign,
      color: 'text-primary',
      bg: 'bg-primary/5 border-primary/15',
    },
    {
      label: 'Work Orders',
      value: requests.length,
      icon: BarChart3,
      color: 'text-violet-600',
      bg: 'bg-violet-50 border-violet-100',
    },
  ]

  return (
    <>
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-1">
            Operations Center
          </p>
          <h1 className="text-[22px] font-bold tracking-tight text-foreground">
            Property Overview
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-[12.5px] font-semibold text-foreground hover:bg-muted/50 transition"
          >
            Refresh
          </button>
          <Link
            href="/dashboard/requests/new"
            className="flex-shrink-0 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-[12.5px] font-semibold text-primary-foreground hover:opacity-90 transition shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" /> New Work Order
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {metrics.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="border-b border-border/60 py-4">
            <div className="flex items-start justify-between mb-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">{label}</p>
              <div className={`flex items-center justify-center w-7 h-7 rounded-lg border ${bg}`}>
                <Icon className={`h-3.5 w-3.5 ${color}`} />
              </div>
            </div>
            <p className="text-[26px] font-bold text-foreground tracking-tight">{value}</p>
          </div>
        ))}
      </div>

      {/* Operations pipeline */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[15px] font-semibold text-foreground">Operations pipeline</h2>
            <p className="text-[12px] text-muted-foreground mt-0.5">Recent work orders across all properties</p>
          </div>
          <Link href="/dashboard/requests" className="text-[12.5px] text-primary hover:underline underline-offset-4 inline-flex items-center gap-1">
            All work orders <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {requests.length === 0 ? (
          <div className="border-y border-dashed border-border py-12 text-center">
            <Briefcase className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-[14px] font-semibold text-foreground mb-1">No work orders on record</p>
            <p className="text-[13px] text-muted-foreground mb-5">Submit a request to initiate your first work order.</p>
            <Link
              href="/dashboard/requests/new"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-[12.5px] font-semibold text-primary-foreground hover:opacity-90 transition"
            >
              <Plus className="h-3.5 w-3.5" /> Submit a request
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border/40 border-y border-border/60">
            {requests.slice(0, 6).map((req) => (
              <div key={req.id} className="flex items-center gap-4 px-1 py-3.5 hover:bg-muted/20 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-[13px] font-semibold text-foreground truncate">{req.type}</p>
                  </div>
                  <p className="text-[11.5px] text-muted-foreground truncate">{req.propertyName}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {req.invoiceAmount && (
                    <span className="text-[12.5px] font-semibold text-foreground tabular-nums">
                      ${req.invoiceAmount.toLocaleString()}
                    </span>
                  )}
                  <StatusPill status={req.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { href: '/dashboard/billing', icon: FileText, label: 'Billing & Invoices', sub: 'Subscription and payment history' },
          { href: '/dashboard/messages', icon: Briefcase, label: 'Messages', sub: 'Updates from assigned contractors' },
          { href: '/dashboard/homeowner/settings', icon: Shield, label: 'Account Settings', sub: 'Profile and notification preferences' },
        ].map(({ href, icon: Icon, label, sub }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 hover:border-primary/30 hover:bg-primary/[0.02] transition group"
          >
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-foreground">{label}</p>
              <p className="text-[11px] text-muted-foreground truncate">{sub}</p>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition" />
          </Link>
        ))}
      </div>
    </>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Contractor Dispatch Board                                                   */
/* ─────────────────────────────────────────────────────────────────────────── */

function ContractorDispatchView({
  jobs,
}: {
  jobs: ReturnType<typeof useRequests>['contractorJobs']
}) {
  const available = jobs.filter(j => j.status === 'available')
  const active    = jobs.filter(j => j.status === 'claimed')
  const earned    = jobs.filter(j => ['completed', 'invoiced'].includes(j.status))
                        .reduce((s, j) => s + (j.payout || 0), 0)
  const pending   = jobs.filter(j => !['invoiced'].includes(j.status))
                        .reduce((s, j) => s + (j.payout || 0), 0)

  const metrics = [
    { label: 'Available',      value: available.length, icon: Briefcase,   color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
    { label: 'In Progress',    value: active.length,    icon: Clock,        color: 'text-sky-600',     bg: 'bg-sky-50 border-sky-100' },
    { label: 'Pending Payout', value: '$' + pending.toLocaleString(), icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/5 border-primary/15' },
    { label: 'Earned',         value: '$' + earned.toLocaleString(),  icon: Zap, color: 'text-violet-600', bg: 'bg-violet-50 border-violet-100' },
  ]

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-1">
            Dispatch Board
          </p>
          <h1 className="text-[22px] font-bold tracking-tight text-foreground">
            Job Pipeline
          </h1>
        </div>
        <Link
          href="/dashboard/jobs"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-[12.5px] font-semibold text-foreground hover:bg-muted/50 transition"
        >
          Full job board <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {metrics.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="border-b border-border/60 py-4">
            <div className="flex items-start justify-between mb-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">{label}</p>
              <div className={`flex items-center justify-center w-7 h-7 rounded-lg border ${bg}`}>
                <Icon className={`h-3.5 w-3.5 ${color}`} />
              </div>
            </div>
            <p className="text-[26px] font-bold text-foreground tracking-tight">{value}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[15px] font-semibold text-foreground">Open dispatches</h2>
            <p className="text-[12px] text-muted-foreground mt-0.5">Jobs available in your service area</p>
          </div>
          <Link href="/dashboard/jobs" className="text-[12.5px] text-primary hover:underline underline-offset-4 inline-flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {available.length === 0 ? (
          <div className="border-y border-dashed border-border py-12 text-center">
            <Briefcase className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-[14px] font-semibold text-foreground mb-1">No open dispatches</p>
            <p className="text-[13px] text-muted-foreground">New jobs matching your trade will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50 border-y border-border/60">
            {available.map((job) => (
              <div key={job.id} className="py-5 hover:bg-muted/10 transition-colors">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <UrgencyDot urgency={(job as { urgency?: string }).urgency} />
                      <p className="text-[14px] font-semibold text-foreground">{job.type}</p>
                    </div>
                    <p className="text-[12px] text-muted-foreground mt-0.5">{job.propertyName}</p>
                  </div>
                  <StatusPill status={job.status} />
                </div>
                <p className="text-[12.5px] text-muted-foreground mb-4 leading-relaxed line-clamp-2">{job.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-bold text-foreground tabular-nums">${job.budget.toLocaleString()}</span>
                  <button className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-[12px] font-semibold text-primary-foreground hover:opacity-90 transition">
                    Claim <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Admin Operations Overview                                                   */
/* ─────────────────────────────────────────────────────────────────────────── */

function AdminOperationsView() {
  return (
    <>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-1">
          Platform
        </p>
        <h1 className="text-[22px] font-bold tracking-tight text-foreground">System Overview</h1>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            href: '/dashboard/admin',
            icon: Shield,
            label: 'System Operations',
            sub: 'Platform health, request queue, dispatch status',
            accent: 'bg-primary/5 border-primary/20',
            iconBg: 'bg-primary/10 text-primary',
          },
          {
            href: '/dashboard/admin/users',
            icon: Briefcase,
            label: 'User Management',
            sub: 'Accounts, roles, permissions, and verifications',
            accent: 'bg-card border-border',
            iconBg: 'bg-muted text-muted-foreground',
          },
          {
            href: '/dashboard/admin/invoices',
            icon: FileText,
            label: 'Financial Oversight',
            sub: 'Invoices, payouts, reconciliation, and reporting',
            accent: 'bg-card border-border',
            iconBg: 'bg-muted text-muted-foreground',
          },
        ].map(({ href, icon: Icon, label, sub, accent, iconBg }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-start gap-4 rounded-xl border p-5 hover:-translate-y-0.5 hover:shadow-lg transition-all ${accent}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-foreground">{label}</p>
              <p className="text-[12px] text-muted-foreground mt-1 leading-relaxed">{sub}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="border-y border-dashed border-border py-10 text-center">
        <AlertCircle className="h-7 w-7 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-[13px] text-muted-foreground">Select a section above to manage platform operations.</p>
      </div>
    </>
  )
}
