export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  initials: string;
}

interface AuthData {
  access_token: string;
  user: AuthUser;
}

interface JWTPayload {
  exp?: number;
  iat?: number;
  sub?: string;
  [key: string]: unknown;
}

const AUTH_KEY = "auth_data";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Decode JWT token without verification (for client-side expiration check)
function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

// Check if JWT token is expired
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return false; // If no exp, assume valid
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

// Get token expiration time
export function getTokenExpiration(token: string): Date | null {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return null;
  return new Date(payload.exp * 1000);
}

export function saveAuth(data: AuthData) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(data));
  }
}

export function getAuth(): AuthData | null {
  if (typeof window === "undefined") return null;
  const stored = sessionStorage.getItem(AUTH_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  return getAuth()?.access_token ?? null;
}

export function getUser(): AuthUser | null {
  return getAuth()?.user ?? null;
}

export function clearAuth() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(AUTH_KEY);
  }
}

export function isLoggedIn(): boolean {
  const auth = getAuth();
  if (!auth) return false;
  if (isTokenExpired(auth.access_token)) {
    clearAuth();
    return false;
  }
  return true;
}

// JWT Login function
export async function login(
  email: string,
  password: string,
): Promise<AuthData> {
  try {
    const res = await fetch(`${BASE_URL}/users/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || `Login failed: ${res.status}`);
    }

    const data: AuthData = await res.json();
    saveAuth(data);
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to login");
  }
}

// JWT Logout function
export function logout() {
  clearAuth();
}
