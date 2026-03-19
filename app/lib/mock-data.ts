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

export interface Invoice {
  id: string
  type: 'client' | 'contractor'
  relatedId: string
  relatedName: string
  amount: number
  status: 'pending' | 'sent' | 'paid'
  issuedAt: string
  dueAt: string
}

export const mockClientRequests: MaintenanceRequest[] = [
  {
    id: 'req-001',
    propertyId: 'prop-1',
    propertyName: '1420 N Maple St',
    type: 'Roof repair',
    status: 'completed',
    budget: 4200,
    createdAt: '2025-01-20',
    updatedAt: '2025-02-05',
    dueDate: '2025-02-07',
    description: 'Replace damaged shingles on south side',
    assignedContractor: { id: 'c1', name: 'John Garcia', phone: '(913) 555-0101' },
    estimatedCost: 4200,
    invoiceAmount: 4200,
  },
  {
    id: 'req-002',
    propertyId: 'prop-1',
    propertyName: '1420 N Maple St',
    type: 'Gutter cleaning',
    status: 'in-progress',
    budget: 350,
    createdAt: '2025-02-03',
    updatedAt: '2025-02-08',
    dueDate: '2025-02-09',
    description: 'Clean gutters and downspouts',
    assignedContractor: { id: 'c2', name: 'Maria Rodriguez', phone: '(913) 555-0102' },
    estimatedCost: 350,
  },
  {
    id: 'req-003',
    propertyId: 'prop-1',
    propertyName: '1420 N Maple St',
    type: 'HVAC inspection',
    status: 'assigned',
    budget: 200,
    createdAt: '2025-02-07',
    updatedAt: '2025-02-08',
    dueDate: '2025-02-15',
    description: 'Annual HVAC system inspection and filter replacement',
    assignedContractor: { id: 'c3', name: 'Tech Services LLC', phone: '(913) 555-0103' },
  },
]

export const mockContractorJobs: ContractorJob[] = [
  {
    id: 'job-001',
    requestId: 'req-002',
    propertyName: '1420 N Maple St',
    type: 'Gutter cleaning',
    status: 'claimed',
    budget: 350,
    description: 'Clean gutters and downspouts',
    claimedAt: '2025-02-03',
    payout: 245,
  },
  {
    id: 'job-002',
    requestId: 'req-004',
    propertyName: '2850 W 21st St',
    type: 'Concrete repair',
    status: 'available',
    budget: 1800,
    description: 'Fix cracked driveway, 40 sq ft',
  },
  {
    id: 'job-003',
    requestId: 'req-005',
    propertyName: '3100 Fairlawn Rd',
    type: 'Fence repair',
    status: 'available',
    budget: 920,
    description: 'Replace 8 damaged fence posts',
  },
]

export const mockInvoices: Invoice[] = [
  {
    id: 'inv-client-001',
    type: 'client',
    relatedId: 'req-001',
    relatedName: 'Roof repair - 1420 N Maple St',
    amount: 4200,
    status: 'paid',
    issuedAt: '2025-02-05',
    dueAt: '2025-02-12',
  },
  {
    id: 'inv-contractor-001',
    type: 'contractor',
    relatedId: 'job-001',
    relatedName: 'Gutter cleaning - 1420 N Maple St',
    amount: 245,
    status: 'sent',
    issuedAt: '2025-02-08',
    dueAt: '2025-02-15',
  },
]
