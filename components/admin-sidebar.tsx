"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "./logo"

export function AdminSidebar() {
  const pathname = usePathname()

  const workspaceLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/admin/live", label: "Live Monitor", icon: "🔴" },
    { href: "/admin/usage-history", label: "Usage History", icon: "📈" },
  ]

  const collectionLinks = [
    { href: "/admin/add-agent", label: "Add Agent", icon: "➕" },
    { href: "/admin/payment", label: "Payment", icon: "💳" },
  ]

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-neutral-900 border-r border-neutral-800 flex-col">
      {/* Logo */}
      <div className="p-4 pt-6 pb-4">
        <Link href="/admin/dashboard">
          <Logo className="w-24 h-auto" />
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 pt-2">
        {/* Admin Section with Search */}
        <div className="mb-8">
          <h3 className="text-xs font-mono uppercase text-neutral-500 mb-3 px-3">Admin</h3>
          <div className="relative mb-4 px-3">
            <input
              type="search"
              placeholder="Search..."
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 pl-10 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <svg
              className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Workspace Section */}
        <div className="mb-8">
          <h3 className="text-xs font-mono uppercase text-neutral-500 mb-3 px-3">Workspace</h3>
          <nav className="space-y-1">
            {workspaceLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  pathname === link.href
                    ? "bg-neutral-800 text-white"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Collections Section */}
        <div className="mb-8">
          <h3 className="text-xs font-mono uppercase text-neutral-500 mb-3 px-3">Management</h3>
          <nav className="space-y-1">
            {collectionLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  pathname === link.href
                    ? "bg-neutral-800 text-white"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-800">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-400 hover:text-white transition-colors"
        >
          <span>⚙️</span>
          <span>Back to Home</span>
        </Link>
      </div>
    </aside>
  )
}
