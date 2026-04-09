'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  STATUS_FLOW,
  STATUS_LABEL,
  avatarGradient,
  buildInitials,
  formatRelative,
  mapUrgencyToPriority,
  type PortalConversation,
  type PortalJob,
  type PortalJobStatus,
  type PortalPriority,
  type PortalRole,
  type PortalUser,
} from './portal-utils'

interface PortalNotification {
  id: string
  title: string
  body?: string | null
  type?: string | null
  read: boolean
  link?: string | null
  created_at: string
}

interface PortalMessage {
  id: string
  sender_id: string
  recipient_id: string
  content: string
  created_at: string
  read_at?: string | null
  sender_name?: string | null
}

interface NewRequestInput {
  title: string
  description: string
  category: string
  priority: PortalPriority
  location: string
  preferredDate: string
  budget?: string
  photoUrls?: string[]
  accessRequirements?: string
}

interface PortalContextValue {
  currentUser: PortalUser | null
  jobs: PortalJob[]
  notifications: PortalNotification[]
  conversations: PortalConversation[]
  loading: boolean
  error: string | null
  refreshJobs: () => Promise<void>
  refreshNotifications: () => Promise<void>
  markNotificationRead: (id: string) => Promise<void>
  markAllNotificationsRead: () => Promise<void>
  submitRequest: (input: NewRequestInput) => Promise<PortalJob | null>
  claimJob: (jobId: string) => Promise<void>
  advanceStatus: (jobId: string) => Promise<void>
  postMessage: (jobId: string, body: string) => Promise<PortalMessage | null>
}

const PortalContext = createContext<PortalContextValue | null>(null)

function toShortId(id: string) {
  return id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase()
}

function mapPortalStatus(status: string): PortalJobStatus {
  if (status === 'claimed') return 'claimed'
  if (status === 'in-progress') return 'in-progress'
  if (status === 'completed') return 'completed'
  if (status === 'cancelled') return 'cancelled'
  return 'open'
}

function nextRawStatus(rawStatus?: string | null) {
  const flow: Record<string, string> = {
    pending_review: 'in_queue',
    in_queue: 'assigned',
    assigned: 'consultation_scheduled',
    consultation_scheduled: 'in_progress',
    in_progress: 'completed',
  }
  if (!rawStatus) return null
  return flow[rawStatus] ?? null
}

