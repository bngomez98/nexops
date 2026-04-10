'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  STATUS_FLOW,
  type Category,
  type Job,
  type JobMessage,
  type JobStatus,
  type NotificationPreferences,
  type PortalDoc,
  type PortalUser,
  type Priority,
} from './mock-data'

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
  docs: PortalDoc[]
  preferences: NotificationPreferences
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  submitRequest: (input: NewRequestInput) => Promise<Job>
  advanceStatus: (jobId: string) => Promise<void>
  assignContractor: (jobId: string, contractorId: string) => Promise<void>
  postMessage: (jobId: string, body: string) => Promise<void>
  updatePreferences: (prefs: NotificationPreferences) => Promise<void>
}

const FALLBACK_USER: PortalUser = {
  id: 'portal-user',
  name: 'Portal User',
  email: '',
  phone: '',
  role: 'homeowner',
  avatarColor: 'from-indigo-400 to-blue-500',
  initials: 'PU',
}

const FALLBACK_PREFS: NotificationPreferences = {
  notifyMessages: true,
  notifyStatus: true,
  notifyPayments: false,
}

const PortalContext = createContext<PortalContextValue | null>(null)

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<PortalUser>(FALLBACK_USER)
  const [users, setUsers] = useState<PortalUser[]>([FALLBACK_USER])
  const [jobs, setJobs] = useState<Job[]>([])
  const [docs, setDocs] = useState<PortalDoc[]>([])
  const [preferences, setPreferences] = useState<NotificationPreferences>(FALLBACK_PREFS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/portal/bootstrap', { cache: 'no-store' })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload?.error || 'Failed to load portal data')
      }

      setCurrentUser(payload.currentUser ?? FALLBACK_USER)
      setUsers(Array.isArray(payload.users) && payload.users.length > 0 ? payload.users : [payload.currentUser ?? FALLBACK_USER])
      setJobs(Array.isArray(payload.jobs) ? payload.jobs : [])
      setDocs(Array.isArray(payload.docs) ? payload.docs : [])
      setPreferences(payload.preferences ?? FALLBACK_PREFS)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load portal data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const submitRequest = useCallback(async (input: NewRequestInput): Promise<Job> => {
    const response = await fetch('/api/portal/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })

    const payload = await response.json()

    if (!response.ok || !payload?.job) {
      throw new Error(payload?.error || 'Unable to submit request')
    }

    setJobs((prev) => [payload.job as Job, ...prev])
    return payload.job as Job
  }, [])

  const advanceStatus = useCallback(async (jobId: string) => {
    const current = jobs.find((job) => job.id === jobId)
    if (!current) return

    const currentIndex = STATUS_FLOW.indexOf(current.status)
    const nextStatus = STATUS_FLOW[Math.min(currentIndex + 1, STATUS_FLOW.length - 1)] as JobStatus

    const response = await fetch(`/api/portal/jobs/${jobId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newStatus: nextStatus }),
    })

    const payload = await response.json()

    if (!response.ok) {
      throw new Error(payload?.error || 'Unable to update status')
    }

    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              status: (payload?.portalStatus as JobStatus) ?? nextStatus,
            }
          : job,
      ),
    )
  }, [jobs])

  const assignContractor = useCallback(async (jobId: string, contractorId: string) => {
    const response = await fetch(`/api/portal/jobs/${jobId}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contractorId }),
    })

    const payload = await response.json()
    if (!response.ok) {
      throw new Error(payload?.error || 'Unable to assign contractor')
    }

    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              contractorId,
              status: payload?.status ?? (job.status === 'pending' ? 'assigned' : job.status),
            }
          : job,
      ),
    )
  }, [])

  const postMessage = useCallback(async (jobId: string, body: string) => {
    const trimmed = body.trim()
    if (!trimmed) return

    const response = await fetch(`/api/portal/jobs/${jobId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: trimmed }),
    })

    const payload = await response.json()
    if (!response.ok || !payload?.message) {
      throw new Error(payload?.error || 'Unable to send message')
    }

    setJobs((prev) =>
      prev.map((job) => {
        if (job.id !== jobId) return job

        return {
          ...job,
          messages: [...job.messages, payload.message as JobMessage],
        }
      }),
    )
  }, [])

  const updatePreferences = useCallback(async (prefs: NotificationPreferences) => {
    const response = await fetch('/api/portal/preferences', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prefs),
    })

    const payload = await response.json()

    if (!response.ok) {
      throw new Error(payload?.error || 'Unable to update preferences')
    }

    setPreferences(payload.preferences ?? prefs)
  }, [])

  const value = useMemo<PortalContextValue>(
    () => ({
      currentUser,
      users,
      jobs,
      docs,
      preferences,
      loading,
      error,
      refresh,
      submitRequest,
      advanceStatus,
      assignContractor,
      postMessage,
      updatePreferences,
    }),
    [
      currentUser,
      users,
      jobs,
      docs,
      preferences,
      loading,
      error,
      refresh,
      submitRequest,
      advanceStatus,
      assignContractor,
      postMessage,
      updatePreferences,
    ],
  )

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>
}

export function usePortal(): PortalContextValue {
  const ctx = useContext(PortalContext)
  if (!ctx) throw new Error('usePortal must be used within PortalProvider')
  return ctx
}
