"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Trophy, ArrowLeft, Clock, Filter, User, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

const CARD    = "rounded-2xl border border-white/[0.06] backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
const CARD_BG = { background: "rgba(17,18,20,0.90)" }
const ACCENT  = "#0078D4"

type Entry = {
  id:        string
  username:  string
  photoURL:  string
  atsScore:  number
  role:      string
  timestamp: number
}

function MedalOrRank({ index }: { index: number }) {
  if (index === 0) return <span className="text-base">🥇</span>
  if (index === 1) return <span className="text-base">🥈</span>
  if (index === 2) return <span className="text-base">🥉</span>
  return <span className="tabular-nums text-xs font-bold text-gray-600">#{index + 1}</span>
}

function scoreColor(s: number) {
  return s >= 80 ? "#22c55e" : s >= 60 ? ACCENT : "#f59e0b"
}

export default function LeaderboardPage() {
  const [entries,    setEntries]    = useState<Entry[]>([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState("")
  const [timeFilter, setTimeFilter] = useState<"all" | "week">("all")
  const [roleFilter, setRoleFilter] = useState("")

  const load = async () => {
    setLoading(true)
    setError("")
    try {
      const { getFirebaseDB }                           = await import("@/lib/firebase")
      const { collection, getDocs, query, orderBy, limit } = await import("firebase/firestore")

      const db   = getFirebaseDB()
      const q    = query(collection(db, "leaderboard"), orderBy("atsScore", "desc"), limit(100))
      const snap = await getDocs(q)

      setEntries(
        snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Entry, "id">) }))
      )
    } catch (e) {
      console.error(e)
      setError("Failed to load leaderboard. Check your Firebase config.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const weekAgo  = Date.now() - 7 * 24 * 60 * 60 * 1000
  const allRoles = Array.from(new Set(entries.map(e => e.role))).slice(0, 6)

  const visible = entries
    .filter(e => timeFilter === "all" || e.timestamp > weekAgo)
    .filter(e => !roleFilter || e.role === roleFilter)

  return (
    <div className="min-h-screen" style={{ background: "#09090B" }}>
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{ background: "radial-gradient(900px circle at 50% 0%,rgba(0,120,212,0.08),transparent 65%)" }}
      />

      <div className="relative z-10 mx-auto max-w-2xl px-4 py-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <Link
            href="/dashboard"
            className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-300"
          >
            <ArrowLeft className="size-4" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl" style={{ background: `${ACCENT}20` }}>
              <Trophy className="size-6" style={{ color: ACCENT }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
              <p className="text-sm text-gray-500">Top ATS scores from the community</p>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className={cn(CARD, "mt-6 p-4")} style={CARD_BG}
        >
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Clock className="size-3.5" /> Time:
            </div>
            {(["all", "week"] as const).map(f => (
              <button
                key={f}
                onClick={() => setTimeFilter(f)}
                className="rounded-full px-3 py-1 text-xs font-medium capitalize transition-all"
                style={timeFilter === f
                  ? { background: ACCENT, color: "white" }
                  : { background: "rgba(255,255,255,0.05)", color: "#6b7280" }
                }
              >
                {f === "all" ? "All Time" : "This Week"}
              </button>
            ))}

            {allRoles.length > 0 && (
              <>
                <span className="text-gray-700">·</span>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Filter className="size-3.5" /> Role:
                </div>
                <button
                  onClick={() => setRoleFilter("")}
                  className="rounded-full px-3 py-1 text-xs font-medium transition-all"
                  style={!roleFilter
                    ? { background: ACCENT, color: "white" }
                    : { background: "rgba(255,255,255,0.05)", color: "#6b7280" }
                  }
                >
                  All
                </button>
                {allRoles.map(r => (
                  <button
                    key={r}
                    onClick={() => setRoleFilter(r === roleFilter ? "" : r)}
                    className="max-w-[140px] truncate rounded-full px-3 py-1 text-xs font-medium transition-all"
                    style={roleFilter === r
                      ? { background: ACCENT, color: "white" }
                      : { background: "rgba(255,255,255,0.05)", color: "#6b7280" }
                    }
                  >
                    {r}
                  </button>
                ))}
              </>
            )}
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.14 }}
          className={cn(CARD, "mt-4 overflow-hidden")} style={CARD_BG}
        >
          {loading && (
            <div className="flex flex-col items-center gap-3 py-16">
              <div className="size-7 animate-spin rounded-full border-2 border-white/10" style={{ borderTopColor: ACCENT }} />
              <p className="text-sm text-gray-500">Loading leaderboard…</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <p className="text-sm text-red-400">{error}</p>
              <button onClick={load} className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white" style={{ background: ACCENT }}>
                <RefreshCw className="size-4" /> Retry
              </button>
            </div>
          )}

          {!loading && !error && visible.length === 0 && (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <Trophy className="size-10 text-gray-700" />
              <div>
                <p className="text-base font-semibold text-white">No scores yet</p>
                <p className="mt-1 text-sm text-gray-500">Analyze a resume and be first on the board!</p>
              </div>
              <Link
                href="/"
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white"
                style={{ background: ACCENT }}
              >
                Analyze a Resume
              </Link>
            </div>
          )}

          {!loading && !error && visible.length > 0 && (
            <>
              <div
                className="grid grid-cols-[44px_1fr_auto_80px] items-center gap-4 border-b border-white/[0.06] px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-600"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <span className="text-center">#</span>
                <span>Name</span>
                <span>Role</span>
                <span className="text-right">Score</span>
              </div>

              {visible.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.025 }}
                  className="grid grid-cols-[44px_1fr_auto_80px] items-center gap-4 border-b border-white/[0.04] px-5 py-4 last:border-0 transition-colors hover:bg-white/[0.02]"
                >
                  <div className="flex w-11 items-center justify-center">
                    <MedalOrRank index={i} />
                  </div>

                  <div className="flex min-w-0 items-center gap-2.5">
                    {entry.photoURL ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={entry.photoURL} alt="" className="size-8 shrink-0 rounded-full" />
                    ) : (
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/[0.06]">
                        <User className="size-4 text-gray-500" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">{entry.username}</p>
                      <p className="text-xs text-gray-600">{new Date(entry.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <span className="max-w-[140px] truncate text-xs text-gray-500">{entry.role}</span>

                  <div className="text-right">
                    <span className="text-xl font-black tabular-nums" style={{ color: scoreColor(entry.atsScore) }}>
                      {entry.atsScore}
                    </span>
                    <span className="text-xs text-gray-600">/100</span>
                  </div>
                </motion.div>
              ))}
            </>
          )}
        </motion.div>

        <p className="mt-6 text-center text-xs text-gray-700">
          {visible.length} {visible.length === 1 ? "entry" : "entries"} shown
        </p>
      </div>
    </div>
  )
}
