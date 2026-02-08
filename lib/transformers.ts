// Constants
export const CURRENT_CLIENT_ID = "65a8f4c2b1234567890abcde";

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
