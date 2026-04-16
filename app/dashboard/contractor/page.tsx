'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardNav } from '@/components/dashboard-nav'
import { ProjectFilters } from '@/components/project-filters'
import { AIAssistant } from '@/components/ai-assistant'
import { AIInsightsCard } from '@/components/ai-insights-card'
import { formatDateOnly } from '@/lib/date-format'
import {
  Briefcase, Star, Layers, MapPin, Loader2,
  BarChart3, AlertTriangle, Sparkles,
  RefreshCw, Clock, DollarSign, Zap, CalendarDays, Crown, ArrowRight,
} from 'lucide-react'
import { toast } from 'sonner'

interface ProjectRequest {
  id: string
  title: string
  description: string
  category: string
  location: string
  budget?: number
  createdAt: string
  preferredDate?: string | null
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

interface ContractorUser {
  name: string
  avatarUrl?: string | null
  subscriptionTier?: string
  subscriptionStatus?: string
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
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(diff / 3600000)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(diff / 86400000)
  if (days < 30) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

function isNew(dateStr: string) {
  return Date.now() - new Date(dateStr).getTime() < 2 * 60 * 60 * 1000
}

export default function ContractorDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<ContractorUser | null>(null)
  const [profile, setProfile] = useState<ContractorProfile | null>(null)
  const [projects, setProjects] = useState<ProjectRequest[]>([])
  const [filteredProjects, setFiltered] = useState<ProjectRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [claimingId, setClaiming] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [filters, setFilters] = useState<FilterState>({
    search: '', category: '', budgetRange: '', status: '', location: '', sortBy: 'recent',
  })
  const pollingRef = useRef<NodeJS.Timeout | null>(null)

