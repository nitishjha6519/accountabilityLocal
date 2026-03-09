"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  LogOut,
} from "lucide-react"
import { clearAuth, getUser } from "@/lib/auth"

export default function SettingsPage() {
  const router = useRouter()
  const user = getUser()

  const displayName = user?.fullName || "Guest"
  const displayEmail = user?.email || "No email"
  const displayInitials = user?.initials || "?"

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
        <h1 className="text-lg font-semibold text-foreground">Profile</h1>
        <div className="w-6" />
      </header>

      {/* Profile Section */}
      <div className="flex flex-col items-center px-4 pb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
          {displayInitials}
        </div>
        <h2 className="mt-4 text-xl font-bold text-foreground">{displayName}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{displayEmail}</p>
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
