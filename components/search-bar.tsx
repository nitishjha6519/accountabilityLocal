import { Search } from "lucide-react"

export function SearchBar() {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-input px-4 py-3">
      <Search className="h-5 w-5 text-muted-foreground" />
      <input
        type="text"
        placeholder="Try 'Fitness' or 'Coding'..."
        className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
        suppressHydrationWarning
      />
    </div>
  )
}
