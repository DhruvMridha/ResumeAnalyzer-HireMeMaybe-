export type Keyword = {
  term: string
  count: number
  status: "matched" | "missing" | "weak"
}

export type Resume = {
  id: string
  name: string
  role: string
  fileName: string
  uploadedAt: string
  atsScore: number
  match: number
  readability: number
  impact: number
  formatting: number
  keywords: Keyword[]
}

export const resumes: Resume[] = [
  {
    id: "resume-a",
    name: "Alex Carter — v3",
    role: "Senior Frontend Engineer",
    fileName: "alex-carter-frontend.pdf",
    uploadedAt: "Updated 2h ago",
    atsScore: 84,
    match: 88,
    readability: 79,
    impact: 82,
    formatting: 91,
    keywords: [
      { term: "React", count: 7, status: "matched" },
      { term: "TypeScript", count: 5, status: "matched" },
      { term: "Next.js", count: 4, status: "matched" },
      { term: "Accessibility", count: 1, status: "weak" },
      { term: "GraphQL", count: 0, status: "missing" },
      { term: "CI/CD", count: 2, status: "matched" },
      { term: "Design Systems", count: 3, status: "matched" },
      { term: "Testing", count: 0, status: "missing" },
      { term: "Performance", count: 2, status: "matched" },
      { term: "Leadership", count: 1, status: "weak" },
    ],
  },
  {
    id: "resume-b",
    name: "Alex Carter — v2",
    role: "Senior Frontend Engineer",
    fileName: "alex-carter-frontend-v2.pdf",
    uploadedAt: "Updated 3d ago",
    atsScore: 71,
    match: 74,
    readability: 68,
    impact: 70,
    formatting: 83,
    keywords: [
      { term: "React", count: 5, status: "matched" },
      { term: "TypeScript", count: 2, status: "weak" },
      { term: "Next.js", count: 1, status: "weak" },
      { term: "Accessibility", count: 0, status: "missing" },
      { term: "GraphQL", count: 0, status: "missing" },
      { term: "CI/CD", count: 1, status: "weak" },
      { term: "Design Systems", count: 1, status: "weak" },
      { term: "Testing", count: 0, status: "missing" },
      { term: "Performance", count: 1, status: "weak" },
      { term: "Leadership", count: 0, status: "missing" },
    ],
  },
]

export const roastLines = [
  {
    severity: "spicy" as const,
    text: '"Results-driven team player" — congratulations, you and 4 million other resumes. Show numbers, not adjectives.',
  },
  {
    severity: "medium" as const,
    text: "Your summary is 6 lines long and says nothing. Recruiters spend 7 seconds here. You wasted 6.5 of them.",
  },
  {
    severity: "spicy" as const,
    text: '"Responsible for" appears 9 times. You were responsible for it. Did it actually happen? Quantify it.',
  },
  {
    severity: "mild" as const,
    text: "No GitHub, no portfolio, no links. You\u2019re an engineer with the digital footprint of a ghost.",
  },
  {
    severity: "medium" as const,
    text: 'Listing "Microsoft Word" as a skill in a senior role is a bold strategy. Bold, and wrong.',
  },
]

export const scoreHistory = [
  { label: "v1", score: 58 },
  { label: "v2", score: 71 },
  { label: "draft", score: 76 },
  { label: "v3", score: 84 },
]
