const USER_KEY = "nexops_user"

export function getStoredUser() {
  if (typeof window === "undefined") return null
  try {
    const stored = localStorage.getItem(USER_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function storeUser(user) {
  if (typeof window === "undefined") return
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearUser() {
  if (typeof window === "undefined") return
  localStorage.removeItem(USER_KEY)
}
