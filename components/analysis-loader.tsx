"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, CircleDotDashed, Circle } from "lucide-react"

export type AnalysisStep = {
  id: string
  label: string
  detail: string
}

const STEPS: AnalysisStep[] = [
  { id: "parse", label: "Parsing resume", detail: "Reading document structure & sections" },
  { id: "extract", label: "Extracting keywords", detail: "Matching against job-relevant terms" },
  { id: "ats", label: "Scoring ATS compatibility", detail: "Checking format, headings & parse rate" },
  { id: "skills", label: "Analyzing skills coverage", detail: "Comparing skills to target role" },
  { id: "impact", label: "Measuring impact signals", detail: "Detecting metrics & action verbs" },
  { id: "report", label: "Compiling report", detail: "Generating insights & recommendations" },
]

const STEP_MS = 900

type Status = "completed" | "in-progress" | "pending"

export function AnalysisLoader({
  fileName,
  onComplete,
}: {
  fileName: string
  onComplete: () => void
}) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (active >= STEPS.length) {
      const t = setTimeout(onComplete, 600)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setActive((a) => a + 1), STEP_MS)
    return () => clearTimeout(t)
  }, [active, onComplete])

  const progress = Math.min(100, Math.round((active / STEPS.length) * 100))

  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            Analyzing {fileName}
          </p>
          <p className="text-xs text-muted-foreground">
            {active >= STEPS.length ? "Finishing up…" : "This usually takes a few seconds"}
          </p>
        </div>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary tabular-nums">
          {Math.min(100, active >= STEPS.length ? 100 : progress)}%
        </span>
      </div>

      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-border">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${active >= STEPS.length ? 100 : progress}%` }}
          transition={{ ease: [0.2, 0.65, 0.3, 0.9], duration: 0.4 }}
        />
      </div>

      <ul className="space-y-0.5">
        {STEPS.map((step, i) => {
          const status: Status =
            i < active ? "completed" : i === active ? "in-progress" : "pending"
          return (
            <motion.li
              key={step.id}
              className="flex items-start gap-2.5 rounded-lg px-2 py-1.5"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.25 }}
            >
              <span className="mt-0.5 flex-shrink-0">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={status}
                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                    transition={{ duration: 0.2 }}
                    className="block"
                  >
                    {status === "completed" ? (
                      <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
                    ) : status === "in-progress" ? (
                      <CircleDotDashed className="size-4 animate-spin text-primary [animation-duration:2s]" aria-hidden="true" />
                    ) : (
                      <Circle className="size-4 text-muted-foreground/40" aria-hidden="true" />
                    )}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className="min-w-0">
                <span
                  className={
                    status === "pending"
                      ? "block text-sm text-muted-foreground/60"
                      : "block text-sm font-medium text-foreground"
                  }
                >
                  {step.label}
                </span>
                <AnimatePresence>
                  {status === "in-progress" && (
                    <motion.span
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="block overflow-hidden text-xs text-muted-foreground"
                    >
                      {step.detail}
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </motion.li>
          )
        })}
      </ul>
    </div>
  )
}
