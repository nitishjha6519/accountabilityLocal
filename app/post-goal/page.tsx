"use client";

import React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PostGoalPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [motivation, setMotivation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dailyEffort, setDailyEffort] = useState("1 hour");
  const [customDailyEffort, setCustomDailyEffort] = useState("");
  const [checkInFrequency, setCheckInFrequency] = useState("daily");
  const [customCheckInFrequency, setCustomCheckInFrequency] = useState("");
  const [hasPledge, setHasPledge] = useState(true);
  const [pledgeAmount, setPledgeAmount] = useState("50.00");

  const dailyEffortOptions = [
    "30 mins",
    "45 mins",
    "1 hour",
    "2 hours",
    "3 hours",
  ];

  const handleDailyEffortChange = (value: string) => {
    if (value === "custom") {
      setDailyEffort("custom");
      setCustomDailyEffort("");
    } else {
      setDailyEffort(value);
      setCustomDailyEffort("");
    }
  };

  const handleCheckInFrequencyChange = (value: string) => {
    if (value === "custom") {
      setCheckInFrequency("custom");
      setCustomCheckInFrequency("");
    } else {
      setCheckInFrequency(value);
      setCustomCheckInFrequency("");
    }
  };

  // Calculate duration display from dates
  const getDurationDisplay = () => {
    if (!startDate || !endDate) return "";
    const start = new Date(startDate + "T12:00:00");
    const end = new Date(endDate + "T12:00:00");
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return "";
    if (diffDays < 7) return `${diffDays} Days`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} Weeks`;
    return `${Math.round(diffDays / 30)} Months`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalDailyEffort =
      dailyEffort === "custom" ? customDailyEffort : dailyEffort;
    const finalCheckInFrequency =
      checkInFrequency === "custom" ? customCheckInFrequency : checkInFrequency;
    const goalData = {
      title,
      motivation,
      startDate,
      endDate,
      duration: getDurationDisplay(),
      dailyEffort: finalDailyEffort,
      checkInFrequency: finalCheckInFrequency,
      hasPledge,
      pledgeAmount,
    };
    sessionStorage.setItem("pendingGoal", JSON.stringify(goalData));
    router.push("/post-goal/review");
  };

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/dashboard" className="text-foreground">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-lg font-semibold text-foreground">New Goal</h1>
          <div className="w-6" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Define Your Goal */}
          <section>
            <h2 className="text-2xl font-bold text-foreground">
              Define Your Goal
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Set the terms for your accountability partner.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">
                  Goal Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Run a 5k Marathon"
                  className="mt-2 w-full rounded-xl bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">
                  Why is this important?
                </label>
                <textarea
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  placeholder="Describe your motivation and what achieving this means to you..."
                  rows={4}
                  className="mt-2 w-full resize-none rounded-xl bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </section>

          {/* The Logistics */}
          <section>
            <h2 className="text-xl font-bold text-foreground">The Logistics</h2>

            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">
                  Start Date
                </label>
                <div className="relative mt-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-xl bg-input px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary [color-scheme:dark]"
                  />
                  <Calendar className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">
                  End Date
                </label>
                <div className="relative mt-2">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || undefined}
                    className="w-full rounded-xl bg-input px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary [color-scheme:dark]"
                  />
                  <Calendar className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

              {startDate && endDate && (
                <div className="rounded-xl bg-primary/10 px-4 py-3">
                  <p className="text-sm text-primary">
                    Duration:{" "}
                    <span className="font-semibold">
                      {getDurationDisplay()}
                    </span>
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-foreground">
                  Daily Effort Expectation
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {dailyEffortOptions.map((effort) => (
                    <button
                      key={effort}
                      type="button"
                      onClick={() => handleDailyEffortChange(effort)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        dailyEffort === effort
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground"
                      }`}
                    >
                      {effort}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleDailyEffortChange("custom")}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      dailyEffort === "custom"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground"
                    }`}
                  >
                    Custom
                  </button>
                </div>

                {dailyEffort === "custom" && (
                  <input
                    type="text"
                    value={customDailyEffort}
                    onChange={(e) => setCustomDailyEffort(e.target.value)}
                    placeholder="e.g., 90 mins, 4 hours, etc."
                    className="mt-3 w-full rounded-xl bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                )}
              </div>
            </div>
          </section>

          {/* Accountability Level */}
          <section>
            <h2 className="text-xl font-bold text-foreground">
              Accountability Level
            </h2>

            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">
                  Check-in Frequency
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["daily", "twice-daily", "weekly"] as const).map((freq) => (
                    <button
                      key={freq}
                      type="button"
                      onClick={() => handleCheckInFrequencyChange(freq)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        checkInFrequency === freq
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground"
                      }`}
                    >
                      {freq === "daily"
                        ? "Daily"
                        : freq === "twice-daily"
                          ? "Twice Daily"
                          : "Weekly"}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleCheckInFrequencyChange("custom")}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      checkInFrequency === "custom"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground"
                    }`}
                  >
                    Custom
                  </button>
                </div>

                {checkInFrequency === "custom" && (
                  <input
                    type="text"
                    value={customCheckInFrequency}
                    onChange={(e) => setCustomCheckInFrequency(e.target.value)}
                    placeholder="e.g., 3 times per week, every Monday, etc."
                    className="mt-3 w-full rounded-xl bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                )}
              </div>

              <div className="rounded-xl bg-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      Trust Score Pledge
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Points at stake for this goal
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHasPledge(!hasPledge)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      hasPledge ? "bg-primary" : "bg-secondary"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                        hasPledge ? "left-[22px]" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>

                {hasPledge && (
                  <div className="mt-4">
                    <div className="flex items-center rounded-xl bg-input">
                      <input
                        type="text"
                        value={pledgeAmount}
                        onChange={(e) => setPledgeAmount(e.target.value)}
                        className="flex-1 bg-transparent py-3 px-4 text-foreground focus:outline-none"
                      />
                      <span className="px-4 text-muted-foreground">pts</span>
                    </div>
                    <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <span className="text-warning">*</span> Points earned by
                      assistant on goal completion
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full rounded-xl bg-primary py-6 text-primary-foreground hover:bg-primary/90"
          >
            {"Post Goal to Marketplace ->"}
          </Button>
        </form>
      </div>
    </div>
  );
}
