import Link from "next/link";

interface Trial {
  id: string;
  goalTitle: string;
  partnerName: string;
  partnerInitials: string;
  avatarColor: string;
  weeklyStreak?: number;
  totalProgress?: string;
  startDate: string;
  endDate: string;
  frequency: "Daily" | "3x Weekly";
  status?: "pending" | "accepted" | "rejected";
}

interface TrialsTabProps {
  trials: Trial[];
  filter: "active" | "history";
  onFilterChange: (filter: "active" | "history") => void;
  role: "client" | "assistant";
}

function isActive(trial: Trial): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(trial.startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(trial.endDate);
  end.setHours(23, 59, 59, 999);
  return today >= start && today <= end;
}

function isHistory(trial: Trial): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(trial.endDate);
  end.setHours(23, 59, 59, 999);
  return today > end;
}

function getDaysProgress(trial: Trial): { completed: number; total: number } {
  const start = new Date(trial.startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(trial.endDate);
  end.setHours(23, 59, 59, 999);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const totalDays =
    Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  let completedDays = 0;
  if (today >= start) {
    if (today > end) {
      completedDays = totalDays; // Trial ended, all days completed
    } else {
      completedDays =
        Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) +
        1;
    }
  }

  return { completed: completedDays, total: totalDays };
}

export function TrialsTab({
  trials,
  filter,
  onFilterChange,
  role,
}: TrialsTabProps) {
  // Only show trials with status 'accepted'
  // const acceptedTrials = trials.filter((trial) => trial.status === "accepted");

  // Filter trials based on date range
  const filteredTrials = trials.filter((trial) => {
    const active = isActive(trial);
    const history = isHistory(trial);
    if (filter === "active") {
      return active;
    } else {
      return history;
    }
  });

  // Count for badges
  const activeCount = trials.filter(isActive).length;
  const historyCount = trials.filter(isHistory).length;
  console.log(
    "TrialsTab: activeCount:",
    activeCount,
    "historyCount:",
    historyCount,
  );

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
            {cat === "active" && activeCount > 0 && ` (${activeCount})`}
            {cat === "history" && historyCount > 0 && ` (${historyCount})`}
          </button>
        ))}
      </div>

      {/* Trial Cards */}
      <div className="flex flex-col gap-4">
        {filteredTrials.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No {filter} trials found.
          </p>
        ) : (
          filteredTrials.map((trial) => (
            <Link
              key={trial.id}
              href={`/attendance/${trial.id}?role=${role}`}
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
              </div>

              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <span>
                  {new Date(trial.startDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                  {" - "}
                  {new Date(trial.endDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="text-primary">{trial.frequency}</span>
              </div>

              {(() => {
                const progress = getDaysProgress(trial);
                const percentage = Math.min(
                  (progress.completed / progress.total) * 100,
                  100,
                );
                return (
                  <>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Days Completed
                      </span>
                      <span className="font-medium text-foreground">
                        {progress.completed}/{progress.total} Days
                      </span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-success"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </>
                );
              })()}
            </Link>
          ))
        )}
      </div>
    </>
  );
}
