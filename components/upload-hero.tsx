"use client"

import { useCallback, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { BackgroundPaths } from "@/components/ui/background-paths"
import { MagnetizeButton } from "@/components/ui/magnetize-button"
import { AnalysisPlanLoader } from "@/components/ui/analysis-plan-loader"
import { cn } from "@/lib/utils"
import { UploadCloud, FileText, CheckCircle2, X, AlertCircle } from "lucide-react"
import { saveAnalysis } from "@/lib/session"

function AnimatedTitle({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ")
  return (
    <h1 className={className}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="mr-4 inline-block last:mr-0">
          {word.split("").map((letter, letterIndex) => (
            <motion.span
              key={`${wordIndex}-${letterIndex}`}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: wordIndex * 0.1 + letterIndex * 0.03,
                type: "spring",
                stiffness: 150,
                damping: 25,
              }}
              className="inline-block bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent"
            >
              {letter}
            </motion.span>
          ))}
        </span>
      ))}
    </h1>
  )
}

export function UploadHero() {
  const router = useRouter()
  const [dragging, setDragging]     = useState(false)
  const [fileName, setFileName]     = useState<string | null>(null)
  const [fileObj,  setFileObj]      = useState<File | null>(null)
  const [loading,  setLoading]      = useState(false)
  const [error,    setError]        = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((f: File) => {
    setFileName(f.name)
    setFileObj(f)
    setError(null)
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const f = e.dataTransfer.files?.[0]
      if (f) handleFile(f)
    },
    [handleFile],
  )

  const handleStartAnalysis = async () => {
    if (!fileObj || loading) return
    setLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append("file", fileObj)
      const res = await fetch("/api/analyze", { method: "POST", body: formData })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Analysis failed")
      }
      const data = await res.json()
      saveAnalysis(data)
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-neutral-950 px-4 py-16">
      <BackgroundPaths />

      {/* ── Main content ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center text-center"
      >
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-sky-300 backdrop-blur-md">
          <span className="size-1.5 rounded-full bg-sky-400" />
          AI Resume Analyzer
        </span>

        <AnimatedTitle
          text="Hire Me Maybe"
          className="mb-4 text-5xl font-bold tracking-tighter text-balance sm:text-7xl md:text-8xl"
        />

        <p className="mb-10 max-w-md text-pretty text-base leading-relaxed text-neutral-400">
          Drop your resume below and let our AI score your ATS compatibility, hunt missing keywords,
          and roast it like a brutally honest recruiter.
        </p>

        {/* Upload box */}
        <div className="w-full">
          {fileName ? (
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-lg">
              <div className="flex size-11 items-center justify-center rounded-xl bg-sky-500/15 text-sky-300">
                <FileText className="size-5" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-medium text-white">{fileName}</p>
                <p className="flex items-center gap-1 text-xs text-neutral-400">
                  <CheckCircle2 className="size-3.5 text-sky-400" aria-hidden="true" />
                  Ready to analyze
                </p>
              </div>
              <button
                onClick={() => { setFileName(null); setFileObj(null); setError(null) }}
                aria-label="Remove file"
                className="flex size-8 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={cn(
                "group flex w-full flex-col items-center gap-3 rounded-2xl border border-dashed p-8 backdrop-blur-lg transition-all duration-300",
                dragging
                  ? "border-sky-400 bg-sky-500/10"
                  : "border-white/15 bg-white/5 hover:border-sky-400/50 hover:bg-white/[0.07]",
              )}
            >
              <div className="flex size-12 items-center justify-center rounded-xl bg-sky-500/15 text-sky-300 transition-transform duration-300 group-hover:-translate-y-0.5">
                <UploadCloud className="size-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  Drop your resume or <span className="text-sky-300">browse files</span>
                </p>
                <p className="mt-1 text-xs text-neutral-500">PDF, DOCX or TXT · up to 5 MB</p>
              </div>
            </button>
          )}
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) handleFile(f)
            }}
          />
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400"
          >
            <AlertCircle className="size-4 shrink-0" />
            {error}
          </motion.div>
        )}

        {/* CTA */}
        <div className="mt-8">
          <MagnetizeButton
            label={loading ? "Analyzing…" : "Start Analysis"}
            disabled={!fileName || loading}
            onClick={handleStartAnalysis}
            className={cn("h-12 px-8 text-base", (!fileName || loading) && "cursor-not-allowed opacity-50")}
          />
          {!fileName && !loading && (
            <p className="mt-3 text-xs text-neutral-600">Upload a resume to enable analysis</p>
          )}
          {loading && (
            <p className="mt-3 text-xs text-neutral-500">
              AI is reading your resume… this takes ~15 seconds
            </p>
          )}
        </div>
      </motion.div>

      {/* ── Bottom-left analysis plan loader ─────────────────────────── */}
      <AnimatePresence>
        {loading && (
          <div className="fixed bottom-6 left-6 z-50">
            <AnalysisPlanLoader />
          </div>
        )}
      </AnimatePresence>
    </main>
  )
}
