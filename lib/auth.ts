const USER_KEY = "nexops_user"

export type AuthUser = {
  id: number
  email: string
  fullName?: string
  name?: string
  businessName?: string
  role: "HOMEOWNER" | "CONTRACTOR" | "ADMIN" | "homeowner" | "contractor" | "admin"
  subscription?: string
  [key: string]: any
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null
  try {
    const stored = localStorage.getItem(USER_KEY)
    return stored ? (JSON.parse(stored) as AuthUser) : null
  } catch {
    return null
  }
}

export function storeUser(user: AuthUser) {
  if (typeof window === "undefined") return
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearUser() {
  if (typeof window === "undefined") return
  localStorage.removeItem(USER_KEY)
}
