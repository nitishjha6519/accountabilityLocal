import { getToken } from "@/lib/auth";
import { CURRENT_CLIENT_ID } from "@/lib/transformers";

// const BASE_URL = "https://accountability-backend-six.vercel.app";
const BASE_URL = "http://localhost:3001";

function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export async function apiPost<T = unknown>(
  path: string,
  body: Record<string, unknown>,
): Promise<T> {
  console.log({
    url: `${BASE_URL}${path}`,
    method: "POST",
    headers: authHeaders(),
    body: body,
  });

  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });

  console.log("res", res);

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || `API error: ${res.status}`);
  }
  return res.json();
}

export async function apiPatch<T = unknown>(
  path: string,
  body: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || `API error: ${res.status}`);
  }
  return res.json();
}

export async function apiGet<T = unknown>(path: string): Promise<T> {
  console.log({
    url: `${BASE_URL}${path}`,
    method: "GET",
    headers: authHeaders(),
  });

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: authHeaders(),
  });

  console.log("API Response:", {
    status: res.status,
    statusText: res.statusText,
  });

  if (!res.ok) {
    const error = await res.text();
    console.error("API Error Response:", error);
    throw new Error(error || `API error: ${res.status}`);
  }

  const text = await res.text();
  console.log("API Response Text:", text);

  if (!text) {
    throw new Error("Empty response from API");
  }

  return JSON.parse(text);
}
// Goals endpoints
export async function fetchUserGoals(clientId: string = CURRENT_CLIENT_ID) {
  return apiGet<any[]>(`/goals/client/${clientId}`);
}

export async function fetchAvailableGoals() {
  return apiGet<any[]>(`/goals/all`);
}

export async function fetchGoalById(id: string) {
  return apiGet(`/goals/${id}`);
}

export async function createGoal(data: Record<string, unknown>) {
  return apiPost("/goals", data);
}
