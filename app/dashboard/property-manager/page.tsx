'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardNav } from '@/components/dashboard-nav'
import { createClient } from '@/lib/supabase/client'
import {
  Loader2, Building2, ClipboardList, DollarSign,
  Plus, ArrowRight, Sparkles, TrendingUp,
} from 'lucide-react'

export default function PropertyManagerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<{ id: string; name: string; role: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeJobs: 0,
    spendThisMonth: 0,
  })

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

      setStats({ totalProperties: propCount ?? 0, activeJobs: active, spendThisMonth: spend })
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

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
             { label: 'Managed Properties', value: stats.totalProperties, icon: Building2, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10' },
             { label: 'Active Work Orders', value: stats.activeJobs, icon: ClipboardList, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
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

        <section className="grid gap-4 lg:grid-cols-3">
          {[
            {
              title: 'Response SLA',
              value: stats.activeJobs > 0 ? 'On Track' : 'No Active Jobs',
              sub: 'Monitor dispatch cycle times and contractor response speed.',
            },
            {
              title: 'Budget Health',
              value: stats.spendThisMonth > 0 ? `$${stats.spendThisMonth.toLocaleString()}` : '$0',
              sub: 'Month-to-date paid invoice volume across managed assets.',
            },
            {
              title: 'Portfolio Utilization',
              value: `${stats.totalProperties} Assets`,
              sub: 'Confirm every property has documented service coverage.',
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-card p-5 card-elevated">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{item.title}</p>
              <p className="mt-2 text-2xl font-display font-bold text-foreground">{item.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{item.sub}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}
