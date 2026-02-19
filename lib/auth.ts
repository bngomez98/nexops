export interface AuthUser {
  id: string
  email: string
  name: string
  role: "homeowner" | "contractor"
  phone?: string
  businessName?: string
  licenseNumber?: string
  serviceCategories?: string[]
  subscription?: "basic" | "premium" | "elite"
  address?: string
  createdAt: string
}

const USER_KEY = "nexops_user"

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null
  try {
    const stored = localStorage.getItem(USER_KEY)
    return stored ? (JSON.parse(stored) as AuthUser) : null
  } catch {
    return null
  }
}

export function storeUser(user: AuthUser): void {
  if (typeof window === "undefined") return
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearUser(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(USER_KEY)
}
