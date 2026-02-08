import { Search, Bell, Rocket, Briefcase } from "lucide-react";

interface BottomNavigationProps {
  activeTab: "goals" | "applications" | "trials";
  role: "client" | "assistant";
  onTabChange: (tab: "goals" | "applications" | "trials") => void;
}

export function BottomNavigation({
  activeTab,
  role,
  onTabChange,
}: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-background">
      <div className="flex items-center justify-around py-3">
        <button
          onClick={() => onTabChange("goals")}
          className={`flex flex-col items-center gap-1 ${activeTab === "goals" ? "text-primary" : "text-muted-foreground"}`}
        >
          {role === "client" ? (
            <Briefcase className="h-5 w-5" />
          ) : (
            <Search className="h-5 w-5" />
          )}
          <span className="text-xs font-medium">
            {role === "client" ? "My Goals" : "Discover"}
          </span>
        </button>
        <button
          onClick={() => onTabChange("applications")}
          className={`relative flex flex-col items-center gap-1 ${activeTab === "applications" ? "text-primary" : "text-muted-foreground"}`}
        >
          <div className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              2
            </span>
          </div>
          <span className="text-xs font-medium">Applications</span>
        </button>
        <button
          onClick={() => onTabChange("trials")}
          className={`flex flex-col items-center gap-1 ${activeTab === "trials" ? "text-primary" : "text-muted-foreground"}`}
        >
          <Rocket className="h-5 w-5" />
          <span className="text-xs font-medium">Trials</span>
        </button>
      </div>
    </nav>
  );
}
