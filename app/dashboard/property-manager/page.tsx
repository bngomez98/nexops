'use client'

import { useEffect, useState } from 'react'
import { useRouter } from '@/lib/router'
import Link from '@/components/link'
import { DashboardNav } from '@/components/dashboard-nav'
import { createClient } from '@/lib/supabase/client'
import {
  Loader2, Building2, ClipboardList, DollarSign,
  Plus, ArrowRight, Sparkles, TrendingUp, AlertTriangle,
  Clock, FileText, ShieldAlert,
} from 'lucide-react'

interface Alert {
  id: string
  type: 'sla_breach' | 'invoice_pending' | 'overdue'
  title: string
  description: string
  href: string
}

export default function PropertyManagerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<{ id: string; name: string; role: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeJobs: 0,
    slaBreached: 0,
    pendingInvoices: 0,
    spendThisMonth: 0,
  })
  const [alerts, setAlerts] = useState<Alert[]>([])

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) { router.push('/auth/login'); return }

      const role = u.user_metadata?.role
      if (role !== 'property-manager') { router.push('/dashboard'); return }

      setUser({ id: u.id, name: u.user_metadata?.full_name ?? u.email, role: 'property-manager' })

      const { count: propCount } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', u.id)

      const { data: jobs } = await supabase
        .from('jobs')
        .select('status, budget_ceiling')
        .eq('client_id', u.id)

      const active = jobs?.filter(j => ['matched', 'in_progress'].includes(j.status)).length ?? 0

      // Fetch SLA-breached service requests
      const { data: slaRequests } = await supabase
        .from('service_requests')
        .select('id, title, address')
        .eq('client_id', u.id)
        .eq('sla_breached', true)
        .in('status', ['open', 'assigned', 'in_progress'])
        .limit(5)

      const slaBreachedCount = slaRequests?.length ?? 0

      // Fetch pending invoice approvals
      const { data: pendingInvoiceList } = await supabase
        .from('invoices')
        .select('id, invoice_number, total, service_request_id')
        .eq('client_id', u.id)
        .eq('status', 'pending')
        .limit(5)

      const pendingInvoiceCount = pendingInvoiceList?.length ?? 0

      // Build action-oriented alerts
      const builtAlerts: Alert[] = []

      slaRequests?.forEach(req => {
        builtAlerts.push({
          id: `sla-${req.id}`,
          type: 'sla_breach',
          title: 'SLA breached',
          description: `${req.title ?? 'Work order'} at ${req.address ?? 'unknown address'} has exceeded its response time commitment.`,
          href: '/dashboard/property-manager/requests',
        })
      })

      pendingInvoiceList?.forEach(inv => {
        builtAlerts.push({
          id: `inv-${inv.id}`,
          type: 'invoice_pending',
          title: `Invoice ${inv.invoice_number ?? '#—'} requires approval`,
          description: `$${(inv.total ?? 0).toLocaleString()} — review and approve to release payment to contractor.`,
          href: '/dashboard/property-manager/invoices',
        })
      })

      setAlerts(builtAlerts)

      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { data: invoices } = await supabase
        .from('invoices')
        .select('total')
        .eq('client_id', u.id)
        .eq('status', 'paid')
        .gte('created_at', startOfMonth.toISOString())

      const spend = invoices?.reduce((s, i) => s + i.total, 0) ?? 0

      setStats({
        totalProperties: propCount ?? 0,
        activeJobs: active,
        slaBreached: slaBreachedCount,
        pendingInvoices: pendingInvoiceCount,
        spendThisMonth: spend,
      })
      setLoading(false)
    }
    load()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }
  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="property-manager" onLogout={handleLogout} />
      
      <main className="lg:ml-[260px] p-5 sm:p-6 lg:p-8 space-y-6 pt-20 lg:pt-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-primary p-6 sm:p-8 text-primary-foreground">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_70%_-20%,rgba(255,255,255,0.15),transparent_50%)]" />
          <div className="pointer-events-none absolute inset-0 dot-grid opacity-20" />
          
          <div className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 text-primary-foreground/80 text-xs font-semibold uppercase tracking-wider bg-white/10 border border-white/15 px-3 py-1.5 rounded-full mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                Portfolio Operations Center
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                Portfolio command center, {user.name.split(' ')[0]}
              </h1>
              <p className="text-primary-foreground/75 text-sm mt-2">
                {stats.totalProperties} managed properties · {stats.activeJobs} active work orders
                {stats.slaBreached > 0 && (
                  <span className="ml-2 inline-flex items-center gap-1 bg-red-500/20 border border-red-400/30 text-red-200 text-xs font-semibold px-2 py-0.5 rounded-full">
                    <AlertTriangle className="w-3 h-3" />
                    {stats.slaBreached} SLA breach{stats.slaBreached !== 1 ? 'es' : ''}
                  </span>
                )}
              </p>
            </div>
            <Link href="/dashboard/property-manager/requests/new">
              <button className="inline-flex items-center gap-2 bg-white text-primary font-semibold text-sm px-5 py-3 rounded-xl hover:bg-white/95 transition-colors shadow-lg">
                <Plus className="w-4 h-4" /> 
                Dispatch Request
              </button>
            </Link>
          </div>
        </div>

        {/* Action-Oriented Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-2.5">
            {alerts.map(alert => {
              const isSla = alert.type === 'sla_breach'
              return (
                <Link key={alert.id} href={alert.href}>
                  <div className={`flex items-start gap-3 rounded-xl border px-5 py-4 transition-colors hover:bg-muted/50 ${
                    isSla
                      ? 'bg-red-50 border-red-200 dark:bg-red-900/15 dark:border-red-800'
                      : 'bg-amber-50 border-amber-200 dark:bg-amber-900/15 dark:border-amber-800'
                  }`}>
                    <div className={`mt-0.5 flex-shrink-0 ${isSla ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {isSla ? <ShieldAlert className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${isSla ? 'text-red-800 dark:text-red-300' : 'text-amber-800 dark:text-amber-300'}`}>
                        {alert.title}
                      </p>
                      <p className={`text-xs mt-0.5 ${isSla ? 'text-red-700 dark:text-red-400' : 'text-amber-700 dark:text-amber-400'}`}>
                        {alert.description}
                      </p>
                    </div>
                    <ArrowRight className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isSla ? 'text-red-500 dark:text-red-400' : 'text-amber-500 dark:text-amber-400'}`} />
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
             { label: 'Managed Properties', value: stats.totalProperties, icon: Building2, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10' },
             { label: 'Active Work Orders', value: stats.activeJobs, icon: ClipboardList, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
             {
               label: 'SLA Breaches',
               value: stats.slaBreached,
               icon: AlertTriangle,
               color: stats.slaBreached > 0 ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground',
               bg: stats.slaBreached > 0 ? 'bg-red-500/10' : 'bg-muted',
             },
             { label: 'Month-to-Date Spend', value: `$${stats.spendThisMonth.toLocaleString()}`, icon: DollarSign, color: 'text-primary', bg: 'bg-primary/10' },
          ].map(s => {
            const Icon = s.icon
            return (
              <div key={s.label} className="bg-card border border-border rounded-xl p-5 card-elevated">
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

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { 
              href: '/dashboard/property-manager/properties', 
              icon: Building2, 
              iconBg: 'bg-blue-500/10', 
              iconColor: 'text-blue-600 dark:text-blue-400', 
               title: 'Property Portfolio', 
               sub: 'Manage assets, addresses, and ownership records' 
            },
            { 
              href: '/dashboard/property-manager/requests', 
              icon: ClipboardList, 
              iconBg: 'bg-amber-500/10', 
              iconColor: 'text-amber-600 dark:text-amber-400', 
               title: 'Service Dispatch', 
               sub: 'Track work orders across every property' 
            },
            { 
              href: '/dashboard/property-manager/invoices', 
              icon: TrendingUp, 
              iconBg: 'bg-primary/10', 
              iconColor: 'text-primary', 
               title: 'Invoices & Cost Control', 
               sub: 'Review approvals, invoices, and monthly spend' 
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
                <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>

        {/* Portfolio Health Metrics */}
        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5 card-elevated">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Response SLA</p>
            </div>
            <p className={`mt-1 text-2xl font-display font-bold ${stats.slaBreached > 0 ? 'text-red-600 dark:text-red-400' : 'text-foreground'}`}>
              {stats.slaBreached > 0
                ? `${stats.slaBreached} Breach${stats.slaBreached !== 1 ? 'es' : ''}`
                : stats.activeJobs > 0 ? 'On Track' : 'No Active Jobs'}
            </p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {stats.slaBreached > 0
                ? 'Requests have exceeded their contracted response time.'
                : 'All active requests are within their response-time windows.'}
            </p>
            {stats.slaBreached > 0 && (
              <Link
                href="/dashboard/property-manager/requests"
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400 hover:underline"
              >
                View breached requests <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-5 card-elevated">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Budget Health</p>
            </div>
            <p className="mt-1 text-2xl font-display font-bold text-foreground">
              {stats.spendThisMonth > 0 ? `$${stats.spendThisMonth.toLocaleString()}` : '$0'}
            </p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Month-to-date paid invoice volume across managed assets.
            </p>
            {stats.pendingInvoices > 0 && (
              <Link
                href="/dashboard/property-manager/invoices"
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
              >
                {stats.pendingInvoices} invoice{stats.pendingInvoices !== 1 ? 's' : ''} awaiting approval <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-5 card-elevated">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Portfolio Utilization</p>
            </div>
            <p className="mt-1 text-2xl font-display font-bold text-foreground">{stats.totalProperties} Assets</p>
            <p className="mt-1.5 text-sm text-muted-foreground">Confirm every property has documented service coverage.</p>
          </div>
        </section>
      </main>
    </div>
  )
}
