'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { ReactNode } from 'react'

import {
  STATUS_FLOW,
  buildInitials,
  avatarGradient,
  mapUrgencyToPriority,
  formatRelative,
} from './portal-utils'
import type {
  PortalUser,
  PortalJob,
  PortalJobStatus,
  PortalPriority,
  PortalRole,
  PortalConversation,
} from './portal-utils'

export { formatRelative }

/* ── Local interfaces ─────────────────────────────────────────────────────── */

export interface PortalNotification {
  id: string
  title: string
  body: string
  read: boolean
  createdAt: string
  jobId?: string | null
}

export interface PortalMessage {
  id: string
  jobId: string
  senderId: string
  senderName: string
  body: string
  createdAt: string
}

export interface NewRequestInput {
  title: string
  description: string
  category: string
  priority: PortalPriority
  location: string
  photoCount?: number
  preferredDate?: string
  budget?: string
  photoUrls?: string[]
  accessRequirements?: string
}

export interface PortalPreferences {
  notifyMessages: boolean
  notifyStatus: boolean
  notifyPayments: boolean
}

/* ── Context value shape ──────────────────────────────────────────────────── */

interface PortalContextValue {
  currentUser: PortalUser | null
  jobs: PortalJob[]
  notifications: PortalNotification[]
  conversations: PortalConversation[]
  preferences: PortalPreferences
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  refreshJobs: () => Promise<void>
  refreshNotifications: () => Promise<void>
  refreshJob: (jobId: string) => Promise<void>
  markNotificationRead: (id: string) => Promise<void>
  markAllNotificationsRead: () => Promise<void>
  submitRequest: (input: NewRequestInput) => Promise<PortalJob | null>
  claimJob: (jobId: string) => Promise<void>
  advanceStatus: (jobId: string) => Promise<void>
  assignContractor: (jobId: string, contractorId: string) => Promise<void>
  postMessage: (jobId: string, body: string) => Promise<PortalMessage | null>
  updateProfile: (fields: { name?: string; phone?: string; bio?: string; serviceCategories?: string[] }) => Promise<void>
  updateAvatar: (file: File) => Promise<string>
  updatePreferences: (prefs: Partial<PortalPreferences>) => Promise<void>
}

const PortalContext = createContext<PortalContextValue | undefined>(undefined)

/* ── Mapping helpers ──────────────────────────────────────────────────────── */

function toShortId(id: string): string {
  if (!id) return ''
  const clean = id.replace(/-/g, '')
  return `REQ-${clean.slice(0, 6).toUpperCase()}`
}

function mapPortalStatus(raw?: string | null): PortalJobStatus {
  if (!raw) return 'open'
  const lower = raw.toLowerCase().replace(/[_ ]/g, '-')
  if (lower === 'completed' || lower === 'complete' || lower === 'done' || lower === 'closed') return 'completed'
  if (lower === 'in-progress' || lower === 'in_progress' || lower === 'active') return 'in-progress'
  if (lower === 'claimed' || lower === 'assigned' || lower === 'accepted') return 'claimed'
  if (lower === 'cancelled' || lower === 'canceled') return 'cancelled'
  return 'open'
}

function mapPhotoUrls(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value
    .map((photo) => {
      if (typeof photo === 'string') return photo
      if (photo && typeof photo === 'object' && typeof (photo as { url?: unknown }).url === 'string') {
        return (photo as { url: string }).url
      }
      return null
    })
    .filter((photo): photo is string => Boolean(photo))
}

