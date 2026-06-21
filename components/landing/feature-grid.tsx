import { Target, ScanSearch, GitCompareArrows, Flame, Upload, TrendingUp } from "lucide-react"

const features = [
  {
    icon: Upload,
    title: "Drag & drop upload",
    desc: "Drop a PDF or DOCX and get a full breakdown in seconds — no formatting headaches.",
  },
  {
    icon: Target,
    title: "Real ATS scoring",
    desc: "An animated gauge scores parse-ability, formatting, and relevance the way recruiters' software does.",
  },
  {
    icon: ScanSearch,
    title: "Keyword analysis",
    desc: "See matched, weak, and missing keywords against any job description, ranked by impact.",
  },
  {
    icon: GitCompareArrows,
    title: "Compare mode",
    desc: "Stack two versions side by side and watch exactly which edits moved the needle.",
  },
  {
    icon: Flame,
    title: "Roast mode",
    desc: "Turn on brutally honest feedback that calls out clichés, fluff, and weak bullet points.",
  },
  {
    icon: TrendingUp,
    title: "Progress tracking",
    desc: "Track your score over time and see your resume climb with every revision.",
  },
]

export function FeatureGrid() {
  return (
    <section id="features" className="px-4 py-16 lg:px-6 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-primary">Everything you need</p>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            One dashboard to make your resume unignorable
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="glass group rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <f.icon className="size-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
