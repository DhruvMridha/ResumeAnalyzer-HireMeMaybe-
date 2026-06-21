const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

async function callGemini(
  parts: object[],
  temperature = 0.4,
  jsonMode = true,
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set")

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: {
        temperature,
        ...(jsonMode && { responseMimeType: "application/json" }),
      },
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Gemini API error ${response.status}: ${err}`)
  }

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error("Empty response from Gemini")
  return text
}

function cleanJSON(raw: string): unknown {
  const cleaned = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim()
  return JSON.parse(cleaned)
}

// Normalise Gemini's winner field — it sometimes returns "Resume A" instead of "A"
function normalizeWinner(raw: unknown): "A" | "B" | "Tie" {
  const s = String(raw ?? "").trim()
  if (!s) return "Tie"
  if (s === "A") return "A"
  if (s === "B") return "B"
  if (s.toLowerCase() === "tie") return "Tie"
  // Handle "Resume A", "resume a wins", etc.
  const hasA = /\bA\b/i.test(s)
  const hasB = /\bB\b/i.test(s)
  if (hasA && !hasB) return "A"
  if (hasB && !hasA) return "B"
  return "Tie"
}

// Normalise per-metric winner too
function normalizeMetricWinner(raw: unknown): "A" | "B" | "Tie" {
  return normalizeWinner(raw)
}

export async function analyzeResumePDF(pdfBase64: string) {
  const prompt = `You are an expert ATS (Applicant Tracking System) analyzer and career coach. Carefully analyze this resume PDF.

Return ONLY valid JSON — no markdown fences, no explanation:
{
  "atsScore": <integer 0-100, overall ATS compatibility>,
  "roleMatch": "<detected primary target role>",
  "strengths": ["<strength 1>","<strength 2>","<strength 3>","<strength 4>"],
  "weaknesses": ["<weakness 1>","<weakness 2>","<weakness 3>","<weakness 4>"],
  "missingKeywords": ["<kw1>","<kw2>","<kw3>","<kw4>","<kw5>","<kw6>"],
  "suggestions": ["<suggestion 1>","<suggestion 2>","<suggestion 3>","<suggestion 4>","<suggestion 5>"],
  "keywords": [
    {"term": "<term>", "count": <integer>, "status": "<matched|missing|weak>"}
  ],
  "match": <integer 0-100>,
  "readability": <integer 0-100>,
  "impact": <integer 0-100>,
  "formatting": <integer 0-100>,
  "resumeText": "<full plain-text content of this resume, all sections included>"
}

Include 12-15 keyword objects covering technical skills and soft skills.`

  const raw = await callGemini([
    { inlineData: { mimeType: "application/pdf", data: pdfBase64 } },
    { text: prompt },
  ])
  return cleanJSON(raw)
}

export async function analyzeResumeText(resumeText: string) {
  const prompt = `You are an expert ATS (Applicant Tracking System) analyzer and career coach. Analyze this resume.

Resume Text:
${resumeText}

Return ONLY valid JSON — no markdown fences:
{
  "atsScore": <integer 0-100>,
  "roleMatch": "<detected primary target role>",
  "strengths": ["<strength>","<strength>","<strength>","<strength>"],
  "weaknesses": ["<weakness>","<weakness>","<weakness>","<weakness>"],
  "missingKeywords": ["<kw>","<kw>","<kw>","<kw>","<kw>","<kw>"],
  "suggestions": ["<suggestion>","<suggestion>","<suggestion>","<suggestion>","<suggestion>"],
  "keywords": [
    {"term": "<term>", "count": <integer>, "status": "<matched|missing|weak>"}
  ],
  "match": <integer 0-100>,
  "readability": <integer 0-100>,
  "impact": <integer 0-100>,
  "formatting": <integer 0-100>,
  "resumeText": "<the original resume text>"
}`

  const raw = await callGemini([{ text: prompt }])
  return cleanJSON(raw)
}

export async function roastResume(resumeText: string) {
  const prompt = `You are a brutally honest but constructive career coach known for sharp, funny feedback. Roast this resume — be savage but family-friendly (no profanity). Reference specific content from the resume. Be funny AND actionable.

Resume:
${resumeText}

Return ONLY valid JSON:
{
  "roastLines": [
    {"severity": "<spicy|medium|mild>", "text": "<roast line>"},
    {"severity": "<spicy|medium|mild>", "text": "<roast line>"},
    {"severity": "<spicy|medium|mild>", "text": "<roast line>"},
    {"severity": "<spicy|medium|mild>", "text": "<roast line>"},
    {"severity": "<spicy|medium|mild>", "text": "<roast line>"},
    {"severity": "<spicy|medium|mild>", "text": "<roast line>"}
  ]
}

Include 2 spicy, 2 medium, 2 mild. Each line should be 1-3 sentences. Be specific — reference actual resume content.`

  const raw = await callGemini([{ text: prompt }], 0.8)
  return cleanJSON(raw)
}

export async function rewriteResume(resumeText: string) {
  const prompt = `You are a top-tier professional resume writer. Rewrite this resume to be more impactful, ATS-optimized, and compelling.

STRICT RULES:
- Do NOT invent skills, jobs, or achievements not in the original
- DO improve wording, add strong action verbs, suggest quantification where logical
- DO remove filler phrases like "results-driven", "team player", "passionate"
- DO make bullet points start with powerful action verbs
- DO improve section structure and readability
- Format as clean markdown

Original Resume:
${resumeText}

Return ONLY valid JSON — no markdown fences:
{
  "rewrittenResume": "<improved resume as full markdown string>",
  "changesSummary": ["<change 1>","<change 2>","<change 3>","<change 4>","<change 5>"]
}`

  const raw = await callGemini([{ text: prompt }], 0.3)
  return cleanJSON(raw)
}

export async function recruiterMode(resumeText: string, role: string) {
  const prompt = `You are a senior tech recruiter with 15+ years of experience at top companies. Evaluate this resume for a ${role || "Software Engineer"} role.

Resume:
${resumeText}

Return ONLY valid JSON:
{
  "verdict": "<Hire|Maybe|Reject>",
  "confidence": <integer 0-100>,
  "reasons": ["<reason for verdict>","<reason>","<reason>"],
  "standoutPoints": ["<positive point>","<positive point>"],
  "concerns": ["<concern>","<concern>"],
  "hiringNote": "<1-2 sentence note you'd write to the hiring manager about this candidate>"
}`

  const raw = await callGemini([{ text: prompt }])
  return cleanJSON(raw)
}

export async function compareResumes(textA: string, pdfBBase64: string, isBPdf: boolean) {
  const jsonSchema = `{
  "winner": "<A|B|Tie>",
  "reason": "<overall reason for winner, 2 sentences>",
  "comparison": [
    {"metric": "ATS Score",         "scoreA": <0-100>, "scoreB": <0-100>, "winner": "<A|B|Tie>"},
    {"metric": "Keyword Density",   "scoreA": <0-100>, "scoreB": <0-100>, "winner": "<A|B|Tie>"},
    {"metric": "Impact Statements", "scoreA": <0-100>, "scoreB": <0-100>, "winner": "<A|B|Tie>"},
    {"metric": "Readability",       "scoreA": <0-100>, "scoreB": <0-100>, "winner": "<A|B|Tie>"},
    {"metric": "Experience Quality","scoreA": <0-100>, "scoreB": <0-100>, "winner": "<A|B|Tie>"},
    {"metric": "Formatting",        "scoreA": <0-100>, "scoreB": <0-100>, "winner": "<A|B|Tie>"}
  ],
  "summaryA": "<2-3 sentence summary of Resume A>",
  "summaryB": "<2-3 sentence summary of Resume B>"
}

IMPORTANT: The "winner" field must be EXACTLY the single letter "A", "B", or "Tie" — nothing else.`

  let parts: object[]

  if (isBPdf) {
    parts = [
      {
        text: `You are an expert resume evaluator. Compare Resume A (text below) and Resume B (attached PDF) head-to-head.

Resume A:
${textA}

Return ONLY valid JSON — no markdown fences:
${jsonSchema}`,
      },
      { inlineData: { mimeType: "application/pdf", data: pdfBBase64 } },
    ]
  } else {
    parts = [
      {
        text: `You are an expert resume evaluator. Compare these two resumes head-to-head.

Resume A:
${textA}

---

Resume B:
${pdfBBase64}

Return ONLY valid JSON — no markdown fences:
${jsonSchema}`,
      },
    ]
  }

  const raw = await callGemini(parts)
  const data = cleanJSON(raw) as Record<string, unknown>

  // Strictly normalise winner so UI never shows "undefined"
  const comparison = (Array.isArray(data.comparison) ? data.comparison : []) as Array<Record<string, unknown>>

  return {
    winner:     normalizeWinner(data.winner),
    reason:     String(data.reason  ?? "See comparison breakdown below."),
    summaryA:   String(data.summaryA ?? data.summary_a ?? ""),
    summaryB:   String(data.summaryB ?? data.summary_b ?? ""),
    comparison: comparison.map(row => ({
      metric:  String(row.metric  ?? ""),
      scoreA:  Number(row.scoreA  ?? row.score_a ?? 0),
      scoreB:  Number(row.scoreB  ?? row.score_b ?? 0),
      winner:  normalizeMetricWinner(row.winner),
    })),
  }
}