function mapProject(p: Record<string, unknown>): PortalJob {
  const status = mapPortalStatus(p.status as string | null | undefined)
  const invoice = (p.invoice && typeof p.invoice === 'object')
    ? (p.invoice as Record<string, unknown>)
    : null
  const invoiceAmountCents =
    typeof invoice?.amountCents === 'number'
      ? invoice.amountCents
      : typeof invoice?.amount_cents === 'number'
        ? invoice.amount_cents
        : null
  const invoicePaidByStatus =
    typeof invoice?.status === 'string' ? invoice.status.toLowerCase() === 'paid' : null

  return {
    id: (p.id as string | null | undefined) ?? '',
    shortId: toShortId((p.id as string | null | undefined) ?? ''),
    title: (p.title as string | null | undefined) ?? (p.name as string | null | undefined) ?? 'Untitled',
    description: (p.description as string | null | undefined) ?? '',
    category: (p.category as string | null | undefined) ?? (p.type as string | null | undefined) ?? 'general',
    priority: mapUrgencyToPriority((p.urgency as string | null | undefined) ?? (p.priority as string | null | undefined)),
    status,
    rawStatus: (p.status as string | null | undefined) ?? null,
    location: (p.location as string | null | undefined) ?? (p.address as string | null | undefined) ?? '',
    createdAt: (p.createdAt as string | null | undefined) ?? (p.created_at as string | null | undefined) ?? new Date().toISOString(),
    preferredDate: (p.preferredDate as string | null | undefined) ?? (p.preferred_date as string | null | undefined) ?? null,
    ownerId:
      (p.ownerId as string | null | undefined) ??
      (p.owner_id as string | null | undefined) ??
      (p.homeownerId as string | null | undefined) ??
      (p.homeowner_id as string | null | undefined) ??
      (p.userId as string | null | undefined) ??
      null,
    ownerName: (p.ownerName as string | null | undefined) ?? (p.owner_name as string | null | undefined) ?? null,
    contractorId: (p.contractorId as string | null | undefined) ?? (p.contractor_id as string | null | undefined) ?? null,
    contractorName: (p.contractorName as string | null | undefined) ?? (p.contractor_name as string | null | undefined) ?? null,
    photoUrls: mapPhotoUrls(p.photoUrls ?? p.photo_urls ?? p.photos),
    invoiceAmount:
      (p.invoiceAmount as number | null | undefined) ??
      (p.invoice_amount as number | null | undefined) ??
      (invoiceAmountCents != null ? invoiceAmountCents / 100 : null),
    invoicePaid:
      (typeof (p.invoicePaid ?? p.invoice_paid) === 'boolean'
        ? Boolean(p.invoicePaid ?? p.invoice_paid)
        : invoicePaidByStatus ?? false),
    finalCost: (p.finalCost as number | null | undefined) ?? (p.final_cost as number | null | undefined) ?? null,
  }
}

function mapUser(u: Record<string, unknown>): PortalUser {
  const name: string = (u.name as string | null | undefined) ?? (u.full_name as string | null | undefined) ?? 'User'
  return {
    id: (u.id as string | null | undefined) ?? '',
    name,
    email: (u.email as string | null | undefined) ?? '',
    phone: (u.phone as string | null | undefined) ?? null,
    bio: (u.bio as string | null | undefined) ?? null,
    role: ((u.role as string | null | undefined) ?? 'homeowner') as PortalRole,
    avatarUrl: (u.avatarUrl as string | null | undefined) ?? (u.avatar_url as string | null | undefined) ?? null,
    initials: buildInitials(name),
    avatarColor: avatarGradient(name),
    rating: (u.rating as number | null | undefined) ?? null,
    jobsCompleted: (u.jobsCompleted as number | null | undefined) ?? (u.jobs_completed as number | null | undefined) ?? null,
    serviceCategories: Array.isArray(u.serviceCategories ?? u.service_categories)
      ? (u.serviceCategories ?? u.service_categories) as string[]
      : [],
  }
}

function mapJobsFromBootstrap(data: Record<string, unknown>): PortalJob[] {
  const users = Array.isArray(data.users)
    ? data.users.filter((user): user is Record<string, unknown> => Boolean(user && typeof user === 'object'))
    : []
  const currentUser =
    data.currentUser && typeof data.currentUser === 'object'
      ? (data.currentUser as Record<string, unknown>)
      : null

  const namesById = new Map<string, string>()
  for (const user of users) {
    if (typeof user.id === 'string' && typeof user.name === 'string') {
      namesById.set(user.id, user.name)
    }
  }
  if (currentUser && typeof currentUser.id === 'string' && typeof currentUser.name === 'string') {
    namesById.set(currentUser.id, currentUser.name)
  }

  const rawJobs = Array.isArray(data.jobs)
    ? data.jobs.filter((job): job is Record<string, unknown> => Boolean(job && typeof job === 'object'))
    : []

  return rawJobs.map((raw) => {
    const mapped = mapProject(raw)
    const ownerId = mapped.ownerId
    const contractorId = mapped.contractorId
    return {
      ...mapped,
      ownerName: mapped.ownerName ?? (ownerId ? namesById.get(ownerId) ?? null : null),
      contractorName: mapped.contractorName ?? (contractorId ? namesById.get(contractorId) ?? null : null),
    }
  })
}

