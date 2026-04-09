'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  STATUS_FLOW,
import {
  type Category,
  type Job,
  type JobStatus,
  type PortalUser,
  type Priority,
  type Role,
} from './mock-data'
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
  error: string | null
  submitRequest: (input: NewRequestInput) => Promise<Job>
  advanceStatus: (jobId: string) => Promise<void>
  assignContractor: (jobId: string, contractorId: string) => Promise<void>
  postMessage: (jobId: string, body: string) => Promise<void>
  reload: () => Promise<void>
  submitRequest: (input: NewRequestInput) => Promise<Job | null>
  advanceStatus: (jobId: string) => Promise<void>
  assignContractor: (jobId: string, contractorId: string) => Promise<void>
  postMessage: (jobId: string, body: string) => Promise<void>
  refreshJob: (jobId: string) => Promise<Job | null>
}

const PortalContext = createContext<PortalContextValue | null>(null)

const FALLBACK_USER: PortalUser = {
const DEFAULT_USER: PortalUser = {
  id: 'unknown',
  name: 'User',
  email: '',
  phone: '',
  role: 'homeowner',
  avatarColor: 'from-indigo-400 to-blue-500',
  initials: 'U',
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'U'
}

function toRole(value: string | null | undefined): Role {
  if (value === 'property_manager' || value === 'manager') return 'manager'
  if (value === 'contractor' || value === 'admin' || value === 'homeowner') return value
  return 'homeowner'
}

function toPriority(source: string): Priority {
  const s = source.toLowerCase()
  if (s.includes('urgent') || s.includes('emergency')) return 'urgent'
  if (s.includes('high')) return 'high'
  if (s.includes('low')) return 'low'
  return 'normal'
}

function toCategory(source: string): Category {
  const s = source.toLowerCase()
  if (
    s === 'plumbing' ||
    s === 'electrical' ||
    s === 'hvac' ||
    s === 'landscaping' ||
    s === 'cleaning' ||
    s === 'handyman'
  ) {
    return s
  }
  return 'other'
}

function toUiStatus(status: string): JobStatus {
  if (status === 'assigned' || status === 'consultation_scheduled') return 'assigned'
  if (status === 'in_progress') return 'in_progress'
  if (status === 'completed') return 'complete'
  return 'pending'
}

function toDbStatus(status: JobStatus): string {
  if (status === 'assigned') return 'assigned'
  if (status === 'in_progress') return 'in_progress'
  if (status === 'complete') return 'completed'
  return 'pending_review'
}

function titleFromNotes(notes: string | null, category: string) {
  if (!notes) return category
  return notes.split('\n')[0].trim() || category
}

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), [])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [users, setUsers] = useState<PortalUser[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadPortalData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser()
      if (authError || !authData.user) {
        throw new Error('Not authenticated')
      }

      const authUser = authData.user
      const { data: profileById } = await supabase
        .from('profiles')
        .select('id, full_name, role, phone, avatar_url, average_rating, reviews_count')
        .eq('id', authUser.id)
        .maybeSingle()

      const me: PortalUser = {
        id: authUser.id,
        name: profileById?.full_name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
        email: authUser.email ?? '',
        phone: profileById?.phone ?? '',
        role: toRole(profileById?.role ?? authUser.user_metadata?.role),
        avatarColor: 'from-indigo-400 to-blue-500',
        initials: initials(profileById?.full_name || authUser.email || 'User'),
        rating: profileById?.average_rating ?? undefined,
        jobsCompleted: profileById?.reviews_count ?? undefined,
      }

      setCurrentUserId((prev) => prev ?? me.id)

      const { data: visibleUsersData } = await supabase
        .from('profiles')
        .select('id, full_name, role, phone, average_rating, reviews_count, is_active')
        .eq('is_active', true)
        .limit(50)

      const visibleUsers: PortalUser[] = (visibleUsersData ?? [])
        .map((p) => ({
          id: p.id,
          name: p.full_name || 'User',
          email: '',
          phone: p.phone ?? '',
          role: toRole(p.role),
          avatarColor: 'from-sky-400 to-cyan-500',
          initials: initials(p.full_name || 'User'),
          rating: p.average_rating ?? undefined,
          jobsCompleted: p.reviews_count ?? undefined,
        }))
        .filter((u) => u.id !== me.id)

      const allUsers = [me, ...visibleUsers]
      setUsers(allUsers)

      const activeUser = allUsers.find((u) => u.id === (currentUserId ?? me.id)) ?? me
      let query = supabase
        .from('service_requests')
        .select('id, owner_id, assigned_contractor_id, category, description, additional_notes, address, status, created_at, consultation_date')
        .order('created_at', { ascending: false })
        .limit(100)

      if (activeUser.role === 'contractor') {
        query = query.eq('assigned_contractor_id', activeUser.id)
      } else if (activeUser.role !== 'admin') {
        query = query.eq('owner_id', activeUser.id)
      }

      const { data: requestRows, error: requestsError } = await query
      if (requestsError) throw requestsError

      const requestIds = (requestRows ?? []).map((r) => r.id)

      let messagesByRequest = new Map<string, Array<{ id: string; sender_id: string; body: string; created_at: string }>>()
      if (requestIds.length > 0) {
        const { data: rows } = await supabase
          .from('messages')
          .select('id, request_id, sender_id, body, created_at')
          .in('request_id', requestIds)
          .order('created_at', { ascending: true })

        for (const row of rows ?? []) {
          const list = messagesByRequest.get(row.request_id) ?? []
          list.push({
            id: row.id,
            sender_id: row.sender_id,
            body: row.body,
            created_at: row.created_at,
          })
          messagesByRequest.set(row.request_id, list)
        }
      }

      const userNameById = new Map(allUsers.map((u) => [u.id, u.name]))

      const mappedJobs: Job[] = (requestRows ?? []).map((r) => {
        const messages = (messagesByRequest.get(r.id) ?? []).map((m) => ({
          id: m.id,
          authorId: m.sender_id,
          authorName: userNameById.get(m.sender_id) ?? 'User',
          body: m.body,
          timestamp: m.created_at,
        }))
        return {
          id: r.id,
          shortId: r.id.slice(0, 8),
          title: titleFromNotes(r.additional_notes, r.category),
          description: r.description,
          category: toCategory(r.category),
          priority: toPriority(r.additional_notes || r.description),
          status: toUiStatus(r.status),
          location: r.address,
          createdAt: r.created_at,
          scheduledFor: r.consultation_date ?? undefined,
          homeownerId: r.owner_id,
          contractorId: r.assigned_contractor_id ?? undefined,
          photos: [],
          messages,
        }
      })

      setJobs(mappedJobs)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load portal data')
      setUsers([FALLBACK_USER])
      setJobs([])
    } finally {
      setLoading(false)
    }
  }, [supabase, currentUserId])

  useEffect(() => {
    void loadPortalData()
  }, [loadPortalData])

  const currentUser = useMemo(
    () => users.find((u) => u.id === currentUserId) ?? users[0] ?? FALLBACK_USER,
    [users, currentUserId],
  )

  const submitRequest = useCallback(
    async (input: NewRequestInput): Promise<Job> => {
      const payload = {
        owner_id: currentUser.id,
        category: input.category,
        description: input.description,
        additional_notes: input.title,
        address: input.location,
        city: 'Topeka',
        state: 'KS',
        zip_code: '66603',
        status: 'pending_review',
      }

      const { data, error: insertError } = await supabase
        .from('service_requests')
        .insert(payload)
        .select('id, owner_id, assigned_contractor_id, category, description, additional_notes, address, status, created_at, consultation_date')
        .single()

      if (insertError || !data) {
        throw new Error(insertError?.message || 'Failed to submit request')
      }

      const newJob: Job = {
        id: data.id,
        shortId: data.id.slice(0, 8),
        title: titleFromNotes(data.additional_notes, data.category),
        description: data.description,
        category: toCategory(data.category),
        priority: input.priority,
        status: toUiStatus(data.status),
        location: data.address,
        createdAt: data.created_at,
        scheduledFor: data.consultation_date ?? undefined,
        homeownerId: data.owner_id,
        contractorId: data.assigned_contractor_id ?? undefined,
        photos: [],
        messages: [],
      }

      setJobs((prev) => [newJob, ...prev])
      return newJob
    },
    [supabase, currentUser.id],

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

    const idx = STATUS_FLOW.indexOf(job.status)
    const nextStatus = STATUS_FLOW[Math.min(idx + 1, STATUS_FLOW.length - 1)]
    if (nextStatus === job.status) return

    const { error: updateError } = await supabase
      .from('service_requests')
      .update({ status: toDbStatus(nextStatus), status_reason: null })
      .eq('id', jobId)

    if (updateError) throw new Error(updateError.message)

    setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, status: nextStatus } : j)))
  }, [jobs, supabase])

  const assignContractor = useCallback(async (jobId: string, contractorId: string) => {
    const { error: updateError } = await supabase
      .from('service_requests')
      .update({
        assigned_contractor_id: contractorId,
        status: 'assigned',
      })
      .eq('id', jobId)

    if (updateError) throw new Error(updateError.message)

    setJobs((prev) =>
      prev.map((j) => {
        if (j.id !== jobId) return j
        return { ...j, contractorId, status: j.status === 'pending' ? 'assigned' : j.status }
      }),
    )
  }, [supabase])

  const postMessage = useCallback(async (jobId: string, body: string) => {
    const trimmed = body.trim()
    if (!trimmed) return

    const { data, error: insertError } = await supabase
      .from('messages')
      .insert({
        request_id: jobId,
        sender_id: currentUser.id,
        body: trimmed,
      })
      .select('id, request_id, sender_id, body, created_at')
      .single()

    if (insertError || !data) {
      throw new Error(insertError?.message || 'Failed to post message')
    }

    setJobs((prev) =>
      prev.map((j) => {
        if (j.id !== jobId) return j
        return {
          ...j,
          messages: [
            ...j.messages,
            {
              id: data.id,
              authorId: data.sender_id,
              authorName: currentUser.name,
              body: data.body,
              timestamp: data.created_at,
            },
          ],
        }
      }),
    )
  }, [supabase, currentUser.id, currentUser.name])
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
      setCurrentUserId,
      users,
      jobs,
      loading,
      error,
      users,
      jobs,
      loading,
      submitRequest,
      advanceStatus,
      assignContractor,
      postMessage,
      reload: loadPortalData,
    }),
    [currentUser, users, jobs, loading, error, submitRequest, advanceStatus, assignContractor, postMessage, loadPortalData],
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
