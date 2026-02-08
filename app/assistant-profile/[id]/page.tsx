"use client"

import { ChevronLeft, Share2, Star, CheckCircle2, MessageSquare, Briefcase } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const assistantProfiles: Record<string, {
  name: string
  initials: string
  avatarColor: string
  avatar?: string
  verified: boolean
  title: string
  rating: number
  reviewCount: number
  totalHours: string
  successRate: string
  experience: string
  about: string
  specializations: { label: string; icon: string }[]
  hourlyRate: number
  rateLabel: string
  workHistory: {
    title: string
    company: string
    type: string
    dateRange: string
    description: string
  }[]
  reviews: {
    name: string
    initials: string
    avatarColor: string
    rating: number
    text: string
    time: string
  }[]
}> = {
  "1": {
    name: "Sarah Jenkins",
    initials: "SJ",
    avatarColor: "#6366f1",
    avatar: "/images/sarah-avatar.jpg",
    verified: true,
    title: "Certified Accountability Coach",
    rating: 4.9,
    reviewCount: 120,
    totalHours: "500+",
    successRate: "98%",
    experience: "5 Yrs",
    about: "I help remote workers stay focused and achieve their fitness and career goals through structured daily check-ins and personalized roadmaps. My approach is tough love mixed with genuine empathy. I believe in building sustainable habits that last beyond our partnership.",
    specializations: [
      { label: "Productivity", icon: "pencil" },
      { label: "Fitness & Health", icon: "fire" },
      { label: "ADHD Support", icon: "brain" },
      { label: "Career Growth", icon: "rocket" },
    ],
    hourlyRate: 50,
    rateLabel: "wk",
    workHistory: [
      {
        title: "Senior Accountability Coach",
        company: "FocusMate Inc.",
        type: "Freelance",
        dateRange: "2021 - Present",
        description: "Guided over 200 clients to reach quarterly goals.",
      },
      {
        title: "Productivity Consultant",
        company: "Freelance",
        type: "Freelance",
        dateRange: "2018 - 2021",
        description: "Specialized in workflow optimization for remote teams.",
      },
    ],
    reviews: [
      {
        name: "Mark T.",
        initials: "MT",
        avatarColor: "#10b981",
        rating: 5,
        text: "\"Sarah changed my life! I finally finished my novel after 3 years of procrastination. Her daily check-ins...\"",
        time: "2 weeks ago",
      },
      {
        name: "Lisa R.",
        initials: "LR",
        avatarColor: "#ec4899",
        rating: 5,
        text: "\"Incredible journey with Sarah. She kept me on track with my workout routine consistently...\"",
        time: "1 month ago",
      },
      {
        name: "David K.",
        initials: "DK",
        avatarColor: "#f59e0b",
        rating: 4,
        text: "\"Great accountability partner. Very structured approach and always responsive...\"",
        time: "2 months ago",
      },
    ],
  },
  "2": {
    name: "Marcus Chen",
    initials: "MC",
    avatarColor: "#f59e0b",
    verified: true,
    title: "Tech Founder Coach & PM",
    rating: 5.0,
    reviewCount: 87,
    totalHours: "350+",
    successRate: "99%",
    experience: "4 Yrs",
    about: "Former YC startup PM turned accountability coach. I specialize in helping founders and indie hackers ship products on time. My no-excuses style keeps you focused on what matters. If you need someone to hold your feet to the fire, I'm your person.",
    specializations: [
      { label: "Startups", icon: "rocket" },
      { label: "Product Dev", icon: "code" },
      { label: "Productivity", icon: "pencil" },
      { label: "Leadership", icon: "star" },
    ],
    hourlyRate: 75,
    rateLabel: "wk",
    workHistory: [
      {
        title: "Product Manager",
        company: "YC Startup (W19)",
        type: "Full-time",
        dateRange: "2019 - 2022",
        description: "Led product team of 8, shipped 3 major releases.",
      },
      {
        title: "Accountability Coach",
        company: "Independent",
        type: "Freelance",
        dateRange: "2022 - Present",
        description: "Helped 50+ founders launch their MVPs on schedule.",
      },
    ],
    reviews: [
      {
        name: "Alex P.",
        initials: "AP",
        avatarColor: "#3b82f6",
        rating: 5,
        text: "\"Marcus helped me ship my app in 6 weeks. His PM background made all the difference...\"",
        time: "1 week ago",
      },
      {
        name: "Nina S.",
        initials: "NS",
        avatarColor: "#8b5cf6",
        rating: 5,
        text: "\"Exactly what I needed. Direct, no-nonsense accountability that actually works...\"",
        time: "3 weeks ago",
      },
    ],
  },
  "3": {
    name: "Jean-Luc P.",
    initials: "JL",
    avatarColor: "#3b82f6",
    verified: false,
    title: "French Language Tutor",
    rating: 4.8,
    reviewCount: 45,
    totalHours: "200+",
    successRate: "95%",
    experience: "3 Yrs",
    about: "Native French speaker from Paris. I make learning French fun and engaging through structured daily practice sessions. Whether you need conversational French or exam prep, I create a personalized roadmap to keep you on track.",
    specializations: [
      { label: "Languages", icon: "globe" },
      { label: "Exam Prep", icon: "book" },
      { label: "Conversation", icon: "chat" },
    ],
    hourlyRate: 30,
    rateLabel: "wk",
    workHistory: [
      {
        title: "French Language Tutor",
        company: "Preply",
        type: "Freelance",
        dateRange: "2021 - Present",
        description: "Tutored 100+ students in conversational French.",
      },
    ],
    reviews: [
      {
        name: "Emma W.",
        initials: "EW",
        avatarColor: "#10b981",
        rating: 5,
        text: "\"Jean-Luc is an amazing tutor! My French improved dramatically in just 2 months...\"",
        time: "1 month ago",
      },
    ],
  },
}