function toPortalStatusTransition(status: PortalJobStatus): string {
  if (status === 'claimed') return 'assigned'
  if (status === 'in-progress') return 'in_progress'
  if (status === 'completed') return 'completed'
  return 'pending'
}

/* ── JSON fetch helper ────────────────────────────────────────────────────── */

async function apiFetch<T>(url: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(opts?.headers as Record<string, string>) },
    ...opts,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(text || `Request failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

/* ── Provider ─────────────────────────────────────────────────────────────── */

const DEFAULT_PREFS: PortalPreferences = {
  notifyMessages: true,
  notifyStatus: true,
  notifyPayments: false,
}

export function PortalProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<PortalUser | null>(null)
  const [jobs, setJobs] = useState<PortalJob[]>([])
  const [notifications, setNotifications] = useState<PortalNotification[]>([])
  const [conversations, setConversations] = useState<PortalConversation[]>([])
  const [preferences, setPreferences] = useState<PortalPreferences>(DEFAULT_PREFS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  /* ── Data loaders ─────────────────────────────────────────────────────── */

  const loadUser = useCallback(async () => {
    try {
      // Prefer bootstrap which returns richer user data (serviceCategories, rating, preferences)
      const data = await apiFetch<Record<string, unknown>>('/api/portal/bootstrap')
      if (mountedRef.current) {
          const cu = data.currentUser
          if (cu && typeof cu === 'object') setCurrentUser(mapUser(cu as Record<string, unknown>))
          const prefs = data.preferences
          if (prefs && typeof prefs === 'object') {
            const p = prefs as Record<string, unknown>
            setPreferences({
              notifyMessages: Boolean(p.notifyMessages ?? true),
              notifyStatus: Boolean(p.notifyStatus ?? true),
              notifyPayments: Boolean(p.notifyPayments ?? false),
            })
          }
        }
    } catch {
      // Fallback to auth/me
      try {
        const data = await apiFetch<Record<string, unknown>>('/api/auth/me')
        if (mountedRef.current) setCurrentUser(mapUser(data))
      } catch {
        if (mountedRef.current) setCurrentUser(null)
      }
    }
  }, [])

  const refreshJobs = useCallback(async () => {
    try {
      const data = await apiFetch<Record<string, unknown>>('/api/portal/bootstrap')
      if (mountedRef.current) setJobs(mapJobsFromBootstrap(data))
    } catch {
      /* keep existing jobs on error */
    }
  }, [])

  const refreshNotifications = useCallback(async () => {
    try {
      const data = await apiFetch<Record<string, unknown>>('/api/notifications')
      const list: unknown[] = Array.isArray(data)
        ? data
        : Array.isArray((data as Record<string, unknown>).notifications)
          ? (data as Record<string, unknown>).notifications as unknown[]
          : []
      if (mountedRef.current) {
        setNotifications(
          list.map((item) => {
            const n = item as Record<string, unknown>
            return {
              id: (n.id as string | undefined) ?? '',
              title: (n.title as string | undefined) ?? '',
              body: (n.body as string | undefined) ?? (n.message as string | undefined) ?? '',
              read: Boolean(n.read ?? false),
              createdAt: (n.createdAt as string | undefined) ?? (n.created_at as string | undefined) ?? new Date().toISOString(),
              jobId: (n.jobId as string | undefined) ?? (n.job_id as string | undefined) ?? null,
            }
          }),
        )
      }
    } catch {
      /* keep existing */
    }
  }, [])

  const loadConversations = useCallback(async () => {
    try {
      const data = await apiFetch<Record<string, unknown>>('/api/messages')
      const list: unknown[] = Array.isArray(data)
        ? data
        : Array.isArray((data as Record<string, unknown>).conversations)
          ? (data as Record<string, unknown>).conversations as unknown[]
          : []
      if (mountedRef.current) {
        setConversations(
          list.map((item) => {
            const c = item as Record<string, unknown>
            return {
              jobId: (c.jobId as string | undefined) ?? (c.job_id as string | undefined) ?? '',
              jobTitle: (c.jobTitle as string | undefined) ?? (c.job_title as string | undefined) ?? '',
              otherUserName: (c.otherUserName as string | undefined) ?? (c.other_user_name as string | undefined) ?? '',
              lastMessage: (c.lastMessage as string | undefined) ?? (c.last_message as string | undefined) ?? '',
              lastMessageAt: (c.lastMessageAt as string | undefined) ?? (c.last_message_at as string | undefined) ?? '',
              unreadCount: (c.unreadCount as number | undefined) ?? (c.unread_count as number | undefined) ?? 0,
            }
          }),
        )
      }
    } catch {
      /* keep existing */
    }
  }, [])

  /* ── Initial load ─────────────────────────────────────────────────────── */

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await Promise.all([loadUser(), refreshJobs(), refreshNotifications(), loadConversations()])
    } catch (err) {
      if (mountedRef.current) setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [loadUser, refreshJobs, refreshNotifications, loadConversations])

  useEffect(() => {
    mountedRef.current = true
    refresh()
    return () => {
      mountedRef.current = false
    }
  }, [refresh])

  /* ── Poll notifications every 60 s ────────────────────────────────────── */

  useEffect(() => {
    const id = setInterval(refreshNotifications, 60_000)
    return () => clearInterval(id)
  }, [refreshNotifications])

  /* ── Refresh a single job ─────────────────────────────────────────────── */

  const refreshJob = useCallback(async (jobId: string) => {
    try {
      const data = await apiFetch<Record<string, unknown>>('/api/portal/bootstrap')
      const jobsFromBootstrap = mapJobsFromBootstrap(data)
      const updated = jobsFromBootstrap.find((job) => job.id === jobId)
      if (!updated) {
        await refreshJobs()
        return
      }
      if (mountedRef.current) {
        setJobs((prev) => prev.map((j) => (j.id === jobId ? updated : j)))
      }
    } catch {
      await refreshJobs()
    }
  }, [refreshJobs])

  /* ── Notification actions ─────────────────────────────────────────────── */

  const markNotificationRead = useCallback(async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    try {
      await apiFetch(`/api/notifications/${id}/read`, { method: 'POST' })
    } catch {
      /* optimistic update stays */
    }
  }, [])

  const markAllNotificationsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    try {
      await apiFetch('/api/notifications/read-all', { method: 'POST' })
    } catch {
      /* optimistic update stays */
    }
  }, [])

  /* ── Submit new request ───────────────────────────────────────────────── */

  const submitRequest = useCallback(
    async (input: NewRequestInput): Promise<PortalJob | null> => {
      try {
        const data = await apiFetch<Record<string, unknown>>('/api/portal/requests', {
          method: 'POST',
          body: JSON.stringify(input),
        })
        const projectData = data.job ?? data.project ?? data
        const raw = (typeof projectData === 'object' && projectData !== null)
          ? projectData as Record<string, unknown>
          : data
        const job = mapProject(raw)
        if (mountedRef.current) setJobs((prev) => [job, ...prev])
        return job
      } catch (err) {
        if (mountedRef.current) setError(err instanceof Error ? err.message : 'Failed to submit request')
        return null
      }
    },
    [],
  )

  /* ── Claim job ────────────────────────────────────────────────────────── */

  const claimJob = useCallback(
    async (jobId: string) => {
      await apiFetch(`/api/projects/claim/${jobId}`, { method: 'POST' })
      await refreshJob(jobId)
    },
    [refreshJob],
  )

  /* ── Assign contractor ────────────────────────────────────────────────── */

  const assignContractor = useCallback(
    async (jobId: string, contractorId: string) => {
      await apiFetch(`/api/portal/jobs/${jobId}/assign`, {
        method: 'POST',
        body: JSON.stringify({ contractorId }),
      })
      await refreshJob(jobId)
    },
    [refreshJob],
  )

  /* ── Advance status ───────────────────────────────────────────────────── */

  const advanceStatus = useCallback(
    async (jobId: string) => {
      const job = jobs.find((j) => j.id === jobId)
      if (!job) return
      const idx = STATUS_FLOW.indexOf(job.status)
      if (idx < 0 || idx >= STATUS_FLOW.length - 1) return
      const nextStatus = STATUS_FLOW[idx + 1]

      await apiFetch(`/api/portal/jobs/${jobId}/status`, {
        method: 'POST',
        body: JSON.stringify({ newStatus: toPortalStatusTransition(nextStatus) }),
      })

      await refreshJob(jobId)
    },
    [jobs, refreshJob],
  )

  /* ── Post message ─────────────────────────────────────────────────────── */

  const postMessage = useCallback(
    async (jobId: string, body: string): Promise<PortalMessage | null> => {
      try {
        const data = await apiFetch<Record<string, unknown>>(`/api/portal/jobs/${jobId}/messages`, {
          method: 'POST',
          body: JSON.stringify({ content: body }),
        })
        const messageData = data.message ?? data
        const m = (typeof messageData === 'object' && messageData !== null)
          ? messageData as Record<string, unknown>
          : data
        return {
          id: (m.id as string | undefined) ?? '',
          jobId: (m.jobId as string | undefined) ?? (m.job_id as string | undefined) ?? jobId,
          senderId: (m.senderId as string | undefined) ?? (m.sender_id as string | undefined) ?? currentUser?.id ?? '',
          senderName:
            (m.senderName as string | undefined) ??
            (m.sender_name as string | undefined) ??
            (m.authorName as string | undefined) ??
            currentUser?.name ??
            '',
          body: (m.body as string | undefined) ?? body,
          createdAt:
            (m.createdAt as string | undefined) ??
            (m.created_at as string | undefined) ??
            (m.timestamp as string | undefined) ??
            new Date().toISOString(),
        }
      } catch {
        return null
      }
    },
    [currentUser],
  )

  /* ── Update profile ───────────────────────────────────────────────────── */

  const updateProfile = useCallback(
    async (fields: { name?: string; phone?: string; bio?: string; serviceCategories?: string[] }) => {
      await apiFetch<Record<string, unknown>>('/api/portal/profile', {
        method: 'PUT',
        body: JSON.stringify(fields),
      })
      if (mountedRef.current) {
        setCurrentUser((prev) => {
          if (!prev) return prev
          const newName = fields.name ?? prev.name
          return {
            ...prev,
            name: newName,
            initials: buildInitials(newName),
            avatarColor: avatarGradient(newName),
            phone: fields.phone !== undefined ? fields.phone : prev.phone,
            bio: fields.bio !== undefined ? fields.bio : prev.bio,
            serviceCategories: fields.serviceCategories !== undefined ? fields.serviceCategories : prev.serviceCategories,
          }
        })
      }
    },
    [],
  )

  /* ── Update avatar ────────────────────────────────────────────────────── */

  const updateAvatar = useCallback(async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('bucket', 'profile-photos')

    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    if (!res.ok) {
      const text = await res.text().catch(() => res.statusText)
      throw new Error(text || 'Upload failed')
    }
    const uploadData = (await res.json()) as { url: string }

    await apiFetch<Record<string, unknown>>('/api/portal/profile', {
      method: 'PUT',
      body: JSON.stringify({ avatarUrl: uploadData.url }),
    })

    if (mountedRef.current) {
      setCurrentUser((prev) => (prev ? { ...prev, avatarUrl: uploadData.url } : prev))
    }
    return uploadData.url
  }, [])

  /* ── Update preferences ───────────────────────────────────────────────── */

  const updatePreferences = useCallback(async (prefs: Partial<PortalPreferences>) => {
    if (mountedRef.current) {
      setPreferences((prev) => ({ ...prev, ...prefs }))
    }
    try {
      await apiFetch<Record<string, unknown>>('/api/portal/preferences', {
        method: 'PUT',
        body: JSON.stringify(prefs),
      })
    } catch {
      /* optimistic update stays */
    }
  }, [])

  /* ── Memoised context value ───────────────────────────────────────────── */

  const value = useMemo<PortalContextValue>(
    () => ({
      currentUser,
      jobs,
      notifications,
      conversations,
      preferences,
      loading,
      error,
      refresh,
      refreshJobs,
      refreshNotifications,
      refreshJob,
      markNotificationRead,
      markAllNotificationsRead,
      submitRequest,
      claimJob,
      advanceStatus,
      assignContractor,
      postMessage,
      updateProfile,
      updateAvatar,
      updatePreferences,
    }),
    [
      currentUser,
      jobs,
      notifications,
      conversations,
      preferences,
      loading,
      error,
      refresh,
      refreshJobs,
      refreshNotifications,
      refreshJob,
      markNotificationRead,
      markAllNotificationsRead,
      submitRequest,
      claimJob,
      advanceStatus,
      assignContractor,
      postMessage,
      updateProfile,
      updateAvatar,
      updatePreferences,
    ],
  )

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>
}

/* ── Hook ─────────────────────────────────────────────────────────────────── */

export function usePortal(): PortalContextValue {
  const ctx = useContext(PortalContext)
  if (!ctx) throw new Error('usePortal must be used inside <PortalProvider>')
  return ctx
}
