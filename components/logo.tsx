import type React from "react"
export const Logo = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <text x="5" y="28" fontFamily="monospace" fontSize="24" fontWeight="bold" fill="white" style={{ filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.5))' }}>
        Hey AI
      </text>
    </svg>
  )
}
