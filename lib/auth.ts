export interface AuthUser {
  id?: string
  fullName?: string
  name?: string
  businessName?: string
  email?: string
  role: "homeowner" | "contractor" | "admin" | string
  subscription?: string
  serviceCategories?: string[]
  [key: string]: any
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
