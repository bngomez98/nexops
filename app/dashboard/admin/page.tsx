'use client'

import { useEffect, useState } from 'react'
import { useRouter } from '@/lib/router'
import Link from '@/components/link'
import { DashboardNav } from '@/components/dashboard-nav'
import { createClient } from '@/lib/supabase/client'
import {
  Loader2, Users, Briefcase, ShieldAlert, DollarSign,
  Activity, ArrowRight, FileText, TrendingUp, CheckCircle2,
  Shield, RefreshCw,
} from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<{ id: string; name: string; role: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingContractors: 0,
    activeJobs: 0,
    revenue: 0,
  })

  async function loadStats(supabase: ReturnType<typeof createClient>) {
    const [usersRes, contractorsRes, jobsRes, revenueRes] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('contractor_profiles').select('*', { count: 'exact', head: true }).eq('is_verified', false),
      supabase.from('jobs').select('*', { count: 'exact', head: true }).in('status', ['matched', 'in_progress']),
      supabase.from('invoices').select('total').eq('status', 'paid'),
    ])
    setStats({
      totalUsers: usersRes.count ?? 0,
      pendingContractors: contractorsRes.count ?? 0,
      activeJobs: jobsRes.count ?? 0,
      revenue: revenueRes.data?.reduce((s: number, i: Record<string, unknown>) => s + (i.total as number), 0) ?? 0,
    })
  }

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) { router.push('/auth/login'); return }
      const role = u.user_metadata?.role
      if (role !== 'admin') { router.push('/dashboard'); return }
      setUser({ id: u.id, name: u.user_metadata?.full_name ?? u.email, role: 'admin' })
      await loadStats(supabase)
      setLoading(false)
    }
    load()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  async function handleRefresh() {
    setRefreshing(true)
    const supabase = createClient()
    await loadStats(supabase)
    setRefreshing(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }
  if (!user) return null

  const firstName = user.name.split(' ')[0]

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="admin" onLogout={handleLogout} />

      <main id="main-content" className="lg:ml-[260px] p-5 sm:p-6 lg:p-8 space-y-6 pt-20 lg:pt-8">

        {/* ── Welcome banner ── */}
        <div className="relative overflow-hidden rounded-2xl bg-primary p-6 sm:p-8 text-primary-foreground">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_70%_-20%,rgba(255,255,255,0.12),transparent_55%)]" />
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, rgba(255,255,255,0.25) 1.5px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />
          <div className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 text-primary-foreground/80 text-xs font-semibold uppercase tracking-wider bg-white/10 border border-white/15 px-3 py-1.5 rounded-full mb-4">
                <Shield className="w-3.5 h-3.5" />
                System Administration
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                Welcome back, {firstName}
              </h1>
              <p className="text-primary-foreground/75 text-sm mt-2 leading-relaxed">
                {stats.totalUsers} users · {stats.activeJobs} active jobs · {stats.pendingContractors} pending verifications · ${stats.revenue.toLocaleString()} revenue
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2.5 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
                title="Refresh stats"
              >
                <RefreshCw className={`w-4 h-4 text-white ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <Link
                href="/dashboard/admin/users"
                className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 transition-colors text-white font-semibold text-sm px-5 py-2.5 rounded-xl border border-white/20"
              >
                <Users className="w-4 h-4" />
                Users
              </Link>
            </div>
          </div>
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Users',
              value: stats.totalUsers,
              icon: Users,
              color: 'text-sky-600 dark:text-sky-400',
              bg: 'bg-sky-500/15',
              border: 'border-sky-200/60 dark:border-sky-900/60',
            },
            {
              label: 'Pending Verifications',
              value: stats.pendingContractors,
              icon: ShieldAlert,
              color: stats.pendingContractors > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground',
              bg: stats.pendingContractors > 0 ? 'bg-amber-500/15' : 'bg-muted',
              border: stats.pendingContractors > 0 ? 'border-amber-200/60 dark:border-amber-900/60' : 'border-border',
            },
            {
              label: 'Active Jobs',
              value: stats.activeJobs,
              icon: Briefcase,
              color: 'text-emerald-600 dark:text-emerald-400',
              bg: 'bg-emerald-500/15',
              border: 'border-emerald-200/60 dark:border-emerald-900/60',
            },
            {
              label: 'Platform Revenue',
              value: `$${stats.revenue.toLocaleString()}`,
              icon: TrendingUp,
              color: 'text-primary',
              bg: 'bg-primary/15',
              border: 'border-primary/20',
            },
          ].map(s => {
            const Icon = s.icon
            return (
              <div key={s.label} className={`bg-card border ${s.border ?? 'border-border'} rounded-xl p-5 relative overflow-hidden`}>
                <div className={`absolute top-0 left-0 right-0 h-0.5 ${s.bg}`} />
                <div className="flex items-start justify-between mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground leading-tight">{s.label}</span>
                  <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${s.color}`} />
                  </div>
                </div>
                <p className="font-display text-[28px] font-bold text-foreground tabular-nums leading-none">{s.value}</p>
              </div>
            )
          })}
        </div>

        {/* ── System status bar ── */}
        <div className="flex items-center gap-3 px-5 py-3.5 bg-card border border-border rounded-xl">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <p className="text-[13px] font-medium text-foreground">All systems operational</p>
          <span className="text-[13px] text-muted-foreground hidden sm:block">·</span>
          <p className="text-[13px] text-muted-foreground hidden sm:block">Last checked just now</p>
          <div className="flex-1" />
          <Link href="/dashboard/admin/matches" className="text-[12.5px] text-primary font-medium hover:underline underline-offset-4 inline-flex items-center gap-1">
            View matching queue <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* ── Action cards ── */}
        <div>
          <h2 className="text-[15px] font-semibold text-foreground mb-4">Operations</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                href: '/dashboard/admin/contractors',
                icon: ShieldAlert,
                iconBg: 'bg-amber-500/10',
                iconColor: 'text-amber-600 dark:text-amber-400',
                title: 'Contractor Verification',
                sub: stats.pendingContractors > 0 ? `${stats.pendingContractors} pending review` : 'All contractors verified',
                urgent: stats.pendingContractors > 0,
              },
              {
                href: '/dashboard/admin/jobs',
                icon: Briefcase,
                iconBg: 'bg-emerald-500/10',
                iconColor: 'text-emerald-600 dark:text-emerald-400',
                title: 'All Jobs',
                sub: `${stats.activeJobs} active jobs`,
                urgent: false,
              },
              {
                href: '/dashboard/admin/matches',
                icon: Activity,
                iconBg: 'bg-violet-500/10',
                iconColor: 'text-violet-600 dark:text-violet-400',
                title: 'Matching Queue',
                sub: 'Manual assignment & history',
                urgent: false,
              },
              {
                href: '/dashboard/admin/users',
                icon: Users,
                iconBg: 'bg-sky-500/10',
                iconColor: 'text-sky-600 dark:text-sky-400',
                title: 'User Management',
                sub: `${stats.totalUsers} total users`,
                urgent: false,
              },
              {
                href: '/dashboard/admin/invoices',
                icon: DollarSign,
                iconBg: 'bg-primary/10',
                iconColor: 'text-primary',
                title: 'Invoices & Revenue',
                sub: `$${stats.revenue.toLocaleString()} earned`,
                urgent: false,
              },
              {
                href: '/dashboard/admin/documents',
                icon: FileText,
                iconBg: 'bg-rose-500/10',
                iconColor: 'text-rose-600 dark:text-rose-400',
                title: 'Document Review',
                sub: 'Compliance verification queue',
                urgent: false,
              },
            ].map(({ href, icon: Icon, iconBg, iconColor, title, sub, urgent }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-4 p-5 bg-card border border-border rounded-xl hover:border-primary/30 hover:shadow-sm card-elevated card-elevated-hover transition-all"
              >
                <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground text-[13.5px]">{title}</p>
                    {urgent && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-[12px] text-muted-foreground mt-0.5 truncate">{sub}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
