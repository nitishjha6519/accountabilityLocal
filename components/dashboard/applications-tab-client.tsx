import Link from "next/link";
import { Clock, ArrowRight, Star } from "lucide-react";
import { StatusBadge } from "./status-badge";

interface Applicant {
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

interface ApplicationsTabClientProps {
  filter: "received" | "shortlisted" | "archived";
  onFilterChange: (filter: "received" | "shortlisted" | "archived") => void;
  applicants: Applicant[];
}

// Map filter to status
const filterToStatus: Record<
  "received" | "shortlisted" | "archived",
  "pending" | "accepted" | "rejected"
> = {
  received: "pending",
  shortlisted: "accepted",
  archived: "rejected",
};

export function ApplicationsTabClient({
  filter,
  onFilterChange,
  applicants,
}: ApplicationsTabClientProps) {
  // Filter applicants by status
  const filteredApplicants = applicants.filter(
    (app) => app.status === filterToStatus[filter],
  );

  // Count by status for badges
  const pendingCount = applicants.filter((a) => a.status === "pending").length;
  const acceptedCount = applicants.filter(
    (a) => a.status === "accepted",
  ).length;
  const rejectedCount = applicants.filter(
    (a) => a.status === "rejected",
  ).length;

  return (
    <>
      {/* Application Filters */}
      <div className="mb-4 flex gap-2">
        {(["received", "shortlisted", "archived"] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => onFilterChange(cat)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filter === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-foreground"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
            {cat === "received" && pendingCount > 0 && ` (${pendingCount})`}
            {cat === "shortlisted" &&
              acceptedCount > 0 &&
              ` (${acceptedCount})`}
            {cat === "archived" && rejectedCount > 0 && ` (${rejectedCount})`}
          </button>
        ))}
      </div>

      <p className="mb-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {filter === "received"
          ? "New Applicants"
          : filter === "shortlisted"
            ? "Shortlisted"
            : "Archived"}
      </p>

      {/* Applicant Cards */}
      <div className="flex flex-col gap-4">
        {filteredApplicants.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No applications found.
          </p>
        ) : (
          filteredApplicants.map((applicant) => (
            <div key={applicant.id} className="rounded-2xl bg-card p-4">
              <div className="mb-2 flex justify-end">
                <span className="text-xs text-primary">
                  Goal: {applicant.goalTitle}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Link
                  href={`/assistant-profile/${applicant.id}`}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-medium text-white transition-opacity hover:opacity-80"
                  style={{ backgroundColor: applicant.avatarColor }}
                >
                  {applicant.initials}
                </Link>
                <div className="flex-1">
                  <Link
                    href={`/assistant-profile/${applicant.id}`}
                    className="hover:underline"
                  >
                    <h3 className="font-semibold text-foreground">
                      {applicant.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="flex items-center gap-1 text-warning">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      {applicant.rating}
                    </span>
                    <span className="text-muted-foreground">
                      • {applicant.specialty}
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-3 text-sm text-muted-foreground">
                {applicant.pitch}
              </p>

              <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    Applied {applicant.appliedTime}
                  </span>
                  <span className="text-reward">
                    {applicant.reward} Trust pts
                  </span>
                </div>
                <Link
                  href={`/applicant/${applicant.id}`}
                  className="flex items-center gap-1 text-sm font-medium text-primary"
                >
                  Details <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
