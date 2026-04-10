export type Role = 'homeowner' | 'contractor' | 'manager' | 'admin'

export type JobStatus = 'pending' | 'assigned' | 'in_progress' | 'complete'

export type Priority = 'low' | 'normal' | 'high' | 'urgent'

export type Category =
  | 'plumbing'
  | 'electrical'
  | 'hvac'
  | 'landscaping'
  | 'cleaning'
  | 'handyman'
  | 'other'

export interface PortalUser {
  id: string
  name: string
  email: string
  phone: string
  role: Role
  avatarColor: string
  initials: string
  rating?: number
  jobsCompleted?: number
}

export interface JobMessage {
  id: string
  authorId: string
  authorName: string
  body: string
  timestamp: string
}

export interface JobInvoice {
  id: string
  amountCents: number
  status: 'draft' | 'submitted' | 'approved' | 'paid'
  submittedAt?: string
  paidAt?: string
}

export interface JobReview {
  rating: number
  body: string
  authorId: string
}

export interface Job {
  id: string
  shortId: string
  title: string
  description: string
  category: Category
  priority: Priority
  status: JobStatus
  location: string
  createdAt: string
  homeownerId: string
  contractorId?: string
  contractorName?: string
  rawStatus?: string
  messages: JobMessage[]
  invoice?: JobInvoice
  review?: JobReview
}

export const CATEGORY_LABEL: Record<Category, string> = {
  plumbing: 'Plumbing',
  electrical: 'Electrical',
  hvac: 'HVAC',
  landscaping: 'Landscaping',
  cleaning: 'Cleaning',
  handyman: 'Handyman',
  other: 'Other',
}

export const STATUS_LABEL: Record<JobStatus, string> = {
  pending: 'Pending',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  complete: 'Complete',
}

export const PRIORITY_LABEL: Record<Priority, string> = {
  low: 'Low',
  normal: 'Normal',
  high: 'High',
  urgent: 'Urgent',
}

export const STATUS_FLOW: JobStatus[] = ['pending', 'assigned', 'in_progress', 'complete']

export function dashboardStatsForJobs(jobs: Job[]) {
  const open = jobs.filter((j) => j.status !== 'complete').length
  const completed = jobs.filter((j) => j.status === 'complete').length
  const pendingPayment = jobs.filter((j) => j.invoice && j.invoice.status !== 'paid').length
  const total = jobs.length || 1
  const completionRate = Math.round((completed / total) * 100)
  const activeContractors = new Set(
    jobs.filter((j) => j.contractorId && j.status !== 'complete').map((j) => j.contractorId),
  ).size
  return { open, completed, pendingPayment, completionRate, activeContractors, total: jobs.length }
}

export function formatRelative(iso: string): string {
  const now = Date.now()
  const then = new Date(iso).getTime()
  const diff = Math.max(0, now - then)
  const mins = Math.round(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  return `${days}d ago`
}

export function formatMoney(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

