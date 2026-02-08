"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Flame, CalendarCheck, Clock, RotateCcw } from "lucide-react"

interface TrialInfo {
  goalTitle: string
  status: string
  assistantName: string
  startDate: string
  endDate: string
  frequency: string
  checkinDates: string[] // YYYY-MM-DD format
}

const trialData: Record<string, TrialInfo> = {
  "1": {
    goalTitle: "Learn French Basics",
    status: "Active Trial",
    assistantName: "Maria",
    startDate: "2026-01-05",
    endDate: "2026-03-05",
    frequency: "Daily",
    checkinDates: [
      "2026-01-05", "2026-01-07", "2026-01-08", "2026-01-10", "2026-01-12",
      "2026-01-14", "2026-01-15", "2026-01-17", "2026-01-19", "2026-01-21",
      "2026-01-23", "2026-01-24", "2026-01-26", "2026-01-28", "2026-01-30",
      "2026-02-01", "2026-02-02", "2026-02-03", "2026-02-04", "2026-02-05",
      "2026-02-06",
    ],
  },
  "2": {
    goalTitle: "Launch MVP",
    status: "Starting Soon",
    assistantName: "James",
    startDate: "2026-02-10",
    endDate: "2026-04-10",
    frequency: "3x Weekly",
    checkinDates: [],
  },
  "3": {
    goalTitle: "Marathon Prep",
    status: "Completed",
    assistantName: "Sarah",
    startDate: "2025-11-01",
    endDate: "2025-12-01",
    frequency: "Daily",
    checkinDates: [
      "2025-11-01", "2025-11-02", "2025-11-03", "2025-11-04", "2025-11-05",
      "2025-11-06", "2025-11-07", "2025-11-08", "2025-11-09", "2025-11-10",
      "2025-11-11", "2025-11-12", "2025-11-13", "2025-11-14", "2025-11-15",
      "2025-11-16", "2025-11-17", "2025-11-18", "2025-11-19", "2025-11-20",
      "2025-11-21", "2025-11-22", "2025-11-23", "2025-11-24", "2025-11-25",
      "2025-11-26", "2025-11-27", "2025-11-28", "2025-11-29", "2025-11-30",
    ],
  },
}

const DAYS = ["S", "M", "T", "W", "T", "F", "S"]
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

function formatDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

function calculateStreak(checkinDates: string[]): number {
  if (checkinDates.length === 0) return 0
  const sorted = [...checkinDates].sort().reverse()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  let streak = 0
  let checkDate = new Date(today)

  // Check if today or yesterday was a checkin to start the streak
  const todayStr = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = formatDateKey(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate())

  if (sorted[0] !== todayStr && sorted[0] !== yesterdayStr) return 0

  if (sorted[0] === todayStr) {
    checkDate = new Date(today)
  } else {
    checkDate = new Date(yesterday)
  }

  for (const dateStr of sorted) {
    const expected = formatDateKey(checkDate.getFullYear(), checkDate.getMonth(), checkDate.getDate())
    if (dateStr === expected) {
      streak++
      checkDate.setDate(checkDate.getDate() - 1)
    } else if (dateStr < expected) {
      break
    }
  }
  return streak
}

function getDaysRemaining(endDate: string): number {
  const end = new Date(endDate + "T12:00:00")
  const now = new Date()
  now.setHours(12, 0, 0, 0)
  const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(0, diff)
}

function formatShortDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00")
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export default function AttendancePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const trial = trialData[id] || trialData["1"]

  // Default calendar to the start month of the trial (or current month if active)
  const startD = new Date(trial.startDate + "T12:00:00")
  const today = new Date()
  const initialMonth = trial.status === "Completed" ? startD.getMonth() : today.getMonth()
  const initialYear = trial.status === "Completed" ? startD.getFullYear() : today.getFullYear()

  const [currentMonth, setCurrentMonth] = useState(initialMonth)
  const [currentYear, setCurrentYear] = useState(initialYear)

  const checkinSet = new Set(trial.checkinDates)
  const totalCheckins = trial.checkinDates.length
  const streak = calculateStreak(trial.checkinDates)
  const daysRemaining = getDaysRemaining(trial.endDate)

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)

  const isToday = (day: number) =>
    day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()

  const isCheckin = (day: number) => checkinSet.has(formatDateKey(currentYear, currentMonth, day))

  const isInTrialRange = (day: number) => {
    const dateStr = formatDateKey(currentYear, currentMonth, day)
    return dateStr >= trial.startDate && dateStr <= trial.endDate
  }

  const isFutureDate = (day: number) => {
    const date = new Date(currentYear, currentMonth, day)
    return date > today
  }

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const handleDayClick = (day: number) => {
    if (!isInTrialRange(day) || isFutureDate(day)) return
    const dateStr = formatDateKey(currentYear, currentMonth, day)
    router.push(`/attendance/${id}/checkin?date=${dateStr}`)
  }

  // Build calendar grid
  const calendarCells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(d)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <button onClick={() => router.back()} className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold text-foreground">Attendance History</h1>
        <div className="w-10" />
      </div>

      <div className="p-4">
        {/* Goal Title */}
        <h2 className="text-2xl font-bold text-foreground">{trial.goalTitle}</h2>
        <div className="mt-1 flex items-center gap-2 text-sm">
          <span className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${trial.status === "Completed" ? "bg-muted-foreground" : "bg-success"}`} />
            {trial.status}
          </span>
          <span className="text-muted-foreground">{'•'}</span>
          <span className="text-muted-foreground">Assistant: {trial.assistantName}</span>
        </div>

        {/* Date Range */}
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>{formatShortDate(trial.startDate)} - {formatShortDate(trial.endDate)}</span>
          <span className="text-primary">{trial.frequency}</span>
        </div>

        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarCheck className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium uppercase tracking-wide">Total</span>
            </div>
            <p className="mt-2 text-3xl font-bold text-foreground">{totalCheckins}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Flame className="h-4 w-4 text-warning" />
              <span className="text-xs font-medium uppercase tracking-wide">Streak</span>
            </div>
            <p className="mt-2">
              <span className="text-3xl font-bold text-foreground">{streak}</span>
              <span className="ml-1 text-sm text-muted-foreground">Days</span>
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RotateCcw className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium uppercase tracking-wide">Left</span>
            </div>
            <p className="mt-2">
              <span className="text-3xl font-bold text-foreground">{daysRemaining}</span>
              <span className="ml-1 text-sm text-muted-foreground">Days</span>
            </p>
          </div>
        </div>

        {/* Calendar */}
        <div className="mt-8">
          {/* Month Navigation */}
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h3>
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={nextMonth} className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Day Headers */}
          <div className="mb-2 grid grid-cols-7 gap-1">
            {DAYS.map((day, i) => (
              <div key={`${day}-${i}`} className="flex h-10 items-center justify-center text-xs font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarCells.map((day, i) => {
              if (day === null) {
                return <div key={`empty-${i}`} className="flex h-10 items-center justify-center" />
              }

              const checkedIn = isCheckin(day)
              const todayDay = isToday(day)
              const inRange = isInTrialRange(day)
              const future = isFutureDate(day)

              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  disabled={!inRange || future}
                  className={`flex h-10 w-full items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    checkedIn
                      ? "bg-primary text-primary-foreground"
                      : todayDay && inRange
                        ? "ring-2 ring-primary text-primary"
                        : !inRange
                          ? "text-muted-foreground/30 cursor-default"
                          : future
                            ? "text-muted-foreground/50 cursor-default"
                            : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {day}
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-primary" />
              Check-in
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full border border-muted-foreground" />
              No Activity
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
