"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { StatsResponse, RecentCall, QuickStatsResponse, StatCard } from "@/types/dashboard"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatCard[]>([
    { title: "Total Calls", value: "Loading...", change: "-" },
    { title: "Active Agents", value: "Loading...", change: "-" },
    { title: "Total Minutes", value: "Loading...", change: "-" },
    { title: "Revenue", value: "Loading...", change: "-" },
  ])
  const [recentCalls, setRecentCalls] = useState<RecentCall[]>([])
  const [quickStats, setQuickStats] = useState<QuickStatsResponse>({
    successRate: 0,
    avgDuration: 0,
    agentUtilization: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch all data in parallel
        const [statsRes, recentRes, quickRes] = await Promise.all([
          fetch("/api/dashboard/stats"),
          fetch("/api/dashboard/recent-activity"),
          fetch("/api/dashboard/quick-stats"),
        ])

        if (!statsRes.ok || !recentRes.ok || !quickRes.ok) {
          throw new Error("Failed to fetch dashboard data")
        }

        const statsData: StatsResponse = await statsRes.json()
        const recentData = await recentRes.json()
        const quickData: QuickStatsResponse = await quickRes.json()

        // Format stats for display
        const formattedStats: StatCard[] = [
          {
            title: "Total Calls",
            value: statsData.totalCalls.toLocaleString(),
            change: "+0", // You can add previous data comparison here
          },
          {
            title: "Active Agents",
            value: statsData.activeAgents.toString(),
            change: "+0",
          },
          {
            title: "Total Minutes",
            value: statsData.totalMinutes.toLocaleString(),
            change: "+0",
          },
          {
            title: "Revenue",
            value: `$${statsData.revenue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
            change: "+0",
          },
        ]

        setStats(formattedStats)
        setRecentCalls(recentData.calls || [])
        setQuickStats(quickData)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError(err instanceof Error ? err.message : "Failed to load dashboard data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen px-4 py-6 md:px-8 md:py-8">
      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm">
          <p className="font-semibold">Error loading dashboard data</p>
          <p>{error}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-neutral-400 font-mono text-xs md:text-sm">Overview of your HeyAI usage and performance</p>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="relative w-full md:w-auto">
            <input
              type="search"
              placeholder="Search..."
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 pl-10 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-72"
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
            <CardHeader className="pb-2 text-center">
              <CardDescription className="font-mono text-xs uppercase text-neutral-500">{stat.title}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-white">
                {isLoading ? <Skeleton className="h-8 w-24 mx-auto bg-neutral-700" /> : stat.value}
              </div>
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
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full bg-neutral-700" />
                ))
              ) : recentCalls.length === 0 ? (
                <div className="text-center py-8 text-neutral-500">
                  <p>No recent activity</p>
                </div>
              ) : (
                recentCalls.map((call, i) => {
                  const startTime = new Date(call.start_time)
                  const now = new Date()
                  const diffMs = now.getTime() - startTime.getTime()
                  const diffMins = Math.floor(diffMs / 60000)
                  const diffHours = Math.floor(diffMs / 3600000)
                  
                  let timeAgo = "Just now"
                  if (diffMins > 60) {
                    timeAgo = `${diffHours}h ago`
                  } else if (diffMins > 0) {
                    timeAgo = `${diffMins}m ago`
                  }

                  const durationMinutes = Math.floor(call.duration / 60)
                  const durationSeconds = call.duration % 60
                  const durationStr = `${durationMinutes}:${durationSeconds.toString().padStart(2, "0")}`

                  return (
                    <div
                      key={i}
                      className="flex justify-between items-center p-4 bg-neutral-800/50 rounded-lg hover:bg-neutral-800 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-mono text-sm text-white">{call.caller_number}</p>
                          <p className="text-xs text-neutral-500">{call.agent_id} • {timeAgo}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-sm text-white">{durationStr}</p>
                        <p className={`text-xs ${call.status?.toLowerCase() === "completed" ? "text-green-500" : "text-yellow-500"}`}>
                          {call.status}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
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
                  <span className="text-sm font-bold text-white">
                    {isLoading ? "-" : `${quickStats.successRate.toFixed(1)}%`}
                  </span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: isLoading ? "0%" : `${quickStats.successRate}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-neutral-400">Avg Call Duration</span>
                  <span className="text-sm font-bold text-white">
                    {isLoading ? "-" : `${Math.floor(quickStats.avgDuration)}:${Math.round((quickStats.avgDuration % 1) * 60).toString().padStart(2, "0")}`}
                  </span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: isLoading ? "0%" : `${Math.min(quickStats.avgDuration * 5, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-neutral-400">Agent Utilization</span>
                  <span className="text-sm font-bold text-white">
                    {isLoading ? "-" : `${quickStats.agentUtilization.toFixed(1)}%`}
                  </span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: isLoading ? "0%" : `${quickStats.agentUtilization}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
