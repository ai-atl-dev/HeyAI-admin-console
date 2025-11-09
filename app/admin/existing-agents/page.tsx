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
    const fetchAgents = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/agents")
        const data = await response.json()

        if (response.ok && data.success) {
          // Format the data for display
          const formattedAgents = data.agents.map((agent: any) => ({
            id: agent.id,
            name: agent.name,
            provider: agent.provider,
            createdAt: new Date(agent.createdAt).toISOString().split("T")[0],
            status: agent.status as "active" | "inactive",
          }))
          setAgents(formattedAgents)
        } else {
          console.error("Failed to fetch agents:", data.error)
          toast({
            title: "Error",
            description: "Failed to load agents. Please refresh the page.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching agents:", error)
        toast({
          title: "Error",
          description: "Failed to load agents. Please check your connection.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAgents()
  }, [])

  const handleDelete = async (id: string, name: string) => {
    try {
      const response = await fetch(`/api/agents?agent_id=${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setAgents(agents.filter((agent) => agent.id !== id))
        toast({
          title: "Agent removed",
          description: `${name} has been removed from your agents.`,
        })
      } else {
        throw new Error(data.error || "Failed to delete agent")
      }
    } catch (error) {
      console.error("Error deleting agent:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete agent",
        variant: "destructive",
      })
    }
  }

  const handleToggleStatus = async (id: string) => {
    const agent = agents.find((a) => a.id === id)
    if (!agent) return

    const newStatus = agent.status === "active" ? "inactive" : "active"

    try {
      const response = await fetch("/api/agents/upsert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agent_id: id,
          agent_name: agent.name,
          status: newStatus,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setAgents(
          agents.map((a) =>
            a.id === id ? { ...a, status: newStatus } : a
          )
        )
        toast({
          title: "Status updated",
          description: `Agent is now ${newStatus}`,
        })
      } else {
        throw new Error(data.error || "Failed to update status")
      }
    } catch (error) {
      console.error("Error updating agent status:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update status",
        variant: "destructive",
      })
    }
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
          <Card className="bg-card border-border">
            <CardContent className="pt-12 pb-12">
              <div className="text-center">
                <p className="text-foreground/60 font-mono text-sm mb-4">No agents registered yet</p>
                <Button
                  onClick={() => (window.location.href = "/admin/add-agent")}
                  className="bg-yellow-400 text-black hover:bg-yellow-500 font-mono"
                >
                  Add Your First Agent
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {agents.map((agent) => (
              <Card key={agent.id} className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <CardTitle className="font-sentient text-foreground">{agent.name}</CardTitle>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-mono ${
                            agent.status === "active"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-neutral-500/20 text-neutral-400"
                          }`}
                        >
                          {agent.status}
                        </span>
                      </div>
                      <CardDescription className="font-mono text-xs mt-1 text-muted-foreground">
                        Provider: {agent.provider} • Created: {agent.createdAt}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(agent.id)}
                        className="font-mono text-xs text-foreground border-border hover:bg-accent"
                      >
                        {agent.status === "active" ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(agent.id, agent.name)}
                        className="font-mono text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/30"
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
