'use client'
import { useAuth } from '@/app/lib/auth-context'
import { useRequests } from '@/app/lib/requests-context'
import { DashboardLayout } from '@/components/dashboard-layout'
import { useRouter } from '@/lib/router'
import { useEffect, useState } from 'react'
import { isHomeownerDashboardRole } from '@/lib/dashboard-role'
import {
  FileText, CheckCircle2, Clock, AlertCircle,
  Briefcase, Plus, ArrowRight, TrendingUp, Search, MessageSquare, Home,
} from 'lucide-react'
import Link from '@/components/link'

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    available:   'bg-emerald-50 text-emerald-700 border-emerald-200',
    claimed:     'bg-sky-50 text-sky-700 border-sky-200',
    'in-progress':'bg-violet-50 text-violet-700 border-violet-200',
    completed:   'bg-muted text-muted-foreground border-border',
    invoiced:    'bg-amber-50 text-amber-700 border-amber-200',
    pending:     'bg-amber-50 text-amber-700 border-amber-200',
  }
  const label: Record<string, string> = {
    available:    'Available',
    claimed:      'Claimed',
    'in-progress':'In Progress',
    completed:    'Completed',
    invoiced:     'Invoiced',
    pending:      'Pending',
  }
  const cls = map[status] ?? 'bg-muted text-muted-foreground border-border'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold border ${cls}`}>
      {label[status] ?? status}
    </span>
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

  return (
    <DashboardLayout
      userName={user?.name ?? 'System User'}
      userRole={user?.role ?? 'client'}
      userEmail={user?.email ?? ''}
      onLogout={handleLogout}
    >
      <div id="main-content" className="space-y-8 max-w-5xl">

        {/* Search bar */}
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

        {/* Page header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[22px] font-bold tracking-tight text-foreground">
              Welcome back, {firstName}
            </h1>
            <p className="mt-1 text-[13.5px] text-muted-foreground">
              {isHomeownerDashboardRole(user?.role)
                ? "Track service dispatch, completion status, and project costs in one view."
                : user?.role === 'contractor'
                ? "Review available work, active assignments, and payout visibility."
                : "Monitor operations performance, user activity, and financial controls."}
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

        {/* Quick actions */}
        {(() => {
          const quickActions = isHomeownerDashboardRole(user?.role) ? [
            { label: 'New Request',      href: '/dashboard/requests/new',              icon: Plus,           color: 'text-primary bg-primary/10' },
            { label: 'Find Contractor',  href: '/search?tab=contractors',              icon: Search,         color: 'text-sky-600 bg-sky-50' },
            { label: 'Messages',         href: '/dashboard/messages',                  icon: MessageSquare,  color: 'text-violet-600 bg-violet-50' },
            { label: 'My Properties',    href: '/dashboard/homeowner/properties',      icon: Home,           color: 'text-emerald-600 bg-emerald-50' },
          ] : user?.role === 'contractor' ? [
            { label: 'Available Work',   href: '/dashboard/contractor/available-work', icon: Briefcase,      color: 'text-primary bg-primary/10' },
            { label: 'Find Properties',  href: '/search?tab=properties',               icon: Search,         color: 'text-sky-600 bg-sky-50' },
            { label: 'Messages',         href: '/dashboard/messages',                  icon: MessageSquare,  color: 'text-violet-600 bg-violet-50' },
            { label: 'Earnings',         href: '/dashboard/contractor/analytics',      icon: TrendingUp,     color: 'text-emerald-600 bg-emerald-50' },
          ] : [
            { label: 'Search Platform',  href: '/search',                              icon: Search,         color: 'text-primary bg-primary/10' },
            { label: 'Messages',         href: '/dashboard/messages',                  icon: MessageSquare,  color: 'text-violet-600 bg-violet-50' },
          ]
          return (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickActions.map(({ label, href, icon: Icon, color }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card hover:bg-muted/40 hover:border-primary/30 transition-all"
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[12px] font-semibold text-foreground text-center leading-tight">{label}</span>
                </Link>
              ))}
            </div>
          )
        })()}

        {/* ── CLIENT VIEW ── */}
        {isHomeownerDashboardRole(user?.role) && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {
                   label: 'Active Dispatch',
                  value: clientRequests.filter(r => r.status !== 'completed' && r.status !== 'invoiced').length,
                  icon: Clock,
                  color: 'text-sky-600',
                  bg: 'bg-sky-50 border-sky-100',
                },
                {
                  label: 'Completed',
                  value: clientRequests.filter(r => r.status === 'completed' || r.status === 'invoiced').length,
                  icon: CheckCircle2,
                  color: 'text-emerald-600',
                  bg: 'bg-emerald-50 border-emerald-100',
                },
                {
                   label: 'Tracked Cost',
                  value: '$' + clientRequests.filter(r => r.invoiceAmount).reduce((s, r) => s + (r.invoiceAmount || 0), 0).toLocaleString(),
                  icon: FileText,
                  color: 'text-primary',
                  bg: 'bg-primary/5 border-primary/15',
                },
                {
                  label: 'Total Requests',
                  value: clientRequests.length,
                  icon: TrendingUp,
                  color: 'text-violet-600',
                  bg: 'bg-violet-50 border-violet-100',
                },
              ].map(({ label, value, icon: Icon, color, bg }) => (
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

            {/* Recent Requests */}
            <div>
              <div className="flex items-center justify-between mb-4">
                 <h2 className="text-[15px] font-semibold text-foreground">Recent service requests</h2>
                <Link href="/dashboard/requests" className="text-[12.5px] text-primary hover:underline underline-offset-4 inline-flex items-center gap-1">
                  View all <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {clientRequests.length === 0 ? (
                <div className="border-y border-dashed border-border py-10 text-center">
                  <Briefcase className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
                   <p className="text-[14px] font-medium text-foreground mb-1">No requests yet</p>
                   <p className="text-[13px] text-muted-foreground mb-5">Create your first request to begin dispatch and contractor matching.</p>
                  <Link
                    href="/dashboard/requests/new"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-[12.5px] font-semibold text-primary-foreground hover:opacity-90 transition"
                  >
                     <Plus className="h-3.5 w-3.5" /> Dispatch a request
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-border/40 border-y border-border/60">
                  {clientRequests.slice(0, 5).map((req) => (
                    <div key={req.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/30 transition-colors">
                      <div className="flex-1 min-w-0 mr-4">
                        <p className="text-[13.5px] font-medium text-foreground truncate">{req.type}</p>
                        <p className="text-[12px] text-muted-foreground mt-0.5 truncate">{req.propertyName}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {req.invoiceAmount && (
                          <span className="text-[12.5px] font-semibold text-foreground">
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

        {/* ── CONTRACTOR VIEW ── */}
        {user?.role === 'contractor' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {
                  label: 'Available',
                  value: contractorJobs.filter(j => j.status === 'available').length,
                  icon: Briefcase,
                  color: 'text-emerald-600',
                  bg: 'bg-emerald-50 border-emerald-100',
                },
                {
                   label: 'Active Assignments',
                  value: contractorJobs.filter(j => j.status === 'claimed').length,
                  icon: Clock,
                  color: 'text-sky-600',
                  bg: 'bg-sky-50 border-sky-100',
                },
                {
                   label: 'Pending Payout Value',
                  value: '$' + contractorJobs.filter(j => j.status !== 'invoiced').reduce((s, j) => s + (j.payout || 0), 0).toLocaleString(),
                  icon: FileText,
                  color: 'text-primary',
                  bg: 'bg-primary/5 border-primary/15',
                },
                {
                  label: 'This Month',
                  value: '$' + contractorJobs
                    .filter(j => j.status === 'completed' || j.status === 'invoiced')
                    .reduce((s, j) => s + (j.payout || 0), 0)
                    .toLocaleString(),
                  icon: TrendingUp,
                  color: 'text-violet-600',
                  bg: 'bg-violet-50 border-violet-100',
                },
              ].map(({ label, value, icon: Icon, color, bg }) => (
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

            {/* Available Jobs */}
            <div>
              <div className="flex items-center justify-between mb-4">
                 <h2 className="text-[15px] font-semibold text-foreground">Available jobs</h2>
                <Link href="/dashboard/jobs" className="text-[12.5px] text-primary hover:underline underline-offset-4 inline-flex items-center gap-1">
                  View all <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {contractorJobs.filter(j => j.status === 'available').length === 0 ? (
                <div className="border-y border-dashed border-border py-10 text-center">
                  <Briefcase className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-[14px] font-medium text-foreground mb-1">No available jobs right now</p>
                   <p className="text-[13px] text-muted-foreground">New opportunities aligned to your trade profile will appear here automatically.</p>
                </div>
              ) : (
                <div className="divide-y divide-border/50 border-y border-border/60">
                  {contractorJobs.filter(j => j.status === 'available').map((job) => (
                    <div
                      key={job.id}
                      className="py-5 hover:bg-muted/20 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-semibold text-foreground">{job.type}</p>
                          <p className="text-[12.5px] text-muted-foreground mt-0.5">{job.propertyName}</p>
                        </div>
                        <StatusBadge status={job.status} />
                      </div>
                      <p className="text-[12.5px] text-muted-foreground mb-4 leading-relaxed">{job.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[15px] font-bold text-foreground">${job.budget.toLocaleString()}</span>
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

        {/* ── ADMIN VIEW ── */}
        {user?.role === 'admin' && (
          <div className="border-y border-border/60 py-10 text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-[14px] font-medium text-foreground mb-1">Admin Dashboard</p>
             <p className="text-[13px] text-muted-foreground">Configure reporting, manage permissions, and monitor operating performance.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
