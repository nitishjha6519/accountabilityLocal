export interface AuthUser {
  id: string
  email: string
  fullName: string
  initials: string
}

interface AuthData {
  access_token: string
  user: AuthUser
}

const AUTH_KEY = "auth_data"

export function saveAuth(data: AuthData) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(data))
  }
}

export function getAuth(): AuthData | null {
  if (typeof window === "undefined") return null
  const stored = sessionStorage.getItem(AUTH_KEY)
  if (!stored) return null
  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

export function getToken(): string | null {
  return getAuth()?.access_token ?? null
}

export function getUser(): AuthUser | null {
  return getAuth()?.user ?? null
}

export function clearAuth() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(AUTH_KEY)
  }
}

export function isLoggedIn(): boolean {
  return getAuth() !== null
}
