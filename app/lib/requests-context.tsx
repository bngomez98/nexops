'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

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

const STORAGE_VERSION = 'v2'
const OLD_STORAGE_KEYS = ['nexus-requests-cache', 'nexus-dashboard-cache']
const REQUESTS_STORAGE_KEY = `nexus-requests-${STORAGE_VERSION}`

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
  clientRequests: MaintenanceRequest[]
  contractorJobs: ContractorJob[]
}

export function RequestsProvider({ children }: { children: ReactNode }) {
  const [clientRequests, setClientRequests] = useState<MaintenanceRequest[]>([])
  const [contractorJobs, setContractorJobs] = useState<ContractorJob[]>([])

  useEffect(() => {
    OLD_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key))

    const raw = localStorage.getItem(REQUESTS_STORAGE_KEY)
    if (!raw) return

    try {
      const parsed = JSON.parse(raw) as PersistedRequests
      if (Array.isArray(parsed.clientRequests) && Array.isArray(parsed.contractorJobs)) {
        setClientRequests(parsed.clientRequests)
        setContractorJobs(parsed.contractorJobs)
      }
    } catch (err) {
      console.error(err)
      localStorage.removeItem(REQUESTS_STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    const payload: PersistedRequests = { clientRequests, contractorJobs }
    localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(payload))
  }, [clientRequests, contractorJobs])

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
    localStorage.removeItem(REQUESTS_STORAGE_KEY)
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
