"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface UsageRecord {
  id: string
  caller: string
  agent: string
  duration: string
  cost: string
  timestamp: string
}

export default function UsageHistory() {
  const usage: UsageRecord[] = [
    {
      id: "1",
      caller: "+1 555-0123",
      agent: "GPT-4",
      duration: "2:34",
      cost: "$0.12",
      timestamp: "2025-01-15 10:23",
    },
    {
      id: "2",
      caller: "+1 555-0456",
      agent: "Claude",
      duration: "1:12",
      cost: "$0.05",
      timestamp: "2025-01-15 09:45",
    },
    {
      id: "3",
      caller: "+1 555-0789",
      agent: "GPT-4",
      duration: "3:45",
      cost: "$0.18",
      timestamp: "2025-01-15 08:12",
    },
    {
      id: "4",
      caller: "+1 555-0321",
      agent: "Claude",
      duration: "0:58",
      cost: "$0.04",
      timestamp: "2025-01-14 16:32",
    },
    {
      id: "5",
      caller: "+1 555-0654",
      agent: "GPT-4",
      duration: "4:23",
      cost: "$0.21",
      timestamp: "2025-01-14 14:55",
    },
  ]

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-4xl font-sentient mb-2">Usage History</h1>
          <p className="text-foreground/60 font-mono text-sm">Track all voice interactions and costs</p>
        </div>

        <Card className="bg-background border-border">
          <CardHeader>
            <CardTitle className="font-sentient">Recent Calls</CardTitle>
            <CardDescription className="font-mono text-xs">Complete history of voice API usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-mono text-xs uppercase text-foreground/60">Caller</th>
                    <th className="text-left py-3 px-4 font-mono text-xs uppercase text-foreground/60">Agent</th>
                    <th className="text-left py-3 px-4 font-mono text-xs uppercase text-foreground/60">Duration</th>
                    <th className="text-left py-3 px-4 font-mono text-xs uppercase text-foreground/60">Cost</th>
                    <th className="text-left py-3 px-4 font-mono text-xs uppercase text-foreground/60">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {usage.map((record) => (
                    <tr key={record.id} className="border-b border-border hover:bg-foreground/5">
                      <td className="py-3 px-4 font-mono text-sm">{record.caller}</td>
                      <td className="py-3 px-4 font-mono text-sm">{record.agent}</td>
                      <td className="py-3 px-4 font-mono text-sm">{record.duration}</td>
                      <td className="py-3 px-4 font-mono text-sm text-primary">{record.cost}</td>
                      <td className="py-3 px-4 font-mono text-xs text-foreground/60">{record.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
