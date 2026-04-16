'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from '@/lib/router'
import { Loader2, AlertCircle, CalendarDays } from 'lucide-react'
import { DashboardNav } from '@/components/dashboard-nav'
import { formatDateOnly } from '@/lib/date-format'

type PipelineProject = {
  id: string
  title: string
  category: string
  status: string
  createdAt: string
  preferredDate: string | null
}

const STAGES = [
  { id: 'open', label: 'Submitted' },
  { id: 'claimed', label: 'Matched' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'completed', label: 'Completed' },
]

export default function HomeownerPipelinePage() {
  const router = useRouter()
  const [userName, setUserName] = useState('User')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [projects, setProjects] = useState<PipelineProject[]>([])

  useEffect(() => {
    async function load() {
      try {
        const authRes = await fetch('/api/auth/me')
        if (!authRes.ok) {
          router.push('/auth/login')
          return
        }

        const authData = await authRes.json()
        if (authData.user?.role !== 'homeowner') {
          router.push('/dashboard/contractor')
          return
        }
        setUserName(authData.user?.name ?? 'Homeowner')

        const res = await fetch('/api/projects/list?pipeline=true')
        const data = await res.json()

        if (!res.ok) {
          const requestId = typeof data.requestId === 'string' ? ` (Ref: ${data.requestId})` : ''
          setError((data.error || 'Unable to load your pipeline') + requestId)
          return
        }

        setProjects(Array.isArray(data.projects) ? data.projects : [])
      } catch (err) {
        console.error(err)
        setError('Unable to load your pipeline right now. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [router])

  const projectsByStage = useMemo(() => {
    const grouped = new Map<string, PipelineProject[]>()
    STAGES.forEach(stage => grouped.set(stage.id, []))
    projects.forEach(project => {
      const key = STAGES.some(stage => stage.id === project.status) ? project.status : 'open'
      grouped.get(key)?.push(project)
    })
    return grouped
  }, [projects])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={userName} role="homeowner" onLogout={async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        router.push('/auth/login')
      }} />

      <main className="md:ml-[220px] p-5 md:p-7">
        <div className="max-w-6xl mx-auto space-y-5">
          <div>
            <h1 className="text-xl font-bold text-foreground">Request Pipeline</h1>
            <p className="text-muted-foreground text-[12.5px] mt-1">
              Track service requests across matching, handling, documentation, and billing milestones.
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-4 rounded-xl border border-destructive/30 bg-destructive/8 text-destructive text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {STAGES.map(stage => (
              <section key={stage.id} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-[12px] font-bold uppercase tracking-wide text-foreground">{stage.label}</h2>
                  <span className="text-[11px] text-muted-foreground">{projectsByStage.get(stage.id)?.length ?? 0}</span>
                </div>
                <div className="space-y-2.5 min-h-[120px]">
                  {(projectsByStage.get(stage.id) ?? []).map(project => (
                    <article key={project.id} className="rounded-xl border border-border bg-background p-3">
                      <p className="text-[12.5px] font-semibold text-foreground line-clamp-2">{project.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        {project.category.replace(/-/g, ' ')}
                      </p>
                      {project.preferredDate && (
                        <p className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
                          <CalendarDays className="w-3 h-3" />
                          {formatDateOnly(project.preferredDate)}
                        </p>
                      )}
                    </article>
                  ))}
                  {(projectsByStage.get(stage.id)?.length ?? 0) === 0 && (
                    <p className="text-[11px] text-muted-foreground">No requests in this stage.</p>
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
