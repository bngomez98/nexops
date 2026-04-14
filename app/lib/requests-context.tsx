'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useAuth } from '@/app/lib/auth-context'

export interface MaintenanceRequest {
  id: string
  propertyId: string
  propertyName: string
  type: string
  status: 'pending' | 'assigned' | 'in-progress' | 'completed' | 'invoiced'
  budget: number
  createdAt: string
  updatedAt: string
  dueDate: string
  description: string
  images?: string[]
  assignedContractor?: {
    id: string
    name: string
    phone: string
  }
  estimatedCost?: number
  invoiceAmount?: number
}

export interface ContractorJob {
  id: string
  requestId: string
  propertyName: string
  type: string
  status: 'available' | 'claimed' | 'completed' | 'invoiced'
  budget: number
  description: string
  claimedAt?: string
  completedAt?: string
  payout?: number
}

const STORAGE_VERSION = 'v3'
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7
const OLD_STORAGE_KEYS = ['nexus-requests-cache', 'nexus-dashboard-cache', 'nexus-requests-v2']
const REQUEST_STATUSES = new Set<MaintenanceRequest['status']>(['pending', 'assigned', 'in-progress', 'completed', 'invoiced'])
const JOB_STATUSES = new Set<ContractorJob['status']>(['available', 'claimed', 'completed', 'invoiced'])

interface RequestsContextType {
  clientRequests: MaintenanceRequest[]
  contractorJobs: ContractorJob[]
  addRequest: (request: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'updatedAt'>) => void
  claimJob: (jobId: string, contractorId: string) => void
  completeJob: (jobId: string) => void
  updateRequestStatus: (requestId: string, status: MaintenanceRequest['status']) => void
  clearCachedData: () => void
}

const RequestsContext = createContext<RequestsContextType | undefined>(undefined)

interface PersistedRequests {
  version: string
  cachedAt: number
  userId: string
  clientRequests: MaintenanceRequest[]
  contractorJobs: ContractorJob[]
}

function getRequestsStorageKey(userId: string) {
  return `nexus-requests-${STORAGE_VERSION}-${userId}`
}

function sanitizeClientRequests(items: unknown): MaintenanceRequest[] {
  if (!Array.isArray(items)) return []
  const seen = new Set<string>()
  const clean: MaintenanceRequest[] = []

  for (const item of items) {
    if (!item || typeof item !== 'object') continue
    const request = item as MaintenanceRequest
    if (
      typeof request.id !== 'string' ||
      !request.id ||
      seen.has(request.id) ||
      typeof request.propertyId !== 'string' ||
      typeof request.propertyName !== 'string' ||
      typeof request.type !== 'string' ||
      typeof request.description !== 'string' ||
      !REQUEST_STATUSES.has(request.status)
    ) {
      continue
    }

    clean.push(request)
    seen.add(request.id)
  }

  return clean
}

function sanitizeContractorJobs(items: unknown): ContractorJob[] {
  if (!Array.isArray(items)) return []
  const seen = new Set<string>()
  const clean: ContractorJob[] = []

  for (const item of items) {
    if (!item || typeof item !== 'object') continue
    const job = item as ContractorJob
    if (
      typeof job.id !== 'string' ||
      !job.id ||
      seen.has(job.id) ||
      typeof job.requestId !== 'string' ||
      typeof job.propertyName !== 'string' ||
      typeof job.type !== 'string' ||
      typeof job.description !== 'string' ||
      !JOB_STATUSES.has(job.status)
    ) {
      continue
    }

    clean.push(job)
    seen.add(job.id)
  }

  return clean
}

export function RequestsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [clientRequests, setClientRequests] = useState<MaintenanceRequest[]>([])
  const [contractorJobs, setContractorJobs] = useState<ContractorJob[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(false)
    setClientRequests([])
    setContractorJobs([])
    OLD_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key))

    if (!user?.id) {
      setIsHydrated(true)
      return
    }

    const storageKey = getRequestsStorageKey(user.id)
    const raw = localStorage.getItem(storageKey)
    if (!raw) {
      setIsHydrated(true)
      return
    }

    try {
      const parsed = JSON.parse(raw) as PersistedRequests
      const isCurrentVersion = parsed.version === STORAGE_VERSION
      const isCurrentUser = parsed.userId === user.id
      const isFresh = typeof parsed.cachedAt === 'number' && Date.now() - parsed.cachedAt <= CACHE_TTL_MS

      if (isCurrentVersion && isCurrentUser && isFresh) {
        setClientRequests(sanitizeClientRequests(parsed.clientRequests))
        setContractorJobs(sanitizeContractorJobs(parsed.contractorJobs))
      } else {
        localStorage.removeItem(storageKey)
      }
    } catch (err) {
      console.error(err)
      localStorage.removeItem(storageKey)
    }
    setIsHydrated(true)
  }, [user?.id])

  useEffect(() => {
    if (!isHydrated || !user?.id) return
    const payload: PersistedRequests = {
      version: STORAGE_VERSION,
      cachedAt: Date.now(),
      userId: user.id,
      clientRequests: sanitizeClientRequests(clientRequests),
      contractorJobs: sanitizeContractorJobs(contractorJobs),
    }
    localStorage.setItem(getRequestsStorageKey(user.id), JSON.stringify(payload))
  }, [clientRequests, contractorJobs, isHydrated, user?.id])

  const addRequest = (request: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString().split('T')[0]
    const newRequest: MaintenanceRequest = {
      ...request,
      id: `req-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      status: 'pending',
    }
    setClientRequests((prev) => [newRequest, ...prev])
  }

  const claimJob = (jobId: string, contractorId: string) => {
    void contractorId
    setContractorJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, status: 'claimed', claimedAt: new Date().toISOString().split('T')[0] } : job
      )
    )
  }

  const completeJob = (jobId: string) => {
    setContractorJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, status: 'completed', completedAt: new Date().toISOString().split('T')[0] } : job
      )
    )
  }

  const updateRequestStatus = (requestId: string, status: MaintenanceRequest['status']) => {
    setClientRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status, updatedAt: new Date().toISOString().split('T')[0] } : req))
    )
  }

  const clearCachedData = () => {
    if (user?.id) {
      localStorage.removeItem(getRequestsStorageKey(user.id))
    }
    OLD_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key))
    setClientRequests([])
    setContractorJobs([])
  }

  return (
    <RequestsContext.Provider
      value={{
        clientRequests,
        contractorJobs,
        addRequest,
        claimJob,
        completeJob,
        updateRequestStatus,
        clearCachedData,
      }}
    >
      {children}
    </RequestsContext.Provider>
  )
}

export function useRequests() {
  const context = useContext(RequestsContext)
  if (!context) {
    throw new Error('useRequests must be used within RequestsProvider')
  }
  return context
}
