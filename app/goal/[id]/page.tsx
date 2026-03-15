import {
  ChevronLeft,
  Pencil,
  Calendar,
  Clock,
  Bell,
  Users,
  Star,
  Dumbbell,
  Briefcase,
  Languages,
} from "lucide-react";
import Link from "next/link";
import { fetchGoalById } from "@/lib/api";
import { getDurationDisplay } from "@/lib/transformers";
import { ApplyButton } from "@/components/apply-button";

// Disable caching to always fetch fresh data
export const dynamic = "force-dynamic";

const iconMap = {
  fitness: Dumbbell,
  career: Briefcase,
  language: Languages,
  business: Briefcase,
};

export default async function GoalDetailsPage(props: any) {
  // Unwrap params and searchParams
  const params = await Promise.resolve(props.params);
  const searchParams = await Promise.resolve(props.searchParams);
  const id = params.id;
  const hideApply = searchParams?.applied === "true";
  // Fetch goal data using API utility
  let goal: any = null;
  try {
    goal = await fetchGoalById(id);
    console.log("Fetched goal:", goal);
  } catch (e) {
    console.error("Error fetching goal:", e);
    return <div className="p-8 text-center text-red-500">Goal not found.</div>;
  }

  // Add default values for missing properties
  if (!goal) {
    return <div className="p-8 text-center text-red-500">Goal not found.</div>;
  }

  // Calculate duration using transformer
  let duration = "Not specified";
  if (goal.startDate && goal.endDate) {
    duration = getDurationDisplay(goal.startDate, goal.endDate);
  }

  const safeGoal = {
    title: goal.title || "Untitled Goal",
    description: goal.description || "No description",
    status: goal.status || "Active Goal",
    duration,
    dailyEffort: goal.dailyEffort || "Not specified",
    reminders: goal.reminders || "Not specified",
    reward: goal.reward ?? 0,
    rewardFrequency: goal.rewardFrequency || "",
    categoryIcon: goal.categoryIcon || goal.category || "fitness",
  };

  const categoryKey: keyof typeof iconMap =
    (safeGoal.categoryIcon as keyof typeof iconMap) || "fitness";
  const CategoryIcon = iconMap[categoryKey] || Dumbbell;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="text-foreground">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-lg font-semibold text-foreground">
            Goal Details
          </h1>
          <button className="text-foreground">
            <Pencil className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <h2 className="text-2xl font-bold text-foreground">{safeGoal.title}</h2>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary">
            <Users className="h-3.5 w-3.5" />
            SEEKING PARTNER
          </span>
          <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent">
            {safeGoal.status}
          </span>
        </div>

        <section className="mt-6">
          <h3 className="text-lg font-semibold text-foreground">Description</h3>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            {safeGoal.description}
          </p>
        </section>

        <section className="mt-6">
          <h3 className="text-lg font-semibold text-foreground">Details</h3>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center rounded-xl bg-card p-4">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                <Calendar className="h-5 w-5 text-primary" />
              </div>

              <span className="text-xs text-muted-foreground">Duration</span>
              <span className="mt-1 font-semibold text-foreground">
                {duration}
              </span>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-card p-4">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">
                Daily Effort
              </span>
              <span className="mt-1 font-semibold text-foreground">
                {safeGoal.dailyEffort}
              </span>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-card p-4">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">Reminders</span>
              <span className="mt-1 font-semibold text-foreground">
                {safeGoal.reminders}
              </span>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <h3 className="text-lg font-semibold text-foreground">Trust Score</h3>
          <div className="mt-3 flex items-center justify-between rounded-xl bg-card p-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Trust Points at Stake
              </p>
              <p className="mt-1 text-3xl font-bold text-foreground">
                {safeGoal.reward}
                <span className="text-lg font-normal text-muted-foreground">
                  {" "}
                  pts
                </span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Earned by assistant upon successful completion.
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
              <Star className="h-6 w-6 text-accent-foreground" />
            </div>
          </div>
        </section>

        {!hideApply && (
          <div className="mt-8 pb-8">
            <ApplyButton
              goalId={id}
              clientId={goal.clientId}
              startDate={goal.startDate}
              endDate={goal.endDate}
            />
          </div>
        )}
      </main>
    </div>
  );
}
