import Link from "next/link";
import {
  Calendar,
  ArrowRight,
  Flame,
  Rocket,
  Check,
  Clock,
  XCircle,
} from "lucide-react";
import { StatusBadge } from "./status-badge";

interface GoalData {
  id: string;
  title: string;
  initials: string;
  avatarColor: string;
  postedTime: string;
  description: string;
  streak?: number;
  todayStatus?: string;
  progress?: number;
  checkedIn?: boolean;
  duration: string;
  reward?: number;
  status: "on-track" | "needs-action" | "paused" | "completed";
  startDate?: string;
  endDate?: string;
}

interface GoalsTabClientProps {
  goals: GoalData[];
}

// Helper function to determine goal status
function getGoalStatus(
  startDate?: string,
  endDate?: string,
): "open" | "ongoing" | "expired" {
  const now = new Date();
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  if (end && now > end) return "expired";
  if (start && end && now >= start && now <= end) return "ongoing";
  return "open";
}

export function GoalsTabClient({ goals }: GoalsTabClientProps) {
  console.log("goals", goals);

  // Calculate stats from goals data based on date status
  const activeGoals = goals.filter(
    (g) => getGoalStatus(g.startDate, g.endDate) !== "expired",
  ).length;
  const expiredGoals = goals.filter(
    (g) => getGoalStatus(g.startDate, g.endDate) === "expired",
  ).length;
  const totalStaked = goals.reduce((sum, g) => sum + (g.reward || 0), 0);

  return (
    <>
      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-card p-3">
          <p className="text-xs text-muted-foreground">Active</p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {activeGoals}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3">
          <p className="text-xs text-muted-foreground">Completed</p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {expiredGoals}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3">
          <p className="text-xs text-muted-foreground">Trust pts</p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {totalStaked}
          </p>
        </div>
      </div>

      {/* Goal Cards */}
      <div className="flex flex-col gap-4">
        {goals.map((goal) => (
          <div key={goal.id} className="rounded-2xl bg-card p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: goal.avatarColor }}
                >
                  {goal.initials}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {goal.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Posted {goal.postedTime}
                  </p>
                </div>
              </div>
              {/* <StatusBadge status={goal.status} /> */}
            </div>

            <p className="mt-3 text-sm text-muted-foreground">
              {goal.description}
            </p>

            {/* {goal.status === "on-track" && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Flame className="h-4 w-4" />
                    Streak: {goal.streak} days
                  </span>
                  <span className="text-warning">
                    Today: {goal.todayStatus}
                  </span>
                </div>
                <div className="mt-2 flex gap-1">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded-full ${i < (goal.streak || 0) ? "bg-success" : "bg-destructive"}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {goal.status === "needs-action" && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Rocket className="h-4 w-4" />
                    Progress: {goal.progress}%
                  </span>
                  <span className="flex items-center gap-1 text-success">
                    <Check className="h-4 w-4" />
                    Checked In
                  </span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
            )} */}

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {goal.duration}
                </span>
                <span className="text-reward">{goal.reward} Trust pts</span>
              </div>
              {(() => {
                const status = getGoalStatus(goal.startDate, goal.endDate);
                if (status === "expired") {
                  return (
                    <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-sm font-medium text-muted-foreground">
                      <XCircle className="h-4 w-4" />
                      Expired
                    </span>
                  );
                }
                if (status === "ongoing") {
                  return (
                    <span className="flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1.5 text-sm font-medium text-amber-600">
                      <Clock className="h-4 w-4" />
                      Ongoing
                    </span>
                  );
                }
                return (
                  <Link
                    href={`/goal/${goal.id}`}
                    className="flex items-center gap-1 text-sm font-medium text-primary"
                  >
                    Details <ArrowRight className="h-4 w-4" />
                  </Link>
                );
              })()}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
