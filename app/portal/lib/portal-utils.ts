export type PortalRole = 'homeowner' | 'contractor' | 'manager' | 'admin' | 'property-manager'

export type PortalJobStatus = 'open' | 'claimed' | 'in-progress' | 'completed' | 'cancelled'

export type PortalPriority = 'low' | 'normal' | 'high' | 'urgent'

export interface PortalUser {
  id: string
  name: string
  email: string
  phone?: string | null
  role: PortalRole
  avatarUrl?: string | null
  initials: string
  avatarColor: string
}

export interface PortalJob {
  id: string
  shortId: string
  title: string
  description: string
  category: string
  priority: PortalPriority
  status: PortalJobStatus
  rawStatus?: string | null
  location: string
  createdAt: string
  preferredDate?: string | null
  ownerId?: string | null
  ownerName?: string | null
  contractorId?: string | null
  contractorName?: string | null
  photoUrls: string[]
  invoiceAmount?: number | null
  invoicePaid?: boolean
  finalCost?: number | null
}

export interface PortalConversation {
  jobId: string
  jobTitle: string
  otherUserName: string
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
}

const AVATAR_GRADIENTS = [
  'from-indigo-400 to-blue-500',
  'from-sky-400 to-cyan-500',
  'from-emerald-400 to-teal-500',
  'from-amber-400 to-orange-500',
  'from-fuchsia-400 to-pink-500',
  'from-violet-400 to-indigo-500',
  'from-rose-400 to-red-500',
]

export const STATUS_LABEL: Record<PortalJobStatus, string> = {
  open: 'Open',
  claimed: 'Claimed',
  'in-progress': 'In progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export const STATUS_FLOW: PortalJobStatus[] = ['open', 'claimed', 'in-progress', 'completed']

export const PRIORITY_LABEL: Record<PortalPriority, string> = {
  low: 'Low',
  normal: 'Normal',
  high: 'High',
  urgent: 'Urgent',
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

export function formatRelative(iso: string) {
  const timestamp = new Date(iso).getTime()
  if (Number.isNaN(timestamp)) return ''
  const diffSeconds = Math.round((Date.now() - timestamp) / 1000)
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  const absSeconds = Math.abs(diffSeconds)
  if (absSeconds < 60) return rtf.format(-diffSeconds, 'second')
  const minutes = Math.round(diffSeconds / 60)
  if (Math.abs(minutes) < 60) return rtf.format(-minutes, 'minute')
  const hours = Math.round(minutes / 60)
  if (Math.abs(hours) < 24) return rtf.format(-hours, 'hour')
  const days = Math.round(hours / 24)
  if (Math.abs(days) < 7) return rtf.format(-days, 'day')
  const weeks = Math.round(days / 7)
  if (Math.abs(weeks) < 4) return rtf.format(-weeks, 'week')
  const months = Math.round(days / 30)
  if (Math.abs(months) < 12) return rtf.format(-months, 'month')
  const years = Math.round(days / 365)
  return rtf.format(-years, 'year')
}

export function formatCategoryLabel(category: string) {
  if (!category) return 'General'
  return category
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export function buildInitials(name: string) {
  const parts = name.split(' ').filter(Boolean)
  if (parts.length === 0) return 'U'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export function avatarGradient(name: string) {
  const hash = Array.from(name).reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length]
}

export function mapUrgencyToPriority(urgency?: string | null): PortalPriority {
  const normalized = urgency?.toLowerCase() ?? ''
  if (['urgent', 'emergency'].includes(normalized)) return 'urgent'
  if (normalized === 'high') return 'high'
  if (normalized === 'low') return 'low'
  return 'normal'
}
