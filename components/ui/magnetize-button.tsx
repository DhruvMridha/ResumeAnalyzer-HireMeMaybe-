"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { motion, useAnimation } from "framer-motion"
import { Sparkles } from "lucide-react"
import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"

interface MagnetizeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  particleCount?: number
  label?: string
}

interface Particle {
  id: number
  x: number
  y: number
}

function MagnetizeButton({
  className,
  particleCount = 14,
  label = "Start Analysis",
  ...props
}: MagnetizeButtonProps) {
  const [isAttracting, setIsAttracting] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const particlesControl = useAnimation()

  useEffect(() => {
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 360 - 180,
      y: Math.random() * 360 - 180,
    }))
    setParticles(newParticles)
  }, [particleCount])

  const handleInteractionStart = useCallback(async () => {
    setIsAttracting(true)
    await particlesControl.start({
      x: 0,
      y: 0,
      transition: { type: "spring", stiffness: 50, damping: 10 },
    })
  }, [particlesControl])

  const handleInteractionEnd = useCallback(async () => {
    setIsAttracting(false)
    await particlesControl.start((i) => ({
      x: particles[i].x,
      y: particles[i].y,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    }))
  }, [particlesControl, particles])

  return (
    <Button
      className={cn(
        "relative min-w-44 touch-none",
        "bg-sky-500/15 hover:bg-sky-500/25",
        "text-sky-300",
        "border border-sky-400/30",
        "transition-all duration-300",
        className,
      )}
      onMouseEnter={handleInteractionStart}
      onMouseLeave={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      {...props}
    >
      {particles.map((_, index) => (
        <motion.div
          key={index}
          custom={index}
          initial={{ x: particles[index].x, y: particles[index].y }}
          animate={particlesControl}
          className={cn(
            "absolute h-1.5 w-1.5 rounded-full",
            "bg-sky-400",
            "transition-opacity duration-300",
            isAttracting ? "opacity-100" : "opacity-40",
          )}
        />
      ))}
      <span className="relative flex w-full items-center justify-center gap-2">
        <Sparkles
          className={cn("h-4 w-4 transition-transform duration-300", isAttracting && "scale-110")}
        />
        {label}
      </span>
    </Button>
  )
}

export { MagnetizeButton }
