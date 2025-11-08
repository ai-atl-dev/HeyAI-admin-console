import Link from "next/link"
import { Logo } from "./logo"
import { MobileMenu } from "./mobile-menu"

export const Header = () => {
  return (
    <div className="fixed z-50 pt-4 md:pt-6 top-0 left-0 w-full">
      <header className="flex items-center justify-between px-6 md:px-12 lg:px-16">
        <Link href="/">
          <Logo className="w-[100px] md:w-[120px]" />
        </Link>
        <nav className="flex max-lg:hidden absolute left-1/2 -translate-x-1/2 items-center justify-center gap-x-10 px-8 py-3 rounded-full backdrop-blur-2xl bg-foreground/5 dark:bg-foreground/10 border border-foreground/10 shadow-lg shadow-foreground/5">
          {["About", "Features", "Pricing", "Contact"].map((item) => (
            <Link
              className="uppercase inline-block font-mono text-sm text-foreground hover:bg-foreground/10 dark:hover:bg-foreground/15 px-3 py-1.5 rounded-full transition-all duration-200"
              href={`#${item.toLowerCase()}`}
              key={item}
            >
              {item}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            className="max-lg:hidden px-6 py-2.5 rounded-full font-mono text-sm backdrop-blur-2xl bg-foreground/5 dark:bg-foreground/10 text-foreground hover:text-foreground hover:bg-foreground/10 dark:hover:bg-foreground/15 border border-foreground/10 hover:border-foreground/20 transition-all duration-200 shadow-lg shadow-foreground/5"
            href="/admin/dashboard"
          >
            Admin Console
          </Link>
          <MobileMenu />
        </div>
      </header>
    </div>
  )
}
