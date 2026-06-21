"use client"

import { cn } from "@/lib/utils"
import { SparklesText } from "@/components/ui/sparkles-text"
import {
  LayoutDashboard,
  FileText,
  Target,
  GitCompareArrows,
  Flame,
  Settings,
  Sparkles,
  LifeBuoy,
} from "lucide-react"

const nav = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Resumes", icon: FileText },
  { label: "ATS Score", icon: Target },
  { label: "Compare", icon: GitCompareArrows },
  { label: "Roast Mode", icon: Flame },
]

const secondary = [
  { label: "Settings", icon: Settings },
  { label: "Support", icon: LifeBuoy },
]

export function Sidebar() {
  return (
    <aside className="glass sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-8 px-4 py-6 lg:flex">
      <div className="flex items-center gap-2.5 px-2">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <Sparkles className="size-5" aria-hidden="true" />
        </div>
        <div className="leading-tight">
          <SparklesText
            text="Hire Me Maybe"
            sparklesCount={6}
            className="text-sm font-semibold text-foreground"
          />
          <p className="text-xs text-muted-foreground">Resume Intelligence</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1" aria-label="Main">
        <p className="px-3 pb-1 text-[0.7rem] font-medium uppercase tracking-wider text-muted-foreground">
          Analyze
        </p>
        {nav.map((item) => (
          <button
            key={item.label}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              item.active
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <item.icon className="size-4" aria-hidden="true" />
            {item.label}
          </button>
        ))}
      </nav>

      <nav className="mt-auto flex flex-col gap-1" aria-label="Secondary">
        {secondary.map((item) => (
          <button
            key={item.label}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <item.icon className="size-4" aria-hidden="true" />
            {item.label}
          </button>
        ))}
        <div className="glass-strong mt-3 rounded-xl p-3">
          <p className="text-xs font-semibold text-foreground">Pro plan</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Unlimited scans & roast mode
          </p>
          <button className="mt-3 w-full rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90">
            Upgrade
          </button>
        </div>
      </nav>
    </aside>
  )
}
