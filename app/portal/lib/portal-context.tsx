'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import {
  JOBS as INITIAL_JOBS,
  USERS,
  type Category,
  type Job,
  type JobStatus,
  type PortalUser,
  type Priority,
  type Role,
  STATUS_FLOW,
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
  setCurrentUserId: (id: string) => void
  users: PortalUser[]
  jobs: Job[]
  submitRequest: (input: NewRequestInput) => Job
  advanceStatus: (jobId: string) => void
  assignContractor: (jobId: string, contractorId: string) => void
  postMessage: (jobId: string, body: string) => void
}

const PortalContext = createContext<PortalContextValue | null>(null)

let nextJobNumber = 1043
let nextMsgId = 1000

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const [currentUserId, setCurrentUserId] = useState<string>('u-admin')
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS)

  const currentUser = useMemo(
    () => USERS.find((u) => u.id === currentUserId) ?? USERS[0],
    [currentUserId],
  )

  const submitRequest = useCallback(
    (input: NewRequestInput): Job => {
      const id = `j-${nextJobNumber}`
      const shortId = String(nextJobNumber)
      nextJobNumber += 1
      const newJob: Job = {
        id,
        shortId,
        title: input.title,
        description: input.description,
        category: input.category,
        priority: input.priority,
        status: 'pending',
        location: input.location,
        createdAt: new Date().toISOString(),
        homeownerId: currentUser.role === 'homeowner' || currentUser.role === 'manager' ? currentUser.id : 'u-home-1',
        photos: Array.from({ length: input.photoCount }).map((_, i) => ({
          id: `np-${id}-${i}`,
          kind: 'attachment' as const,
          caption: `Photo ${i + 1}`,
          hue: 200 + i * 30,
        })),
        messages: [],
      }
      setJobs((prev) => [newJob, ...prev])
      return newJob
    },
    [currentUser],
  )

  const advanceStatus = useCallback((jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id !== jobId) return j
        const idx = STATUS_FLOW.indexOf(j.status)
        const next = STATUS_FLOW[Math.min(idx + 1, STATUS_FLOW.length - 1)]
        return { ...j, status: next as JobStatus }
      }),
    )
  }, [])

  const assignContractor = useCallback((jobId: string, contractorId: string) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id !== jobId) return j
        return {
          ...j,
          contractorId,
          status: j.status === 'pending' ? 'assigned' : j.status,
        }
      }),
    )
  }, [])

  const postMessage = useCallback(
    (jobId: string, body: string) => {
      const trimmed = body.trim()
      if (!trimmed) return
      const messageId = `nm-${++nextMsgId}`
      setJobs((prev) =>
        prev.map((j) => {
          if (j.id !== jobId) return j
          return {
            ...j,
            messages: [
              ...j.messages,
              {
                id: messageId,
                authorId: currentUser.id,
                authorName: currentUser.name,
                body: trimmed,
                timestamp: new Date().toISOString(),
              },
            ],
          }
        }),
      )
    },
    [currentUser],
  )

  const value = useMemo<PortalContextValue>(
    () => ({
      currentUser,
      setCurrentUserId,
      users: USERS,
      jobs,
      submitRequest,
      advanceStatus,
      assignContractor,
      postMessage,
    }),
    [currentUser, jobs, submitRequest, advanceStatus, assignContractor, postMessage],
  )

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>
}

export function usePortal(): PortalContextValue {
  const ctx = useContext(PortalContext)
  if (!ctx) throw new Error('usePortal must be used within PortalProvider')
  return ctx
}

export type { Role }
