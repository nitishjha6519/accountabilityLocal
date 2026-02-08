"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { fetchUserGoals, fetchAvailableGoals } from "@/lib/api";
import { transformGoalsData, CURRENT_CLIENT_ID } from "@/lib/transformers";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { PostGoalCard } from "@/components/dashboard/post-goal-card";
import { GoalsTabClient } from "@/components/dashboard/goals-tab-client";
import { GoalsTabAssistant } from "@/components/dashboard/goals-tab-assistant";
import { ApplicationsTabClient } from "@/components/dashboard/applications-tab-client";
import { ApplicationsTabAssistant } from "@/components/dashboard/applications-tab-assistant";
import { TrialsTab } from "@/components/dashboard/trials-tab";
import { BottomNavigation } from "@/components/dashboard/bottom-navigation";

type UserRole = "client" | "assistant";
type Tab = "goals" | "applications" | "trials";
type ApplicationFilter = "received" | "shortlisted" | "archived";
type AssistantAppFilter = "my-clients" | "pending" | "accepted" | "rejected";
type TrialFilter = "active" | "history";
type DiscoverFilter = "all" | "fitness" | "productivity" | "career";

const applicants = [
  {
    id: "1",
    name: "Sarah Jenkins",
    initials: "SJ",
    avatarColor: "#6366f1",
    rating: 4.9,
    specialty: "Language Specialist",
    pitch:
      "Bonjour! I saw you want to learn French basics. I lived in Lyon for 5 years and have helped 20+ people stay accountable. I won't just ask if yo...",
    appliedTime: "2h ago",
    reward: 30,
    goalTitle: "Learn French Basics",
  },
  {
    id: "2",
    name: "Marcus Chen",
    initials: "MC",
    avatarColor: "#f59e0b",
    rating: 5.0,
    specialty: "Tech Founder Coach",
    pitch:
      "Shipping an MVP is tough. I've been a PM at a YC startup. I'll make sure you hit your weekly milestones. No excuses is exactly my style....",
    appliedTime: "5h ago",
    reward: 200,
    goalTitle: "Launch MVP",
  },
  {
    id: "3",
    name: "Jean-Luc P.",
    initials: "JL",
    avatarColor: "#3b82f6",
    rating: 4.8,
    specialty: "French Tutor",
    pitch: "Native speaker here. I can help with...",
    appliedTime: "1d ago",
    reward: 30,
    goalTitle: "Learn French Basics",
  },
];

const trials = [
  {
    id: "1",
    goalTitle: "Learn French Basics",
    partnerName: "Maria K.",
    partnerInitials: "MK",
    avatarColor: "#10b981",
    weeklyStreak: 5,
    status: "done" as const,
    startDate: "2026-01-05",
    endDate: "2026-03-05",
    frequency: "Daily" as const,
  },
  {
    id: "2",
    goalTitle: "Launch MVP",
    partnerName: "James O.",
    partnerInitials: "JO",
    avatarColor: "#f59e0b",
    weeklyStreak: 0,
    status: "starting-soon" as const,
    startDate: "2026-02-10",
    endDate: "2026-04-10",
    frequency: "3x Weekly" as const,
  },
  {
    id: "3",
    goalTitle: "Marathon Prep",
    partnerName: "Sarah L.",
    partnerInitials: "SL",
    avatarColor: "#ec4899",
    totalProgress: "30/30 Days",
    status: "completed" as const,
    startDate: "2025-11-01",
    endDate: "2025-12-01",
    frequency: "Daily" as const,
  },
];

// Assistant-specific data
const myClients = [
  {
    id: "1",
    name: "Sarah Jenkins",
    initials: "SJ",
    avatarColor: "#6366f1",
    goalCategory: "Marathon Training",
    categoryIcon: "fitness" as const,
    status: "check-in-needed" as const,
    latestUpdate:
      '"Completed 10k run today. Knee feels slightly sore but managed to keep pace."',
    lastActive: "2 hours ago",
  },
  {
    id: "2",
    name: "Mike Ross",
    initials: "MR",
    avatarColor: "#3b82f6",
    goalCategory: "Learn Spanish",
    categoryIcon: "language" as const,
    status: "on-track" as const,
    latestUpdate:
      '"Finished unit 4 vocab. Struggling a bit with irregular verbs, might need extra..."',
    lastActive: "1 day ago",
  },
  {
    id: "3",
    name: "Elena Rodriguez",
    initials: "ER",
    avatarColor: "#ec4899",
    goalCategory: "Career Transition",
    categoryIcon: "career" as const,
    status: "pending" as const,
    latestUpdate:
      '"Updated my resume based on your feedback. Applying to 5 roles today!"',
    lastActive: "3 hours ago",
  },
];

const submittedApplications = [
  {
    id: "1",
    goalTitle: "Learn French Basics",
    clientName: "Maria K.",
    clientInitials: "MK",
    avatarColor: "#10b981",
    reward: 30,
    appliedTime: "2h ago",
    status: "pending" as const,
  },
  {
    id: "2",
    goalTitle: "Launch MVP",
    clientName: "James O.",
    clientInitials: "JO",
    avatarColor: "#f59e0b",
    reward: 200,
    appliedTime: "1d ago",
    status: "accepted" as const,
  },
  {
    id: "3",
    goalTitle: "Gym 4x/Week",
    clientName: "David C.",
    clientInitials: "DC",
    avatarColor: "#ef4444",
    reward: 50,
    appliedTime: "3d ago",
    status: "rejected" as const,
  },
];

