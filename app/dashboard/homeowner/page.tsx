'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardNav } from '@/components/dashboard-nav'
import {
  Plus, Clock, CheckCircle2, Wrench, FileText,
  ArrowRight, AlertCircle, Loader2, TrendingUp,
} from 'lucide-react'

interface ProjectRequest {
  id: string
  title: string
  description: string
  category: string
  location: string
  status: string
  budget?: number
  createdAt: string
}

interface UserData {
  id: string
  email: string
  name: string
  role: string
}

const STATUS: Record<string, { label: string; pill: string; dot: string }> = {
  open:        { label: 'Open',        pill: 'status-open',      dot: 'bg-indigo-500' },
  claimed:     { label: 'In Progress', pill: 'status-claimed',   dot: 'bg-sky-500' },
  'in-progress':{ label: 'In Progress',pill: 'status-progress',  dot: 'bg-violet-500' },
  completed:   { label: 'Completed',   pill: 'status-completed', dot: 'bg-emerald-500' },
  cancelled:   { label: 'Cancelled',   pill: 'status-cancelled', dot: 'bg-slate-400' },
}

function formatCategory(cat: string) {
  return cat.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 30) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

export default function HomeownerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [projects, setProjects] = useState<ProjectRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/auth/me')
        if (!res.ok) { router.push('/login'); return }
        const { user: u } = await res.json()
        if (u.role !== 'homeowner') { router.push('/dashboard/contractor'); return }
        setUser(u)

        const projRes = await fetch('/api/projects/list?type=my-projects')
        if (projRes.ok) {
          const { projects: data } = await projRes.json()
          setProjects(data ?? [])
        }
      } catch {
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) return null

  const open       = projects.filter(p => p.status === 'open')
  const inProgress = projects.filter(p => p.status === 'claimed' || p.status === 'in-progress')
  const completed  = projects.filter(p => p.status === 'completed')

  const stats = [
    { label: 'Open',        value: open.length,       icon: Clock,       color: 'stat-card-indigo',  iconClass: 'text-primary' },
    { label: 'In Progress', value: inProgress.length, icon: Wrench,      color: 'stat-card-amber',   iconClass: 'text-amber-500' },
    { label: 'Completed',   value: completed.length,  icon: CheckCircle2,color: 'stat-card-emerald', iconClass: 'text-emerald-500' },
    { label: 'Total',       value: projects.length,   icon: TrendingUp,  color: 'stat-card-violet',  iconClass: 'text-violet-500' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="homeowner" onLogout={handleLogout} />

      <main className="md:ml-[220px] p-6 space-y-6 animate-fade-up">
        {/* Welcome banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground shadow-lg shadow-primary/20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMC0zNnY2aDZ2LTZoLTZ6TTYgNHY2aDZWNEg2em0wIDMwdjZoNnYtNkg2eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-primary-foreground/70 text-[12px] font-semibold uppercase tracking-wide mb-1">
                Homeowner Dashboard
              </p>
              <h1 className="text-2xl font-bold">
                Welcome back, {user.name.split(' ')[0]}
              </h1>
              <p className="text-primary-foreground/80 text-sm mt-1">
                {projects.length === 0
                  ? 'Post your first request to get started.'
                  : `You have ${open.length} open and ${inProgress.length} in-progress request${inProgress.length !== 1 ? 's' : ''}.`}
              </p>
            </div>
            <Link
              href="/dashboard/homeowner/new-request"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 transition-colors text-white font-semibold text-sm px-5 py-2.5 rounded-xl border border-white/20 backdrop-blur"
            >
              <Plus className="w-4 h-4" />
              New Request
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(s => {
            const Icon = s.icon
            return (
              <div key={s.label} className={`bg-card border border-border rounded-xl p-5 ${s.color}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {s.label}
                  </span>
                  <Icon className={`w-4 h-4 ${s.iconClass}`} />
                </div>
                <p className="text-3xl font-bold text-foreground">{s.value}</p>
              </div>
            )
          })}
        </div>

        {/* Requests list */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-foreground text-[15px]">Your Requests</h2>
              {projects.length > 0 && (
                <span className="text-[11px] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
                  {projects.length}
                </span>
              )}
            </div>
            <Link
              href="/dashboard/homeowner/new-request"
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add new
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                <AlertCircle className="w-6 h-6 text-primary" />
              </div>
              <p className="font-semibold text-foreground text-[15px] mb-2">No requests yet</p>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                Post your first project request and connect with verified contractors in your area.
              </p>
              <Link
                href="/dashboard/homeowner/new-request"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-sm px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                Post First Request
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {projects.map(project => {
                const st = STATUS[project.status] ?? { label: project.status, pill: 'status-pending', dot: 'bg-slate-400' }
                return (
                  <div
                    key={project.id}
                    className="px-6 py-4 hover:bg-secondary/40 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${st.dot}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <p className="font-semibold text-foreground text-[13.5px] leading-snug">
                              {project.title || formatCategory(project.category)}
                            </p>
                            <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full ${st.pill}`}>
                              {st.label}
                            </span>
                          </div>
                          <p className="text-[12px] text-muted-foreground">
                            {formatCategory(project.category)} · {project.location}
                          </p>
                          <p className="text-[12.5px] text-muted-foreground mt-1 line-clamp-1">
                            {project.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        {project.budget != null && (
                          <p className="font-bold text-foreground text-[14px]">
                            ${project.budget.toLocaleString()}
                          </p>
                        )}
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {timeAgo(project.createdAt)}
                        </p>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                          View <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
