"use client"

import { cn } from "@/lib/utils"
import type { Resume } from "@/lib/resume-data"
import { ArrowRight, Minus } from "lucide-react"

const rows = [
  { key: "atsScore", label: "ATS Score" },
  { key: "match", label: "Job Match" },
  { key: "readability", label: "Readability" },
  { key: "impact", label: "Impact" },
  { key: "formatting", label: "Formatting" },
] as const

export function CompareMode({ a, b }: { a: Resume; b: Resume }) {
  return (
    <section className="glass animate-float-up rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Compare mode</h2>
        <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
          v3 vs v2
        </span>
      </div>

      <div className="mb-3 grid grid-cols-[1fr_auto_auto] items-center gap-3 px-1 text-xs font-medium text-muted-foreground">
        <span>Metric</span>
        <span className="w-12 text-right">{b.name.split(" — ")[1]}</span>
        <span className="w-12 text-right">{a.name.split(" — ")[1]}</span>
      </div>

      <div className="flex flex-col gap-1">
        {rows.map((row) => {
          const aVal = a[row.key]
          const bVal = b[row.key]
          const diff = aVal - bVal
          return (
            <div
              key={row.key}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-lg px-1 py-2 transition-colors hover:bg-secondary/50"
            >
              <span className="text-sm text-foreground">{row.label}</span>
              <span className="w-12 text-right text-sm tabular-nums text-muted-foreground">
                {bVal}
              </span>
              <span className="flex w-12 items-center justify-end gap-1 text-sm font-semibold tabular-nums text-foreground">
                {aVal}
                <span
                  className={cn(
                    "flex items-center text-[0.7rem]",
                    diff > 0
                      ? "text-primary"
                      : diff < 0
                        ? "text-destructive"
                        : "text-muted-foreground",
                  )}
                >
                  {diff === 0 ? (
                    <Minus className="size-3" aria-hidden="true" />
                  ) : (
                    <>
                      <ArrowRight
                        className={cn(
                          "size-3",
                          diff > 0 ? "-rotate-45" : "rotate-45",
                        )}
                        aria-hidden="true"
                      />
                      {Math.abs(diff)}
                    </>
                  )}
                </span>
              </span>
            </div>
          )
        })}
      </div>

      <p className="mt-4 rounded-lg bg-primary/5 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
        <span className="font-semibold text-foreground">v3 wins overall.</span>{" "}
        Stronger keyword density and impact statements lifted the ATS score by 13
        points.
      </p>
    </section>
  )
}
