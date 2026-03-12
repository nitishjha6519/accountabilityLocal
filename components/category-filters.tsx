"use client";

import { useState } from "react";

const categories = ["Fitness", "Interview", "Speaking"];

export function CategoryFilters({
  active,
  setActive,
}: {
  active: string;
  setActive: (cat: string) => void;
}) {
  return (
    <div className="py-4">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide lg:flex-wrap lg:overflow-visible lg:pb-0">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActive(category)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active === category
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-foreground hover:bg-secondary/80"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
