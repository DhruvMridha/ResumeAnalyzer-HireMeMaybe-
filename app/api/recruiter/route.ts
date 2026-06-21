import { NextRequest, NextResponse } from "next/server"
import { recruiterMode } from "@/lib/gemini"

export const maxDuration = 30

export async function POST(request: NextRequest) {
  try {
    const { resumeText, role } = await request.json()

    if (!resumeText || typeof resumeText !== "string") {
      return NextResponse.json({ error: "resumeText is required" }, { status: 400 })
    }

    const data = await recruiterMode(resumeText, role || "")
    return NextResponse.json(data)
  } catch (error) {
    console.error("[recruiter] error:", error)
    return NextResponse.json({ error: "Recruiter analysis failed" }, { status: 500 })
  }
}
