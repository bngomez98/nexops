import { generateId } from "./utils";

export type UserRole = "homeowner" | "contractor";

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  name: string;
  phone?: string;
  createdAt: Date;
  // contractor-specific
  company?: string;
  licenseNumber?: string;
  insuranceExpiry?: string;
  membershipTier?: "standard" | "premium" | "elite";
  membershipActive?: boolean;
}

export interface ProjectRequest {
  id: string;
  homeownerId: string;
  homeownerName: string;
  title: string;
  description: string;
  category: ServiceCategory;
  maxBudget: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  photos: string[];
  status: "open" | "claimed" | "completed" | "cancelled";
  claimedBy?: string; // contractor user id
  claimedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type ServiceCategory =
  | "tree_removal"
  | "concrete"
  | "roofing"
  | "hvac"
  | "fencing"
  | "electrical"
  | "plumbing"
  | "excavation";

export const SERVICE_LABELS: Record<ServiceCategory, string> = {
  tree_removal: "Tree Removal",
  concrete: "Concrete Work",
  roofing: "Roofing",
  hvac: "HVAC",
  fencing: "Fencing",
  electrical: "Electrical",
  plumbing: "Plumbing",
  excavation: "Excavation",
};

export const BUDGET_RANGES: Record<ServiceCategory, string> = {
  tree_removal: "$500 – $8,000",
  concrete: "$1,200 – $15,000",
  roofing: "$300 – $25,000",
  hvac: "$3,000 – $20,000",
  fencing: "$1,500 – $8,000",
  electrical: "$500 – $10,000",
  plumbing: "TBD",
  excavation: "TBD",
};

// In-memory store (development)
class Store {
  private users: Map<string, User> = new Map();
  private sessions: Map<string, string> = new Map(); // sessionToken -> userId
  private requests: Map<string, ProjectRequest> = new Map();

  constructor() {
    this.seed();
  }

  private seed() {
    // Seed homeowner
    const homeownerId = generateId();
    this.users.set(homeownerId, {
      id: homeownerId,
      email: "homeowner@example.com",
      passwordHash: "password123", // plain for dev
      role: "homeowner",
      name: "Jane Smith",
      phone: "785-555-0101",
      createdAt: new Date("2024-01-15"),
    });

    // Seed contractor
    const contractorId = generateId();
    this.users.set(contractorId, {
      id: contractorId,
      email: "contractor@example.com",
      passwordHash: "password123",
      role: "contractor",
      name: "Bob Johnson",
      phone: "785-555-0202",
      company: "Johnson Home Services",
      licenseNumber: "KS-12345",
      insuranceExpiry: "2026-06-01",
      membershipTier: "premium",
      membershipActive: true,
      createdAt: new Date("2024-01-10"),
    });

    // Seed project requests
    const requestData: Omit<ProjectRequest, "id" | "homeownerId" | "homeownerName" | "createdAt" | "updatedAt">[] = [
      {
        title: "Large oak tree removal",
        description: "Two large oak trees in backyard need removal. One is close to the fence line. No stump grinding needed.",
        category: "tree_removal",
        maxBudget: 3500,
        address: "1234 SW 29th St",
        city: "Topeka",
        state: "KS",
        zip: "66614",
        photos: [],
        status: "open",
      },
      {
        title: "Concrete driveway replacement",
        description: "Current driveway is cracked and heaved. Need complete removal and replacement, approximately 800 sqft.",
        category: "concrete",
        maxBudget: 8000,
        address: "4567 SW Gage Blvd",
        city: "Topeka",
        state: "KS",
        zip: "66604",
        photos: [],
        status: "open",
      },
      {
        title: "Roof replacement after hail damage",
        description: "Hail damage from last spring storm. Insurance claim approved. Need full shingle replacement.",
        category: "roofing",
        maxBudget: 15000,
        address: "789 NE Gordon St",
        city: "Topeka",
        state: "KS",
        zip: "66616",
        photos: [],
        status: "open",
      },
      {
        title: "HVAC system replacement",
        description: "20-year-old system needs replacement. 2,200 sqft home. Would prefer high-efficiency unit.",
        category: "hvac",
        maxBudget: 12000,
        address: "321 SE 6th Ave",
        city: "Topeka",
        state: "KS",
        zip: "66607",
        photos: [],
        status: "open",
      },
      {
        title: "Privacy fence installation",
        description: "Need 6ft wood privacy fence around backyard, approximately 180 linear feet.",
        category: "fencing",
        maxBudget: 5500,
        address: "654 SW Fairlawn Rd",
        city: "Topeka",
        state: "KS",
        zip: "66614",
        photos: [],
        status: "open",
      },
      {
        title: "Electrical panel upgrade",
        description: "Need to upgrade 100A panel to 200A. House was built in 1978.",
        category: "electrical",
        maxBudget: 4000,
        address: "987 NW Topeka Blvd",
        city: "Topeka",
        state: "KS",
        zip: "66608",
        photos: [],
        status: "open",
      },
    ];

    for (const data of requestData) {
      const id = generateId();
      const now = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
      this.requests.set(id, {
        id,
        homeownerId,
        homeownerName: "Jane Smith",
        ...data,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  // Users
  findUserByEmail(email: string): User | undefined {
    for (const user of this.users.values()) {
      if (user.email === email) return user;
    }
  }

  findUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  createUser(data: Omit<User, "id" | "createdAt">): User {
    const id = generateId();
    const user: User = { ...data, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  updateUser(id: string, data: Partial<User>): User | undefined {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...data };
    this.users.set(id, updated);
    return updated;
  }

  // Sessions
  createSession(userId: string): string {
    const token = generateId() + generateId();
    this.sessions.set(token, userId);
    return token;
  }

  getUserIdBySession(token: string): string | undefined {
    return this.sessions.get(token);
  }

  deleteSession(token: string): void {
    this.sessions.delete(token);
  }

  // Requests
  getOpenRequests(): ProjectRequest[] {
    return Array.from(this.requests.values())
      .filter((r) => r.status === "open")
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getRequestsByHomeowner(homeownerId: string): ProjectRequest[] {
    return Array.from(this.requests.values())
      .filter((r) => r.homeownerId === homeownerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getClaimedByContractor(contractorId: string): ProjectRequest[] {
    return Array.from(this.requests.values())
      .filter((r) => r.claimedBy === contractorId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getRequestById(id: string): ProjectRequest | undefined {
    return this.requests.get(id);
  }

  createRequest(data: Omit<ProjectRequest, "id" | "createdAt" | "updatedAt">): ProjectRequest {
    const id = generateId();
    const now = new Date();
    const request: ProjectRequest = { ...data, id, createdAt: now, updatedAt: now };
    this.requests.set(id, request);
    return request;
  }

  claimRequest(requestId: string, contractorId: string): ProjectRequest | undefined {
    const request = this.requests.get(requestId);
    if (!request || request.status !== "open") return undefined;
    const updated: ProjectRequest = {
      ...request,
      status: "claimed",
      claimedBy: contractorId,
      claimedAt: new Date(),
      updatedAt: new Date(),
    };
    this.requests.set(requestId, updated);
    return updated;
  }

  updateRequest(id: string, data: Partial<ProjectRequest>): ProjectRequest | undefined {
    const request = this.requests.get(id);
    if (!request) return undefined;
    const updated = { ...request, ...data, updatedAt: new Date() };
    this.requests.set(id, updated);
    return updated;
  }
}

// Singleton instance
const globalStore = globalThis as typeof globalThis & { __store?: Store };
if (!globalStore.__store) {
  globalStore.__store = new Store();
}

export const store = globalStore.__store;
