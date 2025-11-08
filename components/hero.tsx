"use client"

import Link from "next/link"
import { GL } from "./gl"
import { Pill } from "./pill"
import { Button } from "./ui/button"
import { useState } from "react"
import { SiriAnimation } from "./siri-animation"
import { useToast } from "@/hooks/use-toast"

export function Hero() {
  const [hovering, setHovering] = useState(false)
  const { toast } = useToast()

  const handleSiriClick = () => {
    toast({
      title: "Voice connection feature coming soon!",
      description: "We're working on bringing you the best AI voice experience.",
    })
  }

  return (
    <div className="flex flex-col h-svh justify-between">
      <GL hovering={hovering} />

      <div className="pb-16 mt-auto text-center relative">
        <Pill className="mb-6">AI VOICE API</Pill>

        <div className="flex justify-center mb-8">
          <SiriAnimation onClick={handleSiriClick} />
        </div>

        <p className="text-sm text-primary/80 animate-pulse mb-8">Click on me to test it out</p>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-sentient">
          Talk to your <br />
          <i className="font-light">AI</i> assistant
        </h1>
        <p className="font-mono text-sm sm:text-base text-foreground/60 text-balance mt-8 max-w-[440px] mx-auto">
          Complete tasks over a phone call — send emails, read messages, or execute commands using advanced AI models
        </p>

        <Link className="contents max-sm:hidden" href="/#contact">
          <Button className="mt-14" onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
            [Get Started]
          </Button>
        </Link>
        <Link className="contents sm:hidden" href="/#contact">
          <Button
            size="sm"
            className="mt-14"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            [Get Started]
          </Button>
        </Link>
      </div>
    </div>
  )
}
