import { NextRequest, NextResponse } from "next/server"
import { analyzeResumePDF, analyzeResumeText } from "@/lib/gemini"

export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const MAX_SIZE = 5 * 1024 * 1024 // 5MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    let analysisData: unknown

    const fileName = file.name.toLowerCase()
    const isPDF = fileName.endsWith(".pdf") || file.type === "application/pdf"
    const isDOCX =
      fileName.endsWith(".docx") ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

    if (isPDF) {
      const pdfBase64 = buffer.toString("base64")
      analysisData = await analyzeResumePDF(pdfBase64)
    } else if (isDOCX) {
      const mammoth = await import("mammoth")
      const result = await mammoth.extractRawText({ buffer })
      if (!result.value.trim()) {
        return NextResponse.json(
          { error: "Could not extract text from DOCX" },
          { status: 400 }
        )
      }
      analysisData = await analyzeResumeText(result.value)
    } else if (fileName.endsWith(".txt")) {
      const text = buffer.toString("utf-8")
      if (!text.trim()) {
        return NextResponse.json({ error: "File appears to be empty" }, { status: 400 })
      }
      analysisData = await analyzeResumeText(text)
    } else {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload PDF, DOCX, or TXT." },
        { status: 400 }
      )
    }

    const sessionId = crypto.randomUUID()

    return NextResponse.json({
      sessionId,
      fileName: file.name,
      analyzedAt: new Date().toISOString(),
      ...(analysisData as object),
    })
  } catch (error) {
    console.error("[analyze] error:", error)
    const message =
      error instanceof Error ? error.message : "Analysis failed. Please try again."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