  const fetchProjects = useCallback(async () => {
    const projRes = await fetch('/api/projects/list?type=available')
    if (projRes.ok) {
      const { projects: list } = await projRes.json()
      setProjects(prev => {
        const newList = list ?? []
        const prevIds = new Set(prev.map((p: ProjectRequest) => p.id))
        const hasNew = newList.some((p: ProjectRequest) => !prevIds.has(p.id))
        if (hasNew && prev.length > 0) {
          toast.success('New project posted to your queue.')
        }
        return newList
      })
      setLastRefresh(new Date())
    }
  }, [])

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/auth/me')
        if (!res.ok) { router.push('/auth/login'); return }
        const data = await res.json()
        if (data.user.role !== 'contractor') { router.push('/dashboard/homeowner'); return }
        setUser(data.user)
        setProfile(data.contractorProfile)
        await fetchProjects()
      } catch (err) {
        console.error(err)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router, fetchProjects])

  useEffect(() => {
    pollingRef.current = setInterval(fetchProjects, 30000)
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [fetchProjects])

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
      if (filters.sortBy === 'budget-low') return (a.budget || 0) - (b.budget || 0)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    setFiltered(result)
  }, [projects, filters])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/auth/login')
  }

  async function handleRefresh() {
    setRefreshing(true)
    await fetchProjects()
    setRefreshing(false)
    toast.success('Dashboard refreshed.')
  }

  async function handleClaim(projectId: string) {
    if (!profile) return
    if (profile.currentActiveProjects >= profile.maxActiveProjects) {
      toast.error('Project capacity reached. Upgrade to claim more.')
      return
    }
    setClaiming(projectId)
    try {
      const res = await fetch(`/api/projects/claim/${projectId}`, { method: 'POST' })
      if (res.ok) {
        setProjects(prev => prev.filter(p => p.id !== projectId))
        setProfile(prev => prev ? { ...prev, currentActiveProjects: prev.currentActiveProjects + 1 } : prev)
        toast.success('Project claimed successfully.')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to claim project')
      }
    } catch (err) {
      console.error(err)
      toast.error('Network error. Please try again.')
    } finally {
      setClaiming(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) return null

  const atCapacity = (profile?.currentActiveProjects ?? 0) >= (profile?.maxActiveProjects ?? 1)
  const capacityPct = profile ? Math.round((profile.currentActiveProjects / profile.maxActiveProjects) * 100) : 0

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="contractor" onLogout={handleLogout} avatarUrl={user.avatarUrl} />

      <main id="main-content" className="lg:ml-[260px] p-5 sm:p-6 lg:p-8 space-y-6 pt-20 lg:pt-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-primary p-6 sm:p-8 text-primary-foreground">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_70%_-20%,rgba(255,255,255,0.15),transparent_50%)]" />
          <div className="pointer-events-none absolute inset-0 dot-grid opacity-20" />
          
          <div className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-5">
            <div>
              <p className="text-primary-foreground/70 text-xs font-semibold uppercase tracking-wider mb-2">
                 Nexus Contractor Operations
              </p>
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                {profile?.companyName || user.name}
              </h1>
              <p className="text-primary-foreground/80 text-sm mt-2 flex flex-wrap items-center gap-3">
                <span className="capitalize">{profile?.membershipTier || 'Starter'} Plan</span>
                <span className="opacity-40">·</span>
                 <span>{profile?.currentActiveProjects ?? 0} / {profile?.maxActiveProjects ?? 3} active assignments</span>
                <span className="opacity-40">·</span>
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                   {projects.length} available projects
                </span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2.5 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
                title={`Last updated ${lastRefresh.toLocaleTimeString()}`}
              >
                <RefreshCw className={`w-4 h-4 text-white ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <Link
                href="/dashboard/contractor/analytics"
                className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 transition-colors text-white font-semibold text-sm px-5 py-2.5 rounded-xl border border-white/20"
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </Link>
            </div>
          </div>

          {/* Capacity Bar */}
          {profile && (
            <div className="relative mt-6">
              <div className="flex items-center justify-between text-xs text-primary-foreground/70 mb-2">
                 <span>Operational capacity</span>
                <span>{profile.currentActiveProjects} / {profile.maxActiveProjects} ({capacityPct}%)</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${atCapacity ? 'bg-red-400/80' : 'bg-white/70'}`}
                  style={{ width: `${Math.min(capacityPct, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
             { label: 'Active Assignments', value: profile?.currentActiveProjects ?? 0, sub: `of ${profile?.maxActiveProjects ?? 3} plan capacity`, icon: Briefcase, color: 'text-primary', bg: 'bg-primary/10' },
             { label: 'Service Rating', value: profile?.averageRating ? profile.averageRating.toFixed(1) : '—', sub: `${profile?.totalReviews ?? 0} verified reviews`, icon: Star, color: 'text-amber-500', bg: 'bg-amber-500/10' },
             { label: 'Open Opportunities', value: projects.length, sub: 'available projects', icon: Layers, color: 'text-blue-500', bg: 'bg-blue-500/10' },
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
                <p className="font-display text-3xl font-bold text-foreground tabular-nums">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
              </div>
            )
          })}
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              label: 'Current Plan',
              value: (profile?.membershipTier || 'Starter').toUpperCase(),
              detail: 'Plan level determines assignment capacity and routing priority.',
            },
            {
              label: 'Time to Claim',
              value: 'Real-time',
              detail: 'New qualified projects surface immediately as they are posted.',
            },
            {
              label: 'Estimated Pipeline',
              value: `$${filteredProjects.reduce((sum, project) => sum + (project.budget || 0), 0).toLocaleString()}`,
              detail: 'Total posted budget across projects currently matching your filters.',
            },
          ].map((card) => (
            <div key={card.label} className="rounded-xl border border-border bg-card p-5 card-elevated">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{card.label}</p>
              <p className="mt-2 text-2xl font-display font-bold text-foreground">{card.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{card.detail}</p>
            </div>
          ))}
        </section>

        {/* Capacity Warning */}
        {atCapacity && (
          <div className="rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700 px-5 py-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
               <p className="font-semibold text-amber-800 dark:text-amber-300">Project capacity reached</p>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-0.5">
                 Your current plan supports up to {profile?.maxActiveProjects} active assignments.{' '}
                 <Link href="/dashboard/contractor/settings" className="underline font-medium">Upgrade your plan</Link> to accept additional work.
              </p>
            </div>
          </div>
        )}

        {/* AI Insights */}
        {projects.length > 0 && (
          <AIInsightsCard
            role="contractor"
            requests={projects.slice(0, 5) as any}
            profile={profile as any}
          />
        )}

        {/* Auto-refresh notice */}
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <RefreshCw className="w-3 h-3" />
           Auto-refresh every 30 seconds · Last updated {lastRefresh.toLocaleTimeString()}
        </p>

        {/* Projects Grid */}
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <ProjectFilters onFiltersChange={setFilters} />
          </div>

          <div className="lg:col-span-3">
            <div className="bg-card border border-border rounded-xl overflow-hidden card-elevated">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-primary" />
                   <h2 className="font-semibold text-foreground">Available Projects</h2>
                </div>
                <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                  {filteredProjects.length} result{filteredProjects.length !== 1 ? 's' : ''}
                </span>
              </div>

              {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                   <p className="font-semibold text-foreground mb-2">No projects available</p>
                  <p className="text-sm text-muted-foreground max-w-sm">
                     New qualified requests appear here automatically. Check back shortly.
                  </p>
                  <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" /> Auto-checking every 30 seconds
                  </p>
                </div>
              ) : filteredProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
                   <p className="font-medium text-foreground mb-1">No matches</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your filters.</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredProjects.map(project => {
                    const icon = CATEGORY_ICONS[project.category] ?? '🔨'
                    const fresh = isNew(project.createdAt)
                    return (
                      <div key={project.id} className="px-6 py-5 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1 min-w-0">
                            <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center text-xl flex-shrink-0">
                              {icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <Link
                                  href={`/dashboard/contractor/projects/${project.id}`}
                                  className="font-semibold text-foreground hover:text-primary transition-colors"
                                >
                                  {project.title || formatCategory(project.category)}
                                </Link>
                                {fresh && (
                                  <span className="text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800 px-2 py-0.5 rounded-full uppercase tracking-wide">
                                    NEW
                                  </span>
                                )}
                              </div>
                              <span className="inline-block text-xs font-semibold bg-muted text-muted-foreground px-2 py-0.5 rounded-md mb-2">
                                {formatCategory(project.category)}
                              </span>
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                {project.description}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {project.location}
                                </span>
                                {project.preferredDate && (
                                  <span className="flex items-center gap-1">
                                    <CalendarDays className="w-3 h-3" />
                                    Needs by {formatDateOnly(project.preferredDate)}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {timeAgo(project.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex-shrink-0 flex flex-col items-end gap-3">
                            {project.budget != null && (
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4 text-primary" />
                                <span className="font-bold text-primary text-lg tabular-nums">
                                  {project.budget.toLocaleString()}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Link href={`/dashboard/contractor/projects/${project.id}`}>
                                <button className="px-3 py-1.5 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors">
                                  View
                                </button>
                              </Link>
                              <button
                                onClick={() => handleClaim(project.id)}
                                disabled={claimingId === project.id || atCapacity}
                                className="px-4 py-1.5 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center gap-1.5"
                              >
                                {claimingId === project.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Claim
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upgrade Section */}
        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 card-elevated">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                 <h3 className="font-semibold text-foreground">Increase assignment capacity</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                   Higher tiers unlock more active assignments, faster routing, and premium support.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/contractor/billing"
              className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-primary border border-primary/30 bg-background hover:bg-primary/5 transition-colors px-4 py-2.5 rounded-lg"
            >
               Review plans
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                name: 'Contractor Pro',
                price: '$59',
                cadence: '/mo billed annually',
                 desc: 'Up to 10 active assignments, priority dispatch notifications, verified badge',
                highlight: true,
                badge: 'Best Value',
              },
              {
                name: 'Contractor Elite',
                price: '$199',
                cadence: '/mo',
                 desc: 'Unlimited assignments, first-priority dispatch access, dedicated account manager',
                highlight: false,
              },
            ].map(plan => (
              <div
                key={plan.name}
                className={`relative rounded-xl border p-5 ${
                  plan.highlight
                    ? 'border-primary/40 bg-primary/5'
                    : 'border-border bg-background'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-2.5 left-4 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground px-2.5 py-1 rounded-full">
                    {plan.badge}
                  </span>
                )}
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-foreground">{plan.name}</span>
                </div>
                <p className="font-display text-3xl font-bold text-foreground tabular-nums">
                  {plan.price}
                  <span className="text-sm font-normal text-muted-foreground">{plan.cadence}</span>
                </p>
                <p className="text-sm text-muted-foreground mt-2 mb-4">{plan.desc}</p>
                <Link href="/dashboard/contractor/billing">
                  <button className={`w-full py-2.5 text-sm font-semibold rounded-lg transition-all inline-flex items-center justify-center gap-1.5 ${
                    plan.highlight
                      ? 'bg-primary text-primary-foreground hover:opacity-95'
                      : 'border border-border bg-background hover:border-primary/40 hover:text-primary'
                  }`}>
                    <Zap className="w-4 h-4" />
                    Upgrade
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>

      <AIAssistant
        role="contractor"
        context={profile ? `Contractor: ${profile.companyName ?? user.name}, ${profile.currentActiveProjects ?? 0}/${profile.maxActiveProjects ?? 3} active projects, rating ${profile.averageRating ?? 'N/A'}.` : undefined}
      />
    </div>
  )
}
