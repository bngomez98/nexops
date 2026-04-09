'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  type Category,
  type Job,
  type JobStatus,
  type PortalUser,
  type Priority,
  type Role,
  STATUS_FLOW,
} from './portal-types'

interface NewRequestInput {
  title: string
  description: string
  category: Category
  priority: Priority
  location: string
  photoCount: number
}

interface PortalContextValue {
  currentUser: PortalUser
  users: PortalUser[]
  jobs: Job[]
  loading: boolean
  submitRequest: (input: NewRequestInput) => Promise<Job | null>
  advanceStatus: (jobId: string) => Promise<void>
  assignContractor: (jobId: string, contractorId: string) => Promise<void>
  postMessage: (jobId: string, body: string) => Promise<void>
  refreshJob: (jobId: string) => Promise<Job | null>
}

const PortalContext = createContext<PortalContextValue | null>(null)

const DEFAULT_USER: PortalUser = {
  id: 'unknown',
  name: 'User',
  email: '',
  phone: '',
  role: 'homeowner',
  avatarColor: 'from-indigo-400 to-blue-500',
  initials: 'U',
}

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<PortalUser>(DEFAULT_USER)
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  const users = useMemo(() => {
    const map = new Map<string, PortalUser>()
    map.set(currentUser.id, currentUser)
    for (const job of jobs) {
      if (job.contractorId && job.contractorName) {
        map.set(job.contractorId, {
          id: job.contractorId,
          name: job.contractorName,
          email: '',
          phone: '',
          role: 'contractor',
          avatarColor: 'from-amber-400 to-orange-500',
          initials: initialsFrom(job.contractorName),
        })
      }
    }
    return Array.from(map.values())
  }, [currentUser, jobs])

  const loadJobs = useCallback(async (role: Role) => {
    const type = role === 'contractor' ? 'my-projects' : 'my-projects'
    const res = await fetch(`/api/projects/list?type=${type}`, { credentials: 'include' })
    if (!res.ok) throw new Error('Failed to load projects')
    const payload = await res.json() as { projects?: ApiProject[] }
    setJobs((payload.projects ?? []).map(mapApiProjectToJob))
  }, [])

  const loadSession = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' })
      if (!res.ok) throw new Error('Not authenticated')
      const data = await res.json() as {
        user: { id: string; name: string; email: string; phone: string; role: string }
      }
      const role = mapRole(data.user.role)
      setCurrentUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone ?? '',
        role,
        avatarColor: avatarFromRole(role),
        initials: initialsFrom(data.user.name),
      })
      await loadJobs(role)
    } catch {
      setCurrentUser(DEFAULT_USER)
      setJobs([])
    } finally {
      setLoading(false)
    }
  }, [loadJobs])

  useEffect(() => {
    void loadSession()
  }, [loadSession])

  const refreshJob = useCallback(async (jobId: string): Promise<Job | null> => {
    const detailRes = await fetch(`/api/projects/${jobId}`, { credentials: 'include' })
    if (!detailRes.ok) return null
    const detailData = await detailRes.json() as { project?: ApiProjectDetail }

    const messagesRes = await fetch(`/api/messages/${jobId}`, { credentials: 'include' })
    const messagesData = messagesRes.ok
      ? await messagesRes.json() as { messages?: ApiMessage[] }
      : { messages: [] }

    const updated = mapApiProjectDetailToJob(detailData.project, messagesData.messages ?? [])
    if (!updated) return null
    setJobs((prev) => {
      const idx = prev.findIndex((j) => j.id === jobId)
      if (idx === -1) return [updated, ...prev]
      const next = [...prev]
      next[idx] = updated
      return next
    })
    return updated
  }, [])

  const submitRequest = useCallback(
    async (input: NewRequestInput): Promise<Job | null> => {
      const res = await fetch('/api/projects/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          category: input.category,
          title: input.title,
          description: input.description,
          location: input.location,
          budget: '',
          preferredDate: new Date().toISOString().slice(0, 10),
        }),
      })
      if (!res.ok) return null
      const data = await res.json() as { project?: { id: string } }
      if (!data.project?.id) return null
      return await refreshJob(data.project.id)
    },
    [refreshJob],
  )

  const advanceStatus = useCallback(async (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId)
    if (!job) return
    const nextRawStatus = nextDbStatus(job.rawStatus)
    if (!nextRawStatus) return
    const res = await fetch(`/api/projects/${jobId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status: nextRawStatus }),
    })
    if (res.ok) {
      const idx = STATUS_FLOW.indexOf(job.status)
      const next = STATUS_FLOW[Math.min(idx + 1, STATUS_FLOW.length - 1)]
      setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, status: next, rawStatus: nextRawStatus } : j)))
    }
  }, [jobs])

  const assignContractor = useCallback(async (jobId: string, _contractorId: string) => {
    const res = await fetch(`/api/projects/claim/${jobId}`, {
      method: 'POST',
      credentials: 'include',
    })
    if (res.ok) {
      await refreshJob(jobId)
    }
  }, [])

  const postMessage = useCallback(
    async (jobId: string, body: string) => {
      const trimmed = body.trim()
      if (!trimmed) return
      const job = jobs.find((j) => j.id === jobId)
      if (!job) return
      const recipientId =
        currentUser.role === 'contractor' ? job.homeownerId : (job.contractorId ?? '')
      if (!recipientId) return
      const res = await fetch(`/api/messages/${jobId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: trimmed, recipient_id: recipientId }),
      })
      if (res.ok) {
        await refreshJob(jobId)
      }
    },
    [currentUser, jobs, refreshJob],
  )

  const value = useMemo<PortalContextValue>(
    () => ({
      currentUser,
      users,
      jobs,
      loading,
      submitRequest,
      advanceStatus,
      assignContractor,
      postMessage,
      refreshJob,
    }),
    [currentUser, users, jobs, loading, submitRequest, advanceStatus, assignContractor, postMessage, refreshJob],
  )

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>
}

