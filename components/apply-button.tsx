"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users, Clock, XCircle } from "lucide-react";
import { submitApplication } from "@/lib/api";
import { getUser } from "@/lib/auth";

interface ApplyButtonProps {
  goalId: string;
  clientId: string;
  startDate?: string;
  endDate?: string;
}

export function ApplyButton({ goalId, clientId, startDate, endDate }: ApplyButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pitch, setPitch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Get assistantId from logged-in user
  const user = getUser();
  const assistantId = user?.id;

  // Determine goal status based on dates
  const now = new Date();
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  const isExpired = end && now > end;
  const isOngoing = start && end && now >= start && now <= end;
  const canApply = !isExpired && !isOngoing;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!assistantId) {
      window.location.href = `/users/signin?redirect=/goal/${goalId}`;
      return;
    }

    if (!pitch.trim()) {
      setError("Please enter your pitch");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await submitApplication({
        clientId,
        goalId,
        assistantId,
        pitch: pitch.trim(),
        status: "pending",
        trialStatus: "none",
      });

      setSubmitted(true);
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message || "Failed to submit application");
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="mt-8 pb-8">
        <div className="rounded-xl border border-green-500 bg-green-50 dark:bg-green-900/20 p-6 text-center">
          <p className="text-green-700 dark:text-green-400 font-semibold">
            Application submitted successfully!
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            The goal owner will review your application.
          </p>
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="mt-8 pb-8">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-border bg-card p-6"
        >
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Your Pitch
            </label>
            <textarea
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              placeholder="Tell the goal owner why you're a good fit for this goal. Share your experience and expertise..."
              className="min-h-[120px] w-full rounded-lg border border-border bg-background p-3 text-foreground placeholder-muted-foreground"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={() => setShowForm(false)}
              disabled={isLoading}
              className="flex-1 rounded-xl border border-border bg-background py-3 font-semibold text-foreground hover:bg-secondary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 gap-2 rounded-xl bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="mt-8 pb-8">
      {isExpired ? (
        <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-muted py-6 text-base font-semibold text-muted-foreground">
          <XCircle className="h-5 w-5" />
          Expired
        </div>
      ) : isOngoing ? (
        <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500/20 py-6 text-base font-semibold text-amber-600">
          <Clock className="h-5 w-5" />
          Ongoing
        </div>
      ) : (
        <Button
          onClick={() => setShowForm(true)}
          className="w-full gap-2 rounded-xl bg-primary py-6 text-base font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <Users className="h-5 w-5" />
          Apply
        </Button>
      )}
    </div>
  );
}
