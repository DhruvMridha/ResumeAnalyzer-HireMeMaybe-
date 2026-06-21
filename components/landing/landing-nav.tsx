import Link from "next/link"
import { Sparkles } from "lucide-react"

const links = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "Pricing", href: "#pricing" },
]

export function LandingNav() {
  return (
    <header className="sticky top-0 z-50 px-4 pt-4 lg:px-6">
      <nav className="glass mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="size-4" aria-hidden="true" />
          </div>
          <span className="text-sm font-semibold text-foreground">Hire Me Maybe</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="hidden rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Sign in
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            Launch app
          </Link>
        </div>
      </nav>
    </header>
  )
}
