'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { mockClientRequests, mockContractorJobs, type MaintenanceRequest, type ContractorJob } from './mock-data'

interface RequestsContextType {
  clientRequests: MaintenanceRequest[]
  contractorJobs: ContractorJob[]
  addRequest: (request: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'updatedAt'>) => void
  claimJob: (jobId: string, contractorId: string) => void
  completeJob: (jobId: string) => void
  updateRequestStatus: (requestId: string, status: MaintenanceRequest['status']) => void
}

const RequestsContext = createContext<RequestsContextType | undefined>(undefined)

export function RequestsProvider({ children }: { children: ReactNode }) {
  const [clientRequests, setClientRequests] = useState<MaintenanceRequest[]>(mockClientRequests)
  const [contractorJobs, setContractorJobs] = useState<ContractorJob[]>(mockContractorJobs)

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

  return (
    <RequestsContext.Provider
      value={{
        clientRequests,
        contractorJobs,
        addRequest,
        claimJob,
        completeJob,
        updateRequestStatus,
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
