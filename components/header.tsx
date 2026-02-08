import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">Accountability.io</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Browse Goals
          </a>
          <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            How it Works
          </a>
          <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Pricing
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild size="sm" className="rounded-full bg-secondary text-foreground hover:bg-secondary/80">
            <Link href="/signup">Register</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
