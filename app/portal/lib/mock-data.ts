// Self-contained mock data for the Nexus Operations Liquid Glass portal.
// All data lives in-memory; no backend calls. Pure UI showcase.

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

export interface JobPhoto {
  id: string
  kind: 'before' | 'after' | 'attachment'
  caption: string
  hue: number
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
  scheduledFor?: string
  homeownerId: string
  contractorId?: string
  photos: JobPhoto[]
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

export const USERS: PortalUser[] = [
  {
    id: 'u-admin',
    name: 'Avery Quinn',
    email: 'avery@nexusoperations.org',
    phone: '(785) 555-0102',
    role: 'admin',
    avatarColor: 'from-indigo-400 to-blue-500',
    initials: 'AQ',
  },
  {
    id: 'u-home-1',
    name: 'Marcus Lane',
    email: 'marcus.lane@example.com',
    phone: '(785) 555-0184',
    role: 'homeowner',
    avatarColor: 'from-sky-400 to-cyan-500',
    initials: 'ML',
  },
  {
    id: 'u-home-2',
    name: 'Priya Anand',
    email: 'priya.anand@example.com',
    phone: '(785) 555-0207',
    role: 'homeowner',
    avatarColor: 'from-fuchsia-400 to-pink-500',
    initials: 'PA',
  },
  {
    id: 'u-mgr-1',
    name: 'Jordan Wells',
    email: 'jordan@oakridgepm.com',
    phone: '(785) 555-0312',
    role: 'manager',
    avatarColor: 'from-emerald-400 to-teal-500',
    initials: 'JW',
  },
  {
    id: 'u-con-1',
    name: 'Diego Marin',
    email: 'diego@marincraft.com',
    phone: '(785) 555-0411',
    role: 'contractor',
    avatarColor: 'from-amber-400 to-orange-500',
    initials: 'DM',
    rating: 4.9,
    jobsCompleted: 142,
  },
  {
    id: 'u-con-2',
    name: 'Hana Okafor',
    email: 'hana@brightline.co',
    phone: '(785) 555-0488',
    role: 'contractor',
    avatarColor: 'from-violet-400 to-indigo-500',
    initials: 'HO',
    rating: 4.8,
    jobsCompleted: 87,
  },
  {
    id: 'u-con-3',
    name: 'Theo Ramsey',
    email: 'theo@ramseyhvac.com',
    phone: '(785) 555-0532',
    role: 'contractor',
    avatarColor: 'from-rose-400 to-red-500',
    initials: 'TR',
    rating: 4.7,
    jobsCompleted: 61,
  },
]

export const JOBS: Job[] = [
  {
    id: 'j-1042',
    shortId: '1042',
    title: 'Kitchen sink leak under cabinet',
    description:
      'Slow drip from the P-trap connection. Cabinet floor is starting to swell. Need someone today if possible.',
    category: 'plumbing',
    priority: 'urgent',
    status: 'in_progress',
    location: '1421 Westwood Ln, Topeka KS',
    createdAt: '2026-04-08T14:22:00Z',
    scheduledFor: '2026-04-09T15:00:00Z',
    homeownerId: 'u-home-1',
    contractorId: 'u-con-1',
    photos: [
      { id: 'p1', kind: 'before', caption: 'Cabinet damage', hue: 210 },
      { id: 'p2', kind: 'before', caption: 'P-trap leak', hue: 195 },
    ],
    messages: [
      {
        id: 'm1',
        authorId: 'u-admin',
        authorName: 'Avery Quinn',
        body: 'Assigned Diego — he can be on site by 3pm.',
        timestamp: '2026-04-08T15:01:00Z',
      },
      {
        id: 'm2',
        authorId: 'u-con-1',
        authorName: 'Diego Marin',
        body: 'On my way. Bringing replacement P-trap and sealant.',
        timestamp: '2026-04-09T14:30:00Z',
      },
      {
        id: 'm3',
        authorId: 'u-home-1',
        authorName: 'Marcus Lane',
        body: 'Thanks — front door code is 4421.',
        timestamp: '2026-04-09T14:32:00Z',
      },
    ],
  },
  {
    id: 'j-1041',
    shortId: '1041',
    title: 'Replace bedroom ceiling fan',
    description: 'Old fan is wobbling and clicks at high speed. Have a replacement on site already.',
    category: 'electrical',
    priority: 'normal',
    status: 'assigned',
    location: '88 Brookline Ct, Topeka KS',
    createdAt: '2026-04-08T09:11:00Z',
    scheduledFor: '2026-04-10T10:00:00Z',
    homeownerId: 'u-home-2',
    contractorId: 'u-con-2',
    photos: [{ id: 'p3', kind: 'attachment', caption: 'Existing fan', hue: 260 }],
    messages: [
      {
        id: 'm4',
        authorId: 'u-admin',
        authorName: 'Avery Quinn',
        body: 'Hana is confirmed for Friday morning.',
        timestamp: '2026-04-08T11:14:00Z',
      },
    ],
  },
  {
    id: 'j-1040',
    shortId: '1040',
    title: 'AC unit not cooling properly',
    description:
      'Outdoor condenser running but blowing warm. Filter replaced last week. Possible refrigerant issue.',
    category: 'hvac',
    priority: 'high',
    status: 'pending',
    location: '2210 Lakeview Dr, Topeka KS',
    createdAt: '2026-04-09T08:42:00Z',
    homeownerId: 'u-home-1',
    photos: [],
    messages: [],
  },
  {
    id: 'j-1039',
    shortId: '1039',
    title: 'Front yard cleanup and mulch',
    description: 'Spring cleanup, edging, fresh mulch in all front beds. ~600 sqft of beds total.',
    category: 'landscaping',
    priority: 'low',
    status: 'complete',
    location: '88 Brookline Ct, Topeka KS',
    createdAt: '2026-04-02T13:15:00Z',
    scheduledFor: '2026-04-05T08:00:00Z',
    homeownerId: 'u-home-2',
    contractorId: 'u-con-3',
    photos: [
      { id: 'p4', kind: 'before', caption: 'Before — overgrown', hue: 90 },
      { id: 'p5', kind: 'after', caption: 'After — fresh mulch', hue: 30 },
    ],
    messages: [
      {
        id: 'm5',
        authorId: 'u-con-3',
        authorName: 'Theo Ramsey',
        body: 'All done — added fresh edging on the curve as well.',
        timestamp: '2026-04-05T15:42:00Z',
      },
    ],
    invoice: {
      id: 'inv-9001',
      amountCents: 48000,
      status: 'paid',
      submittedAt: '2026-04-05T16:00:00Z',
      paidAt: '2026-04-06T09:14:00Z',
    },
    review: {
      rating: 5,
      body: 'Theo and his team were great — beds look fantastic.',
      authorId: 'u-home-2',
    },
  },
  {
    id: 'j-1038',
    shortId: '1038',
    title: 'Deep clean — turnover unit 4B',
    description: 'Tenant move-out clean. Carpets, kitchen, bathrooms, baseboards. Keys at lockbox 9921.',
    category: 'cleaning',
    priority: 'normal',
    status: 'complete',
    location: 'Oakridge Apts 4B, Topeka KS',
    createdAt: '2026-04-01T10:00:00Z',
    scheduledFor: '2026-04-03T09:00:00Z',
    homeownerId: 'u-mgr-1',
    contractorId: 'u-con-2',
    photos: [
      { id: 'p6', kind: 'before', caption: 'Kitchen before', hue: 220 },
      { id: 'p7', kind: 'after', caption: 'Kitchen after', hue: 180 },
    ],
    messages: [],
    invoice: {
      id: 'inv-9000',
      amountCents: 32500,
      status: 'paid',
      submittedAt: '2026-04-03T17:30:00Z',
      paidAt: '2026-04-04T08:02:00Z',
    },
    review: {
      rating: 5,
      body: 'Spotless, ready for next tenant.',
      authorId: 'u-mgr-1',
    },
  },
  {
    id: 'j-1037',
    shortId: '1037',
    title: 'Install dishwasher',
    description: 'New Bosch dishwasher delivered. Existing unit needs removal and disposal.',
    category: 'handyman',
    priority: 'normal',
    status: 'pending',
    location: '1421 Westwood Ln, Topeka KS',
    createdAt: '2026-04-09T07:55:00Z',
    homeownerId: 'u-home-1',
    photos: [],
    messages: [],
  },
]

export function getUser(id: string | undefined): PortalUser | undefined {
  if (!id) return undefined
  return USERS.find((u) => u.id === id)
}

export function getJob(id: string): Job | undefined {
  return JOBS.find((j) => j.id === id)
}

export function jobsForUser(userId: string, role: Role): Job[] {
  if (role === 'admin') return JOBS
  if (role === 'contractor') return JOBS.filter((j) => j.contractorId === userId)
  return JOBS.filter((j) => j.homeownerId === userId)
}

export function dashboardStats(userId: string, role: Role) {
  const visible = jobsForUser(userId, role)
  const open = visible.filter((j) => j.status !== 'complete').length
  const completed = visible.filter((j) => j.status === 'complete').length
  const pendingPayment = visible.filter(
    (j) => j.invoice && j.invoice.status !== 'paid',
  ).length
  const total = visible.length || 1
  const completionRate = Math.round((completed / total) * 100)
  const activeContractors = new Set(
    visible.filter((j) => j.contractorId && j.status !== 'complete').map((j) => j.contractorId),
  ).size
  return { open, completed, pendingPayment, completionRate, activeContractors, total: visible.length }
}

export function formatRelative(iso: string): string {
  const now = new Date('2026-04-09T16:00:00Z').getTime()
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
