export type Role = 'homeowner' | 'property_manager' | 'contractor'

export interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  role: Role
  avatar_url: string | null
  company_name: string | null
  license_number: string | null
  trade_specialty: string | null
  company: string | null
  address: string | null
  created_at: string
  updated_at: string
}

export type JobStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'
export type JobPriority = 'low' | 'normal' | 'high' | 'urgent'

export interface Job {
  id: string
  title: string
  description: string | null
  status: JobStatus
  priority: JobPriority
  owner_id: string | null
  contractor_id: string | null
  property_manager_id: string | null
  address: string | null
  scheduled_date: string | null
  estimated_cost: number | null
  created_at: string
  updated_at: string
}
