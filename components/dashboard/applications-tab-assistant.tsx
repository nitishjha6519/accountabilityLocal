import Link from "next/link";
import { Clock, ArrowRight, Users, Check } from "lucide-react";
import { StatusBadge } from "./status-badge";

interface SubmittedApplication {
  id: string;
  goalTitle: string;
  clientName: string;
  clientId: string;
  clientInitials: string;
  avatarColor: string;
  reward: number;
  appliedTime: string;
  goalId: string;
  status: "pending" | "accepted" | "rejected";
}

interface ApplicationsTabAssistantProps {
  filter: "pending" | "accepted" | "rejected";
  onFilterChange: (filter: "pending" | "accepted" | "rejected") => void;
  submittedApplications: SubmittedApplication[];
}

export function ApplicationsTabAssistant({
  filter,
  onFilterChange,
  submittedApplications,
}: ApplicationsTabAssistantProps) {
  // Count applications by status
  const pendingCount = submittedApplications.filter(
    (a) => a.status === "pending",
  ).length;
  const acceptedCount = submittedApplications.filter(
    (a) => a.status === "accepted",
  ).length;
  const rejectedCount = submittedApplications.filter(
    (a) => a.status === "rejected",
  ).length;

  // Calculate total earnings from accepted applications
  const totalEarnings = submittedApplications
    .filter((a) => a.status === "accepted")
    .reduce((sum, app) => sum + app.reward, 0);

  return (
    <>
      {/* Filter Tabs for Assistant */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {(["pending", "accepted", "rejected"] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => onFilterChange(cat)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filter === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-foreground"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
            {cat === "pending" && pendingCount > 0 && ` (${pendingCount})`}
            {cat === "accepted" && acceptedCount > 0 && ` (${acceptedCount})`}
            {cat === "rejected" && rejectedCount > 0 && ` (${rejectedCount})`}
          </button>
        ))}
      </div>

      <p className="mb-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Your Applications
      </p>

      {/* Submitted Application Cards */}
      <div className="flex flex-col gap-4">
        {submittedApplications
          .filter((app) => app.status === filter)
          .map((app) => (
            <div key={app.id} className="rounded-2xl bg-card p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Link
                    href={`/client-profile/${app.clientId}`}
                    className="hover:underline"
                  >
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-medium text-white"
                      style={{ backgroundColor: app.avatarColor }}
                    >
                      {app.clientInitials}
                    </div>
                  </Link>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {app.goalTitle}
                    </h3>
                    <Link
                      href={`/client-profile/${app.clientId}`}
                      className="text-sm text-muted-foreground hover:underline"
                    >
                      by {app.clientName}
                    </Link>
                  </div>
                </div>
                <StatusBadge status={app.status} />
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  Applied {app.appliedTime}
                </span>
                <span className="text-reward">{app.reward} Trust pts</span>
              </div>

              <div className="mt-4">
                <Link
                  href={`/goal/${app.goalId}?applied=true`}
                  className="flex items-center gap-1 text-sm font-medium text-primary"
                >
                  View Details <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        {submittedApplications.filter((app) => app.status === filter).length ===
          0 && (
          <p className="text-center text-muted-foreground py-8">
            No {filter} applications found.
          </p>
        )}
      </div>
    </>
  );
}
