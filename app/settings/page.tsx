"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Moon,
  Sun,
  Monitor,
  Settings2,
  CreditCard,
  Bell,
  Link2,
  HelpCircle,
  Shield,
  LogOut,
  MoreHorizontal,
  Crown,
} from "lucide-react"
import { clearAuth, getUser } from "@/lib/auth"
import { useTheme } from "@/components/theme-provider"

export default function SettingsPage() {
  const router = useRouter()
  const user = getUser()
  const { theme, setTheme, resolvedTheme } = useTheme()

  const displayName = user?.fullName || "Alex Johnson"
  const displayEmail = user?.email || "alex.j@example.com"
  const displayInitials = user?.initials || "AJ"

  const handleLogout = () => {
    clearAuth()
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4">
        <Link href="/dashboard?role=client&tab=goals">
          <ChevronLeft className="h-6 w-6 text-foreground" />
        </Link>
        <h1 className="text-lg font-semibold text-foreground">Settings</h1>
        <button className="text-foreground">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </header>

      {/* Profile Section */}
      <div className="flex flex-col items-center px-4 pb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-2xl font-bold text-foreground">
          {displayInitials}
        </div>
        <h2 className="mt-4 text-xl font-bold text-foreground">{displayName}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{displayEmail}</p>
        <Link
          href="/settings/edit-profile"
          className="mt-4 flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          <Pencil className="h-4 w-4" />
          Edit Profile
        </Link>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-border" />

      {/* Settings Section */}
      <div className="px-4 pt-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Settings</p>

        {/* Appearance */}
        <div className="mb-4">
          <div className="flex items-center gap-3 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
              {resolvedTheme === "dark" ? (
                <Moon className="h-5 w-5 text-foreground" />
              ) : (
                <Sun className="h-5 w-5 text-foreground" />
              )}
            </div>
            <span className="font-medium text-foreground">Appearance</span>
          </div>
          <div className="ml-12 flex rounded-lg bg-secondary p-1">
            {(["light", "dark", "system"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setTheme(mode)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition-colors ${
                  theme === mode
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {mode === "light" && <Sun className="h-3.5 w-3.5" />}
                {mode === "dark" && <Moon className="h-3.5 w-3.5" />}
                {mode === "system" && <Monitor className="h-3.5 w-3.5" />}
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Setting Rows */}
        {[
          { icon: Settings2, label: "Account Settings", href: "#" },
          { icon: Crown, label: "Subscription Plan", href: "#", badge: "PRO" },
          { icon: CreditCard, label: "Payment Methods", href: "#" },
          { icon: Bell, label: "Notification Preferences", href: "#" },
          { icon: Link2, label: "Linked Accounts", href: "#" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center justify-between py-3.5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                <item.icon className="h-5 w-5 text-foreground" />
              </div>
              <span className="font-medium text-foreground">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              {item.badge && (
                <span className="rounded-md bg-primary/20 px-2 py-0.5 text-xs font-semibold text-primary">
                  {item.badge}
                </span>
              )}
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </Link>
        ))}
      </div>

      {/* Divider */}
      <div className="mx-4 mt-2 h-px bg-border" />

      {/* Support Section */}
      <div className="px-4 pt-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Support</p>
        {[
          { icon: HelpCircle, label: "Help & Support", href: "#" },
          { icon: Shield, label: "Privacy Policy", href: "#" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center justify-between py-3.5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                <item.icon className="h-5 w-5 text-foreground" />
              </div>
              <span className="font-medium text-foreground">{item.label}</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
        ))}
      </div>

      {/* Log Out Button */}
      <div className="px-4 pt-8">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-destructive py-4 text-base font-semibold text-destructive-foreground transition-colors hover:bg-destructive/90"
        >
          <LogOut className="h-5 w-5" />
          Log Out
        </button>
      </div>

      {/* Version */}
      <p className="mt-4 text-center text-xs text-muted-foreground">
        Accountability App - Version 2.1.0
      </p>
    </div>
  )
}
