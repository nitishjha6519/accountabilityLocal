import { ChevronLeft, Pencil, Calendar, Clock, Bell, Users, DollarSign, Dumbbell, Briefcase, Languages } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const goalsData: Record<string, {
  title: string
  ownerName: string
  ownerInitials: string
  avatarColor: string
  reward: number
  rewardFrequency: string
  description: string
  duration: string
  dailyEffort: string
  reminders: string
  category: string
  categoryIcon: "fitness" | "career" | "language" | "business"
  status: string
}> = {
  "1": {
    title: "Marathon Training Prep",
    ownerName: "Jane Doe",
    ownerInitials: "JD",
    avatarColor: "#3b82f6",
    reward: 50,
    rewardFrequency: "/week",
    description: "I need to stick to my 16-week running schedule. I tend to skip the long Sunday runs when I get busy or tired. I need someone to check my Strava logs every Monday morning to ensure I completed the weekend long run.",
    duration: "16 Weeks",
    dailyEffort: "1-2 Hrs",
    reminders: "3x Weekly",
    category: "Fitness",
    categoryIcon: "fitness",
    status: "Active Goal",
  },
  "2": {
    title: "Finish my Novel Draft",
    ownerName: "Sarah Jenkins",
    ownerInitials: "SJ",
    avatarColor: "#6366f1",
    reward: 50,
    rewardFrequency: "",
    description: "I need someone to check in on me every morning at 7 AM to ensure I've written my 500 words. Writer's block is real and I need accountability to push through it.",
    duration: "30 Days",
    dailyEffort: "2-3 Hrs",
    reminders: "Daily",
    category: "Career",
    categoryIcon: "career",
    status: "Active Goal",
  },
  "3": {
    title: "Run a Marathon",
    ownerName: "David Chen",
    ownerInitials: "DC",
    avatarColor: "#f59e0b",
    reward: 120,
    rewardFrequency: "",
    description: "Training for my first marathon. Need accountability for my training schedule and diet. Looking for someone who has experience with endurance training.",
    duration: "3 Months",
    dailyEffort: "1-2 Hrs",
    reminders: "Daily",
    category: "Fitness",
    categoryIcon: "fitness",
    status: "Active Goal",
  },
  "4": {
    title: "Learn French Basics",
    ownerName: "Maria K.",
    ownerInitials: "MK",
    avatarColor: "#10b981",
    reward: 30,
    rewardFrequency: "/week",
    description: "I have Duolingo but I ignore the owl. I need a real human to message me \"Did you practice?\" every day and hold me accountable for at least 30 minutes of French practice.",
    duration: "On-going",
    dailyEffort: "30 Min",
    reminders: "Daily",
    category: "Language",
    categoryIcon: "language",
    status: "Active Goal",
  },
  "5": {
    title: "Launch MVP",
    ownerName: "James O'Connor",
    ownerInitials: "JO",
    avatarColor: "#3b82f6",
    reward: 200,
    rewardFrequency: "",
    description: "Startup founder needing accountability to ship my MVP by end of month. No excuses allowed. Need someone to review my daily progress and call me out when I'm procrastinating.",
    duration: "2 Weeks",
    dailyEffort: "4-6 Hrs",
    reminders: "2x Daily",
    category: "Business",
    categoryIcon: "business",
    status: "Active Goal",
  },
}

const iconMap = {
  fitness: Dumbbell,
  career: Briefcase,
  language: Languages,
  business: Briefcase,
}

export default async function GoalDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const goal = goalsData[id] || goalsData["1"]
  const CategoryIcon = iconMap[goal.categoryIcon]

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="text-foreground">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-lg font-semibold text-foreground">Goal Details</h1>
          <button className="text-foreground">
            <Pencil className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <h2 className="text-2xl font-bold text-foreground">{goal.title}</h2>
        
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary">
            <Users className="h-3.5 w-3.5" />
            SEEKING PARTNER
          </span>
          <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent">
            {goal.status}
          </span>
        </div>

        <section className="mt-6">
          <h3 className="text-lg font-semibold text-foreground">Description</h3>
          <p className="mt-2 leading-relaxed text-muted-foreground">{goal.description}</p>
        </section>

        <section className="mt-6">
          <h3 className="text-lg font-semibold text-foreground">Details</h3>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center rounded-xl bg-card p-4">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">Duration</span>
              <span className="mt-1 font-semibold text-foreground">{goal.duration}</span>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-card p-4">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">Daily Effort</span>
              <span className="mt-1 font-semibold text-foreground">{goal.dailyEffort}</span>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-card p-4">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">Reminders</span>
              <span className="mt-1 font-semibold text-foreground">{goal.reminders}</span>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <h3 className="text-lg font-semibold text-foreground">Stakes</h3>
          <div className="mt-3 flex items-center justify-between rounded-xl bg-card p-4">
            <div>
              <p className="text-sm text-muted-foreground">Commitment Pledge</p>
              <p className="mt-1 text-3xl font-bold text-foreground">
                ${goal.reward.toFixed(2)}
                <span className="text-lg font-normal text-muted-foreground">USD{goal.rewardFrequency}</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Released to assistant upon successful completion.
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
              <DollarSign className="h-6 w-6 text-accent-foreground" />
            </div>
          </div>
        </section>

        <div className="mt-8 pb-8">
          <Button asChild className="w-full gap-2 rounded-xl bg-primary py-6 text-base font-semibold text-primary-foreground hover:bg-primary/90">
            <Link href={`/goal/${id}/apply`}>
              <Users className="h-5 w-5" />
              Apply
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
