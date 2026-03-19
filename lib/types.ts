export type UserRole = 'homeowner' | 'contractor'
export type MembershipTier = 'free' | 'professional' | 'enterprise'
export type ProjectStatus = 'open' | 'claimed' | 'in-progress' | 'completed' | 'cancelled'
export type ServiceCategory = 
  | 'tree-removal'
  | 'concrete-work'
  | 'roofing'
  | 'hvac'
  | 'fencing'
  | 'electrical'
  | 'plumbing'
  | 'excavation'

export interface User {
  id: string
  email: string
  passwordHash: string
  name: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
  // Homeowner specific
  address?: string
  phone?: string
  // Contractor specific
  contractorProfile?: ContractorProfile
}

export interface ContractorProfile {
  userId: string
  companyName: string
  licenseNumber: string
  yearsInBusiness: number
  serviceCategories: ServiceCategory[]
  averageRating: number
  totalReviews: number
  membershipTier: MembershipTier
  membershipExpiresAt: Date
  maxActiveProjects: number
  currentActiveProjects: number
  bio: string
  createdAt: Date
  updatedAt: Date
}

export interface ProjectRequest {
  id: string
  homeownerId: string
  category: ServiceCategory
  title: string
  description: string
  location: string
  budget?: number
  status: ProjectStatus
  claimedBy?: string // contractorId
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
}

export interface Session {
  id: string
  userId: string
  expiresAt: Date
  createdAt: Date
}
