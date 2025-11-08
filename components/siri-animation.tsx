"use client"

import { useEffect, useRef, useState } from "react"

interface SiriAnimationProps {
  onClick?: () => void
}

export function SiriAnimation({ onClick }: SiriAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const size = 200
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.scale(dpr, dpr)

    const centerX = size / 2
    const centerY = size / 2
    const baseRadius = 60
    const waveCount = 5
    let time = 0

    const colors = [
      { r: 255, g: 149, b: 0 }, // Bright Orange
      { r: 255, g: 179, b: 0 }, // Amber
      { r: 255, g: 120, b: 0 }, // Deep Orange
      { r: 251, g: 191, b: 36 }, // Golden
      { r: 255, g: 100, b: 50 }, // Red-Orange
    ]

    const animate = () => {
      ctx.clearRect(0, 0, size, size)

      time += 0.04

      for (let i = 0; i < waveCount; i++) {
        const offset = (i / waveCount) * Math.PI * 2
        const points = 100

        ctx.beginPath()

        for (let j = 0; j <= points; j++) {
          const angle = (j / points) * Math.PI * 2
          const wave1 = Math.sin(angle * 3 + time + offset) * 12
          const wave2 = Math.cos(angle * 2 - time * 0.7 + offset) * 10
          const wave3 = Math.sin(angle * 5 + time * 1.5 + offset) * 6

          const hoverBoost = isHovered ? 1.4 : 1
          const radius = baseRadius + (wave1 + wave2 + wave3) * hoverBoost

          const x = centerX + Math.cos(angle) * radius
          const y = centerY + Math.sin(angle) * radius

          if (j === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }

        ctx.closePath()

        const colorIndex = i % colors.length
        const color = colors[colorIndex]
        const nextColor = colors[(colorIndex + 1) % colors.length]

        const gradient = ctx.createLinearGradient(
          centerX - baseRadius,
          centerY - baseRadius,
          centerX + baseRadius,
          centerY + baseRadius,
        )

        gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${0.25 + i * 0.08})`)
        gradient.addColorStop(1, `rgba(${nextColor.r}, ${nextColor.g}, ${nextColor.b}, ${0.25 + i * 0.08})`)

        ctx.fillStyle = gradient
        ctx.fill()

        ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${0.6 + i * 0.1})`
        ctx.lineWidth = 2
        ctx.stroke()
      }

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, baseRadius)
      gradient.addColorStop(0, "rgba(255, 149, 0, 0.4)")
      gradient.addColorStop(0.5, "rgba(255, 179, 0, 0.1)")
      gradient.addColorStop(1, "rgba(255, 120, 0, 0)")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, size, size)

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isHovered])

  return (
    <div className="relative inline-block">
      <canvas
        ref={canvasRef}
        className="cursor-pointer transition-transform hover:scale-110 duration-300"
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
    </div>
  )
}
