'use client'
import { useAuth } from '@/app/lib/auth-context'
import { useRequests } from '@/app/lib/requests-context'
import { DashboardLayout } from '@/components/dashboard-layout'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { isHomeownerDashboardRole } from '@/lib/dashboard-role'
import {
  FileText, CheckCircle2, Clock, AlertCircle,
  Briefcase, Plus, ArrowRight, TrendingUp,
} from 'lucide-react'
import Link from 'next/link'

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
  const { clientRequests, contractorJobs, clearCachedData } = useRequests()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn) router.push('/auth/login')
  }, [isLoggedIn, router])

  if (!isLoggedIn) return null

  const firstName = user?.name?.split(' ')[0] ?? 'there'

  const handleLogout = async () => {
    await logout()
    router.push('/auth/login')
  }

  const handleResetDashboard = () => {
    clearCachedData()
  }

  return (
    <DashboardLayout
      userName={user?.name ?? 'System User'}
      userRole={user?.role ?? 'client'}
      userEmail={user?.email ?? ''}
      onLogout={handleLogout}
    >
      <div id="main-content" className="space-y-8 max-w-5xl">

        {/* Page header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[22px] font-bold tracking-tight text-foreground">
              Welcome back, {firstName}
            </h1>
            <p className="mt-1 text-[13.5px] text-muted-foreground">
              {isHomeownerDashboardRole(user?.role)
                ? "Here's an overview of your maintenance activity."
                : user?.role === 'contractor'
                ? "Here's your job board and earnings summary."
                : "Admin overview — manage the platform below."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDashboard}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-[12.5px] font-semibold text-foreground hover:bg-muted/50 transition"
            >
              Reset cached dashboard
            </button>

            {user?.role === 'client' && (
              <Link
                href="/dashboard/requests/new"
                className="flex-shrink-0 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-[12.5px] font-semibold text-primary-foreground hover:opacity-90 transition shadow-sm"
              >
                <Plus className="h-3.5 w-3.5" /> New Request
              </Link>
            )}
          </div>
        </div>

        {/* ── CLIENT VIEW ── */}
        {isHomeownerDashboardRole(user?.role) && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {
                  label: 'Active',
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
                  label: 'Total Spend',
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
                <h2 className="text-[15px] font-semibold text-foreground">Recent requests</h2>
                <Link href="/dashboard/requests" className="text-[12.5px] text-primary hover:underline underline-offset-4 inline-flex items-center gap-1">
                  View all <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {clientRequests.length === 0 ? (
                <div className="border-y border-dashed border-border py-10 text-center">
                  <Briefcase className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-[14px] font-medium text-foreground mb-1">No requests yet</p>
                  <p className="text-[13px] text-muted-foreground mb-5">Submit your first maintenance request to get started.</p>
                  <Link
                    href="/dashboard/requests/new"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-[12.5px] font-semibold text-primary-foreground hover:opacity-90 transition"
                  >
                    <Plus className="h-3.5 w-3.5" /> Submit a request
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
                  label: 'Active',
                  value: contractorJobs.filter(j => j.status === 'claimed').length,
                  icon: Clock,
                  color: 'text-sky-600',
                  bg: 'bg-sky-50 border-sky-100',
                },
                {
                  label: 'Pending Payout',
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
                  <p className="text-[13px] text-muted-foreground">New jobs matching your trade will appear here when submitted.</p>
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
                          Claim job <ArrowRight className="h-3 w-3" />
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
            <p className="text-[13px] text-muted-foreground">Configure reports, manage team access, and review platform activity.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
