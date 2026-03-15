import Link from "next/link";
import {
  Calendar,
  Clock,
  Dumbbell,
  Briefcase,
  Languages,
  ArrowRight,
  XCircle,
} from "lucide-react";

interface GoalCardProps {
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
  startDate?: string;
  endDate?: string;
  status?: string;
}

const iconMap = {
  fitness: Dumbbell,
  career: Briefcase,
  language: Languages,
  business: Briefcase,
};

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

export function GoalCard({
  id,
  name,
  initials,
  avatarColor,
  postedTime,
  reward,
  title,
  description,
  duration,
  category,
  categoryIcon,
  startDate,
  endDate,
  status,
}: GoalCardProps) {
  const CategoryIcon = iconMap[categoryIcon];
  const goalStatus = getGoalStatus(startDate, endDate);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-card p-4 transition-shadow hover:shadow-lg hover:shadow-primary/5">
      <div className="flex items-start gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-medium text-white"
            style={{ backgroundColor: avatarColor }}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-foreground">{name}</p>
            <p className="text-sm text-muted-foreground">Posted {postedTime}</p>
          </div>
        </div>
        <span className="shrink-0 whitespace-nowrap rounded-full border border-reward px-2 py-1 text-xs font-medium text-reward">
          {reward} pts
        </span>
      </div>

      <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-1 line-clamp-2 flex-1 text-sm text-muted-foreground">
        {description}
      </p>

      <div className="mt-4 flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <Calendar className="h-4 w-4 shrink-0" />
            {duration}
          </span>
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <CategoryIcon className="h-4 w-4 shrink-0" />
            {category}
          </span>
        </div>
        {status?.toLowerCase() === "applications-closed" ? (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
            <XCircle className="h-3.5 w-3.5" />
            Applications Closed
          </span>
        ) : goalStatus === "expired" ? (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
            <XCircle className="h-3.5 w-3.5" />
            Expired
          </span>
        ) : goalStatus === "ongoing" ? (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-500/20 px-2 py-1 text-xs font-medium text-amber-600">
            <Clock className="h-3.5 w-3.5" />
            Ongoing
          </span>
        ) : (
          <Link
            href={`/goal/${id}`}
            className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            Details <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
