import { createHash, randomUUID } from "crypto"

export interface User {
  id: string
  email: string
  passwordHash: string
  name: string
  role: "homeowner" | "contractor"
  phone?: string
  // Contractor fields
  businessName?: string
  licenseNumber?: string
  serviceCategories?: string[]
  subscription?: "basic" | "premium" | "elite"
  // Homeowner fields
  address?: string
  createdAt: string
}

export interface SafeUser extends Omit<User, "passwordHash"> {}

export interface Lead {
  id: string
  contractorId: string
  homeownerId: string
  homeownerName: string
  service: string
  description: string
  budget: string
  address: string
  photos: number
  status: "new" | "contacted" | "scheduled" | "won" | "lost"
  tier: "basic" | "premium" | "elite"
  value: number
  createdAt: string
  consultationWindow?: string
}

export interface Request {
  id: string
  homeownerId: string
  service: string
  description: string
  budget: string
  address: string
  photos: number
  status: "pending" | "matched" | "in_progress" | "completed" | "cancelled"
  contractorName?: string
  contractorId?: string
  consultationWindow?: string
  createdAt: string
}

function hashPassword(password: string): string {
  return createHash("sha256").update(password + "nexops_salt_2024").digest("hex")
}

// In-memory stores
const users = new Map<string, User>()
const sessions = new Map<string, string>() // sessionToken -> userId
const leadsStore = new Map<string, Lead[]>() // contractorId -> leads[]
const requestsStore = new Map<string, Request[]>() // homeownerId -> requests[]