export function usePortal(): PortalContextValue {
  const ctx = useContext(PortalContext)
  if (!ctx) throw new Error('usePortal must be used within PortalProvider')
  return ctx
}

export type { Role }

interface ApiProject {
  id: string
  title?: string
  description?: string
  category?: string
  location?: string
  status?: string
  rawStatus?: string
  createdAt?: string
  ownerId?: string
  assignedContractorId?: string | null
  contractorName?: string | null
}

interface ApiProjectDetail extends ApiProject {
  assignedContractorId?: string | null
  contractorName?: string | null
}

interface ApiMessage {
  id: string
  authorId?: string
  authorName?: string
  body?: string
  timestamp?: string
  sender_id?: string
  content?: string
  created_at?: string
}

function mapRole(role: string): Role {
  if (role === 'property-manager') return 'manager'
  if (role === 'admin' || role === 'contractor' || role === 'manager') return role
  return 'homeowner'
}

function mapApiStatusToPortal(status?: string): JobStatus {
  if (status === 'claimed' || status === 'assigned') return 'assigned'
  if (status === 'in-progress' || status === 'in_progress' || status === 'consultation_scheduled') {
    return 'in_progress'
  }
  if (status === 'completed' || status === 'declined' || status === 'cancelled') return 'complete'
  return 'pending'
}

function mapApiProjectToJob(project: ApiProject): Job {
  const category = normalizeCategory(project.category)
  return {
    id: project.id,
    shortId: project.id.slice(0, 8),
    title: project.title ?? category,
    description: project.description ?? '',
    category,
    priority: 'normal',
    status: mapApiStatusToPortal(project.status),
    rawStatus: project.rawStatus ?? project.status,
    location: project.location ?? 'N/A',
    createdAt: project.createdAt ?? new Date().toISOString(),
    homeownerId: project.ownerId ?? '',
    contractorId: project.assignedContractorId ?? undefined,
    contractorName: project.contractorName ?? undefined,
    messages: [],
  }
}

function mapApiProjectDetailToJob(project?: ApiProjectDetail, messages: ApiMessage[] = []): Job | null {
  if (!project) return null
  const base = mapApiProjectToJob(project)
  return {
    ...base,
    messages: messages.map((m) => ({
      id: m.id,
      authorId: m.authorId ?? m.sender_id ?? '',
      authorName: m.authorName ?? 'User',
      body: m.body ?? m.content ?? '',
      timestamp: m.timestamp ?? m.created_at ?? new Date().toISOString(),
    })),
  }
}

function initialsFrom(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  return (words[0]?.[0] ?? 'U') + (words[1]?.[0] ?? '')
}

function avatarFromRole(role: Role) {
  if (role === 'admin') return 'from-indigo-400 to-blue-500'
  if (role === 'contractor') return 'from-amber-400 to-orange-500'
  if (role === 'manager') return 'from-emerald-400 to-teal-500'
  return 'from-sky-400 to-cyan-500'
}

function normalizeCategory(category?: string): Category {
  if (category === 'electrical' || category === 'hvac' || category === 'landscaping' || category === 'cleaning' || category === 'handyman' || category === 'other') {
    return category
  }
  if (category === 'plumbing') return category
  return 'other'
}

function nextDbStatus(rawStatus?: string) {
  if (rawStatus === 'pending_review') return 'in_queue'
  if (rawStatus === 'in_queue') return 'assigned'
  if (rawStatus === 'assigned') return 'consultation_scheduled'
  if (rawStatus === 'consultation_scheduled') return 'in_progress'
  if (rawStatus === 'in_progress') return 'completed'
  return null
}
