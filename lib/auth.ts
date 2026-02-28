const USER_KEY = "nexops_user"

export interface AuthUser {
  id: string
  name: string
  email: string
  role: "homeowner" | "contractor"
  subscription?: string
  phone?: string
  address?: string
  businessName?: string
  licenseNumber?: string
  serviceCategories?: string[]
  createdAt?: string
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null
  try {
    const stored = localStorage.getItem(USER_KEY)
    return stored ? JSON.parse(stored) : null
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
