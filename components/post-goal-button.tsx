import Link from "next/link";
import { Plus } from "lucide-react";

export function PostGoalButton() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-background via-background to-transparent p-4 pt-8 lg:static lg:mt-4 lg:bg-transparent lg:p-0">
      <Link
        href="/post-goal"
        className="flex w-full items-center justify-between rounded-2xl bg-primary px-5 py-4 text-left transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
      >
        <div>
          <p className="text-sm text-primary-foreground/80">
            The wall won't break itself
          </p>
          <p className="text-lg font-semibold text-primary-foreground">
            Post Goal
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20">
          <Plus className="h-6 w-6 text-primary-foreground" />
        </div>
      </Link>
    </div>
  );
}
