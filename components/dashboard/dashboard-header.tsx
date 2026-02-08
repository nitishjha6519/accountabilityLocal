import Link from "next/link";
import { Bell } from "lucide-react";

interface DashboardHeaderProps {
  role: "client" | "assistant";
  onRoleChange: (role: "client" | "assistant") => void;
}

export function DashboardHeader({ role, onRoleChange }: DashboardHeaderProps) {
  return (
    <header className="px-4 py-4">
      <div className="flex items-center justify-between">
        <Link href="/settings" className="block">
          <p className="text-sm text-muted-foreground">Good Morning,</p>
          <h1 className="text-xl font-semibold text-foreground">Alex Morgan</h1>
        </Link>
        <button className="relative">
          <Bell className="h-6 w-6 text-foreground" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
            2
          </span>
        </button>
      </div>

      {/* Role Toggle */}
      <div className="mt-4 flex rounded-full bg-secondary p-1">
        <button
          onClick={() => onRoleChange("client")}
          className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${
            role === "client"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground"
          }`}
        >
          Client
        </button>
        <button
          onClick={() => onRoleChange("assistant")}
          className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${
            role === "assistant"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground"
          }`}
        >
          Assistant
        </button>
      </div>
    </header>
  );
}