// Available goals for assistant discover screen
const availableGoals = [
  {
    id: "1",
    title: "Marathon Training",
    clientName: "Sarah J.",
    clientInitials: "SJ",
    avatarColor: "#6366f1",
    verified: true,
    duration: "3 months",
    reward: 50,
    rewardPeriod: "wk",
    description:
      "Looking for someone to keep me accountable for my daily 5am runs. I'm training for the NY Marathon and need motivation.",
    tags: ["Early Bird", "Daily Check-in"],
    category: "fitness" as const,
  },
  {
    id: "2",
    title: "Finish PhD Thesis",
    clientName: "Michael T.",
    clientInitials: "MT",
    avatarColor: "#3b82f6",
    verified: false,
    isNew: true,
    duration: "6 months",
    reward: 30,
    rewardPeriod: "wk",
    description:
      "Need an accountability partner to ensure I write 500 words daily. Weekly zoom check-in required on Sundays.",
    tags: ["Academic", "Video Call"],
    category: "productivity" as const,
  },
  {
    id: "3",
    title: "Sales Calls Consistency",
    clientName: "David L.",
    clientInitials: "DL",
    avatarColor: "#f59e0b",
    verified: true,
    duration: "1 month",
    reward: 75,
    rewardPeriod: "month",
    description:
      "Freelance consultant needing a push to make 10 cold calls every morning before 10am. Simple text confirmation needed.",
    tags: ["Career", "High-Rate"],
    category: "career" as const,
  },
];

export default function DashboardPage() {
  console.log("DashboardPage: RENDERING");
  const searchParams = useSearchParams();
  const hasInitialized = useRef(false);
  const [role, setRole] = useState<UserRole>("client");
  const [activeTab, setActiveTab] = useState<Tab>("goals");
  const [applicationFilter, setApplicationFilter] =
    useState<ApplicationFilter>("received");
  const [assistantAppFilter, setAssistantAppFilter] =
    useState<AssistantAppFilter>("my-clients");
  const [trialFilter, setTrialFilter] = useState<TrialFilter>("active");
  const [discoverFilter, setDiscoverFilter] = useState<DiscoverFilter>("all");
  const [userGoalsData, setUserGoalsData] = useState<any[]>([]);
  const [availableGoalsData, setAvailableGoalsData] = useState<any[]>([]);
  const [loadingGoals, setLoadingGoals] = useState(false);

  console.log("DashboardPage: STATE INITIALIZED", {
    userGoalsData: userGoalsData.length,
    availableGoalsData: availableGoalsData.length,
  });

  // Fetch goals on mount - FIRST
  useEffect(() => {
    (async () => {
      try {
        setLoadingGoals(true);
        const apiGoals = await fetchUserGoals();
        console.log("useEffect: user goals fetched:", apiGoals.length);
        const transformed = transformGoalsData(apiGoals);
        setUserGoalsData(transformed);
      } catch (err) {
        console.error("Failed to fetch user goals:", err);
      } finally {
        setLoadingGoals(false);
      }
    })();
  }, []);

  // Fetch available goals for assistant discover screen - SECOND
  // Fetch available goals for assistant discover screen
  useEffect(() => {
    (async () => {
      try {
        const goals = await fetchAvailableGoals();
        const transformed = transformGoalsData(goals);
        setAvailableGoalsData(transformed || []);
        console.log("useEffect: available goals fetched:", goals?.length || 0);

        // // Filter out user's own goals (those with clientId matching current user)
        // const filteredGoals =
        //   goals?.filter((goal: any) => goal.clientId !== CURRENT_CLIENT_ID) ||
        //   [];
        // console.log(
        //   "useEffect: filtered available goals (excluding own):",
        //   filteredGoals.length,
        // );

        // setAvailableGoalsData(goals || []);
      } catch (err) {
        console.error("Failed to fetch available goals:", err);
      }
    })();
  }, [role]);

  // Search params effect
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const roleParam = searchParams.get("role");
    const tabParam = searchParams.get("tab");
    const filterParam = searchParams.get("filter");

    if (roleParam === "assistant" || roleParam === "client") {
      setRole(roleParam);
    }
    if (
      tabParam === "goals" ||
      tabParam === "applications" ||
      tabParam === "trials"
    ) {
      setActiveTab(tabParam);
    }
    if (
      filterParam === "my-clients" ||
      filterParam === "pending" ||
      filterParam === "accepted" ||
      filterParam === "rejected"
    ) {
      setAssistantAppFilter(filterParam);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <DashboardHeader role={role} onRoleChange={setRole} />

      {role === "client" && activeTab === "goals" && <PostGoalCard />}

      <main className="px-4 py-4">
        {activeTab === "goals" && role === "client" && (
          <GoalsTabClient goals={userGoalsData} />
        )}

        {activeTab === "goals" && role === "assistant" && (
          <GoalsTabAssistant
            goals={availableGoalsData?.length > 0 ? availableGoalsData : []}
            filter={discoverFilter}
            onFilterChange={setDiscoverFilter}
          />
        )}

        {activeTab === "applications" && role === "client" && (
          <ApplicationsTabClient
            filter={applicationFilter}
            onFilterChange={setApplicationFilter}
            applicants={applicants}
          />
        )}

        {activeTab === "applications" && role === "assistant" && (
          <ApplicationsTabAssistant
            filter={assistantAppFilter}
            onFilterChange={setAssistantAppFilter}
            myClients={myClients}
            submittedApplications={submittedApplications}
          />
        )}

        {activeTab === "trials" && (
          <TrialsTab
            trials={trials}
            filter={trialFilter}
            onFilterChange={setTrialFilter}
          />
        )}
      </main>

      <BottomNavigation
        activeTab={activeTab}
        role={role}
        onTabChange={setActiveTab}
      />
    </div>
  );
}
