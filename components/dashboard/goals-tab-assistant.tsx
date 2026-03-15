import Link from "next/link";
import {
  ArrowRight,
  Rocket,
  Users,
  Sliders,
  CheckCircle2,
  Calendar,
  Clock,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/auth";

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

interface AvailableGoal {
  id: string;
  clientId: string;
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
  startDate?: string;
  endDate?: string;
  status?: string;
}

interface GoalsTabAssistantProps {
  goals: AvailableGoal[];
  filter: "all" | "fitness" | "productivity" | "career";
  onFilterChange: (
    filter: "all" | "fitness" | "productivity" | "career",
  ) => void;
  appliedGoalIds?: string[];
}

export function GoalsTabAssistant({
  goals,
  filter,
  onFilterChange,
  appliedGoalIds = [],
}: GoalsTabAssistantProps) {
  const router = useRouter();
  const currentUserId = getUser()?.id;
  const filteredGoals = goals.filter(
    (goal) =>
      goal.clientId !== currentUserId &&
      (filter === "all" || goal.category === filter),
  );
  return (
    <>
      {/* Discover Hero */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          Ready to inspire
          <br />
          <span className="text-primary">someone today?</span>
        </h2>
      </div>

      {/* Assistant Stats Cards */}
      {/*
      <div className="mb-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground">ACTIVE CLIENTS</p>
          <p className="mt-1 text-2xl font-bold text-foreground">0</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-success/20">
            <span className="text-sm text-success">$</span>
          </div>
          <p className="text-xs text-muted-foreground">EARNINGS</p>
          <p className="mt-1 text-2xl font-bold text-foreground">$0.00</p>
        </div>
      </div>
      */}
      {/* Earnings section: show only accepted applications with end date passed */}
      <div className="mb-6 grid grid-cols-1 gap-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-success/20">
            <span className="text-sm text-success">★</span>
          </div>
          <p className="text-xs text-muted-foreground">EARNINGS</p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {goals
              .filter(
                (goal) =>
                  goal.status === "accepted" &&
                  goal.endDate &&
                  new Date(goal.endDate) < new Date(),
              )
              .reduce((sum, goal) => sum + (goal.reward || 0), 0)}{" "}
            Trust pts
          </p>
        </div>
      </div>

      {/* Getting Started Guide */}
      <div className="mb-6 rounded-2xl bg-primary/10 p-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="rounded bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
              NEW
            </span>
            <h3 className="mt-2 font-semibold text-foreground">
              Getting Started Guide
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Learn the best practices to land your first client and set
              competitive rates.
            </p>
            <button className="mt-3 flex items-center gap-1 text-sm font-medium text-primary">
              Read the guide <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/20">
            <Rocket className="h-8 w-8 text-primary" />
          </div>
        </div>
      </div>

      {/* Available Goals Section */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Available Goals
        </h2>
        <button className="text-muted-foreground">
          <Sliders className="h-5 w-5" />
        </button>
      </div>

      {/* Category Filters */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {(["all", "fitness", "productivity", "career"] as const).map(
          (cat, i) => (
            <button
              key={i}
              onClick={() => onFilterChange(cat)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                filter === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground"
              }`}
            >
              {cat === "all"
                ? "All Goals"
                : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ),
        )}
      </div>

      {/* Available Goal Cards */}
      <div className="flex flex-col gap-4">
        {filteredGoals.map((goal) => (
          <div key={goal.id} className="rounded-2xl bg-card p-4">
            <div className="flex items-start gap-3">
              <Link
                href={`/client-profile/${goal.clientId}`}
                className="hover:underline"
              >
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: goal.avatarColor }}
                >
                  {goal.clientInitials}
                </div>
              </Link>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {goal.title}
                    </h3>
                    <div className="flex items-center gap-1 text-sm">
                      <Link
                        href={`/client-profile/${goal.clientId}`}
                        className="text-sm text-muted-foreground hover:underline"
                      >
                        by {goal.clientName}
                      </Link>

                      {goal.verified && (
                        <span className="flex items-center gap-0.5 text-primary">
                          • <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                        </span>
                      )}
                      {goal.isNew && (
                        <span className="text-muted-foreground">• New</span>
                      )}
                    </div>
                  </div>
                  {/* <div className="text-right">
                    <p className="font-semibold text-foreground">
                      ${goal.reward}
                      <span className="text-sm font-normal text-muted-foreground">
                        {goal.rewardPeriod}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {goal.duration}
                    </p>
                  </div> */}
                </div>
              </div>
            </div>

            <p className="mt-3 text-sm text-muted-foreground">
              {goal.description}
            </p>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {/*   {goal.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}*/}
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {goal.duration}
                  </span>
                  <span className="text-reward">{goal.reward} Trust pts</span>
                </div>
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
                if (goal.status?.toLowerCase() === "applications-closed") {
                  return (
                    <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-sm font-medium text-muted-foreground">
                      <XCircle className="h-4 w-4" />
                      Applications Closed
                    </span>
                  );
                }
                if (appliedGoalIds.includes(goal.id)) {
                  return (
                    <span className="flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1.5 text-sm font-medium text-primary">
                      <CheckCircle2 className="h-4 w-4" />
                      Applied
                    </span>
                  );
                }
                return (
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => {
                      router.push(`/goal/${goal.id}`);
                    }}
                  >
                    Apply
                  </Button>
                );
              })()}
            </div>
          </div>
        ))}
      </div>

      {/* View All Link */}
      <button className="mt-6 flex w-full items-center justify-center gap-1 text-sm text-muted-foreground">
        View all opportunities <ArrowRight className="h-4 w-4" />
      </button>
    </>
  );
}
