"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDashboard() {
  const stats = [
    { title: "Total Calls", value: "1,247", change: "+12.5%" },
    { title: "Active Agents", value: "8", change: "+2" },
    { title: "Total Minutes", value: "3,542", change: "+8.3%" },
    { title: "Revenue", value: "$2,847", change: "+15.2%" },
  ]

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-4xl font-sentient mb-2">Dashboard</h1>
          <p className="text-foreground/60 font-mono text-sm">Overview of your Hey AI usage and performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="bg-background border-border">
              <CardHeader>
                <CardDescription className="font-mono text-xs uppercase">{stat.title}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-sm text-primary mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <Card className="bg-background border-border">
            <CardHeader>
              <CardTitle className="font-sentient">Recent Activity</CardTitle>
              <CardDescription className="font-mono text-xs">Latest calls and interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { caller: "+1 555-0123", agent: "GPT-4", duration: "2:34", status: "Completed" },
                  { caller: "+1 555-0456", agent: "Claude", duration: "1:12", status: "Completed" },
                  { caller: "+1 555-0789", agent: "GPT-4", duration: "3:45", status: "In Progress" },
                ].map((call, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-border pb-3">
                    <div>
                      <p className="font-mono text-sm">{call.caller}</p>
                      <p className="text-xs text-foreground/60">{call.agent}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm">{call.duration}</p>
                      <p className="text-xs text-foreground/60">{call.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background border-border">
            <CardHeader>
              <CardTitle className="font-sentient">Quick Actions</CardTitle>
              <CardDescription className="font-mono text-xs">Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="/admin/add-agent"
                  className="p-4 border border-border hover:border-primary transition-colors rounded-lg text-center"
                >
                  <p className="font-mono text-sm">Add Agent</p>
                </a>
                <a
                  href="/admin/usage-history"
                  className="p-4 border border-border hover:border-primary transition-colors rounded-lg text-center"
                >
                  <p className="font-mono text-sm">Usage History</p>
                </a>
                <a
                  href="/admin/payment"
                  className="p-4 border border-border hover:border-primary transition-colors rounded-lg text-center"
                >
                  <p className="font-mono text-sm">Payment</p>
                </a>
                <a
                  href="/admin/live"
                  className="p-4 border border-border hover:border-primary transition-colors rounded-lg text-center"
                >
                  <p className="font-mono text-sm">Live Monitor</p>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
