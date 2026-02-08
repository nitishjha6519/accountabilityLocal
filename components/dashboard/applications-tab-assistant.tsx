import Link from "next/link";
import {
  Clock,
  ArrowRight,
  Users,
  Check,
  MessageSquare,
  Dumbbell,
  Briefcase,
  Languages,
  Rocket,
} from "lucide-react";
import { StatusBadge } from "./status-badge";

interface Client {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  goalCategory: string;
  categoryIcon: "fitness" | "career" | "language" | "business";
  status: string;
  latestUpdate: string;
  lastActive: string;
}

interface SubmittedApplication {
  id: string;
  goalTitle: string;
  clientName: string;
  clientInitials: string;
  avatarColor: string;
  reward: number;
  appliedTime: string;
  status: "pending" | "accepted" | "rejected";
}

const categoryIconMap = {
  fitness: Dumbbell,
  career: Briefcase,
  language: Languages,
  business: Rocket,
};

interface ApplicationsTabAssistantProps {
  filter: "my-clients" | "pending" | "accepted" | "rejected";
  onFilterChange: (
    filter: "my-clients" | "pending" | "accepted" | "rejected",
  ) => void;
  myClients: Client[];
  submittedApplications: SubmittedApplication[];
}

export function ApplicationsTabAssistant({
  filter,
  onFilterChange,
  myClients,
  submittedApplications,
}: ApplicationsTabAssistantProps) {
  return (
    <>
      {/* Filter Tabs for Assistant */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {(["my-clients", "pending", "accepted", "rejected"] as const).map(
          (cat) => (
            <button
              key={cat}
              onClick={() => onFilterChange(cat)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                filter === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground"
              }`}
            >
              {cat === "my-clients"
                ? "My Clients"
                : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ),
        )}
      </div>

      {/* My Clients Content */}
      {filter === "my-clients" && (
        <>
          {/* Assistant Stats Cards */}
          <div className="mb-6 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-success/20">
                <span className="text-sm text-success">$</span>
              </div>
              <p className="text-xs text-muted-foreground">Earnings</p>
              <p className="mt-1 text-2xl font-bold text-foreground">$1,250</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">Active Clients</p>
              <p className="mt-1 text-2xl font-bold text-foreground">5</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-success/20">
                <Check className="h-4 w-4 text-success" />
              </div>
              <p className="text-xs text-muted-foreground">Success</p>
              <p className="mt-1 text-2xl font-bold text-foreground">98%</p>
            </div>
          </div>

          {/* Your Clients Header */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Your Clients
            </h2>
            <button className="text-sm font-medium text-primary">
              View All
            </button>
          </div>

          {/* Client Cards */}
          <div className="flex flex-col gap-4">
            {myClients.map((client) => {
              const CategoryIcon = categoryIconMap[client.categoryIcon];
              return (
                <div key={client.id} className="rounded-2xl bg-card p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-medium text-white"
                        style={{ backgroundColor: client.avatarColor }}
                      >
                        {client.initials}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {client.name}
                        </h3>
                        <p className="flex items-center gap-1.5 text-sm text-primary">
                          <CategoryIcon className="h-3.5 w-3.5" />
                          {client.goalCategory}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={client.status} />
                  </div>

                  <div className="mt-3 rounded-xl bg-secondary/50 p-3">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">
                        Latest:
                      </span>{" "}
                      {client.latestUpdate}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Last active: {client.lastActive}
                    </p>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Application Cards for Pending/Accepted/Rejected */}
      {filter !== "my-clients" && (
        <>
          <p className="mb-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Your Applications
          </p>

          {/* Submitted Application Cards */}
          <div className="flex flex-col gap-4">
            {submittedApplications
              .filter((app) => app.status === filter)
              .map((app) => (
                <div key={app.id} className="rounded-2xl bg-card p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-medium text-white"
                        style={{ backgroundColor: app.avatarColor }}
                      >
                        {app.clientInitials}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {app.goalTitle}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          by {app.clientName}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>

                  <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      Applied {app.appliedTime}
                    </span>
                    <span className="text-reward">${app.reward} Reward</span>
                  </div>

                  <div className="mt-4">
                    <Link
                      href={`/goal/${app.id}`}
                      className="flex items-center gap-1 text-sm font-medium text-primary"
                    >
                      View Details <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
    </>
  );
}
