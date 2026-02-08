"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  X,
  Camera,
  Pencil,
  Star,
  Plus,
  X as XIcon,
  Briefcase,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { getUser } from "@/lib/auth"

interface Experience {
  id: string
  title: string
  company: string
  period: string
  description: string
}

export default function EditProfilePage() {
  const router = useRouter()
  const user = getUser()

  const [about, setAbout] = useState(
    "I help remote workers stay focused and achieve their fitness and career goals through structured daily check-ins and personalized roadmaps. My approach combines behavioral science with empathetic support to build lasting habits."
  )
  const [isEditingAbout, setIsEditingAbout] = useState(false)
  const [specializations, setSpecializations] = useState([
    { id: "1", label: "Productivity", icon: "rocket" },
    { id: "2", label: "Fitness & Health", icon: "dumbbell" },
    { id: "3", label: "ADHD Support", icon: "brain" },
    { id: "4", label: "Career Growth", icon: "trending" },
  ])
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: "1",
      title: "Senior Accountability Coach",
      company: "FocusMate Inc.",
      period: "2021 - Present",
      description: "Guided over 200 clients to reach quarterly goals through deep-work facilitation.",
    },
    {
      id: "2",
      title: "Productivity Consultant",
      company: "Freelance",
      period: "2018 - 2021",
      description: "Specialized in workflow optimization for remote teams.",
    },
  ])

  const displayName = user?.fullName || "Sarah Jenkins"
  const displayInitials = user?.initials || "SJ"

  const removeSpecialization = (id: string) => {
    setSpecializations((prev) => prev.filter((s) => s.id !== id))
  }

  const removeExperience = (id: string) => {
    setExperiences((prev) => prev.filter((e) => e.id !== id))
  }

  const getSpecIcon = (icon: string) => {
    switch (icon) {
      case "rocket": return "🚀"
      case "dumbbell": return "💪"
      case "brain": return "🧠"
      case "trending": return "📈"
      default: return "📌"
    }
  }

  const handleSave = () => {
    router.push("/settings")
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4">
        <Link href="/settings">
          <X className="h-6 w-6 text-foreground" />
        </Link>
        <h1 className="text-lg font-semibold text-foreground">Edit Profile Details</h1>
        <button onClick={handleSave} className="text-sm font-semibold text-primary">
          Save
        </button>
      </header>

      {/* Avatar */}
      <div className="flex flex-col items-center px-4 pt-2 pb-6">
        <div className="relative">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary text-3xl font-bold text-foreground">
            {displayInitials}
          </div>
          <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Camera className="h-4 w-4" />
          </button>
        </div>
        <h2 className="mt-4 flex items-center gap-1.5 text-xl font-bold text-foreground">
          {displayName}
          <CheckCircle2 className="h-5 w-5 fill-primary text-primary-foreground" />
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">Certified Accountability Coach</p>
        <div className="mt-1 flex items-center gap-1 text-sm">
          <Star className="h-4 w-4 fill-warning text-warning" />
          <span className="font-medium text-foreground">4.9</span>
          <span className="text-muted-foreground">(120 reviews)</span>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-4 grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center rounded-xl border border-border bg-card p-3">
          <span className="text-xl font-bold text-foreground">500+</span>
          <span className="text-xs uppercase text-muted-foreground">Hours</span>
        </div>
        <div className="flex flex-col items-center rounded-xl border border-border bg-card p-3">
          <span className="text-xl font-bold text-foreground">98%</span>
          <span className="text-xs uppercase text-muted-foreground">Success</span>
        </div>
        <div className="flex flex-col items-center rounded-xl border border-border bg-card p-3">
          <span className="text-xl font-bold text-foreground">5 Yrs</span>
          <span className="text-xs uppercase text-muted-foreground">Experience</span>
        </div>
      </div>

      {/* About Me */}
      <div className="px-4 pt-8">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">About Me</h3>
          <button onClick={() => setIsEditingAbout(!isEditingAbout)}>
            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>
        {isEditingAbout ? (
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="mt-3 w-full rounded-xl border border-border bg-card p-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            rows={5}
          />
        ) : (
          <div className="mt-3 rounded-xl border border-border bg-card p-4">
            <p className="text-sm leading-relaxed text-foreground">{about}</p>
          </div>
        )}
      </div>

      {/* Specializations */}
      <div className="px-4 pt-8">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Specializations</h3>
          <button className="text-sm font-semibold text-primary">+ Add New</button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {specializations.map((spec) => (
            <div
              key={spec.id}
              className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm text-foreground"
            >
              <span>{getSpecIcon(spec.icon)}</span>
              {spec.label}
              <button
                onClick={() => removeSpecialization(spec.id)}
                className="ml-0.5 rounded-full p-0.5 hover:bg-muted"
              >
                <XIcon className="h-3 w-3 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="px-4 pt-8">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Experience</h3>
          <Link href="/settings/add-experience" className="text-sm font-semibold text-primary">
            + Add Role
          </Link>
        </div>
        <div className="mt-3 flex flex-col gap-4">
          {experiences.map((exp) => (
            <div key={exp.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <Briefcase className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{exp.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {exp.company} - {exp.period}
                    </p>
                  </div>
                </div>
                <button className="rounded-full bg-primary/10 p-1.5">
                  <Pencil className="h-3.5 w-3.5 text-primary" />
                </button>
              </div>
              <p className="mt-3 pl-13 text-sm leading-relaxed text-muted-foreground">
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
