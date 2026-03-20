'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { DashboardNav } from '@/components/dashboard-nav'
import { ProjectFilters } from '@/components/project-filters'
import {
  Briefcase, Star, Layers, MapPin, Loader, BarChart3, ArrowUpRight,
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
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<ContractorProfile | null>(null)
  const [projects, setProjects] = useState<ProjectRequest[]>([])
  const [filteredProjects, setFilteredProjects] = useState<ProjectRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [claimingId, setClaimingId] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    budgetRange: '',
    status: '',
    location: '',
    sortBy: 'recent',
  })

  useEffect(() => {
    async function loadData() {
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
          setProjects(list)
        }
      } catch {
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [router])

  // Apply filters
  useEffect(() => {
    let result = [...projects]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      )
    }
    if (filters.category) {
      result = result.filter(p => p.category === filters.category)
    }
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
    setFilteredProjects(result)
  }, [projects, filters])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  async function handleClaim(projectId: string) {
    if (!profile) return
    if (profile.currentActiveProjects >= profile.maxActiveProjects) return
    setClaimingId(projectId)
    try {
      const res = await fetch(`/api/projects/claim/${projectId}`, { method: 'POST' })
      if (res.ok) {
        setProjects(prev => prev.filter(p => p.id !== projectId))
        setProfile(prev => prev ? { ...prev, currentActiveProjects: prev.currentActiveProjects + 1 } : prev)
      }
    } catch {
      // ignore
    } finally {
      setClaimingId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading…</div>
      </div>
    )
  }

  if (!user) return null

  const atCapacity = (profile?.currentActiveProjects ?? 0) >= (profile?.maxActiveProjects ?? 0)

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="contractor" onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Welcome banner */}
          <div className="rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {profile?.companyName || user.name}
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Membership: <span className="font-semibold text-foreground capitalize">{profile?.membershipTier || 'Free'}</span>
                {profile && (
                  <span className="ml-3">
                    Projects: <span className="font-semibold text-foreground">{profile.currentActiveProjects}/{profile.maxActiveProjects}</span>
                  </span>
                )}
              </p>
            </div>
            <Link href="/dashboard/contractor/analytics">
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <BarChart3 className="w-4 h-4" />
                View Analytics
                <ArrowUpRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="border border-border rounded-xl p-5 bg-muted/20">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Active</span>
              </div>
              <div className="text-3xl font-bold text-foreground">{profile?.currentActiveProjects ?? 0}</div>
              <div className="text-xs text-muted-foreground mt-1">of {profile?.maxActiveProjects ?? 0} max</div>
            </div>
            <div className="border border-border rounded-xl p-5 bg-muted/20">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Rating</span>
              </div>
              <div className="text-3xl font-bold text-foreground">
                {profile?.averageRating ? profile.averageRating.toFixed(1) : '—'}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{profile?.totalReviews ?? 0} reviews</div>
            </div>
            <div className="border border-border rounded-xl p-5 bg-muted/20">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Available</span>
              </div>
              <div className="text-3xl font-bold text-foreground">{projects.length}</div>
              <div className="text-xs text-muted-foreground mt-1">open projects</div>
            </div>
          </div>

          {/* Capacity warning */}
          {atCapacity && (
            <div className="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700 px-5 py-4 flex items-start gap-3">
              <div className="text-amber-600 dark:text-amber-400 font-semibold text-sm mt-0.5">!</div>
              <div>
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                  Project capacity reached
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                  You've reached your limit of {profile?.maxActiveProjects} active projects.{' '}
                  <Link href="/dashboard/contractor/settings" className="underline hover:no-underline">
                    Upgrade your plan
                  </Link>{' '}
                  to take on more work.
                </p>
              </div>
            </div>
          )}

          {/* Projects area */}
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Filters */}
            <div className="lg:col-span-1">
              <ProjectFilters onFiltersChange={setFilters} />
            </div>

            {/* List */}
            <div className="lg:col-span-3">
              <div className="border border-border rounded-xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                  <h3 className="font-semibold text-foreground">Available Projects</h3>
                  <span className="text-xs text-muted-foreground">
                    {filteredProjects.length} result{filteredProjects.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {projects.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Briefcase className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <p className="font-medium text-foreground mb-1">No projects available</p>
                    <p className="text-sm text-muted-foreground">
                      New projects in your service categories will appear here.
                    </p>
                  </div>
                ) : filteredProjects.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                    <p className="font-medium text-foreground mb-1">No matches</p>
                    <p className="text-sm text-muted-foreground">Try adjusting your filters.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {filteredProjects.map(project => (
                      <div key={project.id} className="px-6 py-5 hover:bg-muted/20 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-3 mb-1">
                              <Link
                                href={`/dashboard/contractor/projects/${project.id}`}
                                className="font-medium text-foreground hover:text-primary transition-colors leading-snug"
                              >
                                {project.title}
                              </Link>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">
                              {formatCategory(project.category)}
                            </p>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {project.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {project.location}
                              </span>
                              <span>{timeAgo(project.createdAt)}</span>
                            </div>
                          </div>
                          <div className="flex-shrink-0 flex flex-col items-end gap-3">
                            {project.budget && (
                              <span className="font-bold text-primary text-lg">
                                ${project.budget.toLocaleString()}
                              </span>
                            )}
                            <div className="flex items-center gap-2">
                              <Link href={`/dashboard/contractor/projects/${project.id}`}>
                                <Button variant="outline" size="sm">
                                  View
                                </Button>
                              </Link>
                              <Button
                                size="sm"
                                onClick={() => handleClaim(project.id)}
                                disabled={claimingId === project.id || atCapacity}
                              >
                                {claimingId === project.id ? (
                                  <Loader className="w-4 h-4 animate-spin" />
                                ) : 'Claim'}
                              </Button>
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

          {/* Membership upgrade */}
          <div className="border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Upgrade Your Plan</h3>
              <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full capitalize">
                Current: {profile?.membershipTier || 'free'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-5">
              Increase your active project capacity and access more opportunities.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { name: 'Professional', price: '$299/mo', projects: 5, highlight: profile?.membershipTier === 'free' },
                { name: 'Enterprise', price: '$749/mo', projects: 15, highlight: profile?.membershipTier === 'professional' },
              ].map(plan => (
                <div
                  key={plan.name}
                  className={`rounded-lg border p-5 ${plan.highlight ? 'border-primary/40 bg-primary/5' : 'border-border'}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-foreground">{plan.name}</span>
                    {plan.highlight && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                        Recommended
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">{plan.price}</div>
                  <div className="text-sm text-muted-foreground mb-4">Up to {plan.projects} active projects</div>
                  <Link href="/dashboard/contractor/settings">
                    <Button variant={plan.highlight ? 'default' : 'outline'} size="sm" className="w-full">
                      Upgrade to {plan.name}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
