"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { SearchBar } from "@/components/search-bar";
import { CategoryFilters } from "@/components/category-filters";
import { GoalCard } from "@/components/goal-card";
import { PostGoalButton } from "@/components/post-goal-button";
import { fetchAvailableGoals } from "@/lib/api";
import { transformHomeGoals, HomeGoal } from "@/lib/transformers";
import { Shield, Star, Zap } from "lucide-react";

// Demo goals shown when API returns empty or fails
const DEMO_GOALS: HomeGoal[] = [
  {
    id: "demo-1",
    name: "Alex M.",
    initials: "AM",
    avatarColor: "#10b981",
    postedTime: "2h ago",
    reward: 50,
    title: "Run Every Morning — 30 Days",
    description: "Training for a 5K. Need someone to check in at 7am daily and call me out if I skip. Simple text confirmation.",
    duration: "1 month",
    category: "Fitness",
    categoryIcon: "fitness",
  },
  {
    id: "demo-2",
    name: "Priya K.",
    initials: "PK",
    avatarColor: "#8b5cf6",
    postedTime: "5h ago",
    reward: 75,
    title: "Job Interview Prep — 3/week",
    description: "Preparing for tech interviews at top companies. Looking for someone to quiz me on LeetCode problems and system design 3x a week.",
    duration: "6 weeks",
    category: "Career",
    categoryIcon: "career",
  },
  {
    id: "demo-3",
    name: "James R.",
    initials: "JR",
    avatarColor: "#f59e0b",
    postedTime: "1d ago",
    reward: 40,
    title: "Public Speaking Practice",
    description: "Overcoming stage fright. Need a partner for weekly recorded speeches with honest feedback. Toastmasters-style accountability.",
    duration: "2 months",
    category: "Career",
    categoryIcon: "career",
  },
];

function GoalCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-card p-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="h-10 w-10 shrink-0 rounded-full bg-muted" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="h-3 w-16 rounded bg-muted" />
          </div>
        </div>
        <div className="h-6 w-14 rounded-full bg-muted" />
      </div>
      <div className="mt-4 h-5 w-3/4 rounded bg-muted" />
      <div className="mt-2 h-3 w-full rounded bg-muted" />
      <div className="mt-1 h-3 w-5/6 rounded bg-muted" />
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-3">
          <div className="h-4 w-20 rounded bg-muted" />
          <div className="h-4 w-16 rounded bg-muted" />
        </div>
        <div className="h-4 w-14 rounded bg-muted" />
      </div>
    </div>
  );
}

export default function Home() {
  const [goals, setGoals] = useState<HomeGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  useEffect(() => {
    async function loadGoals() {
      try {
        const apiGoals = await fetchAvailableGoals();
        const sortedGoals = [...(apiGoals || [])].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        const transformed = transformHomeGoals(sortedGoals);
        setGoals(transformed.length > 0 ? transformed : DEMO_GOALS);
      } catch (error) {
        console.error("Failed to fetch goals:", error);
        setGoals(DEMO_GOALS);
      } finally {
        setIsLoading(false);
      }
    }
    loadGoals();
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      <main className="mx-auto max-w-6xl px-4 pb-32 md:pb-12 lg:px-8">
        <HeroSection />

        {/* Trust Score Explainer */}
        <div className="mt-6 rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            How Trust Points Work
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Pledged Points</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Goal-setters stake points when posting a goal — skin in the game.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Earned by Assistants</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Complete the trial and the pledged pts transfer to you as reward.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15">
                <Star className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Builds Your Reputation</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  A high trust score unlocks better goals and higher-value partnerships.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          <aside className="lg:sticky lg:top-20 lg:w-72 lg:shrink-0">
            <SearchBar />
            <CategoryFilters
              active={activeCategory}
              setActive={setActiveCategory}
            />
            <div className="hidden lg:block">
              <PostGoalButton />
            </div>
          </aside>

          <section className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                Recent Requests
                <span className="h-2 w-2 rounded-full bg-primary" />
              </h2>
            </div>

            {isLoading ? (
              <div className="flex flex-col gap-4">
                {[1, 2, 3].map((i) => (
                  <GoalCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {goals
                  .filter(
                    (goal) =>
                      activeCategory === "All" ||
                      goal.category.toLowerCase() ===
                        activeCategory.toLowerCase(),
                  )
                  .map((goal) => (
                    <GoalCard key={goal.id} {...goal} />
                  ))}
              </div>
            )}
          </section>
        </div>

        <div className="lg:hidden">
          <PostGoalButton />
        </div>
      </main>
    </div>
  );
}
