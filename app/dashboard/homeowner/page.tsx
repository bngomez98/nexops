'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardNav } from '@/components/dashboard-nav'
import {
  Plus, Clock, CheckCircle2, Wrench, FileText,
  ArrowRight, AlertCircle, Loader2, TrendingUp,
  ChevronRight, Calendar, DollarSign, MapPin,
  RefreshCw,
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

const STATUS: Record<string, { label: string; pill: string; dot: string; step: number }> = {
  open:         { label: 'Submitted',   pill: 'status-open',      dot: 'bg-indigo-500',   step: 1 },
  claimed:      { label: 'Assigned',    pill: 'status-claimed',   dot: 'bg-sky-500',      step: 2 },
  'in-progress':{ label: 'In Progress', pill: 'status-progress',  dot: 'bg-violet-500',   step: 3 },
  completed:    { label: 'Completed',   pill: 'status-completed', dot: 'bg-emerald-500',  step: 4 },
  cancelled:    { label: 'Cancelled',   pill: 'status-cancelled', dot: 'bg-slate-400',    step: 0 },
}

const STEPS = ['Submitted', 'Assigned', 'In Progress', 'Completed']

const CATEGORY_ICONS: Record<string, string> = {
  'tree-removal': '🌳', 'concrete-work': '🏗️', 'roofing': '🏠',
  'hvac': '❄️', 'fencing': '🏡', 'electrical': '⚡', 'plumbing': '🔧', 'excavation': '🚜',
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

function StatusProgress({ status }: { status: string }) {
  const st = STATUS[status]
  if (!st || st.step === 0) return null
  return (
    <div className="flex items-center gap-0 mt-3">
      {STEPS.map((step, i) => {
        const num = i + 1
        const done = num < st.step
        const active = num === st.step
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 transition-all ${
              done ? 'bg-primary text-primary-foreground' :
              active ? 'bg-primary/20 text-primary ring-2 ring-primary/40' :
              'bg-muted text-muted-foreground'
            }`}>
              {done ? '✓' : num}
            </div>
            <span className={`ml-1 text-[9.5px] font-medium hidden sm:block ${active ? 'text-primary' : done ? 'text-foreground/60' : 'text-muted-foreground'}`}>
              {step}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-2 ${num < st.step ? 'bg-primary/50' : 'bg-border'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function HomeownerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [projects, setProjects] = useState<ProjectRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  async function loadProjects() {
    const projRes = await fetch('/api/projects/list?type=my-projects')
    if (projRes.ok) {
      const { projects: data } = await projRes.json()
      setProjects(data ?? [])
    }
  }

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/auth/me')
        if (!res.ok) { router.push('/login'); return }
        const { user: u } = await res.json()
        if (u.role !== 'homeowner') { router.push('/dashboard/contractor'); return }
        setUser(u)
        await loadProjects()
      } catch {
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router])

  async function handleRefresh() {
    setRefreshing(true)
    await loadProjects()
    setRefreshing(false)
  }

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
    { label: 'Submitted',   value: open.length,       icon: Clock,        color: 'stat-card-indigo',  iconClass: 'text-primary' },
    { label: 'In Progress', value: inProgress.length, icon: Wrench,       color: 'stat-card-amber',   iconClass: 'text-amber-500' },
    { label: 'Completed',   value: completed.length,  icon: CheckCircle2, color: 'stat-card-emerald', iconClass: 'text-emerald-500' },
    { label: 'Total',       value: projects.length,   icon: TrendingUp,   color: 'stat-card-violet',  iconClass: 'text-violet-500' },
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
                  : `${open.length} open · ${inProgress.length} in progress · ${completed.length} completed`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors text-white text-sm px-4 py-2 rounded-xl border border-white/20"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <Link
                href="/dashboard/homeowner/new-request"
                className="flex-shrink-0 inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 transition-colors text-white font-semibold text-sm px-5 py-2.5 rounded-xl border border-white/20 backdrop-blur"
              >
                <Plus className="w-4 h-4" />
                New Request
              </Link>
            </div>
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
              New request
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                <AlertCircle className="w-7 h-7 text-primary" />
              </div>
              <p className="font-semibold text-foreground text-[15px] mb-2">No requests yet</p>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                Post your first project request and get matched with a verified contractor in your area.
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
                const st = STATUS[project.status] ?? { label: project.status, pill: 'status-pending', dot: 'bg-slate-400', step: 0 }
                const icon = CATEGORY_ICONS[project.category] ?? '🔨'
                return (
                  <Link
                    key={project.id}
                    href={`/dashboard/requests/${project.id}`}
                    className="block px-6 py-5 hover:bg-secondary/30 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-lg flex-shrink-0 mt-0.5">
                          {icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <p className="font-semibold text-foreground text-[14px] leading-snug">
                              {project.title || formatCategory(project.category)}
                            </p>
                            <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full ${st.pill}`}>
                              {st.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-[12px] text-muted-foreground">
                            <span>{formatCategory(project.category)}</span>
                            {project.location && (
                              <>
                                <span className="opacity-40">·</span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {project.location}
                                </span>
                              </>
                            )}
                          </div>
                          <p className="text-[12.5px] text-muted-foreground mt-1.5 line-clamp-1">
                            {project.description}
                          </p>
                          <StatusProgress status={project.status} />
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right flex flex-col items-end gap-1">
                        {project.budget != null && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3 text-muted-foreground" />
                            <p className="font-bold text-foreground text-[14px]">
                              {project.budget.toLocaleString()}
                            </p>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {timeAgo(project.createdAt)}
                        </div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                          View details <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/dashboard/homeowner/new-request"
            className="group flex items-center gap-4 p-5 bg-card border border-border rounded-xl hover:border-primary/40 hover:bg-primary/5 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
              <Plus className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-[13.5px]">Submit New Request</p>
              <p className="text-[12px] text-muted-foreground mt-0.5">Get matched with a verified contractor</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
          </Link>

          <Link
            href="/dashboard/homeowner/settings"
            className="group flex items-center gap-4 p-5 bg-card border border-border rounded-xl hover:border-border/80 hover:bg-secondary/30 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-[13.5px]">Account Settings</p>
              <p className="text-[12px] text-muted-foreground mt-0.5">Update your profile and preferences</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-all flex-shrink-0" />
          </Link>
        </div>
      </main>
    </div>
  )
}
