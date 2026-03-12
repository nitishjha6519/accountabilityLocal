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

export default function Home() {
  const [goals, setGoals] = useState<HomeGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  useEffect(() => {
    async function loadGoals() {
      try {
        const apiGoals = await fetchAvailableGoals();
        // Sort by newest first (descending by createdAt)
        const sortedGoals = [...(apiGoals || [])].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        const transformed = transformHomeGoals(sortedGoals);
        setGoals(transformed);
      } catch (error) {
        console.error("Failed to fetch goals:", error);
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

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          <aside className="lg:sticky lg:top-4 lg:w-72 lg:shrink-0">
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
              {/* <button className="text-sm font-medium text-primary hover:underline">
                View all
              </button> */}
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">Loading goals...</p>
              </div>
            ) : goals.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">No goals available yet.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
