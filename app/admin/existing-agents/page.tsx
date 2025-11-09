"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface Agent {
  id: string
  name: string
  provider: string
  createdAt: string
  status: "active" | "inactive"
}

export default function ExistingAgents() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // TODO: Replace with actual API call to fetch agents
    // Simulating API call
    setTimeout(() => {
      setAgents([
        {
          id: "1",
          name: "GPT-4 Assistant",
          provider: "OpenAI",
          createdAt: "2025-01-15",
          status: "active",
        },
        {
          id: "2",
          name: "Claude Sonnet",
          provider: "Anthropic",
          createdAt: "2025-01-10",
          status: "active",
        },
        {
          id: "3",
          name: "Gemini Pro",
          provider: "Google",
          createdAt: "2025-01-08",
          status: "inactive",
        },
      ])
      setLoading(false)
    }, 500)
  }, [])

  const handleDelete = (id: string, name: string) => {
    // TODO: Replace with actual API call to delete agent
    setAgents(agents.filter((agent) => agent.id !== id))
    toast({
      title: "Agent removed",
      description: `${name} has been removed from your agents.`,
    })
  }

  const handleToggleStatus = (id: string) => {
    // TODO: Replace with actual API call to toggle agent status
    setAgents(
      agents.map((agent) =>
        agent.id === id
          ? { ...agent, status: agent.status === "active" ? "inactive" : "active" }
          : agent,
      ),
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-16">
        <div className="container max-w-5xl">
          <div className="flex items-center justify-center h-64">
            <p className="text-foreground/60 font-mono text-sm">Loading agents...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container max-w-5xl">
        <div className="mb-8">
          <h1 className="text-4xl font-sentient mb-2">Existing Agents</h1>
          <p className="text-foreground/60 font-mono text-sm">
            Manage your registered AI agents for voice interactions
          </p>
        </div>

        {agents.length === 0 ? (
          <Card className="bg-background border-border">
            <CardContent className="pt-12 pb-12">
              <div className="text-center">
                <p className="text-foreground/60 font-mono text-sm mb-4">No agents registered yet</p>
                <Button onClick={() => window.location.href = "/admin/add-agent"}>
                  Add Your First Agent
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {agents.map((agent) => (
              <Card key={agent.id} className="bg-background border-border">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <CardTitle className="font-sentient">{agent.name}</CardTitle>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-mono ${
                            agent.status === "active"
                              ? "bg-green-500/10 text-green-500"
                              : "bg-neutral-500/10 text-neutral-500"
                          }`}
                        >
                          {agent.status}
                        </span>
                      </div>
                      <CardDescription className="font-mono text-xs mt-1">
                        Provider: {agent.provider} • Created: {agent.createdAt}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(agent.id)}
                        className="font-mono text-xs"
                      >
                        {agent.status === "active" ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(agent.id, agent.name)}
                        className="font-mono text-xs"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
