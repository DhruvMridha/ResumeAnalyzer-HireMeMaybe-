"use client"

import { useEffect, useState } from "react"
import { scoreHistory } from "@/lib/resume-data"
import { FileCheck2, Target, Flame, GitCompareArrows } from "lucide-react"
import { SparklesText } from "@/components/ui/sparkles-text"

const stats = [
  { label: "Resumes scanned", value: 12, icon: FileCheck2 },
  { label: "Avg. ATS score", value: 78, icon: Target, sparkle: true },
  { label: "Keywords fixed", value: 34, icon: GitCompareArrows },
  { label: "Roasts survived", value: 9, icon: Flame, sparkle: true },
]

function useCountUp(target: number, duration = 900) {
  const [v, setV] = useState(0)
  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      setV(Math.round((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return v
}

function StatCard({ stat, index }: { stat: (typeof stats)[number]; index: number }) {
  const value = useCountUp(stat.value)
  return (
    <div
      className="glass animate-float-up rounded-2xl p-4"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <stat.icon className="size-[18px]" aria-hidden="true" />
      </div>
      {stat.sparkle ? (
        <SparklesText
          text={String(value)}
          sparklesCount={7}
          className="text-2xl font-bold tracking-tight text-foreground tabular-nums"
        />
      ) : (
        <p className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
          {value}
        </p>
      )}
      <p className="mt-0.5 text-xs text-muted-foreground">{stat.label}</p>
    </div>
  )
}

export function StatCards() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((s, i) => (
        <StatCard key={s.label} stat={s} index={i} />
      ))}
    </div>
  )
}

export function TrendCard() {
  const max = Math.max(...scoreHistory.map((s) => s.score))
  return (
    <section className="glass animate-float-up rounded-2xl p-5">
      <h2 className="mb-4 text-sm font-semibold text-foreground">
        Score progress
      </h2>
      <div className="flex h-32 items-end justify-between gap-3">
        {scoreHistory.map((point, i) => (
          <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex w-full flex-1 items-end">
              <div
                className="w-full rounded-t-md bg-primary/80 transition-all duration-700 ease-out"
                style={{
                  height: `${(point.score / max) * 100}%`,
                  transitionDelay: `${i * 100}ms`,
                }}
                aria-label={`${point.label}: ${point.score}`}
              />
            </div>
            <span className="text-xs text-muted-foreground">{point.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
