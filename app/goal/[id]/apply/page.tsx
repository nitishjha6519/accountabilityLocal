"use client"

import React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { ChevronLeft, Dumbbell, Calendar, Briefcase, Languages, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { apiPost } from "@/lib/api"
import { getUser } from "@/lib/auth"

const goalsData: Record<string, {
  title: string
  ownerName: string
  ownerInitials: string
  avatarColor: string
  reward: number
  rewardFrequency: string
  category: string
  categoryIcon: "fitness" | "career" | "language" | "business"
  checkInType: string
}> = {
  "1": {
    title: "Run a Marathon in 6 Months",
    ownerName: "Jane Doe",
    ownerInitials: "JD",
    avatarColor: "#3b82f6",
    reward: 50,
    rewardFrequency: "/week",
    category: "Fitness",
    categoryIcon: "fitness",
    checkInType: "Daily Check-in",
  },
  "2": {
    title: "Finish my Novel Draft",
    ownerName: "Sarah Jenkins",
    ownerInitials: "SJ",
    avatarColor: "#6366f1",
    reward: 50,
    rewardFrequency: "",
    category: "Career",
    categoryIcon: "career",
    checkInType: "Daily Check-in",
  },
  "3": {
    title: "Run a Marathon",
    ownerName: "David Chen",
    ownerInitials: "DC",
    avatarColor: "#f59e0b",
    reward: 120,
    rewardFrequency: "",
    category: "Fitness",
    categoryIcon: "fitness",
    checkInType: "Daily Check-in",
  },
  "4": {
    title: "Learn French Basics",
    ownerName: "Maria K.",
    ownerInitials: "MK",
    avatarColor: "#10b981",
    reward: 30,
    rewardFrequency: "/week",
    category: "Language",
    categoryIcon: "language",
    checkInType: "Daily Check-in",
  },
  "5": {
    title: "Launch MVP",
    ownerName: "James O'Connor",
    ownerInitials: "JO",
    avatarColor: "#3b82f6",
    reward: 200,
    rewardFrequency: "",
    category: "Business",
    categoryIcon: "business",
    checkInType: "2x Daily Check-in",
  },
}

const iconMap = {
  fitness: Dumbbell,
  career: Briefcase,
  language: Languages,
  business: Briefcase,
}

export default function ApplyPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const [pitch, setPitch] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const maxChars = 500

  const goal = goalsData[id] || goalsData["1"]
  const CategoryIcon = iconMap[goal.categoryIcon]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const user = getUser()
    if (!user) {
      setError("Please log in to apply")
      return
    }
    setIsSubmitting(true)
    setError("")
    try {
      await apiPost("/applications", {
        goalId: id,
        assistantId: user.id,
        pitch,
      })
      router.push("/dashboard?role=assistant&tab=applications&filter=pending")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit application")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href={`/goal/${id}`} className="text-foreground">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-lg font-semibold text-foreground">Apply to Goal</h1>
          <div className="w-6" />
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6">
        <div className="rounded-2xl bg-card p-4">
          <div className="flex items-start gap-3">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-medium text-white"
              style={{ backgroundColor: goal.avatarColor }}
            >
              {goal.ownerInitials}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-foreground">{goal.title}</h3>
              <p className="mt-0.5 text-sm text-primary">
                ${goal.reward}{goal.rewardFrequency} <span className="text-muted-foreground">• {goal.ownerName}</span>
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground">
              <CategoryIcon className="h-3.5 w-3.5" />
              {goal.category}
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {goal.checkInType}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Your Pitch</h3>
            <div className="mt-3 rounded-xl border border-border bg-card">
              <textarea
                value={pitch}
                onChange={(e) => setPitch(e.target.value.slice(0, maxChars))}
                placeholder="Hi Jane, I see you're aiming for a marathon! I have 3 years of experience helping runners build endurance safely. Here is how I can help you stay on track..."
                rows={6}
                className="w-full resize-none bg-transparent px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <div className="flex justify-end border-t border-border px-4 py-2">
                <span className="text-sm text-muted-foreground">{pitch.length}/{maxChars}</span>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Mention your relevant experience and how you plan to keep the client accountable to their specific goal.
            </p>
          </div>

          {error && (
            <div className="mt-4 rounded-xl bg-destructive/10 p-3 text-center text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="mt-8 pb-8">
            <Button
              type="submit"
              disabled={isSubmitting || !pitch.trim()}
              className="w-full gap-2 rounded-xl bg-primary py-6 text-base font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application
                  <span className="ml-1">{">"}</span>
                </>
              )}
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              By submitting, you agree to our{" "}
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>
              .
            </p>
          </div>
        </form>
      </main>
    </div>
  )
}