function seedData() {
  const homeownerId = "homeowner-demo-001"
  const contractorId = "contractor-demo-001"

  users.set("homeowner@demo.com", {
    id: homeownerId,
    email: "homeowner@demo.com",
    passwordHash: hashPassword("demo123"),
    name: "Sarah Johnson",
    role: "homeowner",
    phone: "(785) 555-0123",
    address: "1234 Oak Street, Topeka, KS 66603",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  })

  users.set("contractor@demo.com", {
    id: contractorId,
    email: "contractor@demo.com",
    passwordHash: hashPassword("demo123"),
    name: "Mike Rodriguez",
    role: "contractor",
    phone: "(785) 555-0456",
    businessName: "Rodriguez Tree & Landscaping LLC",
    licenseNumber: "KS-TC-2021-4892",
    serviceCategories: ["Tree Removal", "Concrete Work"],
    subscription: "premium",
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  })

  const demoLeads: Lead[] = [
    {
      id: "lead-001",
      contractorId,
      homeownerId: "ho-001",
      homeownerName: "David Chen",
      service: "Tree Removal",
      description: "Two large oak trees need removal from backyard after storm damage.",
      budget: "$1,500 – $2,500",
      address: "5678 Elm Ave, Topeka, KS",
      photos: 4,
      status: "won",
      tier: "premium",
      value: 2100,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      consultationWindow: "Mon Dec 16, 2–4 PM",
    },
    {
      id: "lead-002",
      contractorId,
      homeownerId: "ho-002",
      homeownerName: "Jennifer Park",
      service: "Concrete Work",
      description: "Driveway repaving, ~600 sq ft. Cracks and heaving throughout.",
      budget: "$3,000 – $5,000",
      address: "910 Maple Dr, Topeka, KS",
      photos: 6,
      status: "scheduled",
      tier: "premium",
      value: 4200,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      consultationWindow: "Fri Dec 20, 10 AM–12 PM",
    },
    {
      id: "lead-003",
      contractorId,
      homeownerId: "ho-003",
      homeownerName: "Robert Martinez",
      service: "Tree Removal",
      description: "Dead tree near power lines — urgent removal needed.",
      budget: "$800 – $1,200",
      address: "234 Pine St, Topeka, KS",
      photos: 3,
      status: "new",
      tier: "basic",
      value: 950,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      consultationWindow: "Mon Dec 23, 8–10 AM",
    },
    {
      id: "lead-004",
      contractorId,
      homeownerId: "ho-004",
      homeownerName: "Lisa Thompson",
      service: "Tree Removal",
      description: "Stump grinding for 3 stumps from recent removal.",
      budget: "$300 – $600",
      address: "567 Oak Blvd, Topeka, KS",
      photos: 2,
      status: "contacted",
      tier: "basic",
      value: 450,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      consultationWindow: "Tue Dec 17, 1–3 PM",
    },
    {
      id: "lead-005",
      contractorId,
      homeownerId: "ho-005",
      homeownerName: "Mark Wilson",
      service: "Concrete Work",
      description: "400 sq ft backyard patio slab installation.",
      budget: "$2,500 – $4,000",
      address: "890 Cedar Lane, Topeka, KS",
      photos: 5,
      status: "lost",
      tier: "premium",
      value: 3200,
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      consultationWindow: "Wed Dec 11, 9–11 AM",
    },
    {
      id: "lead-006",
      contractorId,
      homeownerId: "ho-006",
      homeownerName: "Amanda Torres",
      service: "Concrete Work",
      description: "Foundation crack repair and waterproofing.",
      budget: "$1,800 – $3,500",
      address: "321 Birch Way, Topeka, KS",
      photos: 7,
      status: "contacted",
      tier: "premium",
      value: 2600,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      consultationWindow: "Thu Dec 19, 3–5 PM",
    },
  ]
  leadsStore.set(contractorId, demoLeads)

  const demoRequests: Request[] = [
    {
      id: "req-001",
      homeownerId,
      service: "Tree Removal",
      description: "Large pine tree in front yard needs removal. Approximately 40ft tall with root damage.",
      budget: "$1,000 – $2,000",
      address: "1234 Oak Street, Topeka, KS 66603",
      photos: 3,
      status: "matched",
      contractorName: "Rodriguez Tree & Landscaping LLC",
      contractorId,
      consultationWindow: "Thu Dec 19, 2–4 PM",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]
  requestsStore.set(homeownerId, demoRequests)
}

seedData()

// Session management
export function createSession(userId: string): string {
  const token = randomUUID()
  sessions.set(token, userId)
  return token
}

export function getSession(token: string): string | undefined {
  return sessions.get(token)
}

export function deleteSession(token: string): void {
  sessions.delete(token)
}

// User management
export function getUserByEmail(email: string): User | undefined {
  return users.get(email.toLowerCase())
}

export function getUserById(id: string): User | undefined {
  for (const user of users.values()) {
    if (user.id === id) return user
  }
  return undefined
}

export function createUser(data: Omit<User, "id" | "createdAt">): User {
  const user: User = {
    ...data,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  }
  users.set(data.email.toLowerCase(), user)
  return user
}

export function toSafeUser(user: User): SafeUser {
  const { passwordHash: _, ...safe } = user
  return safe
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}

export function hashNewPassword(password: string): string {
  return hashPassword(password)
}

// Leads
export function getLeadsForContractor(contractorId: string): Lead[] {
  return leadsStore.get(contractorId) ?? []
}

export function addLead(contractorId: string, lead: Omit<Lead, "id" | "createdAt">): Lead {
  const newLead: Lead = { ...lead, id: randomUUID(), createdAt: new Date().toISOString() }
  const existing = leadsStore.get(contractorId) ?? []
  leadsStore.set(contractorId, [newLead, ...existing])
  return newLead
}

// Requests
export function getRequestsForHomeowner(homeownerId: string): Request[] {
  return requestsStore.get(homeownerId) ?? []
}

export function addRequest(homeownerId: string, data: Omit<Request, "id" | "createdAt" | "status">): Request {
  const request: Request = {
    ...data,
    id: randomUUID(),
    status: "pending",
    createdAt: new Date().toISOString(),
  }
  const existing = requestsStore.get(homeownerId) ?? []
  requestsStore.set(homeownerId, [request, ...existing])
  return request
}
