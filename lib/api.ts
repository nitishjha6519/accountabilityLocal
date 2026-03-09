import { getToken } from "@/lib/auth";
import { getCurrentClientId } from "@/lib/transformers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

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
export async function fetchUserGoals(clientId?: string) {
  const id = clientId || getCurrentClientId();
  if (!id) throw new Error("User not logged in");
  return apiGet<any[]>(`/goals/client/${id}`);
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
// Application endpoints
export async function submitApplication(data: {
  clientId: string;
  goalId: string;
  assistantId: string;
  pitch: string;
  status: "pending";
  trialStatus: "none";
}) {
  return apiPost("/applications", data);
}

// Fetch applications by assistant ID (for assistant's "my applications" view)
export async function fetchApplicationsByAssistant(assistantId: string) {
  return apiGet<any[]>(`/applications/assistant/${assistantId}`);
}

// Fetch applications by client ID (for client's "received applications" view)
export async function fetchApplicationsByClient(clientId: string) {
  return apiGet<any[]>(`/applications/client/${clientId}`);
}

// Fetch single application by ID
export async function fetchApplicationById(applicationId: string) {
  return apiGet<any>(`/applications/${applicationId}`);
}

// Update application status (accept/reject)
export async function updateApplicationStatus(
  applicationId: string,
  status: "accepted" | "rejected",
) {
  return apiPatch(`/applications/${applicationId}`, { status });
}

// Submit feedback for a session
export interface FeedbackPayload {
  applicationId: string;
  providedBy: string;
  receivedBy: string;
  sessionDate: string;
  clientPresent: boolean;
  assistantPresent: boolean;
  stars: number;
  comment: string;
}

// Submit feedback as client
export async function submitFeedbackAsClient(data: FeedbackPayload) {
  return apiPost("/feedback/client", data as unknown as Record<string, unknown>);
}

// Submit feedback as assistant
export async function submitFeedbackAsAssistant(data: FeedbackPayload) {
  return apiPost("/feedback/assistant", data as unknown as Record<string, unknown>);
}

// Fetch feedback for an application
export interface FeedbackEntry {
  _id: string;
  applicationId: string;
  providedBy: string;
  receivedBy: string;
  sessionDate: string;
  clientPresent: boolean;
  assistantPresent: boolean;
  stars?: number;
  comment?: string;
  createdAt: string;
}

export async function fetchFeedbackByApplication(applicationId: string) {
  return apiGet<FeedbackEntry[]>(`/feedback/application/${applicationId}`);
}

// Fetch feedback by client ID
export async function fetchFeedbackByClient(clientId: string) {
  return apiGet<FeedbackEntry[]>(`/feedback/client/${clientId}`);
}
