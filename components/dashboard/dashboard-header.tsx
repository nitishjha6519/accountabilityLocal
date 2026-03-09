"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, LogOut, Settings, User, ChevronDown } from "lucide-react";
import { getUser, clearAuth } from "@/lib/auth";

interface DashboardHeaderProps {
  role: "client" | "assistant";
  onRoleChange: (role: "client" | "assistant") => void;
}

export function DashboardHeader({ role, onRoleChange }: DashboardHeaderProps) {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = getUser();

  const displayName = user?.fullName || "Guest";
  const displayInitials = user?.initials || "?";

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    clearAuth();
    router.push("/login");
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning,";
    if (hour < 17) return "Good Afternoon,";
    return "Good Evening,";
  };

  return (
    <header className="px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 text-left"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {displayInitials}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{getGreeting()}</p>
              <div className="flex items-center gap-1">
                <h1 className="text-xl font-semibold text-foreground">{displayName}</h1>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${showDropdown ? "rotate-180" : ""}`} />
              </div>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute left-0 top-full z-50 mt-2 w-56 rounded-lg border border-border bg-background shadow-lg">
              <div className="border-b border-border px-4 py-3">
                <p className="font-medium text-foreground">{displayName}</p>
                <p className="text-sm text-muted-foreground">{user?.email || "No email"}</p>
              </div>
              <div className="py-1">
                <Link
                  href="/settings"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary"
                  onClick={() => setShowDropdown(false)}
                >
                  <User className="h-4 w-4" />
                  View Profile
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary"
                  onClick={() => setShowDropdown(false)}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </div>
              <div className="border-t border-border py-1">
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-secondary"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
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
