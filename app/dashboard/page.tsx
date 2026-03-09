"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  fetchUserGoals,
  fetchAvailableGoals,
  fetchApplicationsByAssistant,
  fetchApplicationsByClient,
} from "@/lib/api";
import {
  transformGoalsData,
  getCurrentClientId,
  transformSubmittedApplications,
  SubmittedApplication,
  transformReceivedApplicants,
  ReceivedApplicant,
  transformToTrials,
  Trial,
} from "@/lib/transformers";
import { getUser, isLoggedIn } from "@/lib/auth";
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
type AssistantAppFilter = "pending" | "accepted" | "rejected";
type TrialFilter = "active" | "history";
type DiscoverFilter = "all" | "fitness" | "productivity" | "career";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasInitialized = useRef(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [role, setRole] = useState<UserRole>("client");
  const [activeTab, setActiveTab] = useState<Tab>("goals");
  const [applicationFilter, setApplicationFilter] =
    useState<ApplicationFilter>("received");
  const [assistantAppFilter, setAssistantAppFilter] =
    useState<AssistantAppFilter>("pending");
  const [trialFilter, setTrialFilter] = useState<TrialFilter>("active");
  const [discoverFilter, setDiscoverFilter] = useState<DiscoverFilter>("all");
  const [userGoalsData, setUserGoalsData] = useState<any[]>([]);
  const [availableGoalsData, setAvailableGoalsData] = useState<any[]>([]);
  const [submittedApplications, setSubmittedApplications] = useState<
    SubmittedApplication[]
  >([]);
  const [receivedApplicants, setReceivedApplicants] = useState<
    ReceivedApplicant[]
  >([]);
  const [trials, setTrials] = useState<Trial[]>([]);
  const [loadingGoals, setLoadingGoals] = useState(false);

  // Auth check - redirect to login if not authenticated
  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
    } else {
      setIsAuthChecked(true);
    }
  }, [router]);

  console.log("DashboardPage: STATE INITIALIZED", {
    userGoalsData: userGoalsData.length,
    availableGoalsData: availableGoalsData.length,
  });

  // Fetch goals on mount - FIRST
  useEffect(() => {
    if (!isAuthChecked) return;
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
  }, [isAuthChecked]);

  // Fetch available goals for assistant discover screen
  useEffect(() => {
    if (!isAuthChecked) return;
    (async () => {
      try {
        const goals = await fetchAvailableGoals();
        // Sort by newest first (descending by createdAt)
        const sortedGoals = [...(goals || [])].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        const transformed = transformGoalsData(sortedGoals);
        setAvailableGoalsData(transformed || []);
        console.log("useEffect: available goals fetched:", goals?.length || 0);

        // // Filter out user's own goals (those with clientId matching current user)
        // const currentUserId = getCurrentClientId();
        // const filteredGoals =
        //   goals?.filter((goal: any) => goal.clientId !== currentUserId) ||
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
  }, [role, isAuthChecked]);

  // Fetch applications for assistant
  useEffect(() => {
    if (!isAuthChecked || role !== "assistant") return;

    const user = getUser();
    if (!user?.id) return;

    (async () => {
      try {
        const apps = await fetchApplicationsByAssistant(user.id);
        const transformed = transformSubmittedApplications(apps);
        setSubmittedApplications(transformed);
        console.log(
          "useEffect: assistant applications fetched:",
          apps?.length || 0,
        );
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      }
    })();
  }, [role, isAuthChecked]);

  // Fetch received applications for client
  useEffect(() => {
    if (!isAuthChecked || role !== "client") return;

    const user = getUser();
    if (!user?.id) return;

    (async () => {
      try {
        const apps = await fetchApplicationsByClient(user.id);
        const transformed = transformReceivedApplicants(apps);
        setReceivedApplicants(transformed);
        console.log(
          "useEffect: client received applications fetched:",
          apps?.length || 0,
        );
      } catch (err) {
        console.error("Failed to fetch received applications:", err);
      }
    })();
  }, [role, isAuthChecked]);

  // Fetch trials (accepted applications)
  useEffect(() => {
    if (!isAuthChecked) return;
    const user = getUser();
    if (!user?.id) return;

    (async () => {
      try {
        // Fetch applications based on role
        const apps =
          role === "client"
            ? await fetchApplicationsByClient(user.id)
            : await fetchApplicationsByAssistant(user.id);

        console.log("Trials: fetched apps:", apps?.length, apps);
        console.log("Trials: accepted apps:", apps?.filter((a: any) => a.status === "accepted"));

        // Transform to trials (filters only accepted applications internally)
        const transformedTrials = transformToTrials(apps, role);
        console.log("Trials: transformed:", transformedTrials);
        setTrials(transformedTrials);
      } catch (err) {
        console.error("Failed to fetch trials:", err);
      }
    })();
  }, [role, isAuthChecked]);

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
      filterParam === "pending" ||
      filterParam === "accepted" ||
      filterParam === "rejected"
    ) {
      setAssistantAppFilter(filterParam);
    }
  }, [searchParams]);

  // Show loading while checking auth
  if (!isAuthChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

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
            applicants={receivedApplicants}
          />
        )}

        {activeTab === "applications" && role === "assistant" && (
          <ApplicationsTabAssistant
            filter={assistantAppFilter}
            onFilterChange={setAssistantAppFilter}
            submittedApplications={submittedApplications}
          />
        )}

        {activeTab === "trials" && (
          <TrialsTab
            trials={trials}
            filter={trialFilter}
            onFilterChange={setTrialFilter}
            role={role}
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
