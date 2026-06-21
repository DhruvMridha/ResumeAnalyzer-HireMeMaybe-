"use client"

import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"

function useCountUp(target: number, duration = 1100) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(eased * target))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return value
}

function rating(score: number) {
  if (score >= 80) return "Excellent"
  if (score >= 65) return "Good"
  if (score >= 50) return "Needs work"
  return "At risk"
}

export function ScoreGauge({ score }: { score: number }) {
  const value = useCountUp(score)
  const radius = 80
  const circumference = Math.PI * radius // semicircle
  const offset = circumference - (value / 100) * circumference

  return (
    <section className="glass animate-float-up rounded-2xl p-5">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">ATS Score</h2>
        <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          <TrendingUp className="size-3.5" aria-hidden="true" />
          +13 vs v2
        </span>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative" style={{ width: 200, height: 116 }}>
          <svg width="200" height="116" viewBox="0 0 200 116" aria-hidden="true">
            <defs>
              <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--chart-3)" />
                <stop offset="100%" stopColor="var(--primary)" />
              </linearGradient>
            </defs>
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="var(--secondary)"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="url(#gaugeGrad)"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 0.2s linear" }}
            />
          </svg>
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
            <span className="text-4xl font-bold tracking-tight text-foreground">
              {value}
            </span>
            <span className="text-xs font-medium text-primary">
              {rating(score)}
            </span>
          </div>
        </div>

        <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
          Your resume passes most ATS filters. Add missing keywords to break 90.
        </p>
      </div>
    </section>
  )
}
