import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { SearchBar } from "@/components/search-bar"
import { CategoryFilters } from "@/components/category-filters"
import { GoalCard } from "@/components/goal-card"
import { PostGoalButton } from "@/components/post-goal-button"

const goals = [
  {
    id: "2",
    name: "Sarah Jenkins",
    initials: "SJ",
    avatarColor: "#6366f1",
    postedTime: "2h ago",
    reward: 50,
    title: "Finish my Novel Draft",
    description:
      "I need someone to check in on me every morning at 7 AM to ensure I've written my 500 words.",
    duration: "30 Days",
    category: "Daily Check-in",
    categoryIcon: "career" as const,
  },
  {
    id: "3",
    name: "David Chen",
    initials: "DC",
    avatarColor: "#f59e0b",
    postedTime: "5h ago",
    reward: 120,
    title: "Run a Marathon",
    description:
      "Training for my first marathon. Need accountability for my training schedule and diet.",
    duration: "3 Months",
    category: "Fitness",
    categoryIcon: "fitness" as const,
  },
  {
    id: "4",
    name: "Maria K.",
    initials: "MK",
    avatarColor: "#10b981",
    postedTime: "1d ago",
    reward: 30,
    title: "Learn French Basics",
    description:
      'I have Duolingo but I ignore the owl. I need a real human to message me "Did you practice?" every...',
    duration: "On-going",
    category: "Language",
    categoryIcon: "language" as const,
  },
  {
    id: "5",
    name: "James O'Connor",
    initials: "JO",
    avatarColor: "#3b82f6",
    postedTime: "3h ago",
    reward: 200,
    title: "Launch MVP",
    description:
      "Startup founder needing accountability to ship my MVP by end of month. No excuses allowed.",
    duration: "2 Weeks",
    category: "Business",
    categoryIcon: "business" as const,
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      <main className="mx-auto max-w-6xl px-4 pb-32 md:pb-12 lg:px-8">
        <HeroSection />
        
        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          <aside className="lg:sticky lg:top-4 lg:w-72 lg:shrink-0">
            <SearchBar />
            <CategoryFilters />
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
              <button className="text-sm font-medium text-primary hover:underline">View all</button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {goals.map((goal) => (
                <GoalCard key={goal.id} {...goal} />
              ))}
            </div>
          </section>
        </div>

        <div className="lg:hidden">
          <PostGoalButton />
        </div>
      </main>
    </div>
  )
}
