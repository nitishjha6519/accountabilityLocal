"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Pencil,
  Calendar,
  Clock,
  Bell,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiPost } from "@/lib/api";
import { getUser } from "@/lib/auth";

interface GoalData {
  title: string;
  category: string;
  motivation: string;
  startDate: string;
  endDate: string;
  duration: string;
  dailyEffort: string;
  checkInFrequency: string;
  hasPledge: boolean;
  pledgeAmount: string;
}

export default function ReviewGoalPage() {
  const router = useRouter();
  const [goalData, setGoalData] = useState<GoalData | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("pendingGoal");
    if (stored) {
      setGoalData(JSON.parse(stored));
    } else {
      router.push("/post-goal");
    }
  }, [router]);

  const handlePost = async () => {
    if (!goalData) return;
    const user = getUser();
    if (!user) {
      router.push("/login?redirect=/post-goal/review");
      return;
    }
    setIsPosting(true);
    setError("");
    try {
      await apiPost("/goals/create", {
        title: goalData.title,
        category: goalData.category,
        description: goalData.motivation,
        startDate: goalData.startDate,
        endDate: goalData.endDate,
        dailyEffort: goalData.dailyEffort,
        checkInFrequency: goalData.checkInFrequency,
        hasPledge: goalData.hasPledge,
        pledgeAmount: goalData.hasPledge
          ? Number.parseFloat(goalData.pledgeAmount)
          : 0,
        clientId: user.id,
        status: "posted",
      });
      sessionStorage.removeItem("pendingGoal");
      router.push("/dashboard?role=client&tab=goals");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post goal");
    } finally {
      setIsPosting(false);
    }
  };

  if (!goalData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const getCheckInLabel = (freq: string) => {
    switch (freq) {
      case "daily":
        return "Daily";
      case "twice-daily":
        return "2x Daily";
      case "weekly":
        return "Weekly";
      default:
        return freq;
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Not set";
    const date = new Date(dateStr + "T12:00:00");
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/post-goal" className="text-foreground">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-lg font-semibold text-foreground">
            Goal Details
          </h1>
          <Link href="/post-goal" className="text-foreground">
            <Pencil className="h-5 w-5" />
          </Link>
        </div>

        {/* Goal Title */}
        <h2 className="text-2xl font-bold text-foreground">
          {goalData.title || "Untitled Goal"}
        </h2>

        {/* Status Badges */}
        <div className="mt-3 flex gap-2">
          <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary">
            DRAFT
          </span>
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
            Not Posted
          </span>
        </div>

        {/* Date Range */}
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-card p-3 text-sm">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="text-foreground">
            {formatDate(goalData.startDate)} - {formatDate(goalData.endDate)}
          </span>
          <span className="ml-auto text-muted-foreground">
            {goalData.duration}
          </span>
        </div>

        {/* Description */}
        <section className="mt-6">
          <h3 className="font-semibold text-foreground">Description</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {goalData.motivation || "No description provided."}
          </p>
        </section>

        {/* Details */}
        <section className="mt-6">
          <h3 className="font-semibold text-foreground">Details</h3>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center rounded-xl border border-border bg-card p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Duration</p>
              <p className="text-center text-sm font-semibold text-foreground">
                {goalData.duration || "Not set"}
              </p>
            </div>
            <div className="flex flex-col items-center rounded-xl border border-border bg-card p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Daily Effort</p>
              <p className="text-center text-sm font-semibold text-foreground">
                {goalData.dailyEffort || "1-2 Hrs"}
              </p>
            </div>
            <div className="flex flex-col items-center rounded-xl border border-border bg-card p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Reminders</p>
              <p className="text-center text-sm font-semibold text-foreground">
                {getCheckInLabel(goalData.checkInFrequency)}
              </p>
            </div>
          </div>
        </section>

        {/* Trust Score */}
        {goalData.hasPledge && (
          <section className="mt-6">
            <h3 className="font-semibold text-foreground">Trust Score</h3>
            <div className="mt-3 rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Trust Points at Stake
                  </p>
                  <p className="mt-1 text-2xl font-bold text-foreground">
                    {goalData.pledgeAmount}
                    <span className="ml-1 text-sm font-normal text-muted-foreground">
                      pts
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Earned by assistant upon successful completion.
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                  <span className="text-xl text-primary">★</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-xl bg-destructive/10 p-3 text-center text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Post Button */}
        <Button
          onClick={handlePost}
          disabled={isPosting}
          className="mt-8 w-full rounded-xl bg-primary py-6 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isPosting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Posting...
            </>
          ) : (
            "Post Goal"
          )}
        </Button>
      </div>
    </div>
  );
}
