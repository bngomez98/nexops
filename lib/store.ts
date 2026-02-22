/**
 * Data-access layer for Nexus Operations.
 *
 * All persistence is backed by SQLite via Prisma (lib/db.ts).  The function
 * signatures mirror the original in-memory implementation so that the API
 * routes only need to add `await` — no structural changes required.
 *
 * serviceCategories is serialised as a JSON string in SQLite (which has no
 * native array type) and deserialised back to string[] on every read.
 */
import { createHash, randomUUID } from "crypto"
import { db } from "./db"

// ─── Shared types ────────────────────────────────────────────────────────────

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
  subscription?: "standard" | "premium" | "elite"
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
  tier: "standard" | "premium" | "elite"
  value: number
  createdAt: string
  consultationWindow?: string
  notes?: string
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
  updatedAt?: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function hashPassword(password: string): string {
  return createHash("sha256").update(password + "nexops_salt_2024").digest("hex")
}

function toUser(row: {
  id: string
  email: string
  passwordHash: string
  name: string
  role: string
  phone: string | null
  businessName: string | null
  licenseNumber: string | null
  serviceCategories: string | null
  subscription: string | null
  address: string | null
  createdAt: Date
}): User {
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.passwordHash,
    name: row.name,
    role: row.role as User["role"],
    phone: row.phone ?? undefined,
    businessName: row.businessName ?? undefined,
    licenseNumber: row.licenseNumber ?? undefined,
    serviceCategories: row.serviceCategories
      ? (JSON.parse(row.serviceCategories) as string[])
      : undefined,
    subscription: (row.subscription ?? undefined) as User["subscription"],
    address: row.address ?? undefined,
    createdAt: row.createdAt.toISOString(),
  }
}

function toLead(row: {
  id: string
  contractorId: string
  homeownerId: string
  homeownerName: string
  service: string
  description: string
  budget: string
  address: string
  photos: number
  status: string
  tier: string
  value: number
  consultationWindow: string | null
  notes: string | null
  createdAt: Date
}): Lead {
  return {
    id: row.id,
    contractorId: row.contractorId,
    homeownerId: row.homeownerId,
    homeownerName: row.homeownerName,
    service: row.service,
    description: row.description,
    budget: row.budget,
    address: row.address,
    photos: row.photos,
    status: row.status as Lead["status"],
    tier: row.tier as Lead["tier"],
    value: row.value,
    consultationWindow: row.consultationWindow ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.createdAt.toISOString(),
  }
}

function toRequest(row: {
  id: string
  homeownerId: string
  service: string
  description: string
  budget: string
  address: string
  photos: number
  status: string
  contractorName: string | null
  contractorId: string | null
  consultationWindow: string | null
  createdAt: Date
  updatedAt: Date | null
}): Request {
  return {
    id: row.id,
    homeownerId: row.homeownerId,
    service: row.service,
    description: row.description,
    budget: row.budget,
    address: row.address,
    photos: row.photos,
    status: row.status as Request["status"],
    contractorName: row.contractorName ?? undefined,
    contractorId: row.contractorId ?? undefined,
    consultationWindow: row.consultationWindow ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt?.toISOString(),
  }
}

// ─── Seeding ─────────────────────────────────────────────────────────────────

/**
 * Populate the database with two demo accounts and sample data on first run.
 * Skipped when any user already exists so the call is idempotent.
 */
