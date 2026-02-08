"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AddExperiencePage() {
  const router = useRouter()
  const [jobTitle, setJobTitle] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [currentlyWorking, setCurrentlyWorking] = useState(false)
  const [description, setDescription] = useState("")

  const handleSubmit = () => {
    router.push("/settings/edit-profile")
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4">
        <Link href="/settings/edit-profile">
          <ChevronLeft className="h-6 w-6 text-foreground" />
        </Link>
        <h1 className="text-lg font-semibold text-foreground">Add Experience</h1>
        <div className="w-6" />
      </header>

      {/* Form */}
      <div className="flex flex-col gap-6 px-4 pt-4">
        {/* Job Title */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Job Title
          </label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Senior Accountability Coach"
            className="w-full rounded-xl border border-border bg-card px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>

        {/* Company Name */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Company Name
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. FocusMate Inc."
            className="w-full rounded-xl border border-border bg-card px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-xl border border-border bg-card px-4 py-3.5 text-sm text-foreground focus:border-primary focus:outline-none [color-scheme:dark]"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={currentlyWorking}
              className="w-full rounded-xl border border-border bg-card px-4 py-3.5 text-sm text-foreground focus:border-primary focus:outline-none disabled:opacity-50 [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Currently Working */}
        <button
          type="button"
          onClick={() => setCurrentlyWorking(!currentlyWorking)}
          className="flex items-center gap-3"
        >
          <div
            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
              currentlyWorking ? "border-primary bg-primary" : "border-muted-foreground"
            }`}
          >
            {currentlyWorking && (
              <div className="h-2 w-2 rounded-full bg-primary-foreground" />
            )}
          </div>
          <span className="text-sm text-foreground">I currently work here</span>
        </button>

        {/* Job Description */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Job Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your responsibilities and achievements..."
            rows={5}
            className="w-full rounded-xl border border-border bg-card px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          disabled={!jobTitle.trim() || !companyName.trim()}
          className="mt-2 w-full rounded-xl bg-primary py-6 text-base font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          Add Role
        </Button>

        {/* Cancel */}
        <button
          onClick={() => router.back()}
          className="pb-4 text-center text-sm text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