function priorityToUrgency(priority: PortalPriority) {
  if (priority === 'urgent') return 'urgent'
  if (priority === 'high') return 'high'
  if (priority === 'low') return 'low'
  return 'normal'
}

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<PortalUser | null>(null)
  const [jobs, setJobs] = useState<PortalJob[]>([])
  const [notifications, setNotifications] = useState<PortalNotification[]>([])
  const [conversations, setConversations] = useState<PortalConversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadCurrentUser = useCallback(async () => {
    const res = await fetch('/api/auth/me')
    if (!res.ok) {
      throw new Error('Unable to load user')
    }
    const data = await res.json()
    const name = data.user?.name ?? 'User'
    const role: PortalRole = data.user?.role ?? 'homeowner'
    return {
      id: data.user?.id ?? '',
      name,
      email: data.user?.email ?? '',
      phone: data.user?.phone ?? null,
      role,
      initials: buildInitials(name),
      avatarColor: avatarGradient(name),
      avatarUrl: data.user?.avatarUrl ?? null,
    } satisfies PortalUser
  }, [])

  const mapProject = useCallback((project: Record<string, any>) => {
    const title = project.title || project.category || 'Service request'
    const status = mapPortalStatus(project.status)
    return {
      id: project.id,
      shortId: toShortId(project.id),
      title,
      description: project.description ?? '',
      category: project.category ?? 'general',
      priority: mapUrgencyToPriority(project.urgency),
      status,
      rawStatus: project.rawStatus ?? project.status ?? null,
      location: project.location ?? 'On file',
      createdAt: project.createdAt,
      preferredDate: project.preferredDate ?? null,
      ownerId: project.ownerId ?? null,
      ownerName: project.ownerName ?? null,
      contractorId: project.assignedContractorId ?? null,
      contractorName: project.contractorName ?? null,
      photoUrls: Array.isArray(project.photoUrls) ? project.photoUrls : [],
      invoiceAmount: project.invoiceAmount ?? null,
      invoicePaid: project.invoicePaid ?? false,
      finalCost: project.finalCost ?? null,
    } satisfies PortalJob
  }, [])

  const loadJobs = useCallback(async (user: PortalUser) => {
    const types: string[] = []
    if (user.role === 'contractor') {
      types.push('available', 'my-projects')
    } else if (user.role === 'admin' || user.role === 'property-manager' || user.role === 'manager') {
      types.push('all')
    } else {
      types.push('my-projects')
    }

    const responses = await Promise.all(
      types.map((type) => fetch(`/api/projects/list?type=${encodeURIComponent(type)}`)),
    )

    const jsons = await Promise.all(
      responses.map(async (res) => {
        if (!res.ok) return { projects: [] }
        return res.json()
      }),
    )

    const merged = jsons.flatMap((payload) => payload.projects ?? [])
    const unique = new Map<string, PortalJob>()
    for (const project of merged) {
      unique.set(project.id, mapProject(project))
    }
    setJobs(Array.from(unique.values()))
  }, [mapProject])

  const loadNotifications = useCallback(async () => {
    const res = await fetch('/api/notifications')
    if (!res.ok) return
    const data = await res.json()
    setNotifications(data.notifications ?? [])
  }, [])

  const loadConversations = useCallback(async () => {
    const res = await fetch('/api/messages')
    if (!res.ok) return
    const data = await res.json()
    const conversations: PortalConversation[] = (data.conversations ?? []).map((c: Record<string, any>) => ({
      jobId: c.job_id,
      jobTitle: c.job_title ?? 'Project',
      otherUserName: c.other_user_name ?? 'Unknown',
      lastMessage: c.last_message ?? '',
      lastMessageAt: c.last_message_at ?? '',
      unreadCount: c.unread_count ?? 0,
    }))
    setConversations(conversations)
  }, [])

  const refreshJobs = useCallback(async () => {
    if (!currentUser) return
    await loadJobs(currentUser)
  }, [currentUser, loadJobs])

  const refreshNotifications = useCallback(async () => {
    await loadNotifications()
    await loadConversations()
  }, [loadNotifications, loadConversations])

  const markNotificationRead = useCallback(async (id: string) => {
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    await loadNotifications()
  }, [loadNotifications])

  const markAllNotificationsRead = useCallback(async () => {
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markAllRead: true }),
    })
    await loadNotifications()
  }, [loadNotifications])

  const submitRequest = useCallback(async (input: NewRequestInput) => {
    if (!currentUser) return null
    const payload = {
      category: input.category,
      title: input.title,
      description: input.description,
      location: input.location,
      budget: input.budget ?? '',
      preferredDate: input.preferredDate,
      urgency: priorityToUrgency(input.priority),
      photoUrls: input.photoUrls ?? [],
      accessRequirements: input.accessRequirements ?? '',
    }
    const res = await fetch('/api/projects/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error ?? 'Unable to submit request')
    }
    await loadJobs(currentUser)
    const data = await res.json().catch(() => null)
    const createdId = data?.project?.id
    const created = createdId ? jobs.find((job) => job.id === createdId) ?? null : null
    return created
  }, [currentUser, jobs, loadJobs])

  const claimJob = useCallback(async (jobId: string) => {
    const res = await fetch(`/api/projects/claim/${jobId}`, { method: 'POST' })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error ?? 'Unable to claim job')
    }
    await refreshJobs()
  }, [refreshJobs])

  const advanceStatus = useCallback(async (jobId: string) => {
    const job = jobs.find((item) => item.id === jobId)
    if (!job || !job.rawStatus) return
    const nextStatus = nextRawStatus(job.rawStatus)
    if (!nextStatus) return
    let res = await fetch('/api/automation/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId: job.id, newStatus: nextStatus }),
    })
    if (res.status === 403) {
      res = await fetch(`/api/projects/${job.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      })
    }
    if (!res.ok) return
    setJobs((prev) =>
      prev.map((item) =>
        item.id === job.id
          ? {
              ...item,
              rawStatus: nextStatus,
              status: mapPortalStatus(nextStatus),
            }
          : item,
      ),
    )
  }, [jobs])

  const postMessage = useCallback(async (jobId: string, body: string) => {
    const job = jobs.find((item) => item.id === jobId)
    if (!job || !currentUser) return null
    const recipientId =
      currentUser.role === 'contractor'
        ? job.ownerId
        : job.contractorId
    if (!recipientId) return null
    const res = await fetch(`/api/messages/${jobId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: body, recipient_id: recipientId }),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.message ?? null
  }, [currentUser, jobs])

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const user = await loadCurrentUser()
        if (!active) return
        setCurrentUser(user)
        await Promise.all([loadJobs(user), loadNotifications(), loadConversations()])
      } catch (err) {
        if (!active) return
        setError(err instanceof Error ? err.message : 'Unable to load portal')
      } finally {
        if (active) setLoading(false)
      }
    }
    void load()
    const interval = window.setInterval(() => {
      if (currentUser) {
        void refreshNotifications()
      }
    }, 60000)
    return () => {
      active = false
      window.clearInterval(interval)
    }
  }, [loadCurrentUser, loadJobs, loadNotifications, loadConversations, currentUser, refreshNotifications])

  const value = useMemo<PortalContextValue>(
    () => ({
      currentUser,
      jobs,
      notifications,
      conversations,
      loading,
      error,
      refreshJobs,
      refreshNotifications,
      markNotificationRead,
      markAllNotificationsRead,
      submitRequest,
      claimJob,
      advanceStatus,
      postMessage,
    }),
    [
      currentUser,
      jobs,
      notifications,
      conversations,
      loading,
      error,
      refreshJobs,
      refreshNotifications,
      markNotificationRead,
      markAllNotificationsRead,
      submitRequest,
      claimJob,
      advanceStatus,
      postMessage,
    ],
  )

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>
}

export function usePortal(): PortalContextValue {
  const ctx = useContext(PortalContext)
  if (!ctx) throw new Error('usePortal must be used within PortalProvider')
  return ctx
}

export { STATUS_FLOW, STATUS_LABEL, formatRelative }