export async function seedIfEmpty(): Promise<void> {
  const count = await db.user.count()
  if (count > 0) return

  const homeownerId = "homeowner-demo-001"
  const contractorId = "contractor-demo-001"

  await db.user.create({
    data: {
      id: homeownerId,
      email: "homeowner@demo.com",
      passwordHash: hashPassword("demo123"),
      name: "Sarah Johnson",
      role: "homeowner",
      phone: "(785) 555-0123",
      address: "1234 Oak Street, Topeka, KS 66603",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
  })

  await db.user.create({
    data: {
      id: contractorId,
      email: "contractor@demo.com",
      passwordHash: hashPassword("demo123"),
      name: "Mike Rodriguez",
      role: "contractor",
      phone: "(785) 555-0456",
      businessName: "Rodriguez Tree & Landscaping LLC",
      licenseNumber: "KS-TC-2021-4892",
      serviceCategories: JSON.stringify(["Tree Removal", "Concrete Work"]),
      subscription: "premium",
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    },
  })

  const leads = [
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
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
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
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
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
      tier: "standard",
      value: 950,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
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
      tier: "standard",
      value: 450,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
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
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
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
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      consultationWindow: "Thu Dec 19, 3–5 PM",
    },
  ]

  for (const lead of leads) {
    await db.lead.create({ data: lead })
  }

  const requests = [
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
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: "req-002",
      homeownerId,
      service: "Concrete Work",
      description: "Cracked sidewalk along front of property — roughly 20 linear feet needs replacement.",
      budget: "$500 – $1,000",
      address: "1234 Oak Street, Topeka, KS 66603",
      photos: 2,
      status: "completed",
      contractorName: "Rodriguez Tree & Landscaping LLC",
      contractorId,
      consultationWindow: "Weekday morning (8–12 AM)",
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
    {
      id: "req-003",
      homeownerId,
      service: "Fencing",
      description: "Need a 6ft privacy fence along back property line, approximately 80 linear feet.",
      budget: "$2,500 – $5,000",
      address: "1234 Oak Street, Topeka, KS 66603",
      photos: 0,
      status: "pending",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
  ]

  for (const req of requests) {
    await db.request.create({ data: req })
  }
}

// ─── Session management ───────────────────────────────────────────────────────

export async function createSession(userId: string): Promise<string> {
  const token = randomUUID()
  await db.session.create({
    data: {
      token,
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  })
  return token
}

export async function getSession(token: string): Promise<string | undefined> {
  const session = await db.session.findUnique({ where: { token } })
  if (!session) return undefined
  if (session.expiresAt < new Date()) {
    await db.session.delete({ where: { token } })
    return undefined
  }
  return session.userId
}

export async function deleteSession(token: string): Promise<void> {
  await db.session.deleteMany({ where: { token } })
}

// ─── User management ─────────────────────────────────────────────────────────

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const row = await db.user.findUnique({ where: { email: email.toLowerCase() } })
  return row ? toUser(row) : undefined
}

export async function getUserById(id: string): Promise<User | undefined> {
  const row = await db.user.findUnique({ where: { id } })
  return row ? toUser(row) : undefined
}

export async function createUser(
  data: Omit<User, "id" | "createdAt">,
): Promise<User> {
  const row = await db.user.create({
    data: {
      email: data.email.toLowerCase(),
      passwordHash: data.passwordHash,
      name: data.name,
      role: data.role,
      phone: data.phone,
      businessName: data.businessName,
      licenseNumber: data.licenseNumber,
      serviceCategories: data.serviceCategories
        ? JSON.stringify(data.serviceCategories)
        : undefined,
      subscription: data.subscription,
      address: data.address,
    },
  })
  return toUser(row)
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

// ─── Leads ────────────────────────────────────────────────────────────────────

export async function getLeadsForContractor(contractorId: string): Promise<Lead[]> {
  const rows = await db.lead.findMany({
    where: { contractorId },
    orderBy: { createdAt: "desc" },
  })
  return rows.map(toLead)
}

export async function addLead(
  contractorId: string,
  lead: Omit<Lead, "id" | "createdAt">,
): Promise<Lead> {
  const row = await db.lead.create({
    data: {
      contractorId,
      homeownerId: lead.homeownerId,
      homeownerName: lead.homeownerName,
      service: lead.service,
      description: lead.description,
      budget: lead.budget,
      address: lead.address,
      photos: lead.photos,
      status: lead.status,
      tier: lead.tier,
      value: lead.value,
      consultationWindow: lead.consultationWindow,
      notes: lead.notes,
    },
  })
  return toLead(row)
}

export async function updateLeadStatus(
  contractorId: string,
  leadId: string,
  status: Lead["status"],
  notes?: string,
): Promise<Lead | null> {
  const existing = await db.lead.findFirst({ where: { id: leadId, contractorId } })
  if (!existing) return null
  const row = await db.lead.update({
    where: { id: leadId },
    data: { status, ...(notes !== undefined ? { notes } : {}) },
  })
  return toLead(row)
}

// ─── Requests ─────────────────────────────────────────────────────────────────

export async function getRequestsForHomeowner(homeownerId: string): Promise<Request[]> {
  const rows = await db.request.findMany({
    where: { homeownerId },
    orderBy: { createdAt: "desc" },
  })
  return rows.map(toRequest)
}

export async function addRequest(
  homeownerId: string,
  data: Omit<Request, "id" | "createdAt" | "status">,
): Promise<Request> {
  const row = await db.request.create({
    data: {
      homeownerId,
      service: data.service,
      description: data.description,
      budget: data.budget,
      address: data.address,
      photos: data.photos ?? 0,
      consultationWindow: data.consultationWindow,
      status: "pending",
    },
  })
  return toRequest(row)
}

export async function updateRequestStatus(
  homeownerId: string,
  requestId: string,
  status: Request["status"],
): Promise<Request | null> {
  const existing = await db.request.findFirst({ where: { id: requestId, homeownerId } })
  if (!existing) return null
  const row = await db.request.update({
    where: { id: requestId },
    data: { status, updatedAt: new Date() },
  })
  return toRequest(row)
}
