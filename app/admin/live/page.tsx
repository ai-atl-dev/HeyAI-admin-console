"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Live() {
  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-4xl font-sentient mb-2">Live Monitor</h1>
          <p className="text-foreground/60 font-mono text-sm">Real-time monitoring of active voice calls</p>
        </div>

        <Card className="bg-background border-border">
          <CardHeader>
            <CardTitle className="font-sentient">Live Usage Streaming</CardTitle>
            <CardDescription className="font-mono text-xs">Monitor active calls in real-time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6"></div>
              <p className="text-center font-mono text-sm text-foreground/60">Live usage streaming coming soon.</p>
              <p className="text-center font-mono text-xs text-foreground/40 mt-2 max-w-md">
                This feature will allow you to monitor active calls, see real-time transcriptions, and track AI agent
                performance.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
