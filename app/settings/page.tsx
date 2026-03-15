"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, LogOut, Pencil, Check, X } from "lucide-react";
import { clearAuth, getUser, saveAuth, getAuth } from "@/lib/auth";
import { apiPatch } from "@/lib/api";

export default function SettingsPage() {
  const router = useRouter();
  const user = getUser();

  const displayName = user?.fullName || "Guest";
  const displayEmail = user?.email || "No email";
  const displayInitials = user?.initials || "?";

  const [about, setAbout] = useState(user?.about || "");
  const [editingAbout, setEditingAbout] = useState(false);
  const [aboutDraft, setAboutDraft] = useState("");
  const [savingAbout, setSavingAbout] = useState(false);

  const handleSaveAbout = async () => {
    if (!user?.id) return;
    setSavingAbout(true);
    try {
      await apiPatch(`/users/about/${user.id}`, { about: aboutDraft.trim() });
      const trimmed = aboutDraft.trim();
      setAbout(trimmed);
      // Persist to session so it survives navigation
      const authData = getAuth();
      if (authData) {
        authData.user.about = trimmed;
        saveAuth(authData);
      }
      setEditingAbout(false);
    } catch {
      // silently fail
    } finally {
      setSavingAbout(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

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
        <h2 className="mt-4 text-xl font-bold text-foreground">
          {displayName}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{displayEmail}</p>
      </div>

      {/* About / Bio Section */}
      <div className="px-4 pb-4">
        <div className="rounded-xl bg-card p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">About</h3>
            <button
              onClick={() => {
                setAboutDraft(about);
                setEditingAbout(true);
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>
          {editingAbout ? (
            <div className="mt-2">
              <textarea
                value={aboutDraft}
                onChange={(e) => setAboutDraft(e.target.value)}
                placeholder="Tell others about yourself..."
                className="w-full resize-none rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
              />
              <div className="mt-2 flex justify-end gap-2">
                <button
                  onClick={() => setEditingAbout(false)}
                  className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-secondary"
                >
                  <X className="h-4 w-4" /> Cancel
                </button>
                <button
                  onClick={handleSaveAbout}
                  disabled={savingAbout}
                  className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {savingAbout ? (
                    "Saving..."
                  ) : (
                    <>
                      <Check className="h-4 w-4" /> Save
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              {about || "Add your bio."}
            </p>
          )}
        </div>
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
  );
}
