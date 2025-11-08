import type React from "react"
export const Logo = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <text x="5" y="30" fontFamily="monospace" fontSize="32" fontWeight="700" fill="white" letterSpacing="1" style={{ filter: 'drop-shadow(0 0 10px rgba(0, 0, 0, 0.5))' }}>
        HeyAI
      </text>
    </svg>
  )
}
