"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button className="h-10 w-10 rounded-full backdrop-blur-2xl bg-foreground/5 dark:bg-foreground/10 border border-foreground/10" />
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="h-10 w-10 rounded-full backdrop-blur-2xl bg-foreground/5 dark:bg-foreground/10 text-foreground/80 hover:text-foreground hover:bg-foreground/10 dark:hover:bg-foreground/15 border border-foreground/10 hover:border-foreground/20 transition-all duration-200 shadow-lg shadow-foreground/5 flex items-center justify-center"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  )
}
