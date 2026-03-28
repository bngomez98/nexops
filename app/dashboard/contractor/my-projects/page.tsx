'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardNav } from '@/components/dashboard-nav'
import {
  Briefcase, MapPin, Loader2, Clock, DollarSign,
  ChevronRight, CheckCircle2, Wrench, Calendar,
} from 'lucide-react'

interface ProjectRequest {
  id: string
  title: string
  description: string
  category: string
  location: string
  budget?: number
  status: string
  createdAt: string
}

const STATUS: Record<string, { label: string; pill: string; dot: string }> = {
  open:          { label: 'Open',         pill: 'status-open',      dot: 'bg-primary' },
  claimed:       { label: 'Assigned',     pill: 'status-claimed',   dot: 'bg-muted-foreground' },
  'in-progress': { label: 'In Progress',  pill: 'status-progress',  dot: 'bg-primary' },
  completed:     { label: 'Completed',    pill: 'status-completed', dot: 'bg-foreground/60' },
  cancelled:     { label: 'Cancelled',    pill: 'status-cancelled', dot: 'bg-muted-foreground' },
}

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

export default function ContractorMyProjects() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [projects, setProjects] = useState<ProjectRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<string>('all')

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/auth/me')
        if (!res.ok) { router.push('/auth/login'); return }
        const data = await res.json()
        if (data.user.role !== 'contractor') { router.push('/dashboard/homeowner'); return }
        setUser(data.user)

        const projRes = await fetch('/api/projects/list?type=my-projects')
        if (projRes.ok) {
          const { projects: list } = await projRes.json()
          setProjects(list ?? [])
        }
      } catch {
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/auth/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) return null

  const filters = [
    { key: 'all',         label: 'All' },
    { key: 'claimed',     label: 'Assigned' },
    { key: 'in-progress', label: 'In Progress' },
    { key: 'completed',   label: 'Completed' },
  ]

  const filtered = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.status === activeFilter)

  const active = projects.filter(p => p.status === 'claimed' || p.status === 'in-progress')
  const done   = projects.filter(p => p.status === 'completed')

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="contractor" onLogout={handleLogout} />

      <main className="md:ml-[220px] p-6 space-y-6 animate-fade-up">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground shadow-lg shadow-primary/20">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <p className="text-primary-foreground/70 text-[12px] font-semibold uppercase tracking-wide mb-1">My Projects</p>
            <h1 className="text-2xl font-bold">Claimed Projects</h1>
            <p className="text-primary-foreground/80 text-sm mt-1">
              {active.length} active · {done.length} completed · {projects.length} total
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Active',    value: active.length,    icon: Wrench,      iconClass: 'text-primary',       },
            { label: 'Completed', value: done.length,      icon: CheckCircle2, iconClass: 'text-muted-foreground',  },
            { label: 'Total',     value: projects.length,  icon: Briefcase,   iconClass: 'text-muted-foreground',    },
          ].map(s => {
            const Icon = s.icon
            return (
              <div key={s.label} className={`bg-card border border-border rounded-xl p-5 ${s.color}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{s.label}</span>
                  <Icon className={`w-4 h-4 ${s.iconClass}`} />
                </div>
                <p className="text-3xl font-bold text-foreground">{s.value}</p>
              </div>
            )
          })}
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold transition-all ${
                activeFilter === f.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {f.label}
              <span className="ml-1.5 opacity-70">
                {f.key === 'all' ? projects.length : projects.filter(p => p.status === f.key).length}
              </span>
            </button>
          ))}
        </div>

        {/* Projects list */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-2.5">
              <Briefcase className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-foreground text-[15px]">
                {activeFilter === 'all' ? 'All Projects' : filters.find(f => f.key === activeFilter)?.label}
              </h2>
              <span className="text-[11px] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
                {filtered.length}
              </span>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <p className="font-semibold text-foreground text-[15px] mb-2">
                {activeFilter === 'all' ? 'No projects yet' : `No ${filters.find(f => f.key === activeFilter)?.label.toLowerCase()} projects`}
              </p>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                {activeFilter === 'all'
                  ? 'Claim projects from the dashboard to get started.'
                  : 'Projects in this status will appear here.'}
              </p>
              <Link
                href="/dashboard/contractor"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-sm px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
              >
                <Briefcase className="w-4 h-4" />
                Browse Available Projects
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map(project => {
                const st = STATUS[project.status] ?? { label: project.status, pill: 'status-pending', dot: 'bg-muted-foreground' }
                const icon = CATEGORY_ICONS[project.category] ?? '🔨'
                return (
                  <Link
                    key={project.id}
                    href={`/dashboard/contractor/projects/${project.id}`}
                    className="block px-6 py-5 hover:bg-secondary/30 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-xl flex-shrink-0 mt-0.5">
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
                          <div className="flex items-center gap-3 text-[12px] text-muted-foreground mb-1.5">
                            <span>{formatCategory(project.category)}</span>
                            {project.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {project.location}
                              </span>
                            )}
                          </div>
                          <p className="text-[12.5px] text-muted-foreground line-clamp-1">
                            {project.description}
                          </p>
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
                          View project <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
