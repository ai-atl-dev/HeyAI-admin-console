"use client"

import { GL } from "./gl"
import { useState } from "react"
import { SiriAnimation } from "./siri-animation"
import { useToast } from "@/hooks/use-toast"

export function Hero() {
  const [hovering, setHovering] = useState(false)
  const { toast } = useToast()

  const handleSiriClick = () => {
    // No action on click
  }

  return (
    <div className="flex flex-col h-svh justify-between relative">
      <GL hovering={hovering} />

      <div className="flex-1 flex flex-col items-center justify-start pt-24 text-center relative z-10">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold tracking-tight mt-24 drop-shadow-lg neon-glow-heading" style={{ fontFamily: "'Playfair Display', serif" }}>
          AI that talks, texts and gets it done
        </h1>
        <p className="font-mono text-sm sm:text-base text-white text-balance mt-8 max-w-[440px] mx-auto drop-shadow-md">
          Complete tasks over a phone call — send emails, read messages, or execute commands using advanced AI models
        </p>
      </div>

      <div className="pb-20 text-center relative z-10">
        <div className="flex justify-center -mb-4">
          <SiriAnimation onClick={handleSiriClick} />
        </div>
        <p className="text-lg text-primary/80 animate-pulse drop-shadow-md flex items-center justify-center gap-2 -translate-x-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" x2="12" y1="19" y2="22"></line>
          </svg>
          Try it out
        </p>
      </div>
    </div>
  )
}
