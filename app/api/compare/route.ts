import { NextRequest, NextResponse } from "next/server"
import { compareResumes } from "@/lib/gemini"

export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const textA = formData.get("textA") as string | null
    const fileB = formData.get("fileB") as File | null

    if (!textA) {
      return NextResponse.json({ error: "textA is required" }, { status: 400 })
    }

    if (!fileB) {
      return NextResponse.json({ error: "fileB (Resume B) is required" }, { status: 400 })
    }

    const bytes = await fileB.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const fileName = fileB.name.toLowerCase()
    const isPDF = fileName.endsWith(".pdf") || fileB.type === "application/pdf"
    const isDOCX =
      fileName.endsWith(".docx") ||
      fileB.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

    let pdfBBase64: string
    let isBPdf = false

    if (isPDF) {
      pdfBBase64 = buffer.toString("base64")
      isBPdf = true
    } else if (isDOCX) {
      const mammoth = await import("mammoth")
      const result = await mammoth.extractRawText({ buffer })
      pdfBBase64 = result.value // text, not base64
      isBPdf = false
    } else if (fileName.endsWith(".txt")) {
      pdfBBase64 = buffer.toString("utf-8")
      isBPdf = false
    } else {
      return NextResponse.json(
        { error: "Unsupported file type for Resume B" },
        { status: 400 }
      )
    }

    const data = await compareResumes(textA, pdfBBase64, isBPdf)
    return NextResponse.json(data)
  } catch (error) {
    console.error("[compare] error:", error)
    return NextResponse.json({ error: "Comparison failed" }, { status: 500 })
  }
}
