'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { DashboardNav } from '@/components/dashboard-nav'
import { MapPin, Calendar, DollarSign, ArrowLeft, Loader } from 'lucide-react'

interface ProjectRequest {
  id: string
  title: string
  description: string
  category: string
  location: string
  budget?: number
  status: string
  homeownerId: string
  createdAt: string
}

function formatCategory(cat: string) {
  return cat.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`
  return new Date(dateStr).toLocaleDateString()
}

export default function ProjectDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const [user, setUser] = useState<any>(null)
  const [project, setProject] = useState<ProjectRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [bidAmount, setBidAmount] = useState('')
  const [bidDescription, setBidDescription] = useState('')
  const [bidTimeline, setBidTimeline] = useState('')
  const [submittingBid, setSubmittingBid] = useState(false)
  const [claiming, setClaiming] = useState(false)
  const [claimed, setClaimed] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        const authRes = await fetch('/api/auth/me')
        if (!authRes.ok) { router.push('/auth/login'); return }
        const authData = await authRes.json()
        if (authData.user.role !== 'contractor') { router.push('/dashboard/homeowner'); return }
        setUser(authData.user)

        const projRes = await fetch(`/api/projects/${projectId}`)
        if (projRes.status === 404) { setNotFound(true); return }
        if (!projRes.ok) { router.push('/dashboard/contractor'); return }
        const { project: proj } = await projRes.json()
        setProject(proj)
      } catch {
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [router, projectId])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/auth/login')
  }

  async function handleClaim() {
    setClaiming(true)
    try {
      const res = await fetch(`/api/projects/claim/${projectId}`, { method: 'POST' })
      if (res.ok) {
        setClaimed(true)
        setProject(prev => prev ? { ...prev, status: 'claimed' } : prev)
      }
    } catch {
      // ignore
    } finally {
      setClaiming(false)
    }
  }

  async function submitBid(e: React.FormEvent) {
    e.preventDefault()
    if (!bidAmount || !bidDescription) return
    setSubmittingBid(true)
    try {
      // Bid submission requires a dedicated backend endpoint
      await handleClaim()
      router.push('/dashboard/contractor')
    } catch {
      // ignore
    } finally {
      setSubmittingBid(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading…</div>
      </div>
    )
  }

  if (notFound || !project) {
    return (
      <div className="min-h-screen bg-background">
        {user && <DashboardNav userName={user.name} role="contractor" onLogout={handleLogout} />}
        <main className="container mx-auto px-4 py-16 text-center">
          <p className="text-2xl font-bold text-foreground mb-2">Project not found</p>
          <p className="text-muted-foreground mb-6">This project may have already been claimed or removed.</p>
          <Link href="/dashboard/contractor">
            <Button>Back to Dashboard</Button>
          </Link>
        </main>
      </div>
    )
  }

  const statusLabel: Record<string, string> = {
    open: 'Open',
    claimed: 'Claimed',
    'in-progress': 'In Progress',
    completed: 'Completed',
  }
  const statusClasses: Record<string, string> = {
    open: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200',
    claimed: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200',
    'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
    completed: 'bg-muted text-muted-foreground',
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role="contractor" onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          href="/dashboard/contractor"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Project details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title + status */}
            <div>
              <div className="flex items-start gap-4 mb-3">
                <h1 className="text-3xl font-bold text-foreground flex-1">{project.title}</h1>
                <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold mt-1 ${statusClasses[project.status] ?? 'bg-muted text-muted-foreground'}`}>
                  {statusLabel[project.status] ?? project.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {project.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Posted {timeAgo(project.createdAt)}
                </span>
                {project.budget && (
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4" />
                    Budget: ${project.budget.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Category:</span>
              <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-sm font-medium">
                {formatCategory(project.category)}
              </span>
            </div>

            {/* Description */}
            <div className="border border-border rounded-xl p-6">
              <h2 className="font-semibold text-foreground mb-3">Project Description</h2>
              <p className="text-foreground whitespace-pre-wrap leading-relaxed text-sm">
                {project.description}
              </p>
            </div>
          </div>

          {/* Claim / Bid sidebar */}
          <div className="sticky top-20 h-fit">
            {claimed || project.status !== 'open' ? (
              <div className="border border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-6 text-center">
                <div className="text-emerald-600 text-4xl mb-3">✓</div>
                <p className="font-semibold text-foreground mb-1">
                  {claimed ? 'Project Claimed!' : 'Project Unavailable'}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {claimed
                    ? 'This project has been added to your active projects.'
                    : 'This project has already been claimed.'}
                </p>
                <Link href="/dashboard/contractor">
                  <Button variant="outline" className="w-full">Back to Dashboard</Button>
                </Link>
              </div>
            ) : (
              <div className="border border-border rounded-xl p-6 bg-muted/20">
                <h2 className="font-semibold text-foreground mb-5">Submit Your Bid</h2>

                <form onSubmit={submitBid} className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="bidAmount" className="text-sm font-medium text-foreground">
                      Bid Amount *
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-sm">$</span>
                      <input
                        id="bidAmount"
                        type="number"
                        step="0.01"
                        placeholder={project.budget ? String(project.budget) : '5000'}
                        value={bidAmount}
                        onChange={e => setBidAmount(e.target.value)}
                        required
                        className="flex-1 px-3 py-2 rounded-lg border border-input bg-input text-foreground text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="bidDescription" className="text-sm font-medium text-foreground">
                      Your Proposal *
                    </label>
                    <textarea
                      id="bidDescription"
                      placeholder="Describe your approach, experience, and why you're the right fit..."
                      value={bidDescription}
                      onChange={e => setBidDescription(e.target.value)}
                      rows={4}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-input bg-input text-foreground text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="timeline" className="text-sm font-medium text-foreground">
                      Timeline
                    </label>
                    <select
                      id="timeline"
                      value={bidTimeline}
                      onChange={e => setBidTimeline(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-input text-foreground text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select timeline</option>
                      <option value="1week">Within 1 week</option>
                      <option value="2weeks">Within 2 weeks</option>
                      <option value="1month">Within 1 month</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>

                  <div className="pt-2 space-y-2">
                    <Button type="submit" disabled={submittingBid} className="w-full gap-2">
                      {submittingBid && <Loader className="w-4 h-4 animate-spin" />}
                      {submittingBid ? 'Submitting…' : 'Submit Bid & Claim'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      disabled={claiming}
                      onClick={handleClaim}
                    >
                      {claiming ? <Loader className="w-4 h-4 animate-spin" /> : 'Claim Directly'}
                    </Button>
                  </div>
                </form>

                <div className="mt-5 pt-5 border-t border-border">
                  <p className="text-xs text-muted-foreground font-medium mb-2">Tips for winning:</p>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>· Be specific about your approach and timeline</li>
                    <li>· Include relevant experience with similar projects</li>
                    <li>· Respond quickly to homeowner questions</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
