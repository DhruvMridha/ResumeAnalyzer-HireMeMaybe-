import Link from "next/link"
import { ArrowRight, Sparkles, Star } from "lucide-react"
import { SparklesText } from "@/components/ui/sparkles-text"

export function Hero() {
  return (
    <section className="relative px-4 pt-16 pb-20 lg:px-6 lg:pt-24">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <div className="glass mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground">
          <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
          AI-powered resume intelligence
        </div>

        <h1 className="text-balance text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Beat the bots. Land the
          <span className="mt-2 flex justify-center">
            <SparklesText
              text="interview."
              className="text-4xl sm:text-5xl lg:text-6xl"
              colors={{ first: "#2563eb", second: "#60a5fa" }}
            />
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          Hire Me Maybe scans your resume against any job description, scores it like a
          real ATS, surfaces missing keywords, and even roasts it — so you can
          fix what matters before a recruiter ever sees it.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            Analyze my resume
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
          <Link
            href="/dashboard"
            className="glass inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            View live demo
          </Link>
        </div>

        <div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-4 fill-primary text-primary" />
            ))}
          </div>
          <span>Trusted by 12,000+ job seekers</span>
        </div>
      </div>
    </section>
  )
}
