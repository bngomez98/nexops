'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ProjectFilters } from '@/components/project-filters'
import { NotificationBell } from '@/components/notification-bell'
import { User, LogOut, TrendingUp, Briefcase, Award, MapPin, Loader, BarChart3 } from 'lucide-react'

interface ProjectRequest {
  id: string
  title: string
  description: string
  category: string
  location: string
  budget?: number
  createdAt: string
}

interface ContractorData {
  user: {
    id: string
    email: string
    name: string
    role: string
  }
  contractorProfile: {
    companyName: string
    membershipTier: string
    currentActiveProjects: number
    maxActiveProjects: number
    averageRating: number
    totalReviews: number
  } | null
}

interface FilterState {
  search: string
  category: string
  budgetRange: string
  status: string
  location: string
  sortBy: 'recent' | 'budget-high' | 'budget-low'
}

export default function ContractorDashboard() {
  const router = useRouter()
  const [data, setData] = useState<ContractorData | null>(null)
  const [projects, setProjects] = useState<ProjectRequest[]>([])
  const [filteredProjects, setFilteredProjects] = useState<ProjectRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [claimingProjectId, setClaimingProjectId] = useState<string | null>(null)
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
        const response = await fetch('/api/auth/me')
        if (!response.ok) {
          router.push('/login')
          return
        }
        const userData = await response.json()
        if (userData.user.role !== 'contractor') {
          router.push('/dashboard/homeowner')
          return
        }
        setData(userData)

        // Get available projects
        const projectsResponse = await fetch('/api/projects/list?type=available')
        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json()
          setProjects(projectsData.projects)
        }
      } catch (error) {
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  // Apply filters whenever projects or filters change
  useEffect(() => {
    let result = [...projects]

    // Search filter
    if (filters.search) {
      const query = filters.search.toLowerCase()
      result = result.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      )
    }

    // Category filter
    if (filters.category) {
      result = result.filter(p => p.category === filters.category)
    }

    // Budget range filter
    if (filters.budgetRange) {
      result = result.filter(p => {
        if (!p.budget) return true
        const [min, max] = filters.budgetRange.split('-')
        const budget = p.budget
        if (max === '+') {
          return budget >= parseInt(min)
        }
        return budget >= parseInt(min) && budget <= parseInt(max)
      })
    }

    // Location filter
    if (filters.location) {
      result = result.filter(p =>
        p.location.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    // Sort
    result.sort((a, b) => {
      if (filters.sortBy === 'recent') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else if (filters.sortBy === 'budget-high') {
        return (b.budget || 0) - (a.budget || 0)
      } else if (filters.sortBy === 'budget-low') {
        return (a.budget || 0) - (b.budget || 0)
      }
      return 0
    })

    setFilteredProjects(result)
  }, [projects, filters])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  async function handleClaimProject(projectId: string) {
    setClaimingProjectId(projectId)
    try {
      const response = await fetch(`/api/projects/claim/${projectId}`, {
        method: 'POST',
      })
      if (response.ok) {
        setProjects(projects.filter(p => p.id !== projectId))
      }
    } catch (error) {
      console.error('Error claiming project:', error)
    } finally {
      setClaimingProjectId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!data) return null

  const profile = data.contractorProfile

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Nexus Operations</h1>
            <p className="text-sm text-muted-foreground">
              {profile?.companyName || 'Contractor'} Dashboard
            </p>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">{data.user.name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid gap-6">
          {/* Welcome Section */}
          <div className="bg-accent/5 border border-accent/20 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Welcome, {data.user.name}!
            </h2>
            <p className="text-muted-foreground mb-4">
              Browse available projects in your service categories and grow your business.
            </p>
            {profile && (
              <div className="flex gap-4 mb-6 text-sm">
                <div>
                  <span className="text-muted-foreground">Membership:</span>
                  <span className="ml-2 font-semibold text-foreground capitalize">{profile.membershipTier}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Active Projects:</span>
                  <span className="ml-2 font-semibold text-foreground">
                    {profile.currentActiveProjects}/{profile.maxActiveProjects}
                  </span>
                </div>
              </div>
            )}
            <Button className="gap-2" variant="accent">
              Browse Available Projects
            </Button>
          </div>

          {/* Analytics Link */}
          <div className="flex gap-4">
            <a href="/dashboard/contractor/analytics" className="flex-1">
              <Button variant="outline" className="w-full gap-2">
                <BarChart3 className="w-4 h-4" />
                View Detailed Analytics
              </Button>
            </a>
          </div>

          {/* Stats Section */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border border-border rounded-lg p-6 bg-muted/30">
              <div className="flex items-center gap-3 mb-2">
                <Briefcase className="w-5 h-5 text-accent" />
                <span className="text-sm text-muted-foreground">Active Projects</span>
              </div>
              <div className="text-3xl font-bold text-foreground">
                {profile?.currentActiveProjects || 0}
              </div>
            </div>

            <div className="border border-border rounded-lg p-6 bg-muted/30">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                <span className="text-sm text-muted-foreground">Average Rating</span>
              </div>
              <div className="text-3xl font-bold text-foreground">
                {profile?.averageRating.toFixed(1) || 'N/A'}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {profile?.totalReviews || 0} reviews
              </div>
            </div>

            <div className="border border-border rounded-lg p-6 bg-muted/30">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-5 h-5 text-accent" />
                <span className="text-sm text-muted-foreground">Max Capacity</span>
              </div>
              <div className="text-3xl font-bold text-foreground">
                {profile?.maxActiveProjects || 0}
              </div>
            </div>
          </div>

          {/* Available Projects */}
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <ProjectFilters
                onFiltersChange={setFilters}
              />
            </div>

            {/* Projects List */}
            <div className="lg:col-span-3">
              <div className="border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-foreground">Available Projects</h3>
                  <span className="text-sm text-muted-foreground">
                    {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
                  </span>
                </div>
                {projects.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No projects available in your service categories at the moment. Check back soon!
                  </div>
                ) : filteredProjects.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No projects match your filters. Try adjusting your search criteria.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredProjects.map((project) => (
                  <div key={project.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{project.title}</h4>
                        <p className="text-sm text-muted-foreground capitalize">{project.category.replace('-', ' ')}</p>
                      </div>
                      {project.budget && (
                        <span className="font-bold text-accent text-lg">${project.budget.toLocaleString()}</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {project.location}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleClaimProject(project.id)}
                        disabled={
                          claimingProjectId === project.id ||
                          (data?.contractorProfile?.currentActiveProjects ?? 0) >=
                            (data?.contractorProfile?.maxActiveProjects ?? 0)
                        }
                      >
                        {claimingProjectId === project.id ? (
                          <>
                            <Loader className="w-4 h-4 mr-2 animate-spin" />
                            Claiming...
                          </>
                        ) : (
                          'Claim Project'
                        )}
                      </Button>
                    </div>
                  </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Membership Info */}
          <div className="border border-border rounded-lg p-6 bg-primary/5">
            <h3 className="text-lg font-bold text-foreground mb-4">Membership Plans</h3>
            <p className="text-muted-foreground mb-6">
              Upgrade your membership to access more projects and increase your active project capacity.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { name: 'Professional', price: '$299/mo', projects: 5 },
                { name: 'Enterprise', price: '$749/mo', projects: 15 },
              ].map((plan, i) => (
                <div key={i} className="border border-border rounded-lg p-4">
                  <div className="font-semibold text-foreground mb-2">{plan.name}</div>
                  <div className="text-2xl font-bold text-accent mb-4">{plan.price}</div>
                  <div className="text-sm text-muted-foreground mb-4">
                    Up to {plan.projects} active projects
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Upgrade
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
