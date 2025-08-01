"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Marquee = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    reverse?: boolean
    pauseOnHover?: boolean
  }
>(({ className, reverse, pauseOnHover = false, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex overflow-hidden [--duration:40s] [--gap:1rem]",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "flex w-max items-stretch gap-[--gap]",
          pauseOnHover && "hover:[animation-play-state:paused]",
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        )}
        style={{
          "--duration": "var(--duration, 40s)",
        } as React.CSSProperties}
      >
        {children}
        {children}
        {children}
        {children}
        {children}
      </div>
    </div>
  )
})
Marquee.displayName = "Marquee"

export { Marquee } 