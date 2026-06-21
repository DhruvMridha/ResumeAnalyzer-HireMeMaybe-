"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { roastLines } from "@/lib/resume-data"
import { Flame, Sparkles, RefreshCw } from "lucide-react"

const severityStyle: Record<string, string> = {
  spicy: "border-destructive/30 bg-destructive/5",
  medium: "border-amber-500/30 bg-amber-500/5",
  mild: "border-primary/20 bg-primary/5",
}

const severityLabel: Record<string, string> = {
  spicy: "Brutal",
  medium: "Spicy",
  mild: "Gentle",
}

export function RoastMode() {
  const [enabled, setEnabled] = useState(true)

  return (
    <section className="glass animate-float-up overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <Flame className="size-5" aria-hidden="true" />
          </div>
          <div className="leading-tight">
            <h2 className="text-sm font-semibold text-foreground">Roast mode</h2>
            <p className="text-xs text-muted-foreground">
              Unfiltered feedback from the AI
            </p>
          </div>
        </div>

        <button
          role="switch"
          aria-checked={enabled}
          aria-label="Toggle roast mode"
          onClick={() => setEnabled((v) => !v)}
          className={cn(
            "relative h-6 w-11 shrink-0 rounded-full transition-colors",
            enabled ? "bg-destructive" : "bg-secondary",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 size-5 rounded-full bg-card shadow-sm transition-transform",
              enabled ? "translate-x-5" : "translate-x-0.5",
            )}
          />
        </button>
      </div>

      <div className="p-5">
        {enabled ? (
          <ul className="flex flex-col gap-2.5">
            {roastLines.map((line, i) => (
              <li
                key={i}
                className={cn(
                  "animate-float-up rounded-xl border p-3",
                  severityStyle[line.severity],
                )}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="mb-1 flex items-center gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-foreground">
                    {severityLabel[line.severity]}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {line.text}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <Sparkles className="size-6 text-primary" aria-hidden="true" />
            <p className="text-sm font-medium text-foreground">
              Playing it safe
            </p>
            <p className="max-w-xs text-xs text-muted-foreground">
              Roast mode is off. Flip the switch for brutally honest, no-mercy
              resume feedback.
            </p>
          </div>
        )}

        {enabled && (
          <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-secondary/50 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
            <RefreshCw className="size-4" aria-hidden="true" />
            Roast again
          </button>
        )}
      </div>
    </section>
  )
}
