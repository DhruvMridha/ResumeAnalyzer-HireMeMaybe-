import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

const steps = [
  { num: "01", title: "Upload your resume", desc: "Drop in your PDF and paste the job description you're targeting." },
  { num: "02", title: "Get your ATS score", desc: "Hire Me Maybe parses, scores, and highlights every gap in seconds." },
  { num: "03", title: "Fix & re-score", desc: "Apply suggestions, compare versions, and watch your score climb." },
]

export function CtaSection() {
  return (
    <>
      <section id="how" className="px-4 py-16 lg:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold text-primary">How it works</p>
            <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Three steps to a sharper resume
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.num} className="glass rounded-2xl p-6">
                <span className="text-2xl font-bold text-primary/40">{s.num}</span>
                <h3 className="mt-3 text-base font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="px-4 py-16 lg:px-6 lg:py-24">
        <div className="glass-strong mx-auto flex max-w-4xl flex-col items-center overflow-hidden rounded-3xl px-6 py-14 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="size-6" aria-hidden="true" />
          </div>
          <h2 className="mt-6 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Ready to beat the bots?
          </h2>
          <p className="mt-3 max-w-md text-pretty text-muted-foreground">
            Start free — no credit card required. Run your first scan and see your
            ATS score in under a minute.
          </p>
          <Link
            href="/dashboard"
            className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            Launch the dashboard
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border/60 px-4 py-8 lg:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" aria-hidden="true" />
            <span className="font-semibold text-foreground">Hire Me Maybe</span>
            <span>Resume Intelligence</span>
          </div>
          <p>Built for job seekers · Demo experience</p>
        </div>
      </footer>
    </>
  )
}
