'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardNav } from '@/components/dashboard-nav'
import { createClient } from '@/lib/supabase/client'
import {
  Loader2, Building2, ClipboardList, DollarSign,
  Plus, ArrowRight,
} from 'lucide-react'

export default function PropertyManagerDashboard() {
  const router = useRouter()
  const [user, setUser]     = useState<{ id: string; name: string; role: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats]   = useState({
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

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="property-manager" onLogout={handleLogout} />
      <main className="md:ml-[240px] p-5 md:p-7 space-y-6">
        {/* Welcome banner */}
        <div className="relative overflow-hidden rounded-2xl bg-primary p-6 md:p-8 text-primary-foreground">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <pattern id="g2" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40L40 0M-10 10L10-10M30 50L50 30" stroke="white" strokeWidth="1" fill="none"/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#g2)"/>
            </svg>
          </div>
          <div className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-5">
            <div>
              <p className="text-primary-foreground/60 text-[11px] font-bold uppercase tracking-widest mb-1.5">Property Manager Portal</p>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome, {user.name.split(' ')[0]}</h1>
              <p className="text-primary-foreground/70 text-sm mt-1.5">{stats.totalProperties} properties · {stats.activeJobs} active jobs</p>
            </div>
            <Link href="/dashboard/property-manager/requests/new">
              <button className="inline-flex items-center gap-2 bg-white text-primary font-bold text-[13px] px-5 py-2.5 rounded-xl hover:bg-white/90 transition-colors shadow-sm flex-shrink-0">
                <Plus className="w-4 h-4" /> New Request
              </button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Properties',    value: stats.totalProperties, icon: Building2,    color: 'text-muted-foreground', bg: 'bg-muted' },
            { label: 'Active Jobs',   value: stats.activeJobs,      icon: ClipboardList, color: 'text-muted-foreground', bg: 'bg-muted' },
            { label: 'Spend (Month)', value: `$${stats.spendThisMonth.toLocaleString()}`, icon: DollarSign, color: 'text-primary', bg: 'bg-primary/10' },
          ].map(s => {
            const Icon = s.icon
            return (
              <div key={s.label} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{s.label}</span>
                  <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}><Icon className={`w-4 h-4 ${s.color}`} /></div>
                </div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
              </div>
            )
          })}
        </div>

        {/* Quick actions */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { href: '/dashboard/property-manager/properties', icon: Building2, iconBg: 'bg-muted', iconColor: 'text-muted-foreground', title: 'Manage Properties', sub: 'View and add managed properties' },
            { href: '/dashboard/property-manager/requests', icon: ClipboardList, iconBg: 'bg-muted', iconColor: 'text-muted-foreground', title: 'Service Requests', sub: 'Track requests across portfolio' },
            { href: '/dashboard/property-manager/invoices', icon: DollarSign, iconBg: 'bg-muted', iconColor: 'text-foreground', title: 'Invoices & Spend', sub: 'Portfolio-level financial overview' },
          ].map(({ href, icon: Icon, iconBg, iconColor, title, sub }) => (
            <Link key={href} href={href}
              className="group flex items-center gap-4 p-5 bg-card border border-border rounded-xl hover:border-primary/30 hover:bg-primary/5 transition-all"
            >
              <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}><Icon className={`w-5 h-5 ${iconColor}`} /></div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-[13px]">{title}</p>
                <p className="text-[11.5px] text-muted-foreground mt-0.5">{sub}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
