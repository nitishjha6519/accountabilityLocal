import Link from "next/link";
import { Plus } from "lucide-react";

export function PostGoalCard() {
  return (
    <div className="px-4 py-2">
      <Link
        href="/post-goal"
        className="flex items-center justify-between rounded-2xl bg-primary p-4"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/20">
            <Plus className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-primary-foreground">
              Post a New Goal
            </h3>
            <p className="text-sm text-primary-foreground/70">
              Find an accountability partner today
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
