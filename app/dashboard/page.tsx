"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard, Target, Key, Flame, GitCompareArrows, Sparkles,
  Trophy, Download, CheckCircle2, AlertTriangle, XCircle, Upload,
  RefreshCw, ChevronRight, ArrowRight, Minus, Briefcase, FileText,
  Zap, Shield, Star, Check, X, Copy, AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  loadAnalysis, isFreshAnalysis,
  markLeaderboardShown, hasLeaderboardBeenShown,
} from "@/lib/session"
import type {
  AnalysisResult, RoastLine, RecruiterVerdict,
  CompareResult, RewriteResult,
} from "@/lib/types"

/* ─── Design tokens ──────────────────────────────────────────────────────── */
const CARD =
  "rounded-2xl border border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl"
const CARD_BG = { background: "rgba(17,18,20,0.90)" }
const ACCENT = "#0078D4"

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const, delay: i * 0.07 },
  }),
}

/* ─── useCountUp ─────────────────────────────────────────────────────────── */
function useCountUp(target: number, duration = 1100) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    setValue(0)
    let raf: number
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      setValue(Math.round((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return value
}

/* ─── ProgressBar ────────────────────────────────────────────────────────── */
function ProgressBar({
  value, delay = 0, color = ACCENT,
}: { value: number; delay?: number; color?: string }) {
  const [w, setW] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setW(value), delay + 300)
    return () => clearTimeout(t)
  }, [value, delay])
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
      <div
        className="h-full rounded-full transition-[width] duration-700 ease-out"
        style={{ width: `${w}%`, background: `linear-gradient(90deg,${color}70,${color})` }}
      />
    </div>
  )
}

/* ─── MetricCard — own component so hook runs at top level ──────────────── */
function MetricCard({ label, value, index }: { label: string; value: number; index: number }) {
  const display = useCountUp(value, 900 + index * 100)
  return (
    <div
      className="rounded-xl border border-white/[0.06] p-3"
      style={{ background: "rgba(255,255,255,0.03)" }}
    >
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-0.5 text-2xl font-bold tabular-nums" style={{ color: ACCENT }}>
        {display}
      </p>
    </div>
  )
}

/* ─── ScoreGauge ─────────────────────────────────────────────────────────── */
function ScoreGauge({ score }: { score: number }) {
  const value = useCountUp(score)
  const R = 80
  const circ = Math.PI * R
  const offset = circ - (value / 100) * circ
  const color = score >= 80 ? "#22c55e" : score >= 60 ? ACCENT : "#f59e0b"
  const label = score >= 80 ? "Excellent" : score >= 65 ? "Good" : score >= 50 ? "Needs Work" : "At Risk"
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 200, height: 116 }}>
        <svg width="200" height="116" viewBox="0 0 200 116" aria-hidden="true">
          <defs>
            <linearGradient id="gGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={`${color}60`} />
              <stop offset="100%" stopColor={color} />
            </linearGradient>
          </defs>
          <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" strokeLinecap="round" />
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gGrad)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.25s linear" }}
          />
        </svg>
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
          <span className="text-5xl font-bold tracking-tight text-white tabular-nums">{value}</span>
          <span className="mt-0.5 text-xs font-semibold" style={{ color }}>{label}</span>
        </div>
      </div>
    </div>
  )
}

/* ─── Sidebar ────────────────────────────────────────────────────────────── */
const NAV = [
  { id: "overview",   label: "Overview",       icon: LayoutDashboard },
  { id: "breakdown",  label: "ATS Breakdown",  icon: Target },
  { id: "keywords",   label: "Keywords",       icon: Key },
  { id: "recruiter",  label: "Recruiter Mode", icon: Briefcase },
  { id: "roast",      label: "Roast Mode",     icon: Flame },
  { id: "compare",    label: "Compare",        icon: GitCompareArrows },
  { id: "rewrite",    label: "Rewrite",        icon: Sparkles },
]

function DarkSidebar({
  active, onNav, fileName,
}: { active: string; onNav: (id: string) => void; fileName: string }) {
  return (
    <aside
      className={cn(CARD, "sticky top-0 hidden h-screen w-60 shrink-0 flex-col gap-6 px-3 py-5 lg:flex")}
      style={CARD_BG}
    >
      <div className="flex items-center gap-2.5 px-2 pt-1">
        <div className="flex size-8 items-center justify-center rounded-xl" style={{ background: ACCENT }}>
          <Sparkles className="size-4 text-white" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-bold text-white">Hire Me Maybe</p>
          <p className="text-[11px] text-gray-500">Resume Intelligence</p>
        </div>
      </div>

      <nav className="flex flex-col gap-0.5">
        <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-600">Analyze</p>
        {NAV.map((item) => (
          <button
            key={item.id}
            onClick={() => onNav(item.id)}
            className={cn(
              "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 text-left",
              active === item.id ? "text-white" : "text-gray-500 hover:bg-white/[0.04] hover:text-gray-300",
            )}
            style={active === item.id ? { background: `${ACCENT}20` } : {}}
          >
            <item.icon className="size-4 shrink-0" style={active === item.id ? { color: ACCENT } : {}} />
            {item.label}
            {active === item.id && <ChevronRight className="ml-auto size-3.5" style={{ color: ACCENT }} />}
          </button>
        ))}
      </nav>

      <nav className="mt-auto flex flex-col gap-0.5">
        <Link href="/leaderboard" className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-white/[0.04] hover:text-gray-300">
          <Trophy className="size-4" /> Leaderboard
        </Link>
        <Link href="/" className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-white/[0.04] hover:text-gray-300">
          <Upload className="size-4" /> New Analysis
        </Link>
      </nav>

      {fileName && (
        <div className="rounded-xl border border-white/[0.06] p-3" style={{ background: "rgba(255,255,255,0.03)" }}>
          <div className="flex items-center gap-2">
            <FileText className="size-3.5 shrink-0" style={{ color: ACCENT }} />
            <p className="truncate text-xs font-medium text-gray-400">{fileName}</p>
          </div>
        </div>
      )}
    </aside>
  )
}

