import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"

export const AdminConsoleButton = () => {
  return (
    <div className="fixed z-50 pt-4 md:pt-6 top-0 right-0 px-6 md:px-12 lg:px-16">
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link
          className="max-lg:hidden px-6 py-2.5 rounded-full font-mono text-sm backdrop-blur-2xl bg-foreground/5 dark:bg-foreground/10 text-foreground hover:text-foreground hover:bg-foreground/10 dark:hover:bg-foreground/15 border border-foreground/10 hover:border-foreground/20 transition-all duration-200 shadow-lg shadow-foreground/5"
          href="/admin/dashboard"
        >
          Admin Console
        </Link>
      </div>
    </div>
  )
}
