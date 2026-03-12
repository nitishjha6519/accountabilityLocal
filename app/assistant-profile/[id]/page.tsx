"use client";

import { ChevronLeft, Share2, Star, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function AssistantProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3001/users/profile/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between bg-background px-4 py-3">
        <Link
          href="/dashboard?role=client&tab=applications"
          className="flex h-9 w-9 items-center justify-center"
        >
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </Link>
        <h1 className="text-base font-medium text-foreground">
          Assistant Profile
        </h1>
        <button className="flex h-9 w-9 items-center justify-center">
          <Share2 className="h-5 w-5 text-foreground" />
        </button>
      </header>

      <div className="px-4 pb-32">
        {/* Avatar Section */}
        <div className="mt-4 flex flex-col items-center">
          <div className="relative">
            {/* Show initials if no avatar */}
            <div
              className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-primary/20 text-2xl font-bold text-white"
              style={{
                backgroundColor: profile.user?.avatarColor || "#6366f1",
              }}
            >
              {profile.user?.initials || "A"}
            </div>
          </div>

          <h2 className="mt-4 text-xl font-bold text-foreground">
            {profile.user?.fullName || "Unknown"}
          </h2>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            {profile.user?.about || "No about info"}
          </p>
        </div>

        <div className="md: ml-60 mr-60">
          {/* About Me */}
          <div className="mt-8">
            <h3 className="text-base font-semibold text-foreground">
              About Me
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {profile.user?.about || "No about info"}
            </p>
          </div>

          {/* Reviews */}
          {profile.reviews && profile.reviews.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-foreground">
                  Reviews
                </h3>
              </div>
              <div className="mt-4">
                {profile.reviews.map((review: any, i: number) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-medium text-white bg-primary">
                      {review.providedBy?.initials || "U"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">
                          {review.providedBy?.fullName || "Unknown"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {review.sessionDate}
                        </p>
                      </div>
                      <p className="mt-1 text-sm italic leading-relaxed text-muted-foreground">
                        {review.comment}
                      </p>
                      <div className="mt-1 flex gap-1">
                        {Array.from({ length: review.stars || 0 }).map(
                          (_, j) => (
                            <Star
                              key={j}
                              className="h-3 w-3 fill-warning text-warning"
                            />
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
