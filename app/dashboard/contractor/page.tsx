'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardNav } from '@/components/dashboard-nav'
import { ProjectFilters } from '@/components/project-filters'
import {
  Briefcase, Star, Layers, MapPin, Loader2,
  BarChart3, ArrowUpRight, AlertTriangle, Sparkles,
} from 'lucide-react'

interface ProjectRequest {
  id: string
  title: string
  description: string
  category: string
  location: string
  budget?: number
  createdAt: string
}

interface ContractorProfile {
  companyName: string
  membershipTier: string
  currentActiveProjects: number
  maxActiveProjects: number
  averageRating: number
  totalReviews: number
}

interface FilterState {
  search: string
  category: string
  budgetRange: string
  status: string
  location: string
  sortBy: 'recent' | 'budget-high' | 'budget-low'
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

export default function ContractorDashboard() {
  const router = useRouter()
  const [user, setUser]     = useState<any>(null)
  const [profile, setProfile] = useState<ContractorProfile | null>(null)
  const [projects, setProjects]         = useState<ProjectRequest[]>([])
  const [filteredProjects, setFiltered] = useState<ProjectRequest[]>([])
  const [loading, setLoading]   = useState(true)
  const [claimingId, setClaiming] = useState<string | null>(null)
  const [filters, setFilters]   = useState<FilterState>({
    search: '', category: '', budgetRange: '', status: '', location: '', sortBy: 'recent',
  })

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/auth/me')
        if (!res.ok) { router.push('/login'); return }
        const data = await res.json()
        if (data.user.role !== 'contractor') { router.push('/dashboard/homeowner'); return }
        setUser(data.user)
        setProfile(data.contractorProfile)

        const projRes = await fetch('/api/projects/list?type=available')
        if (projRes.ok) {
          const { projects: list } = await projRes.json()
          setProjects(list ?? [])
        }
      } catch {
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router])

  useEffect(() => {
    let result = [...projects]
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      )
    }
    if (filters.category) result = result.filter(p => p.category === filters.category)
    if (filters.budgetRange) {
      result = result.filter(p => {
        if (!p.budget) return true
        const [min, max] = filters.budgetRange.split('-')
        return max === '+' ? p.budget >= parseInt(min) : p.budget >= parseInt(min) && p.budget <= parseInt(max)
      })
    }
    if (filters.location) {
      result = result.filter(p => p.location.toLowerCase().includes(filters.location.toLowerCase()))
    }
    result.sort((a, b) => {
      if (filters.sortBy === 'budget-high') return (b.budget || 0) - (a.budget || 0)
      if (filters.sortBy === 'budget-low')  return (a.budget || 0) - (b.budget || 0)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    setFiltered(result)
  }, [projects, filters])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  async function handleClaim(projectId: string) {
    if (!profile) return
    if (profile.currentActiveProjects >= profile.maxActiveProjects) return
    setClaiming(projectId)
    try {
      const res = await fetch(`/api/projects/claim/${projectId}`, { method: 'POST' })
      if (res.ok) {
        setProjects(prev => prev.filter(p => p.id !== projectId))
        setProfile(prev => prev ? { ...prev, currentActiveProjects: prev.currentActiveProjects + 1 } : prev)
      }
    } finally {
      setClaiming(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) return null

  const atCapacity = (profile?.currentActiveProjects ?? 0) >= (profile?.maxActiveProjects ?? 1)
  const capacityPct = profile ? Math.round((profile.currentActiveProjects / profile.maxActiveProjects) * 100) : 0

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="contractor" onLogout={handleLogout} />

      <main className="md:ml-[220px] p-6 space-y-6 animate-fade-up">
        {/* Welcome banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground shadow-lg shadow-primary/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-primary-foreground/70 text-[12px] font-semibold uppercase tracking-wide mb-1">
                Contractor Dashboard
              </p>
              <h1 className="text-2xl font-bold">{profile?.companyName || user.name}</h1>
              <p className="text-primary-foreground/80 text-sm mt-1 flex items-center gap-2">
                <span className="capitalize">{profile?.membershipTier || 'Free'} plan</span>
                <span className="opacity-40">·</span>
                <span>{profile?.currentActiveProjects ?? 0} / {profile?.maxActiveProjects ?? 3} active</span>
              </p>
            </div>
            <Link
              href="/dashboard/contractor/analytics"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 transition-colors text-white font-semibold text-sm px-5 py-2.5 rounded-xl border border-white/20"
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Capacity bar */}
          {profile && (
            <div className="relative mt-5">
              <div className="flex items-center justify-between text-[11px] text-primary-foreground/70 mb-1.5">
                <span>Project capacity</span>
                <span>{capacityPct}%</span>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white/70 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(capacityPct, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Active', value: profile?.currentActiveProjects ?? 0, sub: `of ${profile?.maxActiveProjects ?? 3} max`, icon: Briefcase, color: 'stat-card-indigo', iconClass: 'text-primary' },
            { label: 'Rating', value: profile?.averageRating ? profile.averageRating.toFixed(1) : '—', sub: `${profile?.totalReviews ?? 0} reviews`, icon: Star, color: 'stat-card-amber', iconClass: 'text-amber-500' },
            { label: 'Available', value: projects.length, sub: 'open projects', icon: Layers, color: 'stat-card-emerald', iconClass: 'text-emerald-500' },
          ].map(s => {
            const Icon = s.icon
            return (
              <div key={s.label} className={`bg-card border border-border rounded-xl p-5 ${s.color}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{s.label}</span>
                  <Icon className={`w-4 h-4 ${s.iconClass}`} />
                </div>
                <p className="text-3xl font-bold text-foreground">{s.value}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{s.sub}</p>
              </div>
            )
          })}
        </div>

        {/* Capacity warning */}
        {atCapacity && (
          <div className="rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700 px-5 py-4 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Project capacity reached</p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                You've reached your limit of {profile?.maxActiveProjects} active projects.{' '}
                <Link href="/dashboard/contractor/settings" className="underline font-medium">Upgrade your plan</Link> to take on more work.
              </p>
            </div>
          </div>
        )}

        {/* Projects */}
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <ProjectFilters onFiltersChange={setFilters} />
          </div>

          <div className="lg:col-span-3">
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-primary" />
                  <h2 className="font-semibold text-foreground text-[15px]">Available Projects</h2>
                </div>
                <span className="text-[11px] font-medium text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
                  {filteredProjects.length} result{filteredProjects.length !== 1 ? 's' : ''}
                </span>
              </div>

              {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-semibold text-foreground text-[15px] mb-2">No projects available</p>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    New projects in your service categories will appear here.
                  </p>
                </div>
              ) : filteredProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
                  <p className="font-medium text-foreground mb-1">No matches</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your filters.</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredProjects.map(project => (
                    <div key={project.id} className="px-6 py-5 hover:bg-secondary/30 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/dashboard/contractor/projects/${project.id}`}
                            className="font-semibold text-foreground hover:text-primary transition-colors text-[14px] leading-snug"
                          >
                            {project.title || formatCategory(project.category)}
                          </Link>
                          <p className="text-[11.5px] text-muted-foreground mt-0.5 mb-2">
                            {formatCategory(project.category)}
                          </p>
                          <p className="text-[13px] text-muted-foreground line-clamp-2 mb-3">
                            {project.description}
                          </p>
                          <div className="flex items-center gap-4 text-[11.5px] text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {project.location}
                            </span>
                            <span>{timeAgo(project.createdAt)}</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0 flex flex-col items-end gap-3 pt-0.5">
                          {project.budget != null && (
                            <span className="font-bold text-primary text-lg">
                              ${project.budget.toLocaleString()}
                            </span>
                          )}
                          <div className="flex items-center gap-2">
                            <Link href={`/dashboard/contractor/projects/${project.id}`}>
                              <button className="px-3 py-1.5 text-[12px] font-medium border border-border rounded-lg hover:bg-secondary transition-colors">
                                View
                              </button>
                            </Link>
                            <button
                              onClick={() => handleClaim(project.id)}
                              disabled={claimingId === project.id || atCapacity}
                              className="px-3 py-1.5 text-[12px] font-semibold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-1.5"
                            >
                              {claimingId === project.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <>
                                  <Sparkles className="w-3 h-3" />
                                  Claim
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upgrade section */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-foreground text-[15px]">Upgrade your plan</h3>
              <p className="text-[12.5px] text-muted-foreground mt-0.5">
                Take on more projects and grow your business.
              </p>
            </div>
            <span className="text-[11px] bg-secondary text-secondary-foreground font-semibold px-2.5 py-1 rounded-full capitalize">
              Current: {profile?.membershipTier || 'free'}
            </span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { name: 'Professional', price: '$299/mo', projects: 5,  highlight: !profile?.membershipTier || profile.membershipTier === 'free' },
              { name: 'Enterprise',   price: '$749/mo', projects: 15, highlight: profile?.membershipTier === 'professional' },
            ].map(plan => (
              <div
                key={plan.name}
                className={`rounded-xl border p-5 ${plan.highlight ? 'border-primary/40 bg-primary/5' : 'border-border'}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-foreground">{plan.name}</span>
                  {plan.highlight && (
                    <span className="text-[10.5px] bg-primary/15 text-primary font-semibold px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold text-foreground mb-1">{plan.price}</p>
                <p className="text-[12.5px] text-muted-foreground mb-4">Up to {plan.projects} active projects</p>
                <Link href="/dashboard/contractor/settings">
                  <button className={`w-full py-2 text-[12.5px] font-semibold rounded-lg transition-opacity hover:opacity-90 ${plan.highlight ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                    Upgrade to {plan.name}
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
