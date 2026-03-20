'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { DashboardNav } from '@/components/dashboard-nav'
import { Plus, Clock, CheckCircle, Wrench, FileText } from 'lucide-react'

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

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  open: { label: 'Open', classes: 'bg-primary/10 text-primary' },
  claimed: { label: 'In Progress', classes: 'bg-amber-500/10 text-amber-500' },
  'in-progress': { label: 'In Progress', classes: 'bg-amber-500/10 text-amber-500' },
  completed: { label: 'Completed', classes: 'bg-emerald-500/10 text-emerald-600' },
  cancelled: { label: 'Cancelled', classes: 'bg-muted text-muted-foreground' },
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
    async function loadData() {
      try {
        const authRes = await fetch('/api/auth/me')
        if (!authRes.ok) { router.push('/login'); return }
        const { user: userData } = await authRes.json()
        if (userData.role !== 'homeowner') { router.push('/dashboard/contractor'); return }
        setUser(userData)

        const projRes = await fetch('/api/projects/list?type=my-projects')
        if (projRes.ok) {
          const { projects: data } = await projRes.json()
          setProjects(data)
        }
      } catch {
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
        <div className="text-muted-foreground text-sm">Loading…</div>
      </div>
    )
  }

  if (!user) return null

  const open = projects.filter(p => p.status === 'open')
  const inProgress = projects.filter(p => p.status === 'claimed' || p.status === 'in-progress')
  const completed = projects.filter(p => p.status === 'completed')

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="homeowner" onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Welcome banner */}
          <div className="rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Welcome back, {user.name.split(' ')[0]}</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Post a request and get bids from licensed contractors in your area.
              </p>
            </div>
            <Link href="/dashboard/homeowner/new-request" className="flex-shrink-0">
              <Button className="gap-2 w-full sm:w-auto">
                <Plus className="w-4 h-4" />
                Post New Request
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="border border-border rounded-xl p-5 bg-muted/20">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Open</span>
              </div>
              <div className="text-3xl font-bold text-foreground">{open.length}</div>
            </div>
            <div className="border border-border rounded-xl p-5 bg-muted/20">
              <div className="flex items-center gap-2 mb-3">
                <Wrench className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">In Progress</span>
              </div>
              <div className="text-3xl font-bold text-foreground">{inProgress.length}</div>
            </div>
            <div className="border border-border rounded-xl p-5 bg-muted/20">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Done</span>
              </div>
              <div className="text-3xl font-bold text-foreground">{completed.length}</div>
            </div>
          </div>

          {/* Project list */}
          <div className="border border-border rounded-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold text-foreground">Your Requests</h3>
                {projects.length > 0 && (
                  <span className="ml-1 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                    {projects.length}
                  </span>
                )}
              </div>
              <Link href="/dashboard/homeowner/new-request">
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="w-3 h-3" />
                  New
                </Button>
              </Link>
            </div>

            {projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="font-medium text-foreground mb-1">No requests yet</p>
                <p className="text-sm text-muted-foreground mb-6">
                  Post your first project request to connect with contractors.
                </p>
                <Link href="/dashboard/homeowner/new-request">
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Post First Request
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {projects.map(project => {
                  const status = STATUS_CONFIG[project.status] ?? {
                    label: project.status,
                    classes: 'bg-muted text-muted-foreground',
                  }
                  return (
                    <div key={project.id} className="px-6 py-4 hover:bg-muted/20 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-medium text-foreground truncate">{project.title}</h4>
                            <span className={`flex-shrink-0 px-2.5 py-0.5 rounded-full text-xs font-semibold ${status.classes}`}>
                              {status.label}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {formatCategory(project.category)} · {project.location}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          {project.budget && (
                            <div className="font-semibold text-foreground">${project.budget.toLocaleString()}</div>
                          )}
                          <div className="text-xs text-muted-foreground mt-1">{timeAgo(project.createdAt)}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
