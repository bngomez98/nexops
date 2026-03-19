'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { User, LogOut, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react'

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
  user: {
    id: string
    email: string
    name: string
    role: string
  }
}

export default function HomeownerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<UserData['user'] | null>(null)
  const [projects, setProjects] = useState<ProjectRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        // Get user
        const authResponse = await fetch('/api/auth/me')
        if (!authResponse.ok) {
          router.push('/login')
          return
        }
        const userData = await authResponse.json()
        setUser(userData.user)

        // Get projects
        const projectsResponse = await fetch('/api/projects/list?type=my-projects')
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

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!user) return null

  const activeProjects = projects.filter(p => p.status === 'open')
  const claimedProjects = projects.filter(p => p.status === 'claimed')
  const completedProjects = projects.filter(p => p.status === 'completed')

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Nexus Operations</h1>
            <p className="text-sm text-muted-foreground">Homeowner Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">{user.name}</span>
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
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Welcome, {user.name}!</h2>
            <p className="text-muted-foreground mb-6">
              Post a project request and get bids from licensed contractors in your area.
            </p>
            <Link href="/dashboard/homeowner/new-request">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Post New Project Request
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border border-border rounded-lg p-6 bg-muted/30">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Active Requests</span>
              </div>
              <div className="text-3xl font-bold text-foreground">{activeProjects.length}</div>
            </div>
            <div className="border border-border rounded-lg p-6 bg-muted/30">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-5 h-5 text-accent" />
                <span className="text-sm text-muted-foreground">Claimed Projects</span>
              </div>
              <div className="text-3xl font-bold text-foreground">{claimedProjects.length}</div>
            </div>
            <div className="border border-border rounded-lg p-6 bg-muted/30">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span className="text-sm text-muted-foreground">Completed Projects</span>
              </div>
              <div className="text-3xl font-bold text-foreground">{completedProjects.length}</div>
            </div>
          </div>

          {/* Projects Section */}
          <div className="border border-border rounded-lg p-6">
            <h3 className="text-xl font-bold text-foreground mb-6">Your Project Requests</h3>
            {projects.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="mb-4">No project requests yet. Get started by posting your first request!</p>
                <Link href="/dashboard/homeowner/new-request">
                  <Button variant="outline" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Post Your First Project
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{project.title}</h4>
                        <p className="text-sm text-muted-foreground capitalize">{project.category.replace('-', ' ')}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        project.status === 'open' ? 'bg-primary/10 text-primary' :
                        project.status === 'claimed' ? 'bg-accent/10 text-accent' :
                        project.status === 'completed' ? 'bg-secondary/10 text-secondary' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{project.location}</span>
                      {project.budget && <span className="font-semibold text-foreground">${project.budget.toLocaleString()}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
