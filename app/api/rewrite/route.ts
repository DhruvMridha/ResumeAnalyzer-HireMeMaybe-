import { NextRequest, NextResponse } from "next/server"
import { rewriteResume } from "@/lib/gemini"

export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const { resumeText } = await request.json()

    if (!resumeText || typeof resumeText !== "string") {
      return NextResponse.json({ error: "resumeText is required" }, { status: 400 })
    }

    const data = await rewriteResume(resumeText)
    return NextResponse.json(data)
  } catch (error) {
    console.error("[rewrite] error:", error)
    return NextResponse.json({ error: "Rewrite generation failed" }, { status: 500 })
  }
}
