'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardNav } from '@/components/dashboard-nav'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Users, Briefcase, ShieldAlert, DollarSign, Activity, ArrowRight } from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser]   = useState<{ id: string; name: string; role: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0, pendingContractors: 0, activeJobs: 0, revenue: 0,
  })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) { router.push('/auth/login'); return }
      const role = u.user_metadata?.role
      if (role !== 'admin') { router.push('/dashboard'); return }
      setUser({ id: u.id, name: u.user_metadata?.full_name ?? u.email, role: 'admin' })

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
      <DashboardNav userName={user.name} role="admin" onLogout={handleLogout} />
      <main className="md:ml-[240px] p-5 md:p-7 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Overview</h1>
          <p className="text-[14px] text-muted-foreground mt-1">Platform health and key metrics.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-muted-foreground', bg: 'bg-muted' },
            { label: 'Pending Verifications', value: stats.pendingContractors, icon: ShieldAlert, color: 'text-muted-foreground', bg: 'bg-muted' },
            { label: 'Active Jobs', value: stats.activeJobs, icon: Briefcase, color: 'text-muted-foreground', bg: 'bg-muted' },
            { label: 'Platform Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'text-primary', bg: 'bg-primary/10' },
          ].map(s => {
            const Icon = s.icon
            return (
              <div key={s.label} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{s.label}</span>
                  <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}><Icon className={`w-4 h-4 ${s.color}`} /></div>
                </div>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
            )
          })}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { href: '/dashboard/admin/contractors', icon: ShieldAlert, iconBg: 'bg-muted', iconColor: 'text-muted-foreground', title: 'Contractor Verification', sub: `${stats.pendingContractors} pending review` },
            { href: '/dashboard/admin/jobs',        icon: Briefcase,   iconBg: 'bg-muted', iconColor: 'text-muted-foreground', title: 'All Jobs', sub: `${stats.activeJobs} active jobs` },
            { href: '/dashboard/admin/matches',     icon: Activity,    iconBg: 'bg-muted', iconColor: 'text-foreground',    title: 'Matching Queue', sub: 'Manual assignment & history' },
            { href: '/dashboard/admin/users',       icon: Users,       iconBg: 'bg-muted', iconColor: 'text-muted-foreground',    title: 'User Management', sub: `${stats.totalUsers} total users` },
            { href: '/dashboard/admin/invoices',    icon: DollarSign,  iconBg: 'bg-muted', iconColor: 'text-muted-foreground', title: 'Invoices & Revenue', sub: `$${stats.revenue.toLocaleString()} earned` },
            { href: '/dashboard/admin/documents',   icon: ShieldAlert, iconBg: 'bg-orange-500/10', iconColor: 'text-orange-500', title: 'Document Review', sub: 'Compliance verification queue' },
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
