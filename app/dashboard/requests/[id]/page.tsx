'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardNav } from '@/components/dashboard-nav'
import {
  ChevronLeft, Loader2, Calendar, MapPin, DollarSign,
  Wrench, CheckCircle2, Clock, AlertCircle, User,
} from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string
  category: string
  location: string
  budget?: number
  status: string
  rawStatus: string
  createdAt: string
  consultationDate?: string
  finalCost?: number
  completionDate?: string
  contractorName?: string
  assignedContractorId?: string
}

const STATUS: Record<string, { label: string; pill: string; step: number; desc: string }> = {
  open:          { label: 'Submitted',   pill: 'status-open',      step: 1, desc: 'Your request has been submitted and is awaiting contractor assignment.' },
  claimed:       { label: 'Assigned',    pill: 'status-claimed',   step: 2, desc: 'A verified contractor has been assigned to your project.' },
  'in-progress': { label: 'In Progress', pill: 'status-progress',  step: 3, desc: 'Work is underway on your project.' },
  completed:     { label: 'Completed',   pill: 'status-completed', step: 4, desc: 'Your project has been completed.' },
  cancelled:     { label: 'Cancelled',   pill: 'status-cancelled', step: 0, desc: 'This project was cancelled.' },
}

const STEPS = [
  { label: 'Submitted',   icon: Clock },
  { label: 'Assigned',    icon: User },
  { label: 'In Progress', icon: Wrench },
  { label: 'Completed',   icon: CheckCircle2 },
]

const CATEGORY_ICONS: Record<string, string> = {
  'tree-removal': '🌳', 'concrete-work': '🏗️', 'roofing': '🏠',
  'hvac': '❄️', 'fencing': '🏡', 'electrical': '⚡', 'plumbing': '🔧', 'excavation': '🚜',
}

function formatCategory(cat: string) {
  return cat.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export default function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const meRes = await fetch('/api/auth/me')
        if (!meRes.ok) { router.push('/auth/login'); return }
        const { user: u } = await meRes.json()
        setUser(u)

        const projRes = await fetch(`/api/projects/${id}`)
        if (!projRes.ok) {
          const data = await projRes.json()
          setError(data.error || 'Failed to load project')
          return
        }
        const { project: p } = await projRes.json()
        setProject(p)
      } catch {
        setError('Failed to load project details.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, router])

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

  const role = user?.role ?? 'homeowner'
  const isContractor = role === 'contractor'

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        {user && <DashboardNav userName={user.name} role={role} onLogout={handleLogout} />}
        <main className={`${user ? 'md:ml-[220px]' : ''} p-6`}>
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2.5 p-5 rounded-xl border border-destructive/30 bg-destructive/8 text-destructive">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-semibold">{error}</p>
                <Link href={isContractor ? '/dashboard/contractor' : '/dashboard/homeowner'} className="text-sm underline mt-1 block">
                  Return to dashboard
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!project) return null

  const st = STATUS[project.status] ?? { label: project.status, pill: 'status-pending', step: 0, desc: '' }
  const catIcon = CATEGORY_ICONS[project.category] ?? '🔨'

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={user.name} role={role} onLogout={handleLogout} />

      <main className="md:ml-[220px] p-6 space-y-6 animate-fade-up">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Back link */}
          <Link
            href={isContractor ? `/dashboard/contractor/projects/${id}` : '/dashboard/homeowner'}
            className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to {isContractor ? 'project' : 'dashboard'}
          </Link>

          {/* Header card */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl flex-shrink-0">
                {catIcon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <h1 className="text-xl font-bold text-foreground leading-snug">
                    {project.title || formatCategory(project.category)}
                  </h1>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${st.pill}`}>
                    {st.label}
                  </span>
                </div>
                <p className="text-[13px] text-muted-foreground mt-1">{formatCategory(project.category)}</p>
              </div>
            </div>

            {/* Status description */}
            {st.desc && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-secondary/50 border border-border text-[12.5px] text-muted-foreground mb-6">
                <AlertCircle className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                {st.desc}
              </div>
            )}

            {/* Progress steps */}
            {st.step > 0 && (
              <div className="flex items-center gap-0 mb-6">
                {STEPS.map((s, i) => {
                  const num = i + 1
                  const done = num < st.step
                  const active = num === st.step
                  const Icon = s.icon
                  return (
                    <div key={s.label} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center gap-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          done   ? 'bg-primary text-primary-foreground' :
                          active ? 'bg-primary/15 text-primary ring-2 ring-primary/30' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {done ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                        </div>
                        <span className={`text-[9.5px] font-medium hidden sm:block ${
                          active ? 'text-primary' : done ? 'text-foreground/50' : 'text-muted-foreground'
                        }`}>
                          {s.label}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={`flex-1 h-px mx-2 mb-4 ${num < st.step ? 'bg-primary/40' : 'bg-border'}`} />
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Details grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                {project.location && (
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[11px] text-muted-foreground">Location</p>
                      <p className="text-[13.5px] font-medium text-foreground">{project.location}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[11px] text-muted-foreground">Submitted</p>
                    <p className="text-[13.5px] font-medium text-foreground">
                      {new Date(project.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                {project.consultationDate && (
                  <div className="flex items-start gap-2.5">
                    <Calendar className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[11px] text-muted-foreground">Consultation</p>
                      <p className="text-[13.5px] font-medium text-foreground">
                        {new Date(project.consultationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {project.budget != null && (
                  <div className="flex items-start gap-2.5">
                    <DollarSign className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[11px] text-muted-foreground">Budget cap</p>
                      <p className="text-[13.5px] font-bold text-foreground">${project.budget.toLocaleString()}</p>
                    </div>
                  </div>
                )}
                {project.finalCost != null && (
                  <div className="flex items-start gap-2.5">
                    <DollarSign className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[11px] text-muted-foreground">Final cost</p>
                      <p className="text-[13.5px] font-bold text-emerald-600">${project.finalCost.toLocaleString()}</p>
                    </div>
                  </div>
                )}
                {project.completionDate && (
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[11px] text-muted-foreground">Completed</p>
                      <p className="text-[13.5px] font-medium text-foreground">
                        {new Date(project.completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground mb-3">Description</h2>
            <p className="text-[14px] text-foreground leading-[1.85]">{project.description}</p>
          </div>

          {/* Assigned contractor */}
          {project.contractorName && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground mb-4">Assigned Contractor</h2>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{project.contractorName}</p>
                  <p className="text-[12px] text-muted-foreground">Verified contractor · Nexus Operations network</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Link
              href="/dashboard/homeowner"
              className="px-5 py-2.5 rounded-xl border border-border text-[13px] font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              Back to Dashboard
            </Link>
            <Link
              href="/dashboard/homeowner/new-request"
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-[13px] font-semibold hover:opacity-90 transition-opacity"
            >
              Post New Request
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
