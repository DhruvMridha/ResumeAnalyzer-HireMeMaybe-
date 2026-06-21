"use client"

import { useEffect, useState } from "react"
import type { Resume } from "@/lib/resume-data"

const metrics = [
  { key: "match", label: "Job Match" },
  { key: "readability", label: "Readability" },
  { key: "impact", label: "Impact" },
  { key: "formatting", label: "Formatting" },
] as const

function Bar({ value, delay }: { value: number; delay: number }) {
  const [w, setW] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setW(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-700 ease-out"
        style={{ width: `${w}%` }}
      />
    </div>
  )
}

export function MetricsBreakdown({ resume }: { resume: Resume }) {
  return (
    <section className="glass animate-float-up rounded-2xl p-5">
      <h2 className="mb-4 text-sm font-semibold text-foreground">
        Score breakdown
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {metrics.map((m, i) => {
          const value = resume[m.key]
          return (
            <div key={m.key}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{m.label}</span>
                <span className="text-sm font-semibold text-foreground">
                  {value}
                </span>
              </div>
              <Bar value={value} delay={i * 120} />
            </div>
          )
        })}
      </div>
    </section>
  )
}
