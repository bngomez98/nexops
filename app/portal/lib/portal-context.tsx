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

/* ── Context value shape ──────────────────────────────────────────────────── */

interface PortalContextValue {
  currentUser: PortalUser | null
  jobs: PortalJob[]
  notifications: PortalNotification[]
  conversations: PortalConversation[]
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
  if (lower === 'completed' || lower === 'done' || lower === 'closed') return 'completed'
  if (lower === 'in-progress' || lower === 'in_progress' || lower === 'active') return 'in-progress'
  if (lower === 'claimed' || lower === 'assigned' || lower === 'accepted') return 'claimed'
  if (lower === 'cancelled' || lower === 'canceled') return 'cancelled'
  return 'open'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProject(p: any): PortalJob {
  const status = mapPortalStatus(p.status)
  return {
    id: p.id ?? '',
    shortId: toShortId(p.id ?? ''),
    title: p.title ?? p.name ?? 'Untitled',
    description: p.description ?? '',
    category: p.category ?? p.type ?? 'general',
    priority: mapUrgencyToPriority(p.urgency ?? p.priority),
    status,
    rawStatus: p.status ?? null,
    location: p.location ?? p.address ?? '',
    createdAt: p.createdAt ?? p.created_at ?? new Date().toISOString(),
    preferredDate: p.preferredDate ?? p.preferred_date ?? null,
    ownerId: p.ownerId ?? p.owner_id ?? p.userId ?? null,
    ownerName: p.ownerName ?? p.owner_name ?? null,
    contractorId: p.contractorId ?? p.contractor_id ?? null,
    contractorName: p.contractorName ?? p.contractor_name ?? null,
    photoUrls: Array.isArray(p.photoUrls ?? p.photo_urls ?? p.photos) ? (p.photoUrls ?? p.photo_urls ?? p.photos) : [],
    invoiceAmount: p.invoiceAmount ?? p.invoice_amount ?? null,
    invoicePaid: p.invoicePaid ?? p.invoice_paid ?? false,
    finalCost: p.finalCost ?? p.final_cost ?? null,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapUser(u: any): PortalUser {
  const name: string = u.name ?? u.full_name ?? 'User'
  return {
    id: u.id ?? '',
    name,
    email: u.email ?? '',
    phone: u.phone ?? null,
    role: u.role ?? 'homeowner',
    avatarUrl: u.avatarUrl ?? u.avatar_url ?? null,
    initials: buildInitials(name),
    avatarColor: avatarGradient(name),
  }
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

export function PortalProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<PortalUser | null>(null)
  const [jobs, setJobs] = useState<PortalJob[]>([])
  const [notifications, setNotifications] = useState<PortalNotification[]>([])
  const [conversations, setConversations] = useState<PortalConversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  /* ── Data loaders ─────────────────────────────────────────────────────── */

  const loadUser = useCallback(async () => {
    try {
      const data = await apiFetch<Record<string, unknown>>('/api/auth/me')
      if (mountedRef.current) setCurrentUser(mapUser(data))
    } catch {
      if (mountedRef.current) setCurrentUser(null)
    }
  }, [])

  const refreshJobs = useCallback(async () => {
    try {
      const data = await apiFetch<Record<string, unknown>>('/api/projects/list')
      // API may return { projects: [...] } or an array directly
      const list: unknown[] = Array.isArray(data)
        ? data
        : Array.isArray((data as Record<string, unknown>).projects)
          ? (data as Record<string, unknown>).projects as unknown[]
          : []
      if (mountedRef.current) setJobs(list.map(mapProject))
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          list.map((n: any) => ({
            id: n.id ?? '',
            title: n.title ?? '',
            body: n.body ?? n.message ?? '',
            read: n.read ?? false,
            createdAt: n.createdAt ?? n.created_at ?? new Date().toISOString(),
            jobId: n.jobId ?? n.job_id ?? null,
          })),
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          list.map((c: any) => ({
            jobId: c.jobId ?? c.job_id ?? '',
            jobTitle: c.jobTitle ?? c.job_title ?? '',
            otherUserName: c.otherUserName ?? c.other_user_name ?? '',
            lastMessage: c.lastMessage ?? c.last_message ?? '',
            lastMessageAt: c.lastMessageAt ?? c.last_message_at ?? '',
            unreadCount: c.unreadCount ?? c.unread_count ?? 0,
          })),
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
      const data = await apiFetch<Record<string, unknown>>(`/api/projects/${jobId}`)
      // API may return { project: {...} } or the object directly
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const raw: any = (data as any).project ?? data
      const updated = mapProject(raw)
      if (mountedRef.current) {
        setJobs((prev) => prev.map((j) => (j.id === jobId ? updated : j)))
      }
    } catch {
      // Fall back to full refresh
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
        const data = await apiFetch<Record<string, unknown>>('/api/projects/create', {
          method: 'POST',
          body: JSON.stringify(input),
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw: any = (data as any).project ?? data
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

  /* ── Assign contractor (reuses claim endpoint) ────────────────────────── */

  const assignContractor = useCallback(
    async (jobId: string, contractorId: string) => {
      await apiFetch(`/api/projects/claim/${jobId}`, {
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

      try {
        await apiFetch('/api/automation/update-status', {
          method: 'POST',
          body: JSON.stringify({ projectId: jobId, status: nextStatus }),
        })
      } catch {
        // Fallback to direct project update
        await apiFetch(`/api/projects/${jobId}`, {
          method: 'PATCH',
          body: JSON.stringify({ status: nextStatus }),
        })
      }

      await refreshJob(jobId)
    },
    [jobs, refreshJob],
  )

  /* ── Post message ─────────────────────────────────────────────────────── */

  const postMessage = useCallback(
    async (jobId: string, body: string): Promise<PortalMessage | null> => {
      try {
        const data = await apiFetch<Record<string, unknown>>(`/api/messages/${jobId}`, {
          method: 'POST',
          body: JSON.stringify({ body }),
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const m: any = (data as any).message ?? data
        return {
          id: m.id ?? '',
          jobId: m.jobId ?? m.job_id ?? jobId,
          senderId: m.senderId ?? m.sender_id ?? currentUser?.id ?? '',
          senderName: m.senderName ?? m.sender_name ?? currentUser?.name ?? '',
          body: m.body ?? body,
          createdAt: m.createdAt ?? m.created_at ?? new Date().toISOString(),
        }
      } catch {
        return null
      }
    },
    [currentUser],
  )

  /* ── Memoised context value ───────────────────────────────────────────── */

  const value = useMemo<PortalContextValue>(
    () => ({
      currentUser,
      jobs,
      notifications,
      conversations,
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
    }),
    [
      currentUser,
      jobs,
      notifications,
      conversations,
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
