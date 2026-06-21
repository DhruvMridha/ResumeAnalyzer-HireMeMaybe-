export type KeywordStatus = "matched" | "missing" | "weak"

export type Keyword = {
  term: string
  count: number
  status: KeywordStatus
}

export type AnalysisResult = {
  sessionId: string
  fileName: string
  analyzedAt: string
  atsScore: number
  roleMatch: string
  strengths: string[]
  weaknesses: string[]
  missingKeywords: string[]
  suggestions: string[]
  keywords: Keyword[]
  match: number
  readability: number
  impact: number
  formatting: number
  resumeText: string
}

export type RoastLine = {
  severity: "spicy" | "medium" | "mild"
  text: string
}

export type RoastResult = {
  roastLines: RoastLine[]
}

export type RecruiterVerdict = {
  verdict: "Hire" | "Maybe" | "Reject"
  confidence: number
  reasons: string[]
  standoutPoints: string[]
  concerns: string[]
  hiringNote: string
}

export type CompareMetric = {
  metric: string
  scoreA: number
  scoreB: number
  winner: "A" | "B" | "Tie"
}

export type CompareResult = {
  winner: "A" | "B" | "Tie"
  reason: string
  comparison: CompareMetric[]
  summaryA: string
  summaryB: string
}

export type RewriteResult = {
  rewrittenResume: string
  changesSummary: string[]
}

export type LeaderboardEntry = {
  id: string
  username: string
  photoURL: string
  atsScore: number
  role: string
  timestamp: number
  uid: string
}
