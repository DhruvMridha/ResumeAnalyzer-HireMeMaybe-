"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Circle, CircleDotDashed, Sparkles } from "lucide-react"

type StepStatus = "pending" | "in-progress" | "completed"

interface Step {
  id: number
  title: string
  detail: string
  status: StepStatus
  tool: string
}

const STEPS: Omit<Step, "status">[] = [
  { id: 1, title: "Reading document",        detail: "Parsing PDF structure and extracting text content",      tool: "file-parser"       },
  { id: 2, title: "ATS compatibility check", detail: "Scoring format, headings, and section structure",        tool: "ats-engine"        },
  { id: 3, title: "Keyword extraction",      detail: "Identifying industry terms, skills and technologies",    tool: "nlp-processor"     },
  { id: 4, title: "Analysing job match",     detail: "Comparing profile against target role requirements",     tool: "matching-model"    },
  { id: 5, title: "Generating suggestions",  detail: "Creating personalised improvement recommendations",      tool: "gemini-2.5-flash"  },
  { id: 6, title: "Compiling your report",   detail: "Assembling all scores, keywords and suggestions",        tool: "report-builder"    },
]

// How many seconds each step takes (totals ~14 s)
const DURATIONS = [2, 2.5, 2, 2.5, 3, 2]

export function AnalysisPlanLoader() {
  const [steps, setSteps] = useState<Step[]>(
    STEPS.map((s, i) => ({ ...s, status: i === 0 ? "in-progress" : "pending" }))
  )
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (currentStep >= STEPS.length) return
    const ms = DURATIONS[currentStep] * 1000

    const timer = setTimeout(() => {
      setSteps(prev =>
        prev.map((s, i) => {
          if (i === currentStep)     return { ...s, status: "completed" }
          if (i === currentStep + 1) return { ...s, status: "in-progress" }
          return s
        })
      )
      setCurrentStep(c => c + 1)
    }, ms)

    return () => clearTimeout(timer)
  }, [currentStep])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.96 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="w-72 rounded-xl border border-white/10 shadow-2xl overflow-hidden"
      style={{ background: "rgba(9,9,11,0.85)", backdropFilter: "blur(20px)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
        >
          <Sparkles className="size-3.5 text-sky-400" />
        </motion.div>
        <p className="text-xs font-semibold text-white">Analyzing your resume</p>
        <span className="ml-auto flex gap-0.5">
          {[0, 1, 2].map(i => (
            <motion.span
              key={i}
              className="size-1 rounded-full bg-sky-400"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
            />
          ))}
        </span>
      </div>

      {/* Steps */}
      <div className="px-3 py-2.5 space-y-0.5">
        {steps.map((step, idx) => (
          <motion.div
            key={step.id}
            className="flex items-start gap-2.5 rounded-lg px-2 py-1.5 relative"
            animate={step.status === "in-progress"
              ? { backgroundColor: "rgba(14,165,233,0.07)" }
              : { backgroundColor: "rgba(0,0,0,0)" }
            }
            transition={{ duration: 0.3 }}
          >
            {/* Connector line */}
            {idx < steps.length - 1 && (
              <div className="absolute left-[17px] top-[26px] bottom-[-6px] w-px border-l border-dashed border-white/10" />
            )}

            {/* Icon */}
            <div className="mt-0.5 shrink-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.status}
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  {step.status === "completed" ? (
                    <CheckCircle2 className="size-3.5 text-green-400" />
                  ) : step.status === "in-progress" ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    >
                      <CircleDotDashed className="size-3.5 text-sky-400" />
                    </motion.div>
                  ) : (
                    <Circle className="size-3.5 text-white/20" />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Text */}
            <div className="min-w-0 flex-1">
              <p className={`text-xs font-medium leading-tight ${
                step.status === "completed" ? "text-white/40 line-through" :
                step.status === "in-progress" ? "text-white" :
                "text-white/30"
              }`}>
                {step.title}
              </p>
              {step.status === "in-progress" && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-[10px] text-sky-400/80 mt-0.5 leading-snug"
                >
                  {step.detail}
                </motion.p>
              )}
              {step.status === "in-progress" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-1"
                >
                  <span
                    className="text-[9px] font-mono rounded px-1.5 py-0.5"
                    style={{ background: "rgba(14,165,233,0.12)", color: "rgba(125,211,252,0.8)" }}
                  >
                    {step.tool}
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
