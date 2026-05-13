'use client'
import { useAuth } from '@/app/lib/auth-context'
import { useRequests } from '@/app/lib/requests-context'
import { DashboardLayout } from '@/components/dashboard-layout'
import { useRouter } from '@/lib/router'
import { useEffect, useMemo, useState } from 'react'
import { isHomeownerDashboardRole } from '@/lib/dashboard-role'
import {
  FileText, CheckCircle2, Clock, AlertCircle,
  Briefcase, Plus, ArrowRight, TrendingUp, Search, MessageSquare, Home,
  DollarSign, Activity, Layers, BarChart3,
} from 'lucide-react'
import Link from '@/components/link'

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    available:    { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800', label: 'Available' },
    claimed:      { cls: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-800', label: 'Claimed' },
    'in-progress':{ cls: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800', label: 'In Progress' },
    completed:    { cls: 'bg-muted text-muted-foreground border-border', label: 'Completed' },
    invoiced:     { cls: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800', label: 'Invoiced' },
    pending:      { cls: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800', label: 'Pending' },
  }
  const { cls, label } = map[status] ?? { cls: 'bg-muted text-muted-foreground border-border', label: status }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${cls}`}>
      {label}
    </span>
  )
}

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ElementType
  accentColor: string
  accentBg: string
  borderColor?: string
  change?: string
}
function StatCard({ label, value, icon: Icon, accentColor, accentBg, borderColor, change }: StatCardProps) {
  return (
    <div className={`bg-card rounded-xl border ${borderColor ?? 'border-border'} p-5 relative overflow-hidden`}>
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${accentBg}`} />
      <div className="flex items-start justify-between mb-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground">{label}</p>
        <div className={`w-8 h-8 rounded-lg ${accentBg} flex items-center justify-center`}>
          <Icon className={`h-4 w-4 ${accentColor}`} />
        </div>
      </div>
      <p className="text-[28px] font-bold text-foreground tracking-tight tabular-nums leading-none">{value}</p>
      {change && <p className="text-[11.5px] text-muted-foreground mt-2">{change}</p>}
    </div>
  )
}

export default function DashboardPage() {
  const { user, isLoggedIn, logout } = useAuth()
  const { clientRequests, contractorJobs } = useRequests()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!isLoggedIn) router.push('/auth/login')
  }, [isLoggedIn, router])

  if (!isLoggedIn) return null

  const firstName = user?.name?.split(' ')[0] ?? 'there'

  const handleLogout = async () => {
    await logout()
    router.push('/auth/login')
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  /* ── Derived stats (memoized to avoid re-computing on every render) ── */
  const {
    activeRequests, completedRequests, trackedCost,
  } = useMemo(() => ({
    activeRequests:    clientRequests.filter(r => r.status !== 'completed' && r.status !== 'invoiced').length,
    completedRequests: clientRequests.filter(r => r.status === 'completed' || r.status === 'invoiced').length,
    trackedCost:       clientRequests.filter(r => r.invoiceAmount).reduce((s, r) => s + (r.invoiceAmount || 0), 0),
  }), [clientRequests])

  const {
    availableJobs, activeJobs, pendingPayout, monthlyEarnings,
  } = useMemo(() => ({
    availableJobs:   contractorJobs.filter(j => j.status === 'available').length,
    activeJobs:      contractorJobs.filter(j => j.status === 'claimed').length,
    pendingPayout:   contractorJobs.filter(j => j.status !== 'invoiced').reduce((s, j) => s + (j.payout || 0), 0),
    monthlyEarnings: contractorJobs.filter(j => j.status === 'completed' || j.status === 'invoiced').reduce((s, j) => s + (j.payout || 0), 0),
  }), [contractorJobs])

  return (
    <DashboardLayout
      userName={user?.name ?? 'System User'}
      userRole={user?.role ?? 'client'}
      userEmail={user?.email ?? ''}
      onLogout={handleLogout}
    >
      <div id="main-content" className="space-y-7 max-w-5xl">

        {/* ── Search bar ── */}
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search requests, properties, contractors…"
            className="w-full pl-11 pr-4 h-11 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
          />
        </form>

        {/* ── Page header ── */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[22px] font-bold tracking-tight text-foreground">
              Welcome back, {firstName}
            </h1>
            <p className="mt-1 text-[13.5px] text-muted-foreground">
              {isHomeownerDashboardRole(user?.role)
                ? 'Track service dispatch, completion status, and project costs in one view.'
                : user?.role === 'contractor'
                ? 'Review available work, active assignments, and payout visibility.'
                : 'Monitor operations performance, user activity, and financial controls.'}
            </p>
          </div>
          {isHomeownerDashboardRole(user?.role) && (
            <Link
              href="/dashboard/requests/new"
              className="flex-shrink-0 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-[12.5px] font-semibold text-primary-foreground hover:opacity-90 transition shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" /> Dispatch Request
            </Link>
          )}
        </div>

        {/* ── Quick actions ── */}
        {(() => {
          const quickActions = isHomeownerDashboardRole(user?.role) ? [
            { label: 'New Request',     href: '/dashboard/requests/new',              icon: Plus,           iconBg: 'bg-primary/10',      iconColor: 'text-primary' },
            { label: 'Find Contractor', href: '/search?tab=contractors',              icon: Search,         iconBg: 'bg-sky-500/10',      iconColor: 'text-sky-600 dark:text-sky-400' },
            { label: 'Messages',        href: '/dashboard/messages',                  icon: MessageSquare,  iconBg: 'bg-violet-500/10',   iconColor: 'text-violet-600 dark:text-violet-400' },
            { label: 'My Properties',   href: '/dashboard/homeowner/properties',      icon: Home,           iconBg: 'bg-emerald-500/10',  iconColor: 'text-emerald-600 dark:text-emerald-400' },
          ] : user?.role === 'contractor' ? [
            { label: 'Available Work',  href: '/dashboard/contractor/available-work', icon: Briefcase,      iconBg: 'bg-primary/10',      iconColor: 'text-primary' },
            { label: 'Find Properties', href: '/search?tab=properties',               icon: Search,         iconBg: 'bg-sky-500/10',      iconColor: 'text-sky-600 dark:text-sky-400' },
            { label: 'Messages',        href: '/dashboard/messages',                  icon: MessageSquare,  iconBg: 'bg-violet-500/10',   iconColor: 'text-violet-600 dark:text-violet-400' },
            { label: 'Earnings',        href: '/dashboard/contractor/analytics',      icon: TrendingUp,     iconBg: 'bg-emerald-500/10',  iconColor: 'text-emerald-600 dark:text-emerald-400' },
          ] : [
            { label: 'Search Platform', href: '/search',                              icon: Search,         iconBg: 'bg-primary/10',      iconColor: 'text-primary' },
            { label: 'Messages',        href: '/dashboard/messages',                  icon: MessageSquare,  iconBg: 'bg-violet-500/10',   iconColor: 'text-violet-600 dark:text-violet-400' },
          ]
          return (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickActions.map(({ label, href, icon: Icon, iconBg, iconColor }) => (
                <Link
                  key={label}
                  href={href}
                  className="group flex flex-col items-center gap-2.5 p-4 rounded-xl border border-border bg-card hover:bg-muted/40 hover:border-primary/30 hover:shadow-sm transition-all"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg} transition-transform group-hover:scale-110`}>
                    <Icon className={`h-4.5 w-4.5 ${iconColor}`} />
                  </div>
                  <span className="text-[12px] font-semibold text-foreground text-center leading-tight">{label}</span>
                </Link>
              ))}
            </div>
          )
        })()}

        {/* ══ CLIENT VIEW ══ */}
        {isHomeownerDashboardRole(user?.role) && (
          <>
            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard
                label="Active Dispatch"
                value={activeRequests}
                icon={Clock}
                accentColor="text-sky-600 dark:text-sky-400"
                accentBg="bg-sky-500/15"
                borderColor="border-sky-200/60 dark:border-sky-900/60"
              />
              <StatCard
                label="Completed"
                value={completedRequests}
                icon={CheckCircle2}
                accentColor="text-emerald-600 dark:text-emerald-400"
                accentBg="bg-emerald-500/15"
                borderColor="border-emerald-200/60 dark:border-emerald-900/60"
              />
              <StatCard
                label="Tracked Cost"
                value={`$${trackedCost.toLocaleString()}`}
                icon={DollarSign}
                accentColor="text-primary"
                accentBg="bg-primary/15"
                borderColor="border-primary/20"
              />
              <StatCard
                label="Total Requests"
                value={clientRequests.length}
                icon={Activity}
                accentColor="text-violet-600 dark:text-violet-400"
                accentBg="bg-violet-500/15"
                borderColor="border-violet-200/60 dark:border-violet-900/60"
              />
            </div>

            {/* Recent Requests */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[15px] font-semibold text-foreground">Recent service requests</h2>
                <Link href="/dashboard/requests" className="text-[12.5px] text-primary hover:underline underline-offset-4 inline-flex items-center gap-1 font-medium">
                  View all <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {clientRequests.length === 0 ? (
                <div className="border border-dashed border-border rounded-xl py-12 text-center bg-muted/20">
                  <div className="w-12 h-12 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-muted-foreground/50" />
                  </div>
                  <p className="text-[14px] font-semibold text-foreground mb-1">No requests yet</p>
                  <p className="text-[13px] text-muted-foreground mb-6 max-w-xs mx-auto">
                    Create your first request to begin dispatch and contractor matching.
                  </p>
                  <Link
                    href="/dashboard/requests/new"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-[12.5px] font-semibold text-primary-foreground hover:opacity-90 transition"
                  >
                    <Plus className="h-3.5 w-3.5" /> Dispatch a request
                  </Link>
                </div>
              ) : (
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  {clientRequests.slice(0, 5).map((req, i) => (
                    <div
                      key={req.id}
                      className={`flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors ${i < clientRequests.slice(0, 5).length - 1 ? 'border-b border-border/50' : ''}`}
                    >
                      <div className="flex-1 min-w-0 mr-4">
                        <p className="text-[13.5px] font-semibold text-foreground truncate">{req.type}</p>
                        <p className="text-[12px] text-muted-foreground mt-0.5 truncate">{req.propertyName}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {req.invoiceAmount && (
                          <span className="text-[13px] font-bold text-foreground tabular-nums">
                            ${req.invoiceAmount.toLocaleString()}
                          </span>
                        )}
                        <StatusBadge status={req.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ══ CONTRACTOR VIEW ══ */}
        {user?.role === 'contractor' && (
          <>
            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard
                label="Available"
                value={availableJobs}
                icon={Briefcase}
                accentColor="text-emerald-600 dark:text-emerald-400"
                accentBg="bg-emerald-500/15"
                borderColor="border-emerald-200/60 dark:border-emerald-900/60"
              />
              <StatCard
                label="Active Assignments"
                value={activeJobs}
                icon={Clock}
                accentColor="text-sky-600 dark:text-sky-400"
                accentBg="bg-sky-500/15"
                borderColor="border-sky-200/60 dark:border-sky-900/60"
              />
              <StatCard
                label="Pending Payout"
                value={`$${pendingPayout.toLocaleString()}`}
                icon={FileText}
                accentColor="text-primary"
                accentBg="bg-primary/15"
                borderColor="border-primary/20"
              />
              <StatCard
                label="This Month"
                value={`$${monthlyEarnings.toLocaleString()}`}
                icon={TrendingUp}
                accentColor="text-violet-600 dark:text-violet-400"
                accentBg="bg-violet-500/15"
                borderColor="border-violet-200/60 dark:border-violet-900/60"
              />
            </div>

            {/* Available Jobs */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[15px] font-semibold text-foreground">Available jobs</h2>
                <Link href="/dashboard/jobs" className="text-[12.5px] text-primary hover:underline underline-offset-4 inline-flex items-center gap-1 font-medium">
                  View all <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {contractorJobs.filter(j => j.status === 'available').length === 0 ? (
                <div className="border border-dashed border-border rounded-xl py-12 text-center bg-muted/20">
                  <div className="w-12 h-12 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-muted-foreground/50" />
                  </div>
                  <p className="text-[14px] font-semibold text-foreground mb-1">No available jobs right now</p>
                  <p className="text-[13px] text-muted-foreground max-w-xs mx-auto">
                    New opportunities aligned to your trade profile will appear here automatically.
                  </p>
                </div>
              ) : (
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  {contractorJobs.filter(j => j.status === 'available').map((job, i, arr) => (
                    <div
                      key={job.id}
                      className={`px-5 py-5 hover:bg-muted/20 transition-colors ${i < arr.length - 1 ? 'border-b border-border/50' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-semibold text-foreground">{job.type}</p>
                          <p className="text-[12.5px] text-muted-foreground mt-0.5">{job.propertyName}</p>
                        </div>
                        <StatusBadge status={job.status} />
                      </div>
                      <p className="text-[12.5px] text-muted-foreground mb-4 leading-relaxed">{job.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[16px] font-bold text-foreground tabular-nums">${job.budget.toLocaleString()}</span>
                        <button className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-[12px] font-semibold text-primary-foreground hover:opacity-90 transition">
                          Claim assignment <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ══ ADMIN VIEW ══ */}
        {user?.role === 'admin' && (
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: 'Users',       href: '/dashboard/admin/users',       icon: Layers,   desc: 'Manage accounts, roles, and access control.' },
              { label: 'Jobs',        href: '/dashboard/admin/jobs',         icon: Briefcase, desc: 'View active and pending service assignments.' },
              { label: 'Invoices',    href: '/dashboard/admin/invoices',     icon: FileText, desc: 'Financial oversight and invoice management.' },
              { label: 'Contractors', href: '/dashboard/admin/contractors',  icon: BarChart3, desc: 'Contractor verification and performance data.' },
            ].map(({ label, href, icon: Icon, desc }) => (
              <Link
                key={label}
                href={href}
                className="group flex items-center gap-4 p-5 bg-card border border-border rounded-xl hover:border-primary/30 hover:shadow-sm transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-[14px]">{label}</p>
                  <p className="text-[12px] text-muted-foreground mt-0.5">{desc}</p>
                </div>
                <AlertCircle className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary/60 transition-colors flex-shrink-0 rotate-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
