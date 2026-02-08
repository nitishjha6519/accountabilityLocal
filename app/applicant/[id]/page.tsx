"use client"

import { ChevronLeft, Star, Clock, Check, X, MessageSquare, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { apiPatch } from "@/lib/api"

const applicantsData: Record<string, {
  id: string
  name: string
  initials: string
  avatarColor: string
  rating: number
  reviews: number
  specialty: string
  experience: string
  completedGoals: number
  successRate: number
  goalTitle: string
  pitch: string
  appliedTime: string
  reward: number
  availability: string
  languages: string[]
}> = {
  "1": {
    id: "1",
    name: "Alex Morgan",
    initials: "AM",
    avatarColor: "#6366f1",
    rating: 4.9,
    reviews: 127,
    specialty: "Fitness Coach",
    experience: "5+ years",
    completedGoals: 89,
    successRate: 96,
    goalTitle: "Marathon Training Prep",
    pitch: "I've helped 50+ runners complete their first marathon. I check Strava daily and send personalized feedback. I'll create a custom check-in schedule that fits your lifestyle and keeps you on track even on busy weeks.",
    appliedTime: "2 hours ago",
    reward: 50,
    availability: "Daily 6AM-10PM EST",
    languages: ["English", "Spanish"],
  },
  "2": {
    id: "2",
    name: "Jordan Lee",
    initials: "JL",
    avatarColor: "#10b981",
    rating: 4.7,
    reviews: 84,
    specialty: "Writing Coach",
    experience: "3+ years",
    completedGoals: 62,
    successRate: 94,
    goalTitle: "Finish my Novel Draft",
    pitch: "As a published author myself, I understand the struggles of writer's block. I'll check in every morning and provide motivational support plus constructive feedback on your progress.",
    appliedTime: "5 hours ago",
    reward: 50,
    availability: "Daily 7AM-9PM PST",
    languages: ["English"],
  },
  "3": {
    id: "3",
    name: "Sam Wilson",
    initials: "SW",
    avatarColor: "#f59e0b",
    rating: 4.8,
    reviews: 156,
    specialty: "Life Coach",
    experience: "7+ years",
    completedGoals: 134,
    successRate: 98,
    goalTitle: "Launch MVP",
    pitch: "I've coached 20+ startup founders to launch. I'll do daily stand-ups, help prioritize tasks, and call you out when you're making excuses. No sugarcoating - just results.",
    appliedTime: "1 day ago",
    reward: 200,
    availability: "Daily 8AM-11PM EST",
    languages: ["English", "French"],
  },
}

export default function ApplicantDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const [showConfirmModal, setShowConfirmModal] = useState<"accept" | "reject" | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")

  const id = params.id as string
  const applicant = applicantsData[id] || applicantsData["1"]

  const handleConfirm = async () => {
    setIsProcessing(true)
    setError("")
    try {
      const status = showConfirmModal === "accept" ? "accepted" : "rejected"
      await apiPatch(`/applications/${id}`, { status })
      setShowConfirmModal(null)
      router.push("/dashboard?role=client&tab=applications")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update application")
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => router.back()} className="text-foreground">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Applicant Details</h1>
          <div className="w-6" />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        {/* Profile Header */}
        <div className="flex items-start gap-4">
          <div
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-2xl font-semibold text-white"
            style={{ backgroundColor: applicant.avatarColor }}
          >
            {applicant.initials}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground">{applicant.name}</h2>
            <p className="text-muted-foreground">{applicant.specialty}</p>
            <div className="mt-2 flex items-center gap-3">
              <span className="flex items-center gap-1 text-warning">
                <Star className="h-4 w-4 fill-current" />
                {applicant.rating}
              </span>
              <span className="text-sm text-muted-foreground">({applicant.reviews} reviews)</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center rounded-xl bg-card p-4">
            <span className="text-2xl font-bold text-foreground">{applicant.completedGoals}</span>
            <span className="text-xs text-muted-foreground">Goals Completed</span>
          </div>
          <div className="flex flex-col items-center rounded-xl bg-card p-4">
            <span className="text-2xl font-bold text-foreground">{applicant.successRate}%</span>
            <span className="text-xs text-muted-foreground">Success Rate</span>
          </div>
          <div className="flex flex-col items-center rounded-xl bg-card p-4">
            <span className="text-2xl font-bold text-foreground">{applicant.experience}</span>
            <span className="text-xs text-muted-foreground">Experience</span>
          </div>
        </div>

        {/* Applying For */}
        <section className="mt-6">
          <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Applying For</h3>
          <div className="mt-2 rounded-xl bg-primary/10 p-4">
            <p className="font-semibold text-primary">{applicant.goalTitle}</p>
            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {applicant.appliedTime}
              </span>
              <span className="text-reward">${applicant.reward} Reward</span>
            </div>
          </div>
        </section>

        {/* Their Pitch */}
        <section className="mt-6">
          <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Their Pitch</h3>
          <p className="mt-2 leading-relaxed text-foreground">{applicant.pitch}</p>
        </section>

        {/* Additional Info */}
        <section className="mt-6">
          <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Availability</h3>
          <p className="mt-2 text-foreground">{applicant.availability}</p>
        </section>

        <section className="mt-4">
          <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Languages</h3>
          <div className="mt-2 flex gap-2">
            {applicant.languages.map((lang) => (
              <span key={lang} className="rounded-full bg-secondary px-3 py-1 text-sm text-foreground">
                {lang}
              </span>
            ))}
          </div>
        </section>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-3">
          <Button
            variant="outline"
            className="flex-1 gap-2 border-muted-foreground/30 bg-transparent py-6"
          >
            <MessageSquare className="h-5 w-5" />
            Message
          </Button>
        </div>

        <div className="mt-4 flex gap-3 pb-8">
          <Button
            variant="outline"
            className="flex-1 gap-2 border-destructive py-6 text-destructive hover:bg-destructive/10 bg-transparent"
            onClick={() => setShowConfirmModal("reject")}
          >
            <X className="h-5 w-5" />
            Reject
          </Button>
          <Button
            className="flex-1 gap-2 bg-primary py-6 text-primary-foreground hover:bg-primary/90"
            onClick={() => setShowConfirmModal("accept")}
          >
            <Check className="h-5 w-5" />
            Approve
          </Button>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-background p-6">
            <div className="mb-4 flex justify-center">
              <div className={`flex h-16 w-16 items-center justify-center rounded-full ${
                showConfirmModal === "accept" ? "bg-success/20" : "bg-destructive/20"
              }`}>
                {showConfirmModal === "accept" ? (
                  <Check className="h-8 w-8 text-success" />
                ) : (
                  <X className="h-8 w-8 text-destructive" />
                )}
              </div>
            </div>

            <h2 className="text-center text-lg font-semibold text-foreground">
              {showConfirmModal === "accept" ? "Approve Applicant?" : "Reject Applicant?"}
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {showConfirmModal === "accept"
                ? `You're about to approve ${applicant.name} as your accountability partner for "${applicant.goalTitle}".`
                : `You're about to reject ${applicant.name}'s application for "${applicant.goalTitle}".`
              }
            </p>

            {error && (
              <div className="mt-3 rounded-lg bg-destructive/10 p-2 text-center text-xs text-destructive">
                {error}
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => { setShowConfirmModal(null); setError(""); }}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                className={`flex-1 ${
                  showConfirmModal === "accept"
                    ? "bg-success text-white hover:bg-success/90"
                    : "bg-destructive text-white hover:bg-destructive/90"
                }`}
                onClick={handleConfirm}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  showConfirmModal === "accept" ? "Confirm" : "Reject"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
