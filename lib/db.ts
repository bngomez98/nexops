import { User, ProjectRequest, Session, ContractorProfile, UserRole } from './types'

// In-memory database for development
// In production, this would be replaced with a real database (PostgreSQL, MongoDB, etc.)
export const database = {
  users: new Map<string, User>(),
  projects: new Map<string, ProjectRequest>(),
  sessions: new Map<string, Session>(),
  contractorProfiles: new Map<string, ContractorProfile>(),
}

// Helper function to generate IDs
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

// User operations
export async function getUserByEmail(email: string): Promise<User | null> {
  for (const user of database.users.values()) {
    if (user.email === email) {
      return user
    }
  }
  return null
}

export async function getUserById(userId: string): Promise<User | null> {
  return database.users.get(userId) || null
}

export async function createUser(
  email: string,
  passwordHash: string,
  name: string,
  role: UserRole
): Promise<User> {
  const id = generateId()
  const user: User = {
    id,
    email,
    passwordHash,
    name,
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  database.users.set(id, user)
  return user
}

// Project operations
export async function createProjectRequest(
  homeownerId: string,
  category: any,
  title: string,
  description: string,
  location: string,
  budget?: number
): Promise<ProjectRequest> {
  const id = generateId()
  const project: ProjectRequest = {
    id,
    homeownerId,
    category,
    title,
    description,
    location,
    budget,
    status: 'open',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  database.projects.set(id, project)
  return project
}

export async function getProjectById(projectId: string): Promise<ProjectRequest | null> {
  return database.projects.get(projectId) || null
}

export async function getOpenProjects(): Promise<ProjectRequest[]> {
  return Array.from(database.projects.values()).filter(p => p.status === 'open')
}

export async function getProjectsByHomeowner(homeownerId: string): Promise<ProjectRequest[]> {
  return Array.from(database.projects.values()).filter(p => p.homeownerId === homeownerId)
}

export async function claimProject(projectId: string, contractorId: string): Promise<ProjectRequest | null> {
  const project = database.projects.get(projectId)
  if (project) {
    project.claimedBy = contractorId
    project.status = 'claimed'
    project.updatedAt = new Date()
    database.projects.set(projectId, project)
  }
  return project || null
}

// Session operations
export async function createSession(userId: string): Promise<Session> {
  const id = generateId()
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  const session: Session = {
    id,
    userId,
    expiresAt,
    createdAt: new Date(),
  }
  database.sessions.set(id, session)
  return session
}

export async function getSessionById(sessionId: string): Promise<Session | null> {
  const session = database.sessions.get(sessionId)
  if (session && session.expiresAt > new Date()) {
    return session
  }
  if (session && session.expiresAt <= new Date()) {
    database.sessions.delete(sessionId)
  }
  return null
}

export async function deleteSession(sessionId: string): Promise<void> {
  database.sessions.delete(sessionId)
}

// Contractor profile operations
export async function getContractorProfile(userId: string): Promise<ContractorProfile | null> {
  return database.contractorProfiles.get(userId) || null
}

export async function createContractorProfile(
  userId: string,
  companyName: string,
  licenseNumber: string,
  yearsInBusiness: number,
  serviceCategories: any[],
  bio: string
): Promise<ContractorProfile> {
  const membershipExpiresAt = new Date()
  membershipExpiresAt.setDate(membershipExpiresAt.getDate() + 30) // 30-day trial

  const profile: ContractorProfile = {
    userId,
    companyName,
    licenseNumber,
    yearsInBusiness,
    serviceCategories,
    averageRating: 0,
    totalReviews: 0,
    membershipTier: 'free',
    membershipExpiresAt,
    maxActiveProjects: 3,
    currentActiveProjects: 0,
    bio,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  database.contractorProfiles.set(userId, profile)
  return profile
}

export async function updateContractorMembership(
  userId: string,
  tier: string,
  maxProjects: number
): Promise<ContractorProfile | null> {
  const profile = database.contractorProfiles.get(userId)
  if (profile) {
    profile.membershipTier = tier as any
    profile.maxActiveProjects = maxProjects
    profile.membershipExpiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
    profile.updatedAt = new Date()
    database.contractorProfiles.set(userId, profile)
  }
  return profile || null
}
