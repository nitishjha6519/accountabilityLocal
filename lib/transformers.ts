// Constants
import { getUser } from "@/lib/auth";

// Get current client ID from logged-in user
export function getCurrentClientId(): string | null {
  const user = getUser();
  return user?.id ?? null;
}

// Helper function to calculate relative time
export function getRelativeTime(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}

// Generate avatar color from string (hash-based)
export function generateColorFromString(str: string): string {
  const colors = [
    "#10b981", // emerald
    "#3b82f6", // blue
    "#f59e0b", // amber
    "#ec4899", // pink
    "#8b5cf6", // violet
    "#06b6d4", // cyan
    "#ef4444", // red
    "#14b8a6", // teal
  ];

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

// Calculate duration display text
export function getDurationDisplay(
  startDate: string | Date,
  endDate: string | Date,
): string {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end < now) {
    return "Completed";
  }

  const diffMs = start.getTime() - end.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 30) {
    return `${Math.ceil(diffDays / 30)} months`;
  }
  if (diffDays > 0) {
    return `${diffDays} days`;
  }
  return "On-going";
}

// Map API goal to frontend format
export interface APIGoal {
  _id: string;
  clientId: string;
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  startDate: string;
  endDate: string;
  dailyEffort?: string;
  checkInFrequency?: string;
  rewardAmount?: number;
  rewardPeriod?: string;
  pledgeAmount?: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface FrontendGoal {
  id: string;
  title: string;
  initials: string;
  avatarColor: string;
  postedTime: string;
  description: string;
  streak?: number;
  todayStatus?: string;
  duration: string;
  reward?: number;
  status: "on-track" | "needs-action" | "paused" | "completed";
  progress?: number;
  checkedIn?: boolean;
}

export function transformGoalData(
  apiGoal: APIGoal,
  clientName?: string,
): FrontendGoal {
  // Extract initials from title or use default
  const initials = clientName
    ? clientName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "??";

  // Determine status
  let status: "on-track" | "needs-action" | "paused" | "completed" = "on-track";
  if (new Date(apiGoal.endDate) < new Date()) {
    status = "completed";
  }

  return {
    id: apiGoal._id,
    title: apiGoal.title,
    initials,
    avatarColor: generateColorFromString(apiGoal._id),
    postedTime: getRelativeTime(apiGoal.createdAt),
    description: apiGoal.description || "",
    duration: getDurationDisplay(apiGoal.startDate, apiGoal.endDate),
    reward: apiGoal.rewardAmount || 0,
    status,
    streak: 0, // Will be populated from trial/checkin data
    todayStatus: "Pending",
  };
}

// Transform multiple goals
export function transformGoalsData(
  apiGoals: APIGoal[],
  clientMaps?: Record<string, string>,
): FrontendGoal[] {
  return apiGoals.map((goal) =>
    transformGoalData(goal, clientMaps?.[goal.clientId]),
  );
}

// Transform API goals to AvailableGoal format for assistant view
export interface AvailableGoal {
  id: string;
  title: string;
  clientName: string;
  clientInitials: string;
  avatarColor: string;
  verified: boolean;
  isNew?: boolean;
  duration: string;
  reward: number;
  rewardPeriod: string;
  description: string;
  tags: string[];
  category: "fitness" | "productivity" | "career";
}

export function transformToAvailableGoal(apiGoal: APIGoal): AvailableGoal {
  // Generate initials from clientId (use first 2 letters)
  const initials = apiGoal.clientId
    .substring(0, 2)
    .toUpperCase()
    .replace(/[^A-Z]/g, "");

  // Generate placeholder client name
  const clientName = `Client ${apiGoal.clientId.substring(0, 4)}`;

  return {
    id: apiGoal._id,
    title: apiGoal.title,
    clientName,
    clientInitials: initials || "CL",
    avatarColor: generateColorFromString(apiGoal._id),
    verified: false, // Will default to false unless explicitly marked
    duration: getDurationDisplay(apiGoal.startDate, apiGoal.endDate),
    reward: apiGoal.rewardAmount || 0,
    rewardPeriod: apiGoal.rewardPeriod || "per week",
    description: apiGoal.description || "",
    tags: apiGoal.tags || [],
    category:
      (apiGoal.category as "fitness" | "productivity" | "career") || "fitness",
  };
}

export function transformAvailableGoals(apiGoals: APIGoal[]): AvailableGoal[] {
  return apiGoals.map(transformToAvailableGoal);
}

// Home page goal card format
export interface HomeGoal {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  postedTime: string;
  reward: number;
  title: string;
  description: string;
  duration: string;
  category: string;
  categoryIcon: "fitness" | "career" | "language" | "business";
}

export function transformToHomeGoal(apiGoal: APIGoal): HomeGoal {
  // Generate client name placeholder
  const clientName = `Client ${apiGoal.clientId.substring(0, 4)}`;
  const initials = clientName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  // Map category to icon
  const categoryIconMap: Record<
    string,
    "fitness" | "career" | "language" | "business"
  > = {
    fitness: "fitness",
    productivity: "career",
    career: "career",
    language: "language",
    business: "business",
  };

  const category = apiGoal.category || "fitness";
  const categoryIcon = categoryIconMap[category.toLowerCase()] || "fitness";

  return {
    id: apiGoal._id,
    name: clientName,
    initials,
    avatarColor: generateColorFromString(apiGoal._id),
    postedTime: getRelativeTime(apiGoal.createdAt),
    reward: apiGoal.rewardAmount || apiGoal.pledgeAmount || 0,
    title: apiGoal.title,
    description: apiGoal.description || "",
    duration: getDurationDisplay(apiGoal.startDate, apiGoal.endDate),
    category: category.charAt(0).toUpperCase() + category.slice(1),
    categoryIcon,
  };
}

export function transformHomeGoals(apiGoals: APIGoal[]): HomeGoal[] {
  return apiGoals.map(transformToHomeGoal);
}

// Application transformer for assistant's submitted applications view
export interface APIApplication {
  _id: string;
  clientId:
    | string
    | null
    | {
        _id: string;
        fullName?: string;
        email?: string;
        initials?: string;
        [key: string]: unknown;
      };
  goalId:
    | string
    | {
        _id: string;
        clientId: string;
        title: string;
        description?: string;
        rewardAmount?: number;
        pledgeAmount?: number;
        startDate?: string;
        endDate?: string;
        checkInFrequency?: string;
        [key: string]: unknown;
      };
  assistantId:
    | string
    | {
        _id: string;
        fullName?: string;
        email?: string;
        initials?: string;
        [key: string]: unknown;
      };
  pitch: string;
  status: "pending" | "accepted" | "rejected";
  trialStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubmittedApplication {
  id: string;
  goalId: string;
  goalTitle: string;
  clientName: string;
  clientInitials: string;
  avatarColor: string;
  reward: number;
  appliedTime: string;
  status: "pending" | "accepted" | "rejected";
}

export function transformToSubmittedApplication(
  apiApp: APIApplication,
): SubmittedApplication {
  // Handle goalId as either string or populated object
  const goal = typeof apiApp.goalId === "object" ? apiApp.goalId : null;
  const goalIdStr =
    typeof apiApp.goalId === "object" ? apiApp.goalId._id : apiApp.goalId;

  // Handle clientId as either string, null, or populated object
  const client =
    typeof apiApp.clientId === "object" && apiApp.clientId
      ? apiApp.clientId
      : null;
  const clientIdStr =
    typeof apiApp.clientId === "object" && apiApp.clientId
      ? apiApp.clientId._id
      : typeof apiApp.clientId === "string"
        ? apiApp.clientId
        : goal?.clientId || "";

  const goalTitle = goal?.title || "Goal";
  const clientName =
    client?.fullName ||
    `Client ${clientIdStr ? clientIdStr.substring(0, 4) : "????"}`;
  const clientInitials =
    client?.initials ||
    clientName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

  return {
    id: apiApp._id,
    goalId: goalIdStr,
    goalTitle,
    clientName,
    clientInitials,
    avatarColor: generateColorFromString(clientIdStr || apiApp._id),
    reward: goal?.rewardAmount || goal?.pledgeAmount || 0,
    appliedTime: getRelativeTime(apiApp.createdAt),
    status: apiApp.status,
  };
}

export function transformSubmittedApplications(
  apiApps: APIApplication[],
): SubmittedApplication[] {
  return apiApps.map(transformToSubmittedApplication);
}

// Received application transformer for client's "received applications" view
export interface ReceivedApplicant {
  id: string;
  goalId: string;
  name: string;
  initials: string;
  avatarColor: string;
  rating: number;
  specialty: string;
  pitch: string;
  appliedTime: string;
  reward: number;
  goalTitle: string;
  status: "pending" | "accepted" | "rejected";
}

export function transformToReceivedApplicant(
  apiApp: APIApplication,
): ReceivedApplicant {
  // Handle goalId as either string or populated object
  const goal = typeof apiApp.goalId === "object" ? apiApp.goalId : null;
  const goalIdStr =
    typeof apiApp.goalId === "object" ? apiApp.goalId._id : apiApp.goalId;

  // Handle assistantId as either string or populated object
  const assistant =
    typeof apiApp.assistantId === "object" ? apiApp.assistantId : null;
  const assistantIdStr =
    typeof apiApp.assistantId === "object"
      ? apiApp.assistantId._id
      : apiApp.assistantId;

  const goalTitle = goal?.title || "Goal";
  const assistantName =
    assistant?.fullName || `Assistant ${assistantIdStr.substring(0, 4)}`;
  const initials =
    assistant?.initials ||
    assistantName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

  return {
    id: apiApp._id,
    goalId: goalIdStr,
    name: assistantName,
    initials,
    avatarColor: generateColorFromString(assistantIdStr),
    rating: 0, // Will be populated from user profile if available
    specialty: "Accountability Partner",
    pitch: apiApp.pitch || "",
    appliedTime: getRelativeTime(apiApp.createdAt),
    reward: goal?.rewardAmount || goal?.pledgeAmount || 0,
    goalTitle,
    status: apiApp.status,
  };
}

export function transformReceivedApplicants(
  apiApps: APIApplication[],
): ReceivedApplicant[] {
  return apiApps.map(transformToReceivedApplicant);
}

// Trial interface matching trials-tab.tsx
export interface Trial {
  id: string;
  goalTitle: string;
  partnerName: string;
  partnerInitials: string;
  avatarColor: string;
  startDate: string;
  endDate: string;
  frequency: "Daily" | "3x Weekly";
}

// Transform accepted applications to trials
// For clients: partner is the assistant
// For assistants: partner is the client
export function transformToTrials(
  apiApps: APIApplication[],
  viewerRole: "client" | "assistant",
): Trial[] {
  // Filter only accepted applications
  const acceptedApps = apiApps.filter((app) => app.status === "accepted");

  return acceptedApps.map((apiApp) => {
    // Handle goalId as either string or populated object
    const goal = typeof apiApp.goalId === "object" ? apiApp.goalId : null;

    // Handle assistantId and clientId
    const assistant =
      typeof apiApp.assistantId === "object" ? apiApp.assistantId : null;
    const assistantIdStr =
      typeof apiApp.assistantId === "object"
        ? apiApp.assistantId._id
        : apiApp.assistantId;

    const client =
      typeof apiApp.clientId === "object" && apiApp.clientId
        ? apiApp.clientId
        : null;
    const clientIdStr =
      typeof apiApp.clientId === "object" && apiApp.clientId
        ? apiApp.clientId._id
        : typeof apiApp.clientId === "string"
          ? apiApp.clientId
          : "";

    // Determine partner based on viewer role
    let partnerName: string;
    let partnerIdStr: string;

    if (viewerRole === "client") {
      // Client views assistant as partner
      partnerName =
        assistant?.fullName || `Assistant ${assistantIdStr.substring(0, 4)}`;
      partnerIdStr = assistantIdStr;
    } else {
      // Assistant views client as partner
      partnerName =
        client?.fullName ||
        (clientIdStr ? `Client ${clientIdStr.substring(0, 4)}` : "Client");
      partnerIdStr = clientIdStr || apiApp._id;
    }

    const partnerInitials = partnerName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

    // Map checkInFrequency to frequency type
    const freqStr =
      typeof goal?.checkInFrequency === "string"
        ? goal.checkInFrequency.toLowerCase()
        : "daily";
    const frequency: "Daily" | "3x Weekly" = freqStr.includes("3")
      ? "3x Weekly"
      : "Daily";

    // Get dates with proper type conversion
    const startDate =
      typeof goal?.startDate === "string" ? goal.startDate : apiApp.createdAt;
    const endDate =
      typeof goal?.endDate === "string" ? goal.endDate : apiApp.createdAt;

    return {
      id: apiApp._id,
      goalTitle: goal?.title || "Goal",
      partnerName,
      partnerInitials,
      avatarColor: generateColorFromString(partnerIdStr),
      startDate,
      endDate,
      frequency,
    };
  });
}
