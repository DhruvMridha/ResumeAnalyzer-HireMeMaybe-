import type { AnalysisResult } from "./types"

const SESSION_KEY = "hirememaybe_analysis"
const SESSION_TIMESTAMP_KEY = "hirememaybe_analysis_ts"
const LEADERBOARD_SHOWN_KEY = "hirememaybe_lb_shown"

export function saveAnalysis(data: AnalysisResult): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(data))
    localStorage.setItem(SESSION_TIMESTAMP_KEY, Date.now().toString())
    sessionStorage.removeItem(LEADERBOARD_SHOWN_KEY) // reset modal for new analysis
  } catch (e) {
    console.error("Failed to save analysis to localStorage", e)
  }
}

export function loadAnalysis(): AnalysisResult | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AnalysisResult
  } catch {
    return null
  }
}

export function clearAnalysis(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem(SESSION_TIMESTAMP_KEY)
}

export function isFreshAnalysis(): boolean {
  if (typeof window === "undefined") return false
  const ts = localStorage.getItem(SESSION_TIMESTAMP_KEY)
  if (!ts) return false
  const age = Date.now() - parseInt(ts, 10)
  return age < 5 * 60 * 1000 // 5 minutes
}

export function markLeaderboardShown(): void {
  if (typeof window === "undefined") return
  sessionStorage.setItem(LEADERBOARD_SHOWN_KEY, "1")
}

export function hasLeaderboardBeenShown(): boolean {
  if (typeof window === "undefined") return false
  return sessionStorage.getItem(LEADERBOARD_SHOWN_KEY) === "1"
}
