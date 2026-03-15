"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  CalendarCheck,
  Clock,
  RotateCcw,
  Star,
  MessageSquare,
  X,
} from "lucide-react";
import {
  fetchApplicationById,
  submitFeedbackAsClient,
  submitFeedbackAsAssistant,
  fetchFeedbackByApplication,
  FeedbackEntry,
} from "@/lib/api";
import { getUser } from "@/lib/auth";

// Feedback status for a date: green = both present, yellow = one present, red = both absent
type AttendanceStatus = "both" | "one" | "none" | null;

interface TrialInfo {
  goalTitle: string;
  status: string;
  partnerName: string;
  partnerRole: "client" | "assistant";
  partnerId: string;
  startDate: string;
  endDate: string;
  frequency: string;
  checkinDates: string[]; // YYYY-MM-DD format
}

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function calculateStreak(checkinDates: string[]): number {
  if (checkinDates.length === 0) return 0;
  const sorted = [...checkinDates].sort().reverse();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let streak = 0;
  let checkDate = new Date(today);

  // Check if today or yesterday was a checkin to start the streak
  const todayStr = formatDateKey(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDateKey(
    yesterday.getFullYear(),
    yesterday.getMonth(),
    yesterday.getDate(),
  );

  if (sorted[0] !== todayStr && sorted[0] !== yesterdayStr) return 0;

  if (sorted[0] === todayStr) {
    checkDate = new Date(today);
  } else {
    checkDate = new Date(yesterday);
  }

  for (const dateStr of sorted) {
    const expected = formatDateKey(
      checkDate.getFullYear(),
      checkDate.getMonth(),
      checkDate.getDate(),
    );
    if (dateStr === expected) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (dateStr < expected) {
      break;
    }
  }
  return streak;
}

function getDaysRemaining(endDate: string): number {
  const end = new Date(endDate);
  end.setHours(12, 0, 0, 0);
  const now = new Date();
  now.setHours(12, 0, 0, 0);
  const diff = Math.ceil(
    (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  return Math.max(0, diff);
}

function formatShortDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AttendancePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const roleParam = searchParams.get("role") as "client" | "assistant" | null;

  const [trial, setTrial] = useState<TrialInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState<boolean>(false);

  // Feedback modal state
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackStars, setFeedbackStars] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  // Feedback data by date for coloring calendar
  const [feedbackByDate, setFeedbackByDate] = useState<
    Map<string, AttendanceStatus>
  >(new Map());

  useEffect(() => {
    async function loadData() {
      const user = getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setCurrentUserId(user.id);

      try {
        const app = await fetchApplicationById(id);

        // Use role from query param if available, otherwise derive from application
        const userIsClient = roleParam
          ? roleParam === "client"
          : user.id ===
            (typeof app.clientId === "object"
              ? app.clientId._id
              : app.clientId);
        setIsClient(userIsClient);
        const goal = typeof app.goalId === "object" ? app.goalId : null;

        // Get partner info
        let partnerName: string;
        let partnerId: string;
        let partnerRole: "client" | "assistant";

        if (userIsClient) {
          const assistant =
            typeof app.assistantId === "object" ? app.assistantId : null;
          partnerName = assistant?.fullName || `Assistant`;
          partnerId =
            assistant?._id ||
            (typeof app.assistantId === "string" ? app.assistantId : "");
          partnerRole = "assistant";
        } else {
          const client = typeof app.clientId === "object" ? app.clientId : null;
          partnerName = client?.fullName || `Client`;
          partnerId =
            client?._id ||
            (typeof app.clientId === "string" ? app.clientId : "");
          partnerRole = "client";
        }

        // Determine trial status
        const now = new Date();
        const startDate = new Date(goal?.startDate || app.createdAt);
        const endDate = new Date(goal?.endDate || app.createdAt);
        let status = "Active Trial";
        if (now < startDate) status = "Starting Soon";
        else if (now > endDate) status = "Completed";

        // Extract checkin dates (from attendance/checkins array if present)
        const checkinDates =
          app.checkins?.map((c: { date: string }) => c.date.split("T")[0]) ||
          [];

        // Map frequency
        const freqStr = goal?.checkInFrequency?.toLowerCase() || "daily";
        const frequency = freqStr.includes("3") ? "3x Weekly" : "Daily";

        const trialInfo: TrialInfo = {
          goalTitle: goal?.title || "Goal",
          status,
          partnerName,
          partnerRole,
          partnerId,
          startDate:
            goal?.startDate?.split("T")[0] || app.createdAt.split("T")[0],
          endDate: goal?.endDate?.split("T")[0] || app.createdAt.split("T")[0],
          frequency,
          checkinDates,
        };

        setTrial(trialInfo);

        // Fetch feedback data for coloring
        try {
          const feedbackList = await fetchFeedbackByApplication(id);
          const feedbackMap = new Map<string, AttendanceStatus>();

          for (const fb of feedbackList) {
            const dateKey = fb.sessionDate.split("T")[0];
            if (fb.clientPresent && fb.assistantPresent) {
              feedbackMap.set(dateKey, "both");
            } else if (fb.clientPresent || fb.assistantPresent) {
              feedbackMap.set(dateKey, "one");
            } else {
              feedbackMap.set(dateKey, "none");
            }
          }

          setFeedbackByDate(feedbackMap);
        } catch (fbErr) {
          console.error("Failed to fetch feedback:", fbErr);
          // Continue without feedback colors
        }
      } catch (err) {
        setError("Failed to load trial data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, router]);

  // Handle feedback submission
  const handleSubmitFeedback = async () => {
    if (!trial || !currentUserId || feedbackStars === 0) return;

    setSubmittingFeedback(true);
    try {
      // providedBy is always the current user
      // receivedBy is always the partner
      const feedbackData = {
        applicationId: id,
        providedBy: currentUserId,
        receivedBy: trial.partnerId,
        sessionDate: new Date().toISOString().split("T")[0],
        clientPresent: isClient, // Client present if user is client
        assistantPresent: !isClient, // Assistant present if user is assistant
        stars: feedbackStars,
        comment: feedbackComment,
      };

      // Use appropriate endpoint based on role
      if (isClient) {
        await submitFeedbackAsClient(feedbackData);
      } else {
        await submitFeedbackAsAssistant(feedbackData);
      }

      // Refresh feedback data to update calendar colors
      const feedbackList = await fetchFeedbackByApplication(id);
      const feedbackMap = new Map<string, AttendanceStatus>();
      for (const fb of feedbackList) {
        const dateKey = fb.sessionDate.split("T")[0];
        if (fb.clientPresent && fb.assistantPresent) {
          feedbackMap.set(dateKey, "both");
        } else if (fb.clientPresent || fb.assistantPresent) {
          feedbackMap.set(dateKey, "one");
        } else {
          feedbackMap.set(dateKey, "none");
        }
      }
      setFeedbackByDate(feedbackMap);

      setShowFeedbackModal(false);
      setFeedbackStars(0);
      setFeedbackComment("");
      // Could show a success toast here
    } catch (err) {
      console.error("Failed to submit feedback:", err);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  // Default calendar based on trial dates
  const today = new Date();
  const initialMonth =
    trial?.status === "Completed"
      ? new Date(trial.startDate).getMonth()
      : today.getMonth();
  const initialYear =
    trial?.status === "Completed"
      ? new Date(trial.startDate).getFullYear()
      : today.getFullYear();

  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const [currentYear, setCurrentYear] = useState(initialYear);

  // Update calendar when trial loads
  useEffect(() => {
    if (trial) {
      const startD = new Date(trial.startDate);
      if (trial.status === "Completed") {
        setCurrentMonth(startD.getMonth());
        setCurrentYear(startD.getFullYear());
      }
    }
  }, [trial]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !trial) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background gap-4">
        <p className="text-destructive">{error || "Trial not found"}</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-primary underline"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const checkinSet = new Set(trial.checkinDates);
  const totalCheckins = trial.checkinDates.length;
  const streak = calculateStreak(trial.checkinDates);
  const daysRemaining = getDaysRemaining(trial.endDate);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const isToday = (day: number) =>
    day === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear();

  const isCheckin = (day: number) =>
    checkinSet.has(formatDateKey(currentYear, currentMonth, day));

  const getAttendanceStatus = (day: number): AttendanceStatus => {
    const dateKey = formatDateKey(currentYear, currentMonth, day);
    return feedbackByDate.get(dateKey) || null;
  };

  const isInTrialRange = (day: number) => {
    const dateStr = formatDateKey(currentYear, currentMonth, day);
    return dateStr >= trial.startDate && dateStr <= trial.endDate;
  };

  const isFutureDate = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    return date > today;
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDayClick = (day: number) => {
    if (!isInTrialRange(day) || isFutureDate(day)) return;
    const dateStr = formatDateKey(currentYear, currentMonth, day);
    const role = isClient ? "client" : "assistant";
    router.push(`/attendance/${id}/checkin?date=${dateStr}&role=${role}`);
  };

  // Build calendar grid
  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(d);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <button
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold text-foreground">
          Attendance History
        </h1>
        <div className="w-10" />
      </div>

      <div className="p-4">
        {/* Goal Title */}
        <h2 className="text-2xl font-bold text-foreground">
          {trial.goalTitle}
        </h2>
        <div className="mt-1 flex items-center gap-2 text-sm">
          <span className="flex items-center gap-1.5">
            <span
              className={`h-2 w-2 rounded-full ${trial.status === "Completed" ? "bg-muted-foreground" : "bg-success"}`}
            />
            {trial.status}
          </span>
          <span className="text-muted-foreground">{"•"}</span>
          <span className="text-muted-foreground">
            {trial.partnerName}
          </span>
        </div>

        {/* Date Range */}
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>
            {formatShortDate(trial.startDate)} -{" "}
            {formatShortDate(trial.endDate)}
          </span>
          <span className="text-primary">{trial.frequency}</span>
        </div>

        {/* Feedback Button */}
        <button
          onClick={() => setShowFeedbackModal(true)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
        >
          <MessageSquare className="h-4 w-4" />
          Give Feedback
        </button>

        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarCheck className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium uppercase tracking-wide">
                Total
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-foreground">
              {totalCheckins}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Flame className="h-4 w-4 text-warning" />
              <span className="text-xs font-medium uppercase tracking-wide">
                Streak
              </span>
            </div>
            <p className="mt-2">
              <span className="text-3xl font-bold text-foreground">
                {streak}
              </span>
              <span className="ml-1 text-sm text-muted-foreground">Days</span>
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RotateCcw className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium uppercase tracking-wide">
                Left
              </span>
            </div>
            <p className="mt-2">
              <span className="text-3xl font-bold text-foreground">
                {daysRemaining}
              </span>
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
              <button
                onClick={prevMonth}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextMonth}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Day Headers */}
          <div className="mb-2 grid grid-cols-7 gap-1">
            {DAYS.map((day, i) => (
              <div
                key={`${day}-${i}`}
                className="flex h-10 items-center justify-center text-xs font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarCells.map((day, i) => {
              if (day === null) {
                return (
                  <div
                    key={`empty-${i}`}
                    className="flex h-10 items-center justify-center"
                  />
                );
              }

              const todayDay = isToday(day);
              const inRange = isInTrialRange(day);
              const future = isFutureDate(day);
              const attendanceStatus = getAttendanceStatus(day);
              const isPastDate = inRange && !future && !todayDay;

              // Determine background color based on attendance
              let bgClass = "";
              if (!inRange) {
                // Outside trial range
                bgClass = "text-muted-foreground/30 cursor-default";
              } else if (attendanceStatus === "both") {
                // Both present - green
                bgClass = "bg-green-500 text-white";
              } else if (attendanceStatus === "one") {
                // One present - yellow
                bgClass = "bg-yellow-500 text-black";
              } else if (attendanceStatus === "none") {
                // Both absent - red
                bgClass = "bg-red-500 text-white";
              } else if (isPastDate && attendanceStatus === null) {
                // Past date with no feedback - red
                bgClass = "bg-red-500 text-white";
              } else if (future) {
                // Future date with no feedback - greyed out disabled
                bgClass = "text-muted-foreground/50 cursor-default bg-muted/30";
              } else if (todayDay) {
                // Today - highlight with ring
                bgClass = "ring-2 ring-primary text-primary";
              } else {
                bgClass = "text-muted-foreground hover:bg-secondary";
              }

              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  disabled={!inRange || future}
                  className={`flex h-10 w-full items-center justify-center rounded-full text-sm font-medium transition-colors ${bgClass}`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-green-500" />
              Both Active
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-yellow-500" />
              One Active
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500" />
              Missing/Absent
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-muted/50 border border-muted-foreground/30" />
              Future
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Give Feedback
              </h3>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              How was your session with {trial.partnerName}?
            </p>

            {/* Star Rating */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setFeedbackStars(star)}
                  className="p-1"
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= feedbackStars
                        ? "fill-warning text-warning"
                        : "text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Comment */}
            <textarea
              value={feedbackComment}
              onChange={(e) => setFeedbackComment(e.target.value)}
              placeholder="Add a comment (optional)"
              className="w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={3}
            />

            {/* Submit Button */}
            <button
              onClick={handleSubmitFeedback}
              disabled={feedbackStars === 0 || submittingFeedback}
              className="mt-4 w-full rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              {submittingFeedback ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
