"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface UsageRecord {
  id: string
  caller: string
  agent: string
  duration: string
  cost: string
  timestamp: string
  status: string
}

export default function UsageHistory() {
  const [usage, setUsage] = useState<UsageRecord[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchUsageHistory = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/calls/history?limit=100")
        const data = await response.json()

        if (response.ok && data.success) {
          // Format the calls for display
          const formattedUsage = data.calls.map((call: any) => {
            const durationMinutes = Math.floor(call.duration / 60)
            const durationSeconds = call.duration % 60
            const durationStr = `${durationMinutes}:${durationSeconds.toString().padStart(2, "0")}`

            const timestamp = new Date(call.timestamp)
            const formattedTimestamp = timestamp.toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })

            return {
              id: call.id,
              caller: call.caller,
              agent: call.agent,
              duration: durationStr,
              cost: call.cost ? `$${call.cost.toFixed(2)}` : "$0.00",
              timestamp: formattedTimestamp,
              status: call.status,
            }
          })

          setUsage(formattedUsage)
        } else {
          console.error("Failed to fetch usage history:", data.error)
          toast({
            title: "Error",
            description: "Failed to load usage history",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching usage history:", error)
        toast({
          title: "Error",
          description: "Failed to load usage history",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUsageHistory()
  }, [])

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-4xl font-sentient mb-2">Usage History</h1>
          <p className="text-foreground/60 font-mono text-sm">Track all voice interactions and costs</p>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-sentient text-foreground">Recent Calls</CardTitle>
            <CardDescription className="font-mono text-xs text-muted-foreground">
              Complete history of voice API usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <p className="text-foreground/60 font-mono text-sm">Loading usage history...</p>
              </div>
            ) : usage.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-foreground/60 font-mono text-sm">No call history available</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-mono text-xs uppercase text-foreground/60">Caller</th>
                      <th className="text-left py-3 px-4 font-mono text-xs uppercase text-foreground/60">Agent</th>
                      <th className="text-left py-3 px-4 font-mono text-xs uppercase text-foreground/60">Duration</th>
                      <th className="text-left py-3 px-4 font-mono text-xs uppercase text-foreground/60">Cost</th>
                      <th className="text-left py-3 px-4 font-mono text-xs uppercase text-foreground/60">Timestamp</th>
                      <th className="text-left py-3 px-4 font-mono text-xs uppercase text-foreground/60">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usage.map((record) => (
                      <tr key={record.id} className="border-b border-border hover:bg-foreground/5">
                        <td className="py-3 px-4 font-mono text-sm text-foreground">{record.caller}</td>
                        <td className="py-3 px-4 font-mono text-sm text-foreground">{record.agent}</td>
                        <td className="py-3 px-4 font-mono text-sm text-foreground">{record.duration}</td>
                        <td className="py-3 px-4 font-mono text-sm text-yellow-400">{record.cost}</td>
                        <td className="py-3 px-4 font-mono text-xs text-foreground/60">{record.timestamp}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-mono ${
                              record.status === "completed"
                                ? "bg-green-500/20 text-green-400"
                                : record.status === "failed"
                                  ? "bg-red-500/20 text-red-400"
                                  : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