const specIcons: Record<string, string> = {
  pencil: "pencil",
  fire: "fire",
  brain: "brain",
  rocket: "rocket",
  code: "code",
  star: "star",
  globe: "globe",
  book: "book",
  chat: "chat",
}

const specEmojis: Record<string, string> = {
  pencil: "\u270F\uFE0F",
  fire: "\uD83D\uDD25",
  brain: "\uD83E\uDDE0",
  rocket: "\uD83D\uDE80",
  code: "\uD83D\uDCBB",
  star: "\u2B50",
  globe: "\uD83C\uDF0D",
  book: "\uD83D\uDCDA",
  chat: "\uD83D\uDCAC",
}

export default function AssistantProfilePage() {
  const params = useParams()
  const id = params.id as string
  const [showFullAbout, setShowFullAbout] = useState(false)

  const profile = assistantProfiles[id]

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Profile not found</p>
      </div>
    )
  }

  const truncatedAbout = profile.about.length > 150 ? profile.about.slice(0, 150) + "..." : profile.about

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between bg-background/95 px-4 py-3 backdrop-blur-md">
        <Link href="/dashboard?role=client&tab=applications" className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </Link>
        <h1 className="font-semibold text-foreground">Assistant Profile</h1>
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
          <Share2 className="h-4 w-4 text-foreground" />
        </button>
      </header>

      <div className="px-4 pb-32">
        {/* Avatar Section */}
        <div className="mt-4 flex flex-col items-center">
          <div className="relative">
            {profile.avatar ? (
              <Image
                src={profile.avatar || "/placeholder.svg"}
                alt={profile.name}
                width={120}
                height={120}
                className="h-28 w-28 rounded-full border-4 border-primary/30 object-cover"
              />
            ) : (
              <div
                className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-primary/30 text-3xl font-bold text-white"
                style={{ backgroundColor: profile.avatarColor }}
              >
                {profile.initials}
              </div>
            )}
            {profile.verified && (
              <div className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary">
                <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
          </div>

          <h2 className="mt-3 flex items-center gap-1.5 text-xl font-bold text-foreground">
            {profile.name}
            {profile.verified && <CheckCircle2 className="h-5 w-5 text-primary" />}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{profile.title}</p>

          <div className="mt-2 flex items-center gap-1">
            <Star className="h-4 w-4 fill-warning text-warning" />
            <span className="text-sm font-medium text-foreground">{profile.rating}</span>
            <span className="text-sm text-muted-foreground">({profile.reviewCount} reviews)</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-border bg-card p-3 text-center">
            <p className="text-xl font-bold text-foreground">{profile.totalHours}</p>
            <p className="text-xs uppercase text-muted-foreground">Hours</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3 text-center">
            <p className="text-xl font-bold text-foreground">{profile.successRate}</p>
            <p className="text-xs uppercase text-muted-foreground">Success</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3 text-center">
            <p className="text-xl font-bold text-foreground">{profile.experience}</p>
            <p className="text-xs uppercase text-muted-foreground">Exp</p>
          </div>
        </div>

        {/* About Me */}
        <div className="mt-6">
          <h3 className="font-semibold text-foreground">About Me</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {showFullAbout ? profile.about : truncatedAbout}
          </p>
          {profile.about.length > 150 && (
            <button
              onClick={() => setShowFullAbout(!showFullAbout)}
              className="mt-1 text-sm font-medium text-primary"
            >
              {showFullAbout ? "Show less" : "Read more"}
            </button>
          )}
        </div>

        {/* Specializations */}
        <div className="mt-6">
          <h3 className="font-semibold text-foreground">Specializations</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.specializations.map((spec) => (
              <span
                key={spec.label}
                className="flex items-center gap-1.5 rounded-full bg-secondary px-3.5 py-2 text-sm text-foreground"
              >
                <span>{specEmojis[spec.icon] || specEmojis.star}</span>
                {spec.label}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <Button variant="outline" className="flex-1 gap-2 bg-transparent">
            <MessageSquare className="h-4 w-4" />
            Message
          </Button>
          <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
            Hire {profile.name.split(" ")[0]} (${profile.hourlyRate}/{profile.rateLabel})
          </Button>
        </div>

        {/* Work Experience */}
        <div className="mt-8">
          <h3 className="font-semibold text-foreground">Experience</h3>
          <div className="mt-4 flex flex-col gap-5">
            {profile.workHistory.map((job, i) => (
              <div key={i} className="flex gap-3">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{job.title}</h4>
                  <p className="text-sm text-muted-foreground">{job.company} &bull; {job.dateRange}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{job.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Client Reviews */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Client Reviews</h3>
            <button className="text-sm font-medium text-primary">See All</button>
          </div>
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {profile.reviews.map((review, i) => (
              <div key={i} className="w-64 shrink-0 rounded-xl bg-card p-4">
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: review.avatarColor }}
                  >
                    {review.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{review.name}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star
                          key={j}
                          className={`h-3 w-3 ${j < review.rating ? "fill-warning text-warning" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{review.text}</p>
                <p className="mt-2 text-xs text-muted-foreground">{review.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
