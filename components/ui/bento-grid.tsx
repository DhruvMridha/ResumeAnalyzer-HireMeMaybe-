"use client"

import { cn } from "@/lib/utils"

export interface BentoItem {
  title: string
  description: string
  icon: React.ReactNode
  status?: string
  tags?: string[]
  meta?: string
  cta?: string
  colSpan?: number
  hasPersistentHover?: boolean
}

interface BentoGridProps {
  items: BentoItem[]
  className?: string
}

export function BentoGrid({ items, className }: BentoGridProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {items.map((item, index) => (
        <div
          key={index}
          className={cn(
            "group relative animate-float-up overflow-hidden rounded-xl p-4 transition-all duration-300",
            "glass hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(37,99,235,0.10)] will-change-transform",
            item.colSpan === 2 ? "lg:col-span-2" : "col-span-1",
            item.hasPersistentHover && "-translate-y-0.5 shadow-[0_8px_30px_rgba(37,99,235,0.10)]",
          )}
          style={{ animationDelay: `${index * 70}ms` }}
        >
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-300",
              item.hasPersistentHover ? "opacity-100" : "opacity-0 group-hover:opacity-100",
            )}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,color-mix(in_oklch,var(--primary)_14%,transparent)_1px,transparent_1px)] bg-[length:6px_6px]" />
          </div>

          <div className="relative flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary/15">
                {item.icon}
              </div>
              <span className="rounded-lg bg-secondary px-2 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm transition-colors duration-300 group-hover:bg-primary/10 group-hover:text-primary">
                {item.status || "Active"}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-[15px] font-semibold tracking-tight text-foreground">
                {item.title}
                {item.meta && (
                  <span className="ml-2 text-xs font-normal text-muted-foreground">{item.meta}</span>
                )}
              </h3>
              <p className="text-sm leading-snug text-muted-foreground">{item.description}</p>
            </div>

            <div className="mt-1 flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                {item.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="rounded-md bg-secondary px-2 py-1 backdrop-blur-sm transition-all duration-200 hover:bg-primary/10"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <span className="text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">
                {item.cta || "View"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
