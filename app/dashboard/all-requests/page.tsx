'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardNav } from '@/components/dashboard-nav'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle2, Clock, AlertCircle, FileText, TrendingUp, Loader2 } from 'lucide-react'

interface RequestStats {
  total: number
  active: number
  completed: number
  revenue: number
}

interface RecentRequest {
  id: string
  category: string
  status: string
  budget_max: number
  created_at: string
  properties?: { address: string }
}

function fmt(s: string) { return s.replace(/-|_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }

export default function AllRequestsPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ id: string; name: string; role: string } | null>(null)
  const [stats, setStats] = useState<RequestStats>({ total: 0, active: 0, completed: 0, revenue: 0 })
  const [recent, setRecent] = useState<RecentRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) { router.push('/auth/login'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('id', u.id)
        .single()

      if (profile?.role !== 'admin') { router.push('/dashboard'); return }
      setUser({ id: u.id, name: profile?.full_name ?? u.email, role: 'admin' })

      const { data: requests } = await supabase
        .from('service_requests')
        .select('id, category, status, budget_max, created_at, final_cost, properties(address)')
        .order('created_at', { ascending: false })

      if (requests) {
        const active = requests.filter(r => !['completed', 'cancelled'].includes(r.status)).length
        const completed = requests.filter(r => r.status === 'completed').length
        const revenue = requests
          .filter(r => r.final_cost)
          .reduce((s, r) => s + (r.final_cost ?? 0), 0)
        setStats({ total: requests.length, active, completed, revenue })
        setRecent(requests.slice(0, 10) as unknown as RecentRequest[])
      }
      setLoading(false)
    }
    load()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="w-5 h-5 animate-spin text-primary" />
    </div>
  )
  if (!user) return null

  const assignmentRate = stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(0) : '0'

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="admin" onLogout={handleLogout} />
      <main className="md:ml-[240px] p-5 md:p-8 max-w-5xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Network Overview</h1>
          <p className="text-muted-foreground text-sm mt-1">Monitor all service requests and system health</p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total requests', value: stats.total, icon: FileText },
            { label: 'Active', value: stats.active, icon: Clock },
            { label: 'Completed', value: stats.completed, icon: CheckCircle2 },
            { label: 'Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: TrendingUp },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
                  <p className="text-2xl font-bold text-foreground mt-2">{value}</p>
                </div>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h2 className="text-[15px] font-semibold mb-4">Performance metrics</h2>
          <div className="space-y-3">
            {[
              { label: 'Assignment rate', value: `${assignmentRate}%` },
              { label: 'Avg. revenue per job', value: stats.completed > 0 ? `$${(stats.revenue / stats.completed).toFixed(0)}` : '—' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="text-sm font-semibold text-foreground">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-[15px] font-semibold mb-4">Recent requests</h2>
          {recent.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center">
              <AlertCircle className="w-8 h-8 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No requests yet.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {recent.map(req => (
                <div key={req.id} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{fmt(req.category)}</p>
                    <p className="text-xs text-muted-foreground">{req.properties?.address ?? '—'}</p>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      req.status === 'completed' ? 'bg-emerald-100 text-emerald-700'
                        : req.status === 'in_progress' ? 'bg-blue-100 text-blue-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {fmt(req.status)}
                    </span>
                    <span className="text-sm font-semibold text-foreground w-16 text-right">
                      ${(req.budget_max ?? 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