/* ─── Topbar ─────────────────────────────────────────────────────────────── */
function DarkTopbar({ role, onExport }: { role: string; onExport: () => void }) {
  return (
    <header
      className={cn(CARD, "sticky top-0 z-20 flex items-center justify-between gap-4 px-5 py-3.5")}
      style={CARD_BG}
    >
      <div>
        <h1 className="text-base font-bold text-white tracking-tight">Resume Analysis</h1>
        {role && <p className="mt-0.5 text-xs text-gray-500">Target role: {role}</p>}
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] px-3 py-1.5 text-xs font-medium text-gray-400 transition-colors hover:bg-white/[0.05] hover:text-white"
        >
          <Upload className="size-3.5" /> New
        </Link>
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-80"
          style={{ background: ACCENT }}
        >
          <Download className="size-3.5" /> Export PDF
        </button>
      </div>
    </header>
  )
}

/* ─── LeaderboardModal ───────────────────────────────────────────────────── */
function LeaderboardModal({
  analysis, onClose,
}: { analysis: AnalysisResult; onClose: () => void }) {
  const [step, setStep] = useState<"prompt" | "saving" | "done" | "error">("prompt")
  const [username, setUsername] = useState("")

  const handleSave = async () => {
    if (!username.trim()) return
    setStep("saving")
    try {
      const { getFirebaseAuth, getFirebaseDB, googleProvider } = await import("@/lib/firebase")
      const { signInWithPopup } = await import("firebase/auth")
      const { collection, addDoc } = await import("firebase/firestore")

      const auth = getFirebaseAuth()
      const db   = getFirebaseDB()
      const cred = await signInWithPopup(auth, googleProvider)

      await addDoc(collection(db, "leaderboard"), {
        uid:       cred.user.uid,
        username:  username.trim() || cred.user.displayName || "Anonymous",
        photoURL:  cred.user.photoURL ?? "",
        atsScore:  analysis.atsScore,
        role:      analysis.roleMatch,
        timestamp: Date.now(),
      })
      setStep("done")
      markLeaderboardShown()
    } catch (e) {
      console.error("Leaderboard save:", e)
      setStep("error")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
        className={cn(CARD, "w-full max-w-md p-6")}
        style={CARD_BG}
      >
        {step === "prompt" && (
          <>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl" style={{ background: `${ACCENT}20` }}>
                <Trophy className="size-6" style={{ color: ACCENT }} />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Save to Leaderboard?</h2>
                <p className="text-sm text-gray-500">Score: <span className="font-semibold text-white">{analysis.atsScore}/100</span></p>
              </div>
            </div>
            <p className="mb-5 text-sm text-gray-400">
              Compare with others targeting <span className="font-medium text-white">{analysis.roleMatch}</span>.
            </p>
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-medium text-gray-400">Display name</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. Alex C."
                maxLength={30}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-gray-600 outline-none transition-colors focus:border-white/20"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={onClose} className="flex-1 rounded-xl border border-white/[0.08] py-2.5 text-sm font-medium text-gray-400 transition-colors hover:bg-white/[0.04]">
                Skip
              </button>
              <button
                onClick={handleSave}
                disabled={!username.trim()}
                className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                style={{ background: ACCENT }}
              >
                Save with Google
              </button>
            </div>
          </>
        )}
        {step === "saving" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="size-8 animate-spin rounded-full border-2 border-white/10" style={{ borderTopColor: ACCENT }} />
            <p className="text-sm text-gray-400">Signing in & saving…</p>
          </div>
        )}
        {step === "done" && (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl" style={{ background: `${ACCENT}20` }}>
              <CheckCircle2 className="size-7" style={{ color: ACCENT }} />
            </div>
            <div>
              <p className="text-base font-bold text-white">Score saved!</p>
              <p className="mt-1 text-sm text-gray-400">You&apos;re on the leaderboard.</p>
            </div>
            <div className="flex w-full gap-2">
              <button onClick={onClose} className="flex-1 rounded-xl border border-white/[0.08] py-2.5 text-sm font-medium text-gray-400 hover:bg-white/[0.04]">
                Close
              </button>
              <Link
                href="/leaderboard"
                onClick={onClose}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold text-white hover:opacity-90"
                style={{ background: ACCENT }}
              >
                View Board <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        )}
        {step === "error" && (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <AlertCircle className="size-10 text-red-400" />
            <div>
              <p className="text-base font-bold text-white">Something went wrong</p>
              <p className="mt-1 text-sm text-gray-500">Please try again.</p>
            </div>
            <div className="flex w-full gap-2">
              <button onClick={onClose} className="flex-1 rounded-xl border border-white/[0.08] py-2.5 text-sm text-gray-400">Cancel</button>
              <button onClick={() => setStep("prompt")} className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white" style={{ background: ACCENT }}>Retry</button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

/* ─── EmptyState ─────────────────────────────────────────────────────────── */
function EmptyState() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 text-center" style={{ background: "#09090B" }}>
      <div className="flex size-16 items-center justify-center rounded-2xl" style={{ background: `${ACCENT}15`, border: `1px solid ${ACCENT}30` }}>
        <FileText className="size-7" style={{ color: ACCENT }} />
      </div>
      <div>
        <h2 className="text-xl font-bold text-white">No analysis found</h2>
        <p className="mt-2 text-sm text-gray-500">Upload a resume to get started.</p>
      </div>
      <Link href="/" className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white" style={{ background: ACCENT }}>
        <Upload className="size-4" /> Analyze a Resume
      </Link>
    </div>
  )
}

/* ─── Main page ──────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const [analysis,         setAnalysis]         = useState<AnalysisResult | null>(null)
  const [loaded,           setLoaded]           = useState(false)
  const [activeSection,    setActiveSection]    = useState("overview")
  const [kwFilter,         setKwFilter]         = useState<"all"|"matched"|"weak"|"missing">("all")
  const [showLeaderboard,  setShowLeaderboard]  = useState(false)

  // Roast
  const [roastEnabled,  setRoastEnabled]  = useState(false)
  const [roast,         setRoast]         = useState<RoastLine[] | null>(null)
  const [roastLoading,  setRoastLoading]  = useState(false)
  const [roastError,    setRoastError]    = useState<string | null>(null)

  // Recruiter
  const [recruiter,        setRecruiter]        = useState<RecruiterVerdict | null>(null)
  const [recruiterLoading, setRecruiterLoading] = useState(false)

  // Rewrite
  const [rewrite,        setRewrite]        = useState<RewriteResult | null>(null)
  const [rewriteLoading, setRewriteLoading] = useState(false)
  const [rewriteError,   setRewriteError]   = useState<string | null>(null)

  // Compare
  const [compare,        setCompare]        = useState<CompareResult | null>(null)
  const [compareLoading, setCompareLoading] = useState(false)
  const [compareError,   setCompareError]   = useState<string | null>(null)
  const [compareFile,    setCompareFile]    = useState<File | null>(null)
  const compareInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const data = loadAnalysis()
    setAnalysis(data)
    setLoaded(true)
    if (data && isFreshAnalysis() && !hasLeaderboardBeenShown()) {
      const t = setTimeout(() => setShowLeaderboard(true), 2500)
      return () => clearTimeout(t)
    }
  }, [])

  const scrollTo = (id: string) => {
    setActiveSection(id)
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const handleExportPDF = async () => {
    if (!analysis) return
    try {
      const { jsPDF } = await import("jspdf")
      const doc = new jsPDF()
      const B: [number,number,number] = [0, 120, 212]
      doc.setFillColor(9, 9, 11); doc.rect(0, 0, 210, 297, "F")
      doc.setFillColor(...B);     doc.rect(0, 0, 210, 40, "F")
      doc.setFontSize(20); doc.setTextColor(255, 255, 255)
      doc.text("Resume Analysis Report", 15, 18)
      doc.setFontSize(10); doc.setTextColor(180, 210, 255)
      doc.text(`${analysis.fileName} · ${new Date(analysis.analyzedAt).toLocaleDateString()}`, 15, 30)
      let y = 55
      doc.setFontSize(14); doc.setTextColor(255, 255, 255)
      doc.text(`ATS Score: ${analysis.atsScore}/100  ·  Role: ${analysis.roleMatch}`, 15, y); y += 12
      doc.setFontSize(10); doc.setTextColor(160, 160, 160)
      doc.text(`Match: ${analysis.match}  Readability: ${analysis.readability}  Impact: ${analysis.impact}  Formatting: ${analysis.formatting}`, 15, y); y += 14
      doc.setTextColor(...B); doc.setFontSize(12); doc.text("Strengths", 15, y); y += 7
      doc.setTextColor(180, 180, 180); doc.setFontSize(10)
      analysis.strengths?.forEach(s => { doc.text(`• ${s}`, 18, y); y += 7 })
      y += 4
      doc.setTextColor(...B); doc.setFontSize(12); doc.text("Suggestions", 15, y); y += 7
      doc.setTextColor(180, 180, 180); doc.setFontSize(10)
      analysis.suggestions?.forEach(s => {
        const lines = doc.splitTextToSize(`• ${s}`, 180)
        doc.text(lines, 18, y); y += lines.length * 6
      })
      if (y < 260) {
        y += 4
        doc.setTextColor(...B); doc.setFontSize(12); doc.text("Missing Keywords", 15, y); y += 7
        doc.setTextColor(180, 180, 180); doc.setFontSize(10)
        const kw = doc.splitTextToSize(analysis.missingKeywords?.join(", ") ?? "", 180)
        doc.text(kw, 18, y)
      }
      doc.save(`hirememaybe-${analysis.fileName.replace(/\.[^.]+$/, "")}.pdf`)
    } catch (err) { console.error("PDF export:", err) }
  }

  const fetchRoast = async (a: AnalysisResult) => {
    if (roastLoading) return
    setRoastLoading(true)
    setRoastError(null)

    // Build fallback text from analysis data if resumeText is missing
    const text = a.resumeText?.trim()
      || `Target Role: ${a.roleMatch}.
Strengths: ${a.strengths?.join(", ")}.
Weaknesses: ${a.weaknesses?.join(", ")}.
Missing Keywords: ${a.missingKeywords?.join(", ")}.
ATS Score: ${a.atsScore}/100.
Job Match: ${a.match}/100.
Keywords: ${a.keywords?.map(k => k.term).join(", ")}.`

    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: text }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || `Server error ${res.status}`)
      if (json.roastLines && json.roastLines.length > 0) {
        setRoast(json.roastLines)
      } else {
        throw new Error("No roast lines returned")
      }
    } catch (e) {
      console.error("Roast:", e)
      setRoastError(e instanceof Error ? e.message : "Roast failed. Check your Gemini API key.")
    } finally {
      setRoastLoading(false)
    }
  }

  const fetchRecruiter = async (a: AnalysisResult) => {
    if (!a.resumeText || recruiterLoading) return
    setRecruiterLoading(true)
    try {
      const res = await fetch("/api/recruiter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: a.resumeText, role: a.roleMatch }),
      })
      const json = await res.json()
      setRecruiter(json)
    } catch (e) { console.error("Recruiter:", e) } finally { setRecruiterLoading(false) }
  }

  const fetchRewrite = async (a: AnalysisResult) => {
    if (rewriteLoading) return
    setRewriteLoading(true)
    setRewriteError(null)

    const text = a.resumeText?.trim()
      || `Role: ${a.roleMatch}.\nStrengths: ${a.strengths?.join(", ")}.\nWeaknesses: ${a.weaknesses?.join(", ")}.\nKeywords: ${a.keywords?.map(k => k.term).join(", ")}.`

    try {
      const res  = await fetch("/api/rewrite", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ resumeText: text }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || `Server error ${res.status}`)

      const resume   = String(json.rewrittenResume ?? "").trim()
      const changes  = Array.isArray(json.changesSummary) ? json.changesSummary : []

      if (!resume) throw new Error("AI returned an empty rewrite. Please try again.")

      setRewrite({ rewrittenResume: resume, changesSummary: changes })
    } catch (e) {
      console.error("Rewrite:", e)
      setRewriteError(e instanceof Error ? e.message : "Rewrite failed. Check your Gemini API key.")
    } finally {
      setRewriteLoading(false)
    }
  }

  const fetchCompare = async (a: AnalysisResult) => {
    if (!compareFile || compareLoading) return
    setCompareLoading(true)
    setCompareError(null)

    const textA = a.resumeText?.trim()
      || `Role: ${a.roleMatch}.\nStrengths: ${a.strengths?.join(", ")}.\nKeywords: ${a.keywords?.map(k => k.term).join(", ")}.`

    try {
      const fd = new FormData()
      fd.append("textA", textA)
      fd.append("fileB", compareFile)
      const res  = await fetch("/api/compare", { method: "POST", body: fd })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || `Server error ${res.status}`)
      if (!json.winner) throw new Error("AI returned an incomplete comparison. Please try again.")
      setCompare(json)
    } catch (e) {
      console.error("Compare:", e)
      setCompareError(e instanceof Error ? e.message : "Comparison failed. Please try again.")
    } finally {
      setCompareLoading(false)
    }
  }

  /* ── Early returns ───────────────────────────────────────────────────── */
  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#09090B" }}>
        <div className="size-8 animate-spin rounded-full border-2 border-white/10" style={{ borderTopColor: ACCENT }} />
      </div>
    )
  }
  if (!analysis) return <EmptyState />

  /* ── Derived values ──────────────────────────────────────────────────── */
  const kws        = analysis.keywords ?? []
  const visibleKw  = kwFilter === "all" ? kws : kws.filter(k => k.status === kwFilter)
  const kwCounts   = {
    matched: kws.filter(k => k.status === "matched").length,
    weak:    kws.filter(k => k.status === "weak").length,
    missing: kws.filter(k => k.status === "missing").length,
  }

  const verdictColor = (v: string) => v === "Hire" ? "#22c55e" : v === "Maybe" ? "#f59e0b" : "#ef4444"
  const VerdictIcon  = (v: string) => v === "Hire" ? CheckCircle2 : v === "Maybe" ? AlertTriangle : XCircle

  const spinnerCss = { borderTopColor: "white" } as const

  /* ── Render ──────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen" style={{ background: "#09090B" }}>
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{ background: "radial-gradient(800px circle at 10% 20%,rgba(0,120,212,0.07),transparent 60%),radial-gradient(600px circle at 90% 80%,rgba(0,120,212,0.04),transparent 50%)" }}
      />

      <div className="relative z-10 mx-auto flex max-w-[1380px] gap-5 px-4 lg:px-6">
        <DarkSidebar active={activeSection} onNav={scrollTo} fileName={analysis.fileName} />

        <main className="min-w-0 flex-1 py-4 lg:py-5">
          <DarkTopbar role={analysis.roleMatch} onExport={handleExportPDF} />

          <div className="mt-5 flex flex-col gap-5">

            {/* ── OVERVIEW ─────────────────────────────────────────────── */}
            <section id="overview">
              <motion.div variants={fadeUp} initial="hidden" animate="visible" className={cn(CARD, "p-6")} style={CARD_BG}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
                  <div className="flex flex-col items-center justify-center lg:col-span-2">
                    <ScoreGauge score={analysis.atsScore} />
                    <p className="mt-3 max-w-[180px] text-center text-xs text-gray-500">
                      {analysis.atsScore >= 80
                        ? "Passes most ATS filters."
                        : "Add missing keywords to boost your score."}
                    </p>
                  </div>
                  <div className="flex flex-col justify-center gap-4 lg:col-span-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-gray-600">Target Role</p>
                      <p className="mt-1 text-xl font-bold text-white">{analysis.roleMatch}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <MetricCard label="Job Match"   value={analysis.match}       index={0} />
                      <MetricCard label="Readability" value={analysis.readability}  index={1} />
                      <MetricCard label="Impact"      value={analysis.impact}       index={2} />
                      <MetricCard label="Formatting"  value={analysis.formatting}   index={3} />
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* ── STRENGTHS / WEAKNESSES ───────────────────────────────── */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {(
                [
                  { title: "Strengths",  items: analysis.strengths,  icon: CheckCircle2,  color: "#22c55e", delay: 1 },
                  { title: "Weaknesses", items: analysis.weaknesses, icon: AlertTriangle, color: "#f59e0b", delay: 2 },
                ] as const
              ).map(({ title, items, color, delay, icon: Icon }) => (
                <motion.div
                  key={title}
                  custom={delay}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className={cn(CARD, "p-5")}
                  style={CARD_BG}
                >
                  <div className="mb-4 flex items-center gap-2">
                    <Icon className="size-4" style={{ color }} />
                    <h2 className="text-sm font-semibold text-white">{title}</h2>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {items?.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full" style={{ background: color }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* ── SCORE BREAKDOWN ──────────────────────────────────────── */}
            <section id="breakdown">
              <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className={cn(CARD, "p-5")} style={CARD_BG}>
                <h2 className="mb-5 text-sm font-semibold text-white">Score Breakdown</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    { label: "Job Match",   value: analysis.match },
                    { label: "Readability", value: analysis.readability },
                    { label: "Impact",      value: analysis.impact },
                    { label: "Formatting",  value: analysis.formatting },
                  ].map((m, i) => (
                    <div key={m.label}>
                      <div className="mb-1.5 flex justify-between text-xs">
                        <span className="text-gray-400">{m.label}</span>
                        <span className="font-semibold text-white">{m.value}</span>
                      </div>
                      <ProgressBar value={m.value} delay={i * 100} />
                    </div>
                  ))}
                </div>
              </motion.div>
            </section>

            {/* ── KEYWORDS ─────────────────────────────────────────────── */}
            <section id="keywords">
              <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible" className={cn(CARD, "p-5")} style={CARD_BG}>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-[15px] font-semibold text-white">Keyword Analysis</h2>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-green-500" />{kwCounts.matched} matched</span>
                    <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-amber-500" />{kwCounts.weak} weak</span>
                    <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-red-500"   />{kwCounts.missing} missing</span>
                  </div>
                </div>
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {(["all", "matched", "weak", "missing"] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setKwFilter(f)}
                      className="rounded-full px-3 py-1 text-xs font-medium capitalize transition-all"
                      style={kwFilter === f ? { background: ACCENT, color: "white" } : { background: "rgba(255,255,255,0.05)", color: "#6b7280" }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <ul className="flex flex-wrap gap-2">
                  {visibleKw.map(k => {
                    const cfgMap = {
                      matched: { Icon: Check,         bg: "rgba(34,197,94,0.10)",  border: "rgba(34,197,94,0.25)",  text: "#86efac" },
                      weak:    { Icon: AlertTriangle, bg: "rgba(245,158,11,0.10)", border: "rgba(245,158,11,0.25)", text: "#fcd34d" },
                      missing: { Icon: X,             bg: "rgba(239,68,68,0.10)",  border: "rgba(239,68,68,0.25)",  text: "#fca5a5" },
                    }
                    const { Icon, bg, border, text } = cfgMap[k.status]
                    return (
                      <li
                        key={k.term}
                        className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[13px] font-medium"
                        style={{ background: bg, borderColor: border, color: text }}
                      >
                        <Icon className="size-3.5" />
                        {k.term}
                        {k.count > 0 && <span className="rounded bg-black/20 px-1 text-xs tabular-nums">{k.count}×</span>}
                      </li>
                    )
                  })}
                </ul>
              </motion.div>
            </section>

            {/* ── SUGGESTIONS ──────────────────────────────────────────── */}
            <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible" className={cn(CARD, "p-5")} style={CARD_BG}>
              <div className="mb-4 flex items-center gap-2">
                <Zap className="size-4" style={{ color: ACCENT }} />
                <h2 className="text-[15px] font-semibold text-white">AI Suggestions</h2>
              </div>
              <ul className="flex flex-col gap-2.5">
                {analysis.suggestions?.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-xl border border-white/[0.04] p-3"
                    style={{ background: "rgba(255,255,255,0.02)" }}
                  >
                    <span
                      className="flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                      style={{ background: `${ACCENT}20`, color: ACCENT }}
                    >{i + 1}</span>
                    <p className="text-[14px] text-gray-300">{s}</p>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* ── RECRUITER MODE ───────────────────────────────────────── */}
            <section id="recruiter">
              <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible" className={cn(CARD, "overflow-hidden")} style={CARD_BG}>
                <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-9 items-center justify-center rounded-xl" style={{ background: `${ACCENT}15` }}>
                      <Briefcase className="size-4" style={{ color: ACCENT }} />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-white">Recruiter Mode</h2>
                      <p className="text-xs text-gray-500">Senior recruiter verdict</p>
                    </div>
                  </div>
                  {!recruiter && (
                    <button
                      onClick={() => fetchRecruiter(analysis)}
                      disabled={recruiterLoading}
                      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                      style={{ background: ACCENT }}
                    >
                      {recruiterLoading
                        ? <><span className="size-3 animate-spin rounded-full border border-white/30" style={spinnerCss} /> Analyzing…</>
                        : <><Briefcase className="size-3.5" /> Run Analysis</>}
                    </button>
                  )}
                </div>
                <div className="p-5">
                  {!recruiter && !recruiterLoading && (
                    <div className="flex flex-col items-center gap-3 py-8 text-center">
                      <Shield className="size-8 text-gray-600" />
                      <p className="text-sm font-medium text-gray-400">Get a senior recruiter&apos;s honest verdict</p>
                      <p className="text-xs text-gray-600">Hire, Maybe, or Reject — with detailed reasoning</p>
                    </div>
                  )}
                  {recruiterLoading && (
                    <div className="flex flex-col items-center gap-3 py-8">
                      <div className="size-7 animate-spin rounded-full border-2 border-white/10" style={{ borderTopColor: ACCENT }} />
                      <p className="text-sm text-gray-500">Reviewing your resume…</p>
                    </div>
                  )}
                  {recruiter && (() => {
                    const VI    = VerdictIcon(recruiter.verdict)
                    const vCol  = verdictColor(recruiter.verdict)
                    return (
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4 rounded-2xl border p-4"
                          style={{ background: `${vCol}10`, borderColor: `${vCol}30` }}>
                          <VI className="size-10" style={{ color: vCol }} />
                          <div className="min-w-0 flex-1">
                            <p className="text-2xl font-black" style={{ color: vCol }}>{recruiter.verdict}</p>
                            <p className="mb-1 text-xs text-gray-400">Confidence: {recruiter.confidence}%</p>
                            <ProgressBar value={recruiter.confidence} delay={200} color={vCol} />
                          </div>
                        </div>
                        <p className="rounded-xl border border-white/[0.06] p-3 text-sm italic text-gray-400" style={{ background: "rgba(255,255,255,0.02)" }}>
                          &ldquo;{recruiter.hiringNote}&rdquo;
                        </p>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {[
                            { title: "Standout Points", items: recruiter.standoutPoints, color: "#22c55e" },
                            { title: "Concerns",        items: recruiter.concerns,       color: "#ef4444" },
                          ].map(({ title, items, color }) => (
                            <div key={title}>
                              <p className="mb-2 text-xs font-semibold" style={{ color }}>{title}</p>
                              <ul className="flex flex-col gap-1.5">
                                {items?.map((item, i) => (
                                  <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                                    <span className="mt-1.5 size-1 shrink-0 rounded-full" style={{ background: color }} />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </motion.div>
            </section>

            {/* ── ROAST MODE ───────────────────────────────────────────── */}
            <section id="roast">
              <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible" className={cn(CARD, "overflow-hidden")} style={CARD_BG}>
                <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-red-500/10">
                      <Flame className="size-4 text-red-400" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-white">Roast Mode</h2>
                      <p className="text-xs text-gray-500">Savage but constructive</p>
                    </div>
                  </div>
                  <button
                    role="switch"
                    aria-checked={roastEnabled}
                    onClick={() => {
                      const next = !roastEnabled
                      setRoastEnabled(next)
                      if (next && !roast && !roastLoading) fetchRoast(analysis)
                    }}
                    style={{
                      position:        "relative",
                      width:           "42px",
                      height:          "24px",
                      borderRadius:    "12px",
                      backgroundColor: roastEnabled ? "#ef4444" : "rgba(255,255,255,0.12)",
                      border:          "none",
                      cursor:          "pointer",
                      flexShrink:      0,
                      transition:      "background-color 0.22s ease",
                      padding:         0,
                      outline:         "none",
                    }}
                  >
                    <span style={{
                      position:        "absolute",
                      top:             "2px",
                      left:            roastEnabled ? "20px" : "2px",
                      width:           "20px",
                      height:          "20px",
                      borderRadius:    "50%",
                      backgroundColor: "white",
                      boxShadow:       "0 1px 4px rgba(0,0,0,0.35)",
                      transition:      "left 0.22s ease",
                      display:         "block",
                    }} />
                  </button>
                </div>
                <div className="p-5">
                  {!roastEnabled && (
                    <div className="flex flex-col items-center gap-2 py-8 text-center">
                      <Flame className="size-7 text-gray-600" />
                      <p className="text-sm font-medium text-gray-400">Toggle the switch for savage feedback</p>
                    </div>
                  )}
                  {roastEnabled && roastLoading && (
                    <div className="flex flex-col items-center gap-3 py-8">
                      <div className="size-7 animate-spin rounded-full border-2 border-red-500/20" style={{ borderTopColor: "#ef4444" }} />
                      <p className="text-sm text-gray-500">Preparing the roast…</p>
                    </div>
                  )}
                  {roastEnabled && !roastLoading && roastError && (
                    <div className="flex flex-col items-center gap-3 py-8 text-center">
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-red-500/10">
                        <AlertCircle className="size-6 text-red-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Roast failed</p>
                        <p className="mt-1 text-xs text-gray-500 max-w-xs">{roastError}</p>
                      </div>
                      <button
                        onClick={() => { setRoastError(null); setRoast(null); fetchRoast(analysis) }}
                        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white"
                        style={{ background: "#ef4444" }}
                      >
                        <RefreshCw className="size-3.5" /> Try Again
                      </button>
                    </div>
                  )}
                  {roastEnabled && !roastLoading && !roastError && roast && (
                    <ul className="flex flex-col gap-2.5">
                      {roast.map((line, i) => {
                        const cfgR = {
                          spicy:  { bg: "rgba(239,68,68,0.08)",  border: "rgba(239,68,68,0.2)",  label: "Brutal", lc: "#ef4444" },
                          medium: { bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)", label: "Spicy",  lc: "#f59e0b" },
                          mild:   { bg: `${ACCENT}08`,           border: `${ACCENT}25`,          label: "Gentle", lc: ACCENT    },
                        }[line.severity]
                        return (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="rounded-xl border p-3"
                            style={{ background: cfgR.bg, borderColor: cfgR.border }}
                          >
                            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: cfgR.lc }}>{cfgR.label}</span>
                            <p className="mt-1 text-sm text-gray-300">{line.text}</p>
                          </motion.li>
                        )
                      })}
                      <button
                        onClick={() => { setRoast(null); setRoastError(null); fetchRoast(analysis) }}
                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] py-2.5 text-sm font-medium text-gray-400 transition-colors hover:bg-white/[0.04]"
                      >
                        <RefreshCw className="size-4" /> Roast Again
                      </button>
                    </ul>
                  )}
                </div>
              </motion.div>
            </section>

            {/* ── COMPARE MODE ─────────────────────────────────────────── */}
            <section id="compare">
              <motion.div custom={8} variants={fadeUp} initial="hidden" animate="visible" className={cn(CARD, "overflow-hidden")} style={CARD_BG}>
                <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-9 items-center justify-center rounded-xl" style={{ background: `${ACCENT}15` }}>
                      <GitCompareArrows className="size-4" style={{ color: ACCENT }} />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-white">Compare Mode</h2>
                      <p className="text-xs text-gray-500">Resume A vs Resume B</p>
                    </div>
                  </div>
                  {compareFile && !compare && (
                    <button
                      onClick={() => fetchCompare(analysis)}
                      disabled={compareLoading}
                      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                      style={{ background: ACCENT }}
                    >
                      {compareLoading
                        ? <><span className="size-3 animate-spin rounded-full border border-white/30" style={spinnerCss} /> Comparing…</>
                        : "Compare Now"}
                    </button>
                  )}
                </div>
                <div className="p-5">
                  {compareError && !compare && (
                    <div className="flex flex-col items-center gap-3 py-8 text-center">
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-red-500/10">
                        <AlertCircle className="size-6 text-red-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Comparison failed</p>
                        <p className="mt-1 text-xs text-gray-500 max-w-xs">{compareError}</p>
                      </div>
                      <button
                        onClick={() => { setCompareError(null); fetchCompare(analysis) }}
                        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white"
                        style={{ background: ACCENT }}
                      >
                        <RefreshCw className="size-3.5" /> Try Again
                      </button>
                    </div>
                  )}
                  {!compareError && !compare ? (
                    <div className="flex flex-col gap-4">
                      <div className="rounded-xl border border-white/[0.06] p-3" style={{ background: "rgba(255,255,255,0.02)" }}>
                        <p className="mb-1 text-xs font-medium text-gray-500">Resume A (current)</p>
                        <div className="flex items-center gap-2">
                          <FileText className="size-4 shrink-0" style={{ color: ACCENT }} />
                          <p className="truncate text-sm font-medium text-white">{analysis.fileName}</p>
                          <span className="ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: ACCENT }}>
                            {analysis.atsScore}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="mb-2 text-xs font-medium text-gray-500">Resume B</p>
                        {compareFile ? (
                          <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] p-3">
                            <FileText className="size-4 shrink-0 text-gray-400" />
                            <p className="flex-1 truncate text-sm text-gray-300">{compareFile.name}</p>
                            <button onClick={() => { setCompareFile(null); setCompare(null) }} className="text-gray-600 transition-colors hover:text-gray-400">
                              <X className="size-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => compareInputRef.current?.click()}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/[0.12] py-6 text-sm text-gray-500 transition-colors hover:border-white/25 hover:text-gray-300"
                          >
                            <Upload className="size-4" /> Upload Resume B (PDF, DOCX, TXT)
                          </button>
                        )}
                        <input
                          ref={compareInputRef}
                          type="file"
                          accept=".pdf,.docx,.txt"
                          className="hidden"
                          onChange={e => { const f = e.target.files?.[0]; if (f) { setCompareFile(f); setCompare(null) } }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <div
                        className="flex items-center gap-3 rounded-2xl border p-4"
                        style={{
                          background:   compare.winner === "Tie" ? "rgba(255,255,255,0.03)" : `${compare.winner === "A" ? "#22c55e" : ACCENT}10`,
                          borderColor:  compare.winner === "Tie" ? "rgba(255,255,255,0.08)" : `${compare.winner === "A" ? "#22c55e" : ACCENT}30`,
                        }}
                      >
                        <Star className="size-6 shrink-0 text-amber-400" />
                        <div>
                          <p className="font-bold text-white">{compare.winner === "Tie" ? "It&apos;s a tie!" : `Resume ${compare.winner} wins`}</p>
                          <p className="text-xs text-gray-400">{compare.reason}</p>
                        </div>
                      </div>
                      <div className="overflow-hidden rounded-xl border border-white/[0.06]">
                        <div className="grid grid-cols-[1fr_auto_auto_auto] border-b border-white/[0.06] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-600" style={{ background: "rgba(255,255,255,0.02)" }}>
                          <span>Metric</span>
                          <span className="w-14 text-right">A</span>
                          <span className="w-14 text-right">B</span>
                          <span className="w-10 text-center">Win</span>
                        </div>
                        {compare.comparison?.map((row, i) => (
                          <div key={i} className="grid grid-cols-[1fr_auto_auto_auto] items-center border-b border-white/[0.04] px-4 py-2.5 last:border-0">
                            <span className="text-sm text-gray-300">{row.metric}</span>
                            <span className="w-14 text-right text-sm tabular-nums text-gray-400">{row.scoreA}</span>
                            <span className="w-14 text-right text-sm tabular-nums text-gray-400">{row.scoreB}</span>
                            <span className="w-10 text-center">
                              {row.winner === "Tie"
                                ? <Minus className="mx-auto size-3.5 text-gray-600" />
                                : <span className="rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white" style={{ background: ACCENT }}>{row.winner}</span>}
                            </span>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => { setCompare(null); setCompareFile(null); setCompareError(null) }}
                        className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] py-2 text-xs font-medium text-gray-500 transition-colors hover:bg-white/[0.04]"
                      >
                        <RefreshCw className="size-3.5" /> Compare different resume
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </section>

            {/* ── REWRITE MODE ─────────────────────────────────────────── */}
            <section id="rewrite">
              <motion.div custom={9} variants={fadeUp} initial="hidden" animate="visible" className={cn(CARD, "overflow-hidden")} style={CARD_BG}>
                <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-9 items-center justify-center rounded-xl" style={{ background: `${ACCENT}15` }}>
                      <Sparkles className="size-4" style={{ color: ACCENT }} />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-white">AI Resume Rewrite</h2>
                      <p className="text-xs text-gray-500">Better wording — no fake content added</p>
                    </div>
                  </div>
                  {!rewrite && (
                    <button
                      onClick={() => fetchRewrite(analysis)}
                      disabled={rewriteLoading}
                      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                      style={{ background: ACCENT }}
                    >
                      {rewriteLoading
                        ? <><span className="size-3 animate-spin rounded-full border border-white/30" style={spinnerCss} /> Rewriting…</>
                        : <><Sparkles className="size-3.5" /> Rewrite Resume</>}
                    </button>
                  )}
                </div>
                <div className="p-5">
                  {!rewrite && !rewriteLoading && !rewriteError && (
                    <div className="flex flex-col items-center gap-3 py-8 text-center">
                      <Sparkles className="size-8 text-gray-600" />
                      <p className="text-sm font-medium text-gray-400">Let AI improve your resume language</p>
                      <p className="text-xs text-gray-600 max-w-xs">Enhances existing content — no fabricated skills</p>
                    </div>
                  )}
                  {!rewrite && !rewriteLoading && rewriteError && (
                    <div className="flex flex-col items-center gap-3 py-8 text-center">
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-red-500/10">
                        <AlertCircle className="size-6 text-red-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Rewrite failed</p>
                        <p className="mt-1 text-xs text-gray-500 max-w-xs">{rewriteError}</p>
                      </div>
                      <button
                        onClick={() => { setRewriteError(null); setRewrite(null); fetchRewrite(analysis) }}
                        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white"
                        style={{ background: ACCENT }}
                      >
                        <RefreshCw className="size-3.5" /> Try Again
                      </button>
                    </div>
                  )}
                  {rewriteLoading && (
                    <div className="flex flex-col items-center gap-3 py-8">
                      <div className="size-7 animate-spin rounded-full border-2 border-white/10" style={{ borderTopColor: ACCENT }} />
                      <p className="text-sm text-gray-500">Rewriting your resume…</p>
                    </div>
                  )}
                  {rewrite && (
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: ACCENT }}>Key Improvements</p>
                        <ul className="flex flex-col gap-1.5">
                          {rewrite.changesSummary?.map((c, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                              <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-green-500" />
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="relative rounded-xl border border-white/[0.06] p-4" style={{ background: "rgba(255,255,255,0.02)" }}>
                        <div className="mb-3 flex items-center justify-between">
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Rewritten Resume</p>
                          <button
                            onClick={() => navigator.clipboard.writeText(rewrite.rewrittenResume)}
                            className="flex items-center gap-1 rounded px-2 py-1 text-xs text-gray-500 transition-colors hover:bg-white/[0.06] hover:text-gray-300"
                          >
                            <Copy className="size-3" /> Copy
                          </button>
                        </div>
                        <pre className="max-h-96 overflow-y-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-gray-300">
                          {rewrite.rewrittenResume}
                        </pre>
                      </div>
                      <button
                        onClick={() => { setRewrite(null); setRewriteError(null); fetchRewrite(analysis) }}
                        className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] py-2 text-xs font-medium text-gray-500 transition-colors hover:bg-white/[0.04]"
                      >
                        <RefreshCw className="size-3.5" /> Rewrite Again
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </section>

            <footer className="pb-6 pt-2 text-center text-xs text-gray-700">
              Hire Me Maybe · Analyzed {new Date(analysis.analyzedAt).toLocaleString()}
            </footer>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {showLeaderboard && (
          <LeaderboardModal
            analysis={analysis}
            onClose={() => { setShowLeaderboard(false); markLeaderboardShown() }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
