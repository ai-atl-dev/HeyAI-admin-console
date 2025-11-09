"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function AdminSidebar() {
  const pathname = usePathname()

  const workspaceLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/admin/live", label: "Live Monitor", icon: "🔴", animated: true },
  ]

  const collectionLinks = [
    { href: "/admin/add-agent", label: "Add Agent", icon: "➕" },
    { href: "/admin/payment", label: "Payment", icon: "💳" },
  ]

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-neutral-900 border-r border-neutral-800 flex-col">
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 pt-20 md:pt-24">
        {/* Workspace Section */}
        <div className="mb-8">
          <h3 className="text-xs font-mono uppercase text-neutral-500 mb-3 px-3">Workspace</h3>
          <nav className="space-y-1">
            {workspaceLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${pathname === link.href
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
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${pathname === link.href
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
