"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDashboard() {
  const stats = [
    { title: "Total Calls", value: "1,247", change: "+12.5%", icon: "📞" },
    { title: "Active Agents", value: "8", change: "+2", icon: "🤖" },
    { title: "Total Minutes", value: "3,542", change: "+8.3%", icon: "⏱️" },
    { title: "Revenue", value: "$2,847", change: "+15.2%", icon: "💰" },
  ]

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-neutral-400 font-mono text-sm">Overview of your Hey AI usage and performance</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="search"
              placeholder="Search..."
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 pl-10 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary w-64"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500"
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
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="font-mono text-xs uppercase text-neutral-500">{stat.title}</CardDescription>
              <span className="text-2xl">{stat.icon}</span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <p className="text-sm text-green-500 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity - Takes 2 columns */}
        <Card className="bg-neutral-900 border-neutral-800 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white font-semibold">Recent Activity</CardTitle>
            <CardDescription className="font-mono text-xs text-neutral-500">Latest calls and interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { caller: "+1 555-0123", agent: "GPT-4", duration: "2:34", status: "Completed", time: "2 min ago" },
                { caller: "+1 555-0456", agent: "Claude", duration: "1:12", status: "Completed", time: "15 min ago" },
                { caller: "+1 555-0789", agent: "GPT-4", duration: "3:45", status: "In Progress", time: "Just now" },
                { caller: "+1 555-0321", agent: "Claude", duration: "0:45", status: "Completed", time: "1 hour ago" },
              ].map((call, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-4 bg-neutral-800/50 rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-neutral-700 rounded-full flex items-center justify-center text-lg">
                      📞
                    </div>
                    <div>
                      <p className="font-mono text-sm text-white">{call.caller}</p>
                      <p className="text-xs text-neutral-500">{call.agent} • {call.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm text-white">{call.duration}</p>
                    <p className={`text-xs ${call.status === "Completed" ? "text-green-500" : "text-yellow-500"}`}>
                      {call.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white font-semibold">Quick Stats</CardTitle>
            <CardDescription className="font-mono text-xs text-neutral-500">Today's overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-neutral-400">Success Rate</span>
                  <span className="text-sm font-bold text-white">94%</span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "94%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-neutral-400">Avg Call Duration</span>
                  <span className="text-sm font-bold text-white">2:45</span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: "68%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-neutral-400">Agent Utilization</span>
                  <span className="text-sm font-bold text-white">87%</span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: "87%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
