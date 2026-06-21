import { NextRequest, NextResponse } from "next/server"
import { roastResume } from "@/lib/gemini"

export const maxDuration = 30

export async function POST(request: NextRequest) {
  try {
    const { resumeText } = await request.json()

    if (!resumeText || typeof resumeText !== "string") {
      return NextResponse.json({ error: "resumeText is required" }, { status: 400 })
    }

    const data = await roastResume(resumeText)
    return NextResponse.json(data)
  } catch (error) {
    console.error("[roast] error:", error)
    return NextResponse.json({ error: "Roast generation failed" }, { status: 500 })
  }
}
