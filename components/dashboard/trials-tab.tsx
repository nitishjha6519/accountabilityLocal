import Link from "next/link";
import { StatusBadge } from "./status-badge";

interface Trial {
  id: string;
  goalTitle: string;
  partnerName: string;
  partnerInitials: string;
  avatarColor: string;
  weeklyStreak?: number;
  totalProgress?: string;
  status: "done" | "starting-soon" | "completed";
  startDate: string;
  endDate: string;
  frequency: "Daily" | "3x Weekly";
}

interface TrialsTabProps {
  trials: Trial[];
  filter: "active" | "history";
  onFilterChange: (filter: "active" | "history") => void;
}

export function TrialsTab({ trials, filter, onFilterChange }: TrialsTabProps) {
  return (
    <>
      <div className="mb-2">
        <h2 className="text-xl font-semibold text-foreground">My Trials</h2>
        <p className="text-sm text-muted-foreground">
          Manage your active accountability partnerships
        </p>
      </div>

      {/* Trial Filters */}
      <div className="my-4 flex gap-2">
        {(["active", "history"] as const).map((cat) => (
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
          </button>
        ))}
      </div>

      {/* Trial Cards */}
      <div className="flex flex-col gap-4">
        {trials.map((trial) => (
          <Link
            key={trial.id}
            href={`/attendance/${trial.id}`}
            className="block rounded-2xl bg-card p-4 transition-colors hover:bg-card/80"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: trial.avatarColor }}
                >
                  {trial.partnerInitials}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {trial.goalTitle}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {trial.partnerName}
                  </p>
                </div>
              </div>
              <StatusBadge status={trial.status} />
            </div>

            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              <span>
                {new Date(trial.startDate + "T12:00:00").toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                  },
                )}
                {" - "}
                {new Date(trial.endDate + "T12:00:00").toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric", year: "numeric" },
                )}
              </span>
              <span className="text-primary">{trial.frequency}</span>
            </div>

            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {trial.totalProgress ? "Total Progress" : "Weekly Streak"}
              </span>
              <span className="font-medium text-foreground">
                {trial.totalProgress || `${trial.weeklyStreak} Days`}
              </span>
            </div>

            {!trial.totalProgress && trial.weeklyStreak !== undefined && (
              <div className="mt-2 h-2 rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-success"
                  style={{ width: `${(trial.weeklyStreak / 7) * 100}%` }}
                />
              </div>
            )}
          </Link>
        ))}
      </div>
    </>
  );
}
