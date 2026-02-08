"use client"

import { useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { X, CheckCircle2, XCircle, Star, Calendar, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { apiPost } from "@/lib/api"
import { getUser } from "@/lib/auth"

const trialData: Record<string, { goalTitle: string; assistantName: string; startDate: string; endDate: string }> = {
  "1": { goalTitle: "Learn French Basics", assistantName: "Maria", startDate: "2026-01-05", endDate: "2026-03-05" },
  "2": { goalTitle: "Launch MVP", assistantName: "James", startDate: "2026-02-10", endDate: "2026-04-10" },
  "3": { goalTitle: "Marathon Prep", assistantName: "Sarah", startDate: "2025-11-01", endDate: "2025-12-01" },
}

const activityNames: Record<string, string[]> = {
  "1": ["Vocabulary Session", "Grammar Practice", "Listening Exercise", "Conversational Practice", "Writing Assignment", "Pronunciation Drill", "Reading Comprehension"],
  "2": ["Sprint Planning", "Feature Development", "Code Review", "User Testing", "Bug Fixes", "Design Review", "Deployment Prep"],
  "3": ["Morning 5K Run", "Interval Training", "Consistent Morning Workout", "Long Distance Practice", "Recovery Stretching", "Tempo Run", "Hill Repeats"],
}

function getDayName(dateStr: string) {
  const date = new Date(dateStr + "T12:00:00")
  return date.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase()
}

function getFormattedDate(dateStr: string) {
  const date = new Date(dateStr + "T12:00:00")
  const day = date.getDate()
  const month = date.toLocaleDateString("en-US", { month: "long" }).toUpperCase()
  return `${day} ${month}`
}

export default function CheckinPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = params.id as string
  const dateStr = searchParams.get("date") || new Date().toISOString().split("T")[0]

  const trial = trialData[id] || trialData["1"]
  const activities = activityNames[id] || activityNames["1"]

  // Pick activity based on date - consistent for the same date
  const dateParts = dateStr.split("-")
  const dayNum = Number.parseInt(dateParts[2])
  const monthNum = Number.parseInt(dateParts[1])
  const activityIndex = (dayNum + monthNum) % activities.length
  const activityName = activities[activityIndex]

  // Check if date is within trial range
  const isInRange = dateStr >= trial.startDate && dateStr <= trial.endDate

  const [myAttendance, setMyAttendance] = useState<"present" | "absent" | null>(null)
  const [partnerAttendance, setPartnerAttendance] = useState<"present" | "absent" | null>(null)
  const [rating, setRating] = useState(0)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const maxFeedback = 200

  const handleSave = async () => {
    const user = getUser()
    if (!user) {
      setError("Please log in to save check-in")
      return
    }
    setIsSaving(true)
    setError("")
    try {
      await apiPost("/feedback", {
        applicationId: id,
        providedBy: user.id,
        receivedBy: user.id,
        sessionDate: dateStr,
        clientPresent: myAttendance === "present",
        assistantPresent: partnerAttendance === "present",
        stars: rating || undefined,
        comment: feedback || undefined,
      })
      router.back()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save check-in")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button onClick={() => router.back()} className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground">
          <X className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">Daily Check-in</h1>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground">
          <Calendar className="h-5 w-5" />
        </button>
      </div>

      <div className="p-4">
        {/* Date & Activity */}
        <div className="text-center">
          <p className="text-sm font-semibold tracking-wide text-primary">
            {getDayName(dateStr)}, {getFormattedDate(dateStr)}
          </p>
          <h2 className="mt-2 text-2xl font-bold text-foreground">{activityName}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{trial.goalTitle} {'•'} w/ {trial.assistantName}</p>
        </div>

        {!isInRange && (
          <div className="mt-6 rounded-xl bg-destructive/10 p-4 text-center text-sm text-destructive">
            This date is outside the trial period ({trial.startDate} to {trial.endDate})
          </div>
        )}

        {isInRange && (
          <>
            {/* Your Attendance */}
            <div className="mt-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Your Attendance</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setMyAttendance("present")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                    myAttendance === "present"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Present
                </button>
                <button
                  onClick={() => setMyAttendance("absent")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                    myAttendance === "absent"
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  <XCircle className="h-4 w-4" />
                  Absent
                </button>
              </div>
            </div>

            {/* Partner Attendance */}
            <div className="mt-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Partner Attendance ({trial.assistantName.toUpperCase()})
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setPartnerAttendance("present")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                    partnerAttendance === "present"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Present
                </button>
                <button
                  onClick={() => setPartnerAttendance("absent")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                    partnerAttendance === "absent"
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  <XCircle className="h-4 w-4" />
                  Absent
                </button>
              </div>
            </div>

            {/* Partner Performance Rating */}
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {"Partner's Performance"}
                </p>
                <span className="text-lg font-bold text-primary">{rating > 0 ? rating.toFixed(1) : ""}</span>
              </div>
              <div className="flex justify-center rounded-xl bg-secondary/50 py-4">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= (hoveredStar || rating)
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Daily Feedback */}
            <div className="mt-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Daily Feedback</p>
              <div className="relative">
                <textarea
                  value={feedback}
                  onChange={(e) => {
                    if (e.target.value.length <= maxFeedback) {
                      setFeedback(e.target.value)
                    }
                  }}
                  placeholder="Encourage your partner or leave notes on today's session..."
                  rows={4}
                  className="w-full resize-none rounded-xl border border-border bg-input p-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <span className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                  {feedback.length}/{maxFeedback}
                </span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 rounded-xl bg-destructive/10 p-3 text-center text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pb-8">
              <Button
                onClick={handleSave}
                disabled={!myAttendance || isSaving}
                className="flex w-full items-center justify-center gap-2 bg-primary py-6 text-base font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Save Check-in
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
