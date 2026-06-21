"use client"

import { useCallback, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { UploadCloud, FileText, CheckCircle2, X } from "lucide-react"
import { AnalysisLoader } from "@/components/analysis-loader"

export function UploadArea() {
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState<string | null>("alex-carter-frontend.pdf")
  const [analyzing, setAnalyzing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const startAnalysis = useCallback((name: string) => {
    setFile(name)
    setAnalyzing(true)
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const f = e.dataTransfer.files?.[0]
      if (f) startAnalysis(f.name)
    },
    [startAnalysis],
  )

  return (
    <section
      className="glass animate-float-up rounded-2xl p-5"
      aria-label="Resume upload"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Upload resume</h2>
        <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
          PDF · DOCX
        </span>
      </div>

      {analyzing ? (
        <AnalysisLoader fileName={file ?? "resume.pdf"} onComplete={() => setAnalyzing(false)} />
      ) : file ? (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/50 p-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {file}
            </p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <CheckCircle2 className="size-3.5 text-primary" aria-hidden="true" />
              Parsed · 2 pages · 642 words
            </p>
          </div>
          <button
            onClick={() => startAnalysis(file)}
            aria-label="Re-analyze"
            className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
          >
            Re-analyze
          </button>
          <button
            onClick={() => setFile(null)}
            aria-label="Remove file"
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors",
            dragging
              ? "border-primary bg-primary/5"
              : "border-border bg-secondary/30 hover:border-primary/50",
          )}
        >
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UploadCloud className="size-6" aria-hidden="true" />
          </div>
          <p className="text-sm font-medium text-foreground">
            Drag & drop or click to upload
          </p>
          <p className="text-xs text-muted-foreground">
            Max 5MB · Your file never leaves the analysis sandbox
          </p>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) startAnalysis(f.name)
        }}
      />
    </section>
  )
}
