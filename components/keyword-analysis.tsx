"use client"

import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import type { Keyword } from "@/lib/resume-data"
import { Check, AlertTriangle, X } from "lucide-react"

const filters = [
  { key: "all", label: "All" },
  { key: "matched", label: "Matched" },
  { key: "weak", label: "Weak" },
  { key: "missing", label: "Missing" },
] as const

const meta: Record<
  Keyword["status"],
  { icon: typeof Check; className: string; dot: string }
> = {
  matched: {
    icon: Check,
    className: "border-primary/30 bg-primary/10 text-primary",
    dot: "bg-primary",
  },
  weak: {
    icon: AlertTriangle,
    className: "border-amber-500/30 bg-amber-500/10 text-amber-600",
    dot: "bg-amber-500",
  },
  missing: {
    icon: X,
    className: "border-destructive/30 bg-destructive/10 text-destructive",
    dot: "bg-destructive",
  },
}

export function KeywordAnalysis({ keywords }: { keywords: Keyword[] }) {
  const [filter, setFilter] = useState<(typeof filters)[number]["key"]>("all")

  const counts = useMemo(
    () => ({
      matched: keywords.filter((k) => k.status === "matched").length,
      weak: keywords.filter((k) => k.status === "weak").length,
      missing: keywords.filter((k) => k.status === "missing").length,
    }),
    [keywords],
  )

  const visible = keywords.filter((k) =>
    filter === "all" ? true : k.status === filter,
  )

  return (
    <section className="glass animate-float-up rounded-2xl p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-foreground">
          Keyword analysis
        </h2>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-primary" />
            {counts.matched} matched
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-amber-500" />
            {counts.weak} weak
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-destructive" />
            {counts.missing} missing
          </span>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              filter === f.key
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ul className="flex flex-wrap gap-2">
        {visible.map((k) => {
          const m = meta[k.status]
          const Icon = m.icon
          return (
            <li
              key={k.term}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm font-medium",
                m.className,
              )}
            >
              <Icon className="size-3.5" aria-hidden="true" />
              {k.term}
              {k.count > 0 && (
                <span className="rounded bg-card/60 px-1 text-xs tabular-nums">
                  {k.count}
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
