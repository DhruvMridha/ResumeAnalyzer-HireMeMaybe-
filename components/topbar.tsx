"use client"

import { Search, Bell, Plus } from "lucide-react"

export function Topbar() {
  return (
    <header className="glass sticky top-0 z-20 flex items-center justify-between gap-4 rounded-2xl px-4 py-3">
      <div>
        <h1 className="text-pretty text-lg font-semibold tracking-tight text-foreground">
          Resume Analyzer
        </h1>
        <p className="text-xs text-muted-foreground">
          AI-powered ATS insights for your applications
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search resumes, roles…"
            aria-label="Search"
            className="h-9 w-56 rounded-lg border border-border bg-secondary/60 pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
          />
        </div>
        <button
          aria-label="Notifications"
          className="relative flex size-9 items-center justify-center rounded-lg border border-border bg-secondary/60 text-muted-foreground transition-colors hover:text-foreground"
        >
          <Bell className="size-4" aria-hidden="true" />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary" />
        </button>
        <button className="flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
          <Plus className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">New scan</span>
        </button>
      </div>
    </header>
  )
}
