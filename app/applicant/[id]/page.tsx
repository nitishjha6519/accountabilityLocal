"use client";

import {
  ChevronLeft,
  Clock,
  Check,
  X,
  MessageSquare,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { fetchApplicationById, updateApplicationStatus } from "@/lib/api";
import { getRelativeTime, generateColorFromString } from "@/lib/transformers";

interface ApplicationData {
  _id: string;
  goalId: {
    _id: string;
    title: string;
    rewardAmount?: number;
    pledgeAmount?: number;
  };
  assistantId:
    | string
    | {
        _id: string;
        fullName?: string;
        initials?: string;
      };
  pitch: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

export default function ApplicantDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [showConfirmModal, setShowConfirmModal] = useState<
    "accept" | "reject" | null
  >(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const id = params.id as string;

  useEffect(() => {
    async function loadApplication() {
      try {
        const data = await fetchApplicationById(id);
        setApplication(data);
      } catch (err) {
        console.error("Failed to fetch application:", err);
        setError("Failed to load application details");
      } finally {
        setIsLoading(false);
      }
    }
    loadApplication();
  }, [id]);

  // Extract assistant info
  const assistant =
    typeof application?.assistantId === "object"
      ? application.assistantId
      : null;
  const assistantIdStr =
    typeof application?.assistantId === "object"
      ? application.assistantId._id
      : application?.assistantId || "";
  const assistantName =
    assistant?.fullName || `Assistant ${assistantIdStr.substring(0, 4)}`;
  const assistantInitials =
    assistant?.initials ||
    assistantName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  const avatarColor = generateColorFromString(assistantIdStr);

  // Extract goal info
  const goalTitle = application?.goalId?.title || "Goal";
  const reward =
    application?.goalId?.rewardAmount || application?.goalId?.pledgeAmount || 0;
  const appliedTime = application?.createdAt
    ? getRelativeTime(application.createdAt)
    : "";

  const handleConfirm = async () => {
    setIsProcessing(true);
    setError("");
    try {
      const status = showConfirmModal === "accept" ? "accepted" : "rejected";
      await updateApplicationStatus(id, status);
      setShowConfirmModal(null);
      router.push("/dashboard?role=client&tab=applications");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update application",
      );
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background gap-4">
        <p className="text-muted-foreground">
          {error || "Application not found"}
        </p>
        <Button
          onClick={() => router.push("/dashboard?role=client&tab=applications")}
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() =>
              router.push("/dashboard?role=client&tab=applications")
            }
            className="text-foreground"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">
            Applicant Details
          </h1>
          <div className="w-6" />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        {/* Profile Header */}
        <div className="flex items-start gap-4">
          <div
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-2xl font-semibold text-white"
            style={{ backgroundColor: avatarColor }}
          >
            {assistantInitials}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground">
              {assistantName}
            </h2>
            <p className="text-muted-foreground">Accountability Partner</p>
          </div>
        </div>

        {/* Applying For */}
        <section className="mt-6">
          <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Applying For
          </h3>
          <div className="mt-2 rounded-xl bg-primary/10 p-4">
            <Link
              href={`/goal/${application.goalId._id}`}
              className="font-semibold text-primary hover:underline"
            >
              {goalTitle}
            </Link>
            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Applied {appliedTime}
              </span>
              <span className="text-reward">${reward} Reward</span>
            </div>
          </div>
        </section>

        {/* Their Pitch */}
        <section className="mt-6">
          <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Their Pitch
          </h3>
          <p className="mt-2 leading-relaxed text-foreground">
            {application.pitch || "No pitch provided."}
          </p>
        </section>

        {/* Status Badge */}
        {application.status !== "pending" && (
          <section className="mt-6">
            <div
              className={`rounded-xl p-4 text-center ${
                application.status === "accepted"
                  ? "bg-success/10 text-success"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              <p className="font-semibold">
                {application.status === "accepted"
                  ? "Application Accepted"
                  : "Application Rejected"}
              </p>
            </div>
          </section>
        )}

        {/* Action Buttons - only show for pending applications */}
        {application.status === "pending" && (
          <>
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
          </>
        )}
      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-background p-6">
            <div className="mb-4 flex justify-center">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-full ${
                  showConfirmModal === "accept"
                    ? "bg-success/20"
                    : "bg-destructive/20"
                }`}
              >
                {showConfirmModal === "accept" ? (
                  <Check className="h-8 w-8 text-success" />
                ) : (
                  <X className="h-8 w-8 text-destructive" />
                )}
              </div>
            </div>

            <h2 className="text-center text-lg font-semibold text-foreground">
              {showConfirmModal === "accept"
                ? "Approve Applicant?"
                : "Reject Applicant?"}
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {showConfirmModal === "accept"
                ? `You're about to approve ${assistantName} as your accountability partner for "${goalTitle}".`
                : `You're about to reject ${assistantName}'s application for "${goalTitle}".`}
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
                onClick={() => {
                  setShowConfirmModal(null);
                  setError("");
                }}
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
                ) : showConfirmModal === "accept" ? (
                  "Confirm"
                ) : (
                  "Reject"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
